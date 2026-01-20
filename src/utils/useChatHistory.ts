import { useState } from "react";
import type { ChatMessage } from "../agents/types";

export function useChatHistory(initial: ChatMessage[]) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const addMessage = (msg: ChatMessage) => setMessages((prev) => [...prev, msg]);
  const reset = () => setMessages(initial);
  return { messages, setMessages, addMessage, reset };
}
