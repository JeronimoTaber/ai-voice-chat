import { TOOL_MAPPING } from "../tools/functionCallingRegistry";
import type { ChatMessage } from "../types";

export async function getToolResponse(response: any): Promise<ChatMessage> {
  const toolCall = response.tool_calls?.[0];
  if (!toolCall) throw new Error("No tool call found");
  const toolName = toolCall.function.name as keyof typeof TOOL_MAPPING;
  const toolArgs = JSON.parse(toolCall.function.arguments);
  const toolResult = await TOOL_MAPPING[toolName](toolArgs);
  return {
    role: "tool",
    content: JSON.stringify(toolResult),
    tool_call_id: toolCall.id,
    name: toolName,
  };
}
