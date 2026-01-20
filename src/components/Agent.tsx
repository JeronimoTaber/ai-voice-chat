import React, { useState, useCallback, useEffect } from "react";
import type { FormEvent, ReactElement } from "react";
import { agenticLoopStreaming } from "../agents/AgentOrchestrator/index";
import type { ChatMessage } from "../agents/types";
import { playPing } from "../utils/playPing";
import { useAutoScroll } from "../utils/useAutoScroll";
import { useChatHistory } from "../utils/useChatHistory";
import { useAgentSpeech } from "../utils/useAgentSpeech";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { sanitizeUserInput } from "../utils/sanitizeUserInput";

const INITIAL_MESSAGE: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "¡Hola! Mi nombre es Agent y estoy aquí para ayudarte y asistirte.",
  },
];

const Agent: React.FC = (): ReactElement => {
  // Chat state
  const { messages, setMessages, reset: resetMessages } = useChatHistory(INITIAL_MESSAGE);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [conversationEnded, setConversationEnded] = useState<boolean>(false);
  const [listeningToggle, setListeningToggle] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const messagesEndRef = useAutoScroll([messages, streamingContent]);

  // Ensure scroll always happens after every message/streaming update
  useEffect(() => {
    const anchor = document.getElementById("messages-end-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingContent, isStreaming]);

  // Save messages to session storage on every update
  useEffect(() => {
    sessionStorage.setItem("agent_transcript", JSON.stringify(messages));
  }, [messages]);

  // Speech recognition logic
  const speech = useAgentSpeech({
    onSend: (content: string) => sendMessage(content),
    listenningToogle: listeningToggle,
    setlistenningToogle: setListeningToggle,
  });

  // Send message to LLM using agentic loop with streaming
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    const sanitizedContent = sanitizeUserInput(content);
    if (!sanitizedContent.trim()) return;
    setError("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: sanitizedContent }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsStreaming(true);
    setStreamingContent("");
    try {
      const res = await agenticLoopStreaming(newMessages);
      const reply = res.content || "No response.";
      const assistantMessage: ChatMessage = { 
        role: "assistant", 
        content: reply,
        groundingMetadata: res.groundingMetadata
      };
      setMessages([...newMessages, assistantMessage]);
      setIsStreaming(false);
      setStreamingContent("");
      if (
        res.finalReport ||
        (sanitizedContent.trim().toLowerCase() === "yes" && !res.finalReport)
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "If you need to start a new conversation, click below.",
            },
          ]);
          setConversationEnded(true);
        }, 500);
      } else if (listeningToggle && !conversationEnded) {
        playPing();
        setTimeout(() => {
          speech.handleMicButton();
        }, 200);
      }
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `Error: ${(e as Error).message}` },
      ]);
      setIsStreaming(false);
      setStreamingContent("");
      setError("Sorry, something went wrong. Please try again.");
    }
    setLoading(false);
  }, [messages, setMessages, conversationEnded, listeningToggle]);

  // Handle text input send
  const handleSend = useCallback((e?: FormEvent<Element>): void => {
    if (e) e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  // Reset conversation
  const handleReset = useCallback((): void => {
    resetMessages();
    setConversationEnded(false);
    setStreamingContent("");
    setIsStreaming(false);
    setError("");
  }, [resetMessages]);

  return (
    <div className="flex flex-col h-[90dvh] min-h-0 max-w-2xl mx-auto rounded-3xl bg-white/70 shadow-2xl backdrop-blur-lg border border-white/20 overflow-hidden font-sans" role="main" aria-label="AI chat agent">
      <div className="flex-1 min-h-0 overflow-y-auto p-8 pb-4 flex flex-col gap-5 bg-gradient-to-br from-indigo-100 to-slate-50">
        <MessageList messages={messages} isStreaming={isStreaming} streamingContent={streamingContent} />
        <div id="messages-end-anchor" ref={messagesEndRef} />
      </div>
      {error && (
        <div className="text-red-700 bg-red-50 border border-red-400 rounded-lg px-4 py-2 mx-6 my-3 text-center text-base shadow" role="alert" aria-live="assertive">{error}</div>
      )}
      {!conversationEnded ? (
        <InputBar
          input={input}
          setInput={setInput}
          onSend={handleSend}
          loading={loading}
          canSend={!!input.trim()}
          micProps={speech.browserSupportsSpeechRecognition && speech.isMicrophoneAvailable ? {
            show: true,
            onMic: speech.handleMicButton,
            listening: speech.listening,
          } : undefined}
        />
      ) : (
        <div className="flex items-center justify-center p-4 border-t bg-white/80">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white text-base font-semibold rounded-full px-7 py-3 mx-auto shadow transition hover:from-indigo-400 hover:to-indigo-600 hover:scale-105"
            onClick={handleReset}
            aria-label="Start new conversation"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.51 15"/><path d="M3.51 15A9 9 0 0 0 18.49 9"/></svg>
            <span>Start New Conversation</span>
          </button>
        </div>
      )}
      {speech.listening && (
        <div className="px-4 py-2 text-center text-indigo-600 text-sm bg-slate-100/70 rounded-xl mx-6 my-2 shadow" aria-live="polite">
          Listening...
        </div>
      )}
    </div>
  );
};

export default React.memo(Agent);
