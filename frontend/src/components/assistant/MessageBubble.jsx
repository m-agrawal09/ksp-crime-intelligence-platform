import React from "react";
import { FaUser, FaBrain } from "react-icons/fa";

const MessageBubble = ({ message }) => {
  const isOfficer = message.sender === "officer";

  // Light-weight custom parser to format mock markdown responses into clean React nodes
  const parseMarkdown = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let tableRows = [];
    let inTable = false;

    const renderTable = (rows, key) => {
      if (rows.length === 0) return null;
      
      const headerCells = rows[0].split("|").map(c => c.trim()).filter(c => c);
      const bodyRows = rows.slice(2).map(r => r.split("|").map(c => c.trim()).filter(c => c));

      return (
        <div key={key} className="my-3.5 overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/40 shadow-inner">
          <table className="w-full text-left border-collapse font-mono text-[10px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider">
                {headerCells.map((h, idx) => (
                  <th key={idx} className="py-2.5 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40 text-slate-300">
              {bodyRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                  {row.map((cell, cidx) => (
                    <td key={cidx} className="py-2.5 px-4">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const parseBold = (str) => {
      const parts = str.split("**");
      return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part);
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("|")) {
        inTable = true;
        tableRows.push(line);
        continue;
      }

      if (inTable && !line.startsWith("|")) {
        elements.push(renderTable(tableRows, `table-${i}`));
        tableRows = [];
        inTable = false;
      }

      if (line.startsWith("###")) {
        elements.push(
          <h3 key={i} className="text-xs font-bold text-blue-400 tracking-wider font-mono uppercase mt-4 mb-2 border-b border-slate-800 pb-1">
            {parseBold(line.replace("###", "").trim())}
          </h3>
        );
      } else if (line.startsWith("####")) {
        elements.push(
          <h4 key={i} className="text-[11px] font-bold text-slate-200 font-mono uppercase mt-3 mb-1.5">
            {parseBold(line.replace("####", "").trim())}
          </h4>
        );
      } else if (line.startsWith("*") || line.startsWith("-")) {
        elements.push(
          <div key={i} className="flex items-start gap-2 pl-2 text-[11px] leading-relaxed text-slate-350 my-1 font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <span>{parseBold(line.substring(1).trim())}</span>
          </div>
        );
      } else if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.")) {
        elements.push(
          <div key={i} className="flex items-start gap-2 pl-2 text-[11px] leading-relaxed text-slate-355 my-1 font-sans">
            <span className="font-mono text-blue-400 font-bold flex-shrink-0">{line.slice(0, 2)}</span>
            <span>{parseBold(line.substring(2).trim())}</span>
          </div>
        );
      } else if (line) {
        elements.push(
          <p key={i} className="text-[11px] leading-relaxed text-slate-400 my-2 font-sans">
            {parseBold(line)}
          </p>
        );
      }
    }

    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows, `table-end`));
    }

    return elements;
  };

  return (
    <div className={`flex gap-3 w-full max-w-3xl ${isOfficer ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
      
      {/* Icon Avatar */}
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center border flex-shrink-0 shadow-sm ${
        isOfficer 
          ? "bg-slate-900 border-slate-800 text-slate-300"
          : "bg-blue-600/10 border-blue-500/30 text-blue-400"
      }`}>
        {isOfficer ? <FaUser className="text-xs" /> : <FaBrain className="text-xs animate-pulse" />}
      </div>

      {/* Bubble text */}
      <div className={`flex-1 rounded-xl border p-4 shadow-md ${
        isOfficer 
          ? "bg-slate-900/60 border-slate-800/80 text-slate-200"
          : "bg-slate-950/40 border-slate-850 text-slate-300"
      }`}>
        <div className="flex items-center justify-between border-b border-slate-900/40 pb-1 mb-1.5 text-[9px] font-mono text-slate-500 tracking-wider">
          <span>{isOfficer ? "INVESTIGATING OFFICER" : "AI PLATFORM CONSOLE"}</span>
          <span>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}</span>
        </div>
        <div className="space-y-1">
          {isOfficer ? (
            <p className="text-[11px] leading-relaxed font-sans">{message.text}</p>
          ) : (
            parseMarkdown(message.text)
          )}
        </div>
      </div>

    </div>
  );
};

export default MessageBubble;
