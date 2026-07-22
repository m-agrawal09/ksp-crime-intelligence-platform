import React, { useState, useRef } from "react";
import { FaPaperPlane, FaMicrophone, FaTrash } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";

const ChatInput = ({ onSend, onClear, disabled }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 140) + "px";
    }
  };

  const canSend = text.trim() && !disabled;

  return (
    <div
      className="flex-shrink-0"
      style={{
        padding: "14px 20px 16px",
        borderTop: "1px solid rgba(51,65,85,0.3)",
        background: "rgba(6,13,26,0.7)",
      }}
    >
      {/* Status row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex items-center gap-1.5">
          <RiRobot2Fill className="text-xs text-blue-400" />
          <span className="text-xs font-semibold text-slate-500 font-inter">KSP AI Copilot</span>
        </div>
        <span className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-500/80 font-inter font-medium">CCTNS Live Connected</span>
        </div>
      </div>

      {/* Input container */}
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-end gap-3 rounded-2xl transition-all duration-200"
          style={{
            padding: "10px 14px",
            background: "rgba(15,23,42,0.9)",
            border: `1px solid ${canSend ? "rgba(37,99,235,0.5)" : "rgba(51,65,85,0.5)"}`,
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask about crimes, FIR records, officers, district stats…"
            className="flex-1 bg-transparent text-[14px] text-white placeholder-slate-500 focus:outline-none resize-none font-inter leading-relaxed"
            style={{
              minHeight: 40,
              maxHeight: 140,
              padding: "4px 0",
              scrollbarWidth: "none",
            }}
          />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
            <button
              type="button"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Voice input (coming soon)"
            >
              <FaMicrophone className="text-sm" />
            </button>

            <button
              type="button"
              onClick={onClear}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <FaTrash className="text-sm" />
            </button>

            {/* Send */}
            <button
              type="submit"
              disabled={!canSend}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold font-inter transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: canSend
                  ? "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
                  : "rgba(51,65,85,0.5)",
                color: "white",
                border: "none",
                boxShadow: canSend ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
              }}
            >
              <FaPaperPlane className="text-xs" />
              Send
            </button>
          </div>
        </div>

        <p className="text-[11px] font-inter text-slate-600 mt-2 text-center">
          <kbd className="bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-500 font-mono text-[10px]">Enter</kbd>
          {" "}to send · {" "}
          <kbd className="bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-500 font-mono text-[10px]">Shift+Enter</kbd>
          {" "}for new line
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
