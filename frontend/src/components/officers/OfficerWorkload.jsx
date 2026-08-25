import React from "react";
import { FaBriefcase, FaClipboardList, FaBalanceScale, FaClock } from "react-icons/fa";

const OfficerWorkload = ({ workload }) => {
  if (!workload) return null;

  return (
    <div 
      className="rounded-sm border border-slate-700/60 shadow-xl bg-slate-900/85 backdrop-blur-md flex flex-col h-[460px]"
      style={{ padding: "22px 24px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-3.5 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5 pl-1">
          <FaBriefcase className="text-blue-400 text-xs" />
          <h2 className="text-xs font-bold text-white uppercase tracking-[0.14em] font-mono">
            Active Workload & Court Dockets
          </h2>
        </div>
        <span className="rounded-sm bg-slate-950 border border-slate-700/60 px-2.5 py-0.5 font-mono text-[9px] text-slate-400 uppercase tracking-wider">
          Status: Active
        </span>
      </div>

      {/* Scrollable workload items list */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin font-mono text-[10px] leading-normal">
        
        {/* 1. High Priority Cases */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold border-b border-slate-700/40 pb-1.5 uppercase tracking-wider text-[9px] pl-1">
            <FaClipboardList className="text-[10px]" />
            <span>CRITICAL ROADMAP PATHS</span>
          </div>
          <div className="space-y-2.5">
            {workload.highPriority && workload.highPriority.length > 0 ? (
              workload.highPriority.map((c) => (
                <div 
                  key={c.caseNo} 
                  className="bg-slate-950/80 border border-slate-700/60 p-3.5 rounded-sm flex flex-col gap-1.5 hover:border-slate-600 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-center gap-2 pl-0.5">
                    <span className="font-bold text-white font-mono text-xs">{c.caseNo}</span>
                    <span className="text-[8px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-sm uppercase font-bold tracking-wider">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed pl-0.5">{c.title}</p>
                  <span className="text-[9px] font-mono text-slate-400 block pl-0.5 pt-0.5">Due milestone: <span className="text-slate-200">{c.date}</span></span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-[10px] py-1 pl-1">No critical paths assigned</div>
            )}
          </div>
        </div>

        {/* 2. Upcoming Court Hearings */}
        <div className="space-y-2.5 pt-1.5">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold border-b border-slate-700/40 pb-1.5 uppercase tracking-wider text-[9px] pl-1">
            <FaBalanceScale className="text-[10px]" />
            <span>JUDICIAL TRIAL DOCKETS</span>
          </div>
          <div className="space-y-2.5">
            {workload.hearings && workload.hearings.length > 0 ? (
              workload.hearings.map((h) => (
                <div 
                  key={h.docketNo} 
                  className="bg-slate-950/80 border border-slate-700/60 p-3.5 rounded-sm flex flex-col gap-1.5 hover:border-slate-600 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-center gap-2 pl-0.5">
                    <span className="font-bold text-white font-mono text-xs">{h.docketNo}</span>
                    <span className="text-[8px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-sm font-bold tracking-wider">{h.time}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed pl-0.5">{h.court}</p>
                  <span className="text-[9px] font-mono text-slate-400 block pl-0.5 pt-0.5">Hearing Date: <span className="text-slate-200">{h.date}</span></span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-[10px] py-1 pl-1">No pending judicial hearings</div>
            )}
          </div>
        </div>

        {/* 3. Pending Investigations */}
        <div className="space-y-2.5 pt-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-slate-700/40 pb-1.5 uppercase tracking-wider text-[9px] pl-1">
            <FaClock className="text-[10px]" />
            <span>PENDING CLOSURES</span>
          </div>
          <div className="space-y-2">
            {workload.pending && workload.pending.length > 0 ? (
              workload.pending.map((p) => (
                <div 
                  key={p.caseNo} 
                  className="flex justify-between items-center bg-slate-950/80 border border-slate-700/60 p-3 rounded-sm text-xs hover:border-slate-600 transition-colors shadow-sm"
                >
                  <span className="font-bold text-slate-200 truncate max-w-[170px] pl-0.5">{p.caseNo}: {p.title}</span>
                  <span className="text-amber-400 text-[8px] font-bold uppercase tracking-wider pr-0.5">{p.status}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-[10px] py-1 pl-1">No pending closures</div>
            )}
          </div>
        </div>

        {/* 4. Recently Assigned */}
        <div className="space-y-2.5 pt-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold border-b border-slate-700/40 pb-1.5 uppercase tracking-wider text-[9px] pl-1">
            <FaClock className="text-[10px]" />
            <span>RECENT INTAKES</span>
          </div>
          <div className="space-y-2">
            {workload.recent && workload.recent.length > 0 ? (
              workload.recent.map((r) => (
                <div 
                  key={r.caseNo} 
                  className="flex justify-between items-center bg-slate-950/80 border border-slate-700/60 p-3 rounded-sm text-xs hover:border-slate-600 transition-colors shadow-sm"
                >
                  <span className="font-bold text-slate-200 truncate max-w-[170px] pl-0.5">{r.caseNo}: {r.title}</span>
                  <span className="text-slate-400 text-[8px] font-bold uppercase tracking-wider pr-0.5">{r.assigned}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-[10px] py-1 pl-1">No recent intakes logged</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerWorkload;
