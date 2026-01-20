import { useEffect, useRef } from "react";

export function useAutoScroll(deps: any[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line
  }, deps);
  return messagesEndRef;
}
