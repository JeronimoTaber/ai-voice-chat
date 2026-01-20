import SYSTEM_PROMPT from "../prompts/systemPrompt";
import type { LLMCallOptions } from "../types";
import { prepareMessages } from "../utils/llmStreamUtils";

export async function callLLM({
  messages,
}: LLMCallOptions): Promise<any> {
  const fullMessages = prepareMessages(messages, SYSTEM_PROMPT);

  // Call the server endpoint for non-streaming LLM calls
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3002";
  const response = await fetch(
    `${serverUrl}/api/llm-complete`,
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

  const data = await response.json();

  // Add groundingMetadata to the message if it exists
  if (data.choices && data.choices[0] && data.groundingMetadata) {
    data.choices[0].message.groundingMetadata = data.groundingMetadata;
  }

  return data;
}
