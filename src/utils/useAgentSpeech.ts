import { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function useAgentSpeech({
  onSend,
  listenningToogle: _listenningToogle,
  setlistenningToogle,
}: {
  onSend: (content: string) => void;
  listenningToogle: boolean;
  setlistenningToogle: (v: boolean) => void;
}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const lastTranscriptRef = useRef(transcript);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const micAbortRef = useRef(false);


  // Mic button logic
  const handleMicButton = () => {
    if (!listening) {
      micAbortRef.current = false;
      SpeechRecognition.startListening({ continuous: true });
      setlistenningToogle(true);
    } else {
      micAbortRef.current = true;
      SpeechRecognition.abortListening && SpeechRecognition.abortListening();
      SpeechRecognition.stopListening();
      resetTranscript();
      setlistenningToogle(false);
    }
  };

  // Handle speech-to-text send
  const handleMicSend = () => {
    if (transcript.trim()) {
      onSend(transcript);
      resetTranscript();
    }
  };

  // Watch transcript for silence
  useEffect(() => {
    if (!listening) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      return;
    }
    if (transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        if (transcript.trim() && !micAbortRef.current) {
          SpeechRecognition.stopListening();
          handleMicSend();
        }
      }, 2000);
    }
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [transcript, listening]);

  return {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    handleMicButton,
  };
}
