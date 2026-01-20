import React from "react";
import Agent from "./components/Agent";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-slate-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700 drop-shadow-lg">AI Voice Chat</h1>
      <Agent />
    </div>
  );
};

export default App;
