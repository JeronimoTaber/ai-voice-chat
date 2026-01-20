// Central SVG icon library for chatbot UI

export const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
);

export const BotIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
    <circle cx="19" cy="19" r="17" fill="#fff" stroke="#818cf8" strokeWidth="2"/>
    <circle cx="19" cy="19" r="11" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5"/>
    <circle cx="16" cy="19" r="1.5" fill="#818cf8"/>
    <circle cx="22" cy="19" r="1.5" fill="#818cf8"/>
    <rect x="18" y="7" width="2" height="5" rx="1" fill="#818cf8"/>
  </svg>
);

export const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

export const MicIcon = ({active = false}: {active?: boolean}) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#f44336" : "none"} stroke={active ? "#f44336" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
);
