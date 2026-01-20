import React, { useRef, useEffect } from "react";
import { SendIcon, MicIcon } from "./ChatIcons";

interface InputBarProps {
  input: string;
  setInput: (v: string) => void;
  onSend: (e?: React.FormEvent) => void;
  loading: boolean;
  canSend: boolean;
  micProps?: {
    show: boolean;
    onMic: () => void;
    listening: boolean;
  };
}

export const InputBar: React.FC<InputBarProps> = ({
  input,
  setInput,
  onSend,
  loading,
  canSend,
  micProps,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus input when not loading
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  return (
    <form className="flex items-center px-5 py-4 border-t bg-white/80 gap-2" onSubmit={onSend}>
      <input
        ref={inputRef}
        className="flex-1 px-4 py-3 rounded-full border-2 border-indigo-300 outline-none text-base bg-slate-100 transition focus:border-indigo-500 focus:shadow-lg"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        disabled={loading}
        aria-label="Message input"
      />
      <button
        className="bg-gradient-to-br from-indigo-500 to-indigo-400 border-none cursor-pointer text-xl ml-1 text-white rounded-full w-11 h-11 flex items-center justify-center shadow hover:from-indigo-400 hover:to-indigo-500 transition"
        type="submit"
        disabled={loading || !canSend}
        aria-label="Send"
      >
        <SendIcon />
      </button>
      {micProps?.show && (
        <button
          className={`bg-gradient-to-br from-indigo-500 to-indigo-400 border-none cursor-pointer text-xl ml-1 text-white rounded-full w-11 h-11 flex items-center justify-center shadow hover:from-indigo-400 hover:to-indigo-500 transition ${micProps.listening ? 'ring-2 ring-red-400' : ''}`}
          type="button"
          onClick={micProps.onMic}
          aria-label="Mic"
        >
          <MicIcon active={micProps.listening} />
        </button>
      )}
    </form>
  );
};
