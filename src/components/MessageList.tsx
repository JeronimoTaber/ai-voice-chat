import React from "react";
import type { ChatMessage } from "../agents/types";
import MarkdownMessage from "./MarkdownMessage";
import { StreamingMessage } from "./StreamingMessage";
import { UserIcon, BotIcon } from "./ChatIcons";
import { SourcesTooltip } from "./SourcesTooltip";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
  streamingContent?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  streamingContent,
}) => {
  // If streaming, replace the last assistant message with the streaming message
  const displayMessages = isStreaming && streamingContent
    ? [
        ...messages,
        { role: "assistant", content: streamingContent }
      ]
    : messages;

  return (
    <div className="flex flex-col gap-5" id="chat-messages-scrollable">
      {displayMessages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex items-end gap-3 max-w-[80%] text-base animate-fadeInUp ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg shadow">
            {msg.role === "user" ? <UserIcon /> : <BotIcon />}
          </div>
          <div className={`px-5 py-3 text-base rounded-2xl min-w-12 min-h-10 shadow transition ${msg.role === "user" ? "bg-gradient-to-br from-indigo-400 to-indigo-500 text-white rounded-br-md rounded-tl-2xl" : "bg-white/85 text-gray-900 rounded-bl-md rounded-tr-2xl"}`}> 
            <div className="flex items-start gap-2">
              <div className="flex-1">
                {msg.role === "assistant" ? (
                  isStreaming && idx === displayMessages.length - 1 ? (
                    <StreamingMessage content={msg.content} />
                  ) : (
                    <MarkdownMessage content={msg.content} />
                  )
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "assistant" && msg.groundingMetadata && (
                <SourcesTooltip groundingMetadata={msg.groundingMetadata} />
              )}
            </div>
          </div>
        </div>
      ))}
      <div id="messages-end-anchor" />
    </div>
  );
};
