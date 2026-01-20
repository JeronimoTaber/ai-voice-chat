import SYSTEM_PROMPT from "../prompts/systemPrompt";
import type { LLMCallOptions } from "../types";
import { prepareMessages, parseLLMStream } from "../utils/llmStreamUtils";

export async function callLLMStreaming({
  messages,
  onChunk,
}: LLMCallOptions & {
  onChunk?: (chunk: string) => void;
}): Promise<any> {
  const fullMessages = prepareMessages(messages, SYSTEM_PROMPT);

  // Call the server endpoint instead of calling LLM directly
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3002";
  const response = await fetch(
    `${serverUrl}/api/llm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: fullMessages,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `LLM call failed: ${response.status} ${response.statusText}`
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body reader available");
  }

  const responseMessage = await parseLLMStream(reader, onChunk);

  return {
    choices: [
      {
        message: responseMessage,
      },
    ],
  };
}

export async function callLLM({ messages }: LLMCallOptions): Promise<any> {
  return callLLMStreaming({ messages });
}
