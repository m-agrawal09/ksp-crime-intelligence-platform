import React from "react";
import { FaFileSignature, FaMapMarked, FaFolderPlus, FaUserTie, FaExchangeAlt, FaShieldAlt } from "react-icons/fa";

const SuggestedPrompts = ({ onPromptClick }) => {
  const prompts = [
    {
      text: "Summarize crimes in Bengaluru City",
      desc: "Compile spatial overview of property and cyber offences.",
      icon: FaMapMarked,
      color: "text-blue-400 bg-blue-500/5 hover:border-blue-500/40"
    },
    {
      text: "Show high-risk districts",
      desc: "Rank active incident levels across Karnataka GIS centers.",
      icon: FaShieldAlt,
      color: "text-red-400 bg-red-500/5 hover:border-red-500/40"
    },
    {
      text: "Explain recent cyber fraud trends",
      desc: "Outline phishing vectors and digital forensic roadmap.",
      icon: FaFolderPlus,
      color: "text-purple-400 bg-purple-500/5 hover:border-purple-500/40"
    },
    {
      text: "Generate officer performance summary",
      desc: "Review closure and detection rates of investigating officers.",
      icon: FaUserTie,
      color: "text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/40"
    },
    {
      text: "Compare crime statistics between districts",
      desc: "Side-by-side analysis of Bengaluru vs Mangaluru dockets.",
      icon: FaExchangeAlt,
      color: "text-amber-400 bg-amber-500/5 hover:border-amber-500/40"
    },
    {
      text: "Draft an executive crime briefing",
      desc: "Formulate DG&IGP brief including threat vectors.",
      icon: FaFileSignature,
      color: "text-indigo-400 bg-indigo-500/5 hover:border-indigo-500/40"
    }
  ];

  return (
    <div className="space-y-4">
      <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block">
        Suggested Intelligence Operations
      </span>
      <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
        {prompts.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.text}
              onClick={() => onPromptClick(p.text)}
              className={`flex flex-col text-left p-4 rounded-xl border border-slate-800/80 hover:bg-slate-900/40 transition-all duration-300 group cursor-pointer ${p.color}`}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-current transition-colors">
                <Icon className="text-sm" />
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-200 mt-3 group-hover:text-white transition-colors">
                {p.text}
              </span>
              <p className="text-[10px] leading-relaxed text-slate-400 font-sans mt-1">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
