import React from "react";
import { FaInfoCircle, FaStar, FaBrain, FaRegCheckCircle } from "react-icons/fa";

const OfficerSummary = ({ summary }) => {
  if (!summary) return null;

  // Determine priority based on workload Status
  const priority = summary.workloadStatus === "Optimal" ? "MEDIUM" : "HIGH";

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-[4px] py-5 px-6 shadow-lg flex flex-col h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FaBrain className="text-blue-400 text-sm" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            AI Performance Recommendation
          </h2>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-[9px] text-slate-400">
          Source: KSP Audit
        </span>
      </div>

      {/* Vertical Hierarchy Content */}
      <div className="flex-grow flex flex-col justify-between font-mono text-[10px] leading-normal space-y-3.5 overflow-y-auto pr-1 scrollbar-thin">
        
        {/* 1. Highlighted AI Performance Score */}
        <div className="flex items-center justify-between bg-slate-950/40 border border-slate-850 p-3 rounded-[4px] flex-shrink-0">
          <div>
            <span className="text-slate-500 text-[8px] uppercase tracking-wider block">AI Performance Score</span>
            <span className="text-xl font-extrabold text-white font-mono mt-0.5 block">{summary.rating}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex text-amber-500 text-[9px]">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <span className="text-[7.5px] text-slate-400 uppercase tracking-widest font-mono">Telemetry Rating</span>
          </div>
        </div>

        {/* 2. Vertical Hierarchy List of Details */}
        <div className="space-y-3">
          {/* Strength */}
          <div>
            <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Investigation Strength:</span>
            <span className="text-slate-200 font-bold block mt-1 font-sans text-xs">{summary.strongArea}</span>
          </div>

          {/* Recommendation */}
          <div>
            <span className="text-slate-500 text-[8px] uppercase tracking-wider block">AI Recommendation:</span>
            <p className="text-slate-300 font-sans text-xs mt-1 leading-relaxed">
              "{summary.aiRecommendation}"
            </p>
          </div>

          {/* Grid for Priority and Expected Improvement */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/60">
            <div>
              <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Audit Priority:</span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-[2px] font-bold text-[8.5px] uppercase tracking-wider ${
                priority === "HIGH" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {priority}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Expected Improvement:</span>
              <span className="text-emerald-400 font-bold block mt-1 text-[9px] uppercase tracking-wide">
                -10% Resolution Cycle
              </span>
            </div>
          </div>
        </div>

        {/* Sync details */}
        <div className="border-t border-slate-850 pt-3 flex justify-between items-center text-[8px] text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-1">
            <FaRegCheckCircle className="text-emerald-500" />
            <span>AUDIT METRICS IN SYNC</span>
          </div>
          <span>UPDATED: {summary.lastUpdated}</span>
        </div>

      </div>
    </div>
  );
};

export default OfficerSummary;
