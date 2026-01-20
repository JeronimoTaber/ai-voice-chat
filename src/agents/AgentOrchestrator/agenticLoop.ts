import { callLLM } from "./llmApi";
import type { ChatMessage } from "../types";

/**
 * Simplified agentic loop without streaming.
 * Calls the LLM and waits for the complete response. Tool calls (like fileSearch) are handled server-side by Gemini.
 * @param messages - The conversation history so far.
 * @returns The final LLM message.
 */
export async function agenticLoopStreaming(
  messages: ChatMessage[]
): Promise<any> {
  // Call the LLM and get the complete response
  // The server handles fileSearch tool calling with Gemini
  const data = await callLLM({
    messages,
  });
  
  const responseMsg = data.choices[0].message;
  
  return responseMsg;
}
