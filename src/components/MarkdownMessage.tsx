import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownMessageProps {
  content: string;
}

// Remove leading and trailing spaces from each line, keep line breaks
function cleanMarkdownContent(content: string): string {
  return content.trim();
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => (
  <div className="prose prose-indigo max-w-none text-base">
    <ReactMarkdown>{cleanMarkdownContent(content)}</ReactMarkdown>
  </div>
);

export default MarkdownMessage;