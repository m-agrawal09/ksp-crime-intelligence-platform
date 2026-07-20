import React from "react";
import { FaBrain, FaStar, FaRegCheckCircle, FaExclamationTriangle, FaChartLine, FaCheck } from "react-icons/fa";

const OfficerSummary = ({ summary }) => {
  if (!summary) return null;

  // Determine priority based on workload Status
  const priority = summary.workloadStatus === "Optimal" ? "MEDIUM" : "HIGH";

  // Calculate stars count out of 5 based on rating (e.g., "4.8 / 5.0")
  const ratingVal = parseFloat(summary.rating) || 5;
  const starsCount = Math.round(ratingVal);

  return (
    <div className="bg-slate-900/35 border border-slate-800/35 rounded-xl py-6 px-7 shadow-lg flex flex-col h-[420px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/20 pb-3.5 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <FaBrain className="text-blue-400 text-xs animate-pulse" />
          <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.14em] font-mono">
            AI Performance Recommendation
          </h2>
        </div>
        <span className="rounded-full bg-slate-950 border border-slate-800/50 px-2.5 py-0.5 font-mono text-[8px] text-slate-500 uppercase tracking-wider">
          Audit Model v4.2
        </span>
      </div>

      {/* Vertical Hierarchy Content */}
      <div className="flex-grow flex flex-col justify-between font-mono text-[10px] leading-normal space-y-4 overflow-y-auto pr-1 scrollbar-thin">
        
        {/* 1. Highlighted AI Performance Rating (Stars & Numeric) */}
        <div className="flex items-center justify-between bg-slate-950/40 border border-slate-850 p-3 rounded-lg flex-shrink-0">
          <div>
            <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Performance Rating</span>
            <span className="text-lg font-extrabold text-white font-mono mt-1 block leading-none">{summary.rating}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex text-amber-500 text-[9px] gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} className={i < starsCount ? "text-amber-500" : "text-slate-700"} />
              ))}
            </div>
            <span className="text-[7.5px] text-slate-400 uppercase tracking-widest font-mono">Telemetry Rating</span>
          </div>
        </div>

        {/* 2. Executive Summary Details */}
        <div className="space-y-4 flex-grow">
          {/* Executive Summary */}
          <div>
            <span className="text-slate-500 text-[8px] uppercase tracking-wider block mb-1">Executive Summary</span>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Officer shows consistent command of the docket workflow with high operational precision.
            </p>
          </div>

          {/* Strength */}
          <div className="flex gap-2">
            <span className="text-emerald-400 mt-0.5"><FaCheck className="text-[9px]" /></span>
            <div>
              <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Strength</span>
              <span className="text-slate-200 font-bold block font-sans text-[11px] mt-0.5">{summary.strongArea}</span>
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="flex gap-2">
            <span className="text-amber-400 mt-0.5"><FaExclamationTriangle className="text-[9px]" /></span>
            <div>
              <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Areas to Improve</span>
              <span className="text-slate-300 font-sans text-[11px] block mt-0.5">
                {summary.workloadStatus === "Optimal" ? "Reduce backlog files" : "Optimize case handover timelines"}
              </span>
            </div>
          </div>

          {/* AI Recommendation */}
          <div>
            <span className="text-slate-500 text-[8px] uppercase tracking-wider block mb-1">AI Recommendation</span>
            <p className="text-slate-300 font-sans text-xs leading-relaxed bg-[#0a0f1d] border border-slate-800/40 p-3 rounded-lg">
              "{summary.aiRecommendation}"
            </p>
          </div>

          {/* Suggested Action */}
          <div>
            <span className="text-slate-500 text-[8px] uppercase tracking-wider block mb-0.5">Suggested Action</span>
            <span className="text-slate-300 font-sans block text-[11.5px]">
              Deploy cyber-dossier automation to save approx 4 hours per filing cycle.
            </span>
          </div>

          {/* Projected Performance & Confidence Level */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/20">
            <div>
              <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Projected Performance</span>
              <span className="text-emerald-400 font-bold block mt-1 text-[9px] uppercase tracking-wide flex items-center gap-1 font-mono">
                <FaChartLine /> -10% Cycle Time
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Confidence Level</span>
              <span className="text-blue-400 font-bold block mt-1 text-[9px] uppercase tracking-wide">
                94% Audit Match
              </span>
            </div>
          </div>
        </div>

        {/* Sync details */}
        <div className="border-t border-slate-800/20 pt-3 flex justify-between items-center text-[8px] text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-1">
            <FaRegCheckCircle className="text-emerald-500" />
            <span>Telemetry Audited &amp; Synchronized</span>
          </div>
          <span>Updated: {summary.lastUpdated}</span>
        </div>

      </div>
    </div>
  );
};

export default OfficerSummary;
