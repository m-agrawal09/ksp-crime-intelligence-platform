import React from "react";
import { FaBriefcase, FaClipboardList, FaBalanceScale, FaClock } from "react-icons/fa";

const OfficerWorkload = ({ workload }) => {
  if (!workload) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-[500px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FaBriefcase className="text-blue-400 text-sm" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Active Workload & Court Dockets
          </h2>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-[9px] text-slate-400">
          Status: Active
        </span>
      </div>

      {/* Grid containing workload items */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin font-mono text-[10px] leading-normal">
        
        {/* 1. High Priority Cases */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-red-400 font-bold border-b border-slate-900 pb-1">
            <FaClipboardList className="text-[9px]" />
            <span>CRITICAL ROADMAP PATHS</span>
          </div>
          <div className="space-y-2">
            {workload.highPriority.map((c) => (
              <div key={c.caseNo} className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-lg">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-slate-200">{c.caseNo}</span>
                  <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 rounded uppercase">
                    {c.status}
                  </span>
                </div>
                <p className="text-slate-400 font-sans mt-1 text-[10px]">{c.title}</p>
                <span className="text-[8px] text-slate-500 block mt-1">Due milestone: {c.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Upcoming Court Hearings */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold border-b border-slate-900 pb-1">
            <FaBalanceScale className="text-[9px]" />
            <span>JUDICIAL TRIAL DOCKETS</span>
          </div>
          <div className="space-y-2">
            {workload.hearings.map((h) => (
              <div key={h.docketNo} className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-lg">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-slate-200">{h.docketNo}</span>
                  <span className="text-[8px] text-blue-400">{h.time}</span>
                </div>
                <p className="text-slate-400 font-sans mt-1 text-[10px]">{h.court}</p>
                <span className="text-[8px] text-slate-500 block mt-1">Hearing Date: {h.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Pending Investigations */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-slate-900 pb-1">
            <FaClock className="text-[9px]" />
            <span>PENDING CLOSURES</span>
          </div>
          <div className="space-y-1.5">
            {workload.pending.map((p) => (
              <div key={p.caseNo} className="flex justify-between items-center bg-slate-950/20 border border-slate-900/60 p-2 rounded text-[9px]">
                <span className="font-bold text-slate-300 truncate max-w-[120px]">{p.caseNo}: {p.title}</span>
                <span className="text-slate-500 text-[8px]">{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Recently Assigned */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold border-b border-slate-900 pb-1">
            <FaClock className="text-[9px]" />
            <span>RECENT INTAKES</span>
          </div>
          <div className="space-y-1.5">
            {workload.recent.map((r) => (
              <div key={r.caseNo} className="flex justify-between items-center bg-slate-950/20 border border-slate-900/60 p-2 rounded text-[9px]">
                <span className="font-bold text-slate-300 truncate max-w-[150px]">{r.caseNo}: {r.title}</span>
                <span className="text-slate-500 text-[8px]">{r.assigned}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerWorkload;
