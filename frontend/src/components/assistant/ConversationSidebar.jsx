import React from "react";
import { FaPlus } from "react-icons/fa";
import { RiChatHistoryLine } from "react-icons/ri";

const ConversationSidebar = ({ sessions, activeSessionId, onSelectSession, onNewSession }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* New session button */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold font-inter transition-all cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(124,58,237,0.2) 100%)",
            border: "1px solid rgba(37,99,235,0.35)",
            color: "#93c5fd",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(37,99,235,0.35) 0%, rgba(124,58,237,0.35) 100%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(124,58,237,0.2) 100%)";
          }}
        >
          <FaPlus className="text-[10px]" />
          New Session
        </button>
      </div>

      {/* Section label */}
      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <RiChatHistoryLine className="text-xs text-slate-600" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-600">
            Recent
          </span>
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(51,65,85,0.3) transparent" }}>
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className="w-full text-left rounded-lg px-3 py-2.5 transition-all duration-150 cursor-pointer group"
              style={{
                background: isActive ? "rgba(37,99,235,0.15)" : "transparent",
                border: `1px solid ${isActive ? "rgba(37,99,235,0.3)" : "transparent"}`,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(51,65,85,0.2)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs font-semibold font-inter truncate leading-snug"
                  style={{ color: isActive ? "#93c5fd" : "#94a3b8" }}
                >
                  {session.title}
                </span>
                {session.status === "active" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-600 mt-0.5 block font-inter">
                {session.timestamp}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(51,65,85,0.25)" }}
      >
        <span className="text-[10px] font-mono text-slate-600">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</span>
        <span className="text-[10px] font-mono text-emerald-500/70">1 active</span>
      </div>
    </div>
  );
};

export default ConversationSidebar;
