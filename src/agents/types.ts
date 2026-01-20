// Types for Agent Orchestrator

export type ChatMessage = {
  role: "user" | "system" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  name?: string;
  groundingMetadata?: any;
};

export interface LLMCallOptions {
  messages: ChatMessage[];
}
