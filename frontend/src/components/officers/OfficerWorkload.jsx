import React from "react";
import { FaBriefcase, FaClipboardList, FaBalanceScale, FaClock } from "react-icons/fa";

const OfficerWorkload = ({ workload }) => {
  if (!workload) return null;

  return (
    <div className="bg-slate-900/35 border border-slate-800/35 rounded-xl py-6 px-7 shadow-lg flex flex-col h-[420px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/20 pb-3.5 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <FaBriefcase className="text-blue-400 text-xs" />
          <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.14em] font-mono">
            Active Workload & Court Dockets
          </h2>
        </div>
        <span className="rounded-full bg-slate-950 border border-slate-800/50 px-2.5 py-0.5 font-mono text-[8px] text-slate-500 uppercase tracking-wider">
          Status: Active
        </span>
      </div>

      {/* Grid containing workload items */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin font-mono text-[10px] leading-normal">
        
        {/* 1. High Priority Cases */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-red-400 font-bold border-b border-slate-900/20 pb-1.5 uppercase tracking-wider text-[8.5px]">
            <FaClipboardList className="text-[9px]" />
            <span>CRITICAL ROADMAP PATHS</span>
          </div>
          <div className="space-y-2.5">
            {workload.highPriority && workload.highPriority.length > 0 ? (
              workload.highPriority.map((c) => (
                <div key={c.caseNo} className="bg-slate-950/20 border border-slate-800/30 py-3 px-3.5 rounded-lg flex flex-col gap-1 hover:border-slate-800/50 transition-colors">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-slate-200">{c.caseNo}</span>
                    <span className="text-[7.5px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-400 font-sans mt-0.5 text-[9.5px] leading-relaxed">{c.title}</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">Due milestone: {c.date}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-600 text-[9px] py-1">No critical paths assigned</div>
            )}
          </div>
        </div>

        {/* 2. Upcoming Court Hearings */}
        <div className="space-y-2.5 pt-1.5">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold border-b border-slate-900/20 pb-1.5 uppercase tracking-wider text-[8.5px]">
            <FaBalanceScale className="text-[9px]" />
            <span>JUDICIAL TRIAL DOCKETS</span>
          </div>
          <div className="space-y-2.5">
            {workload.hearings && workload.hearings.length > 0 ? (
              workload.hearings.map((h) => (
                <div key={h.docketNo} className="bg-slate-950/20 border border-slate-800/30 py-3 px-3.5 rounded-lg flex flex-col gap-1 hover:border-slate-800/50 transition-colors">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-slate-200">{h.docketNo}</span>
                    <span className="text-[7.5px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold tracking-wider">{h.time}</span>
                  </div>
                  <p className="text-slate-400 font-sans mt-0.5 text-[9.5px] leading-relaxed">{h.court}</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">Hearing Date: {h.date}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-600 text-[9px] py-1">No pending judicial hearings</div>
            )}
          </div>
        </div>

        {/* 3. Pending Investigations */}
        <div className="space-y-2.5 pt-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-slate-900/20 pb-1.5 uppercase tracking-wider text-[8.5px]">
            <FaClock className="text-[9px]" />
            <span>PENDING CLOSURES</span>
          </div>
          <div className="space-y-2">
            {workload.pending && workload.pending.length > 0 ? (
              workload.pending.map((p) => (
                <div key={p.caseNo} className="flex justify-between items-center bg-slate-950/10 border border-slate-900/40 py-2.5 px-3.5 rounded-lg text-[9px] hover:border-slate-800/40 transition-colors">
                  <span className="font-bold text-slate-300 truncate max-w-[130px]">{p.caseNo}: {p.title}</span>
                  <span className="text-slate-500 text-[7.5px] font-bold uppercase tracking-wider">{p.status}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-600 text-[9px] py-1">No pending closures</div>
            )}
          </div>
        </div>

        {/* 4. Recently Assigned */}
        <div className="space-y-2.5 pt-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold border-b border-slate-900/20 pb-1.5 uppercase tracking-wider text-[8.5px]">
            <FaClock className="text-[9px]" />
            <span>RECENT INTAKES</span>
          </div>
          <div className="space-y-2">
            {workload.recent && workload.recent.length > 0 ? (
              workload.recent.map((r) => (
                <div key={r.caseNo} className="flex justify-between items-center bg-slate-950/10 border border-slate-900/40 py-2.5 px-3.5 rounded-lg text-[9px] hover:border-slate-800/40 transition-colors">
                  <span className="font-bold text-slate-300 truncate max-w-[150px]">{r.caseNo}: {r.title}</span>
                  <span className="text-slate-500 text-[7.5px] font-bold uppercase tracking-wider">{r.assigned}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-600 text-[9px] py-1">No recent intakes logged</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerWorkload;
