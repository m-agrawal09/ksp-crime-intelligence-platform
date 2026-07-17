import React, { useState, useRef } from "react";
import { FaPaperPlane, FaPaperclip, FaMicrophone, FaTrash } from "react-icons/fa";

const ChatInput = ({ onSend, onClear, disabled }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        
        {/* Left utility buttons */}
        <div className="flex gap-2 justify-start items-center">
          <button
            type="button"
            className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-500 hover:text-white transition-all cursor-pointer"
            title="Attach Document/FIR (Placeholder)"
          >
            <FaPaperclip className="text-xs" />
          </button>
          
          <button
            type="button"
            className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-500 hover:text-white transition-all cursor-pointer"
            title="Voice Commands (Placeholder)"
          >
            <FaMicrophone className="text-xs" />
          </button>

          <button
            type="button"
            onClick={onClear}
            className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-red-500/40 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
            title="Purge Active Session Cache"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>

        {/* Text Input area */}
        <div className="flex-1 relative flex items-center">
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type intelligence query script... (e.g. 'Summarize crimes in Bengaluru')"
            className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700 font-mono resize-none transition-colors align-middle leading-normal min-h-[38px] max-h-[120px]"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaPaperPlane className="text-[10px]" />
          SEND
        </button>

      </form>
    </div>
  );
};

export default ChatInput;
