import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { FaTerminal } from "react-icons/fa";

const ChatWindow = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    // Auto scroll to bottom
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 bg-slate-950/20 border border-slate-900 rounded-xl p-5 overflow-y-auto space-y-5 scrollbar-thin min-h-[300px]">
      
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs py-20 text-center gap-2">
          <FaTerminal className="text-xl text-slate-700 animate-pulse" />
          <span>Awaiting command input. Select a suggested operation or type a query.</span>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 w-full max-w-lg mr-auto">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-600/10 border border-blue-500/30 text-blue-400 flex-shrink-0">
                <div className="h-4 w-4 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />
              </div>
              <div className="flex-1 rounded-xl border border-slate-850 p-4 bg-slate-950/40 font-mono text-[10px] text-slate-500 flex items-center gap-2">
                <span className="animate-pulse">Analyzing datastore. Querying QuickML engine...</span>
              </div>
            </div>
          )}
        </>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
