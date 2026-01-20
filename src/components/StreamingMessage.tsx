import React from "react";
import MarkdownMessage from "./MarkdownMessage";

interface StreamingMessageProps {
  content: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ content }) => (
  <div className="flex items-end gap-3 max-w-[80%] text-base animate-fadeInUp self-start">
    <MarkdownMessage content={content} />
    <span className="animate-pulse text-indigo-500 font-bold ml-1">▋</span>
  </div>
);
