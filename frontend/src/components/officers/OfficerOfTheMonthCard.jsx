import React from "react";
import { FaTrophy, FaAward, FaBuilding, FaIdBadge, FaStar, FaShieldAlt } from "react-icons/fa";

const OfficerOfTheMonthCard = ({ officer }) => {
  if (!officer) return null;

  // Calculate performance score out of 100 based on metrics
  const performanceScore = Math.min(
    100,
    Math.round((officer.clearanceRate * 0.6) + (officer.detectionRate * 0.4))
  );

  return (
    <div
      className="relative overflow-hidden rounded-sm border border-slate-700/60 shadow-xl backdrop-blur-md font-sans"
      style={{
        padding: "26px 28px",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(26, 20, 10, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)",
        borderLeft: "5px solid #f59e0b",
      }}
    >
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 relative z-10">
        
        {/* LEFT COLUMN: Hero Recognition Spotlight */}
        <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-7">
          
          {/* Avatar Frame with Gold Accent Borders */}
          <div className="relative flex-shrink-0">
            <div className="h-32 w-32 rounded-sm overflow-hidden border-2 border-amber-500/80 bg-slate-950 p-1 flex-shrink-0 shadow-xl">
              <img
                src={officer.avatar}
                alt={officer.name}
                className="h-full w-full object-cover rounded-sm"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-3 py-0.5 rounded-sm text-[9px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-md whitespace-nowrap">
              <FaTrophy className="text-[10px]" /> Spotlight Hero
            </div>
          </div>

          {/* Details & Citation */}
          <div className="text-center md:text-left space-y-3.5 flex-1 pl-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9.5px] font-mono font-bold uppercase tracking-widest">
              <FaAward className="text-amber-400 text-sm" />
              <span>Officer of the Month Commendation</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                {officer.name}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1.5 text-xs font-mono text-slate-300 mt-2">
                <span className="text-amber-400 font-bold uppercase tracking-widest">{officer.rank}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <FaBuilding className="text-amber-400 text-xs flex-shrink-0" /> {officer.unit}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <FaIdBadge className="text-amber-400 text-xs flex-shrink-0" /> Badge: <span className="text-white font-bold">{officer.badgeNumber}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span>Exp: <span className="text-white font-bold">{officer.yearsOfService} Years</span></span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-semibold">
                  ● Active On Duty
                </span>
              </div>
            </div>

            {/* Specialization Block */}
            <div className="text-xs text-slate-300 font-sans border-l-2 border-amber-500/60 pl-3 py-0.5">
              <span className="text-amber-400 font-mono font-bold uppercase tracking-wide text-[9.5px] block mb-0.5">Core Specialization</span>
              {officer.specialArea}
            </div>

            {/* Citation block */}
            <div className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-sm pl-4">
              <span className="text-[9.5px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">Official Citation Record</span>
              <p className="text-xs italic text-amber-100/90 leading-relaxed font-sans">
                "{officer.commendation}"
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Top Performance Metrics */}
        <div className="w-full lg:w-[320px] flex flex-col justify-center gap-3">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest text-center lg:text-left block mb-1 pl-1">Performance Highlights</span>
          
          <div className="grid grid-cols-2 gap-3 font-mono">
            {/* Cases Solved */}
            <div className="bg-slate-950/70 border border-slate-700/60 rounded-sm p-4 text-center hover:border-amber-500/40 transition-colors shadow-sm">
              <span className="text-[8.5px] text-amber-400 font-bold uppercase tracking-wider block mb-1.5">Cases Solved</span>
              <span className="text-2xl font-bold text-white block leading-none">{officer.casesSolvedMonth}</span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest block mt-2">Previous Month</span>
            </div>

            {/* Clearance Rate */}
            <div className="bg-slate-950/70 border border-slate-700/60 rounded-sm p-4 text-center hover:border-amber-500/40 transition-colors shadow-sm">
              <span className="text-[8.5px] text-amber-400 font-bold uppercase tracking-wider block mb-1.5">Clearance Rate</span>
              <span className="text-2xl font-bold text-amber-400 block leading-none">{officer.clearanceRate}%</span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest block mt-2">Trial Filing Rate</span>
            </div>

            {/* Career Closures */}
            <div className="bg-slate-950/70 border border-slate-700/60 rounded-sm p-4 text-center hover:border-amber-500/40 transition-colors shadow-sm">
              <span className="text-[8.5px] text-amber-400 font-bold uppercase tracking-wider block mb-1.5">Career Closures</span>
              <span className="text-2xl font-bold text-white block leading-none">{officer.totalCasesClosed}</span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest block mt-2">CCTNS Logged</span>
            </div>

            {/* Performance Score */}
            <div className="bg-slate-950/70 border border-slate-700/60 rounded-sm p-4 text-center hover:border-amber-500/40 transition-colors shadow-sm">
              <span className="text-[8.5px] text-amber-400 font-bold uppercase tracking-wider block mb-1.5">Performance Score</span>
              <span className="text-2xl font-extrabold text-white block leading-none flex items-center justify-center gap-0.5">
                {performanceScore}<span className="text-xs font-bold text-amber-400">/100</span>
              </span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest block mt-2">Audit Telemetry</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerOfTheMonthCard;
