import { callLLMStreaming } from "./llmApi";
import type { ChatMessage } from "../types";

/**
 * Simplified agentic loop with streaming support.
 * Calls the LLM with streaming support. Tool calls (like fileSearch) are handled server-side by Gemini.
 * @param messages - The conversation history so far.
 * @param onChunk - Optional callback for streaming LLM output.
 * @returns The final LLM message.
 */
export async function agenticLoopStreaming(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<any> {
  // Call the LLM with streaming and get the response
  // The server handles fileSearch tool calling with Gemini
  const data = await callLLMStreaming({
    messages,
    onChunk,
  });
  
  const responseMsg = data.choices[0].message;
  
  return responseMsg;
}
