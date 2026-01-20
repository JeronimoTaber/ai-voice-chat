import type { ChatMessage } from "../types";

/**
 * Prepares the full message array, ensuring the system prompt is present.
 */
export function prepareMessages(messages: ChatMessage[], systemPrompt: string): ChatMessage[] {
  if (!messages.length || messages[0].role !== "system") {
    return [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ];
  }
  return messages;
}

/**
 * Parses the streaming LLM response and accumulates content/tool_calls.
 * 
 * Reads from a ReadableStream, decodes each chunk, and processes lines prefixed with 'data: '.
 * Handles incremental content and tool call deltas, building up the response as the stream progresses.
 * Calls the optional onChunk callback with each new content chunk.
 * Returns the final response object when the stream ends or '[DONE]' is received.
 */
export async function parseLLMStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk?: (chunk: string) => void
): Promise<any> {
  const decoder = new TextDecoder(); // Decodes Uint8Array chunks to string
  let buffer = ""; // Holds incomplete data between reads
  let content = ""; // Accumulates the assistant's message content
  let response: any = null; // The response object being built

  /**
   * Handles tool call deltas, merging them into the response object.
   * Tool calls may arrive in multiple parts, so we merge arguments and names as they stream in.
   */
  function handleToolCalls(delta: any) {
    if (!delta.tool_calls) return;
    if (!response.tool_calls) response.tool_calls = [];
    for (const toolCall of delta.tool_calls) {
      const idx = toolCall.index || 0; // Tool calls may be indexed
      response.tool_calls[idx] = response.tool_calls[idx] || {
        id: toolCall.id || "",
        type: toolCall.type || "function",
        function: { name: "", arguments: "" },
      };
      // Merge streamed arguments and names
      if (toolCall.function?.arguments)
        response.tool_calls[idx].function.arguments += toolCall.function.arguments;
      if (toolCall.function?.name)
        response.tool_calls[idx].function.name = toolCall.function.name;
      if (toolCall.id)
        response.tool_calls[idx].id = toolCall.id;
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read(); // Read next chunk from stream
      if (done) break;
      buffer += decoder.decode(value, { stream: true }); // Append decoded chunk to buffer
      const lines = buffer.split("\n"); // Split buffer into lines
      buffer = lines.pop() || ""; // Save incomplete line for next chunk
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue; // Ignore non-data lines
        const data = trimmed.slice(6); // Remove 'data: ' prefix
        if (data === "[DONE]")
          // If stream signals completion, return the response
          return response || { role: "assistant", content: content || "No response generated.", tool_calls: null };
        try {
          const parsed = JSON.parse(data); // Parse JSON data
          const delta = parsed.choices?.[0]?.delta; // Get delta update
          if (!delta) continue;
          if (!response)
            // Initialize response object if needed
            response = { role: delta.role || "assistant", content: "", tool_calls: null };
          if (delta.content) {
            // Append new content chunk
            content += delta.content;
            response.content = content;
            onChunk?.(delta.content); // Call callback if provided
          }
          handleToolCalls(delta); // Merge tool call updates
        } catch {}
      }
    }
  } finally {
    reader.releaseLock(); // Always release the stream lock
  }
  // Return the built response, or a fallback if nothing was received
  return response || { role: "assistant", content: content || "No response generated.", tool_calls: null };
}
