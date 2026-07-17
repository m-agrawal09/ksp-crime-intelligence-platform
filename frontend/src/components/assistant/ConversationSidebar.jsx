import React from "react";
import { FaPlus, FaComments, FaCheckCircle, FaInbox, FaArchive } from "react-icons/fa";

const ConversationSidebar = ({ sessions, activeSessionId, onSelectSession, onNewSession }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col h-[650px] shadow-lg">
      {/* Header action */}
      <button
        onClick={onNewSession}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs py-3 px-4 rounded-lg transition-all shadow-md cursor-pointer mb-5"
      >
        <FaPlus className="text-[10px]" />
        NEW ASSIST SESSION
      </button>

      {/* Title */}
      <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-3 block">
        Intelligence Logs
      </span>

      {/* List container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          
          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex flex-col p-3 rounded-lg border text-left font-mono transition-all leading-normal group cursor-pointer ${
                isActive
                  ? "bg-slate-950/80 border-slate-700 text-white shadow-inner"
                  : "bg-slate-900/30 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex justify-between items-center w-full gap-2">
                <span className="font-bold text-[11px] truncate group-hover:text-blue-400 transition-colors">
                  {session.title}
                </span>
                {/* Status Dot */}
                <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                  session.status === "active" ? "bg-emerald-500 animate-pulse" :
                  session.status === "standby" ? "bg-blue-500" :
                  "bg-slate-700"
                }`} />
              </div>
              <span className="text-[9px] text-slate-650 mt-1 block">
                {session.timestamp}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer statistics */}
      <div className="border-t border-slate-850 pt-3 mt-4 text-[9px] font-mono text-slate-500 flex justify-between">
        <span>ARCHIVED LOGS: {sessions.filter(s => s.status === "archived").length}</span>
        <span>ACTIVE: 1</span>
      </div>
    </div>
  );
};

export default ConversationSidebar;
