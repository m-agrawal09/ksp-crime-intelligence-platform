import React from "react";
import { FaTrophy, FaMedal, FaAward, FaBuilding, FaIdBadge, FaStar, FaShieldAlt } from "react-icons/fa";

const OfficerOfTheMonthCard = ({ officer }) => {
  if (!officer) return null;

  // Calculate a premium performance score out of 100 based on metrics
  const performanceScore = Math.min(
    100,
    Math.round((officer.clearanceRate * 0.6) + (officer.detectionRate * 0.4))
  );

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#8B6A1F]/30 bg-gradient-to-br from-[#0a0b0e] via-[#1a1407] to-[#0a0803] p-8 shadow-2xl font-sans">
      
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 relative z-10">
        
        {/* LEFT COLUMN: Hero Recognition Spotlight */}
        <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar Frame with Gold Accent Borders */}
          <div className="relative flex-shrink-0">
            <div className="h-36 w-36 rounded-xl overflow-hidden border-2 border-[#8B6A1F] bg-slate-950 p-1 flex-shrink-0 shadow-xl">
              <img
                src={officer.avatar}
                alt={officer.name}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-[#C89B2C] text-slate-950 px-4 py-1 rounded-md text-[9px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-[#C89B2C]/20 whitespace-nowrap">
              <FaTrophy className="text-[10px]" /> Spotlight Hero
            </div>
          </div>

          {/* Details & Citation */}
          <div className="text-center md:text-left space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#3A2A08]/30 border border-[#8B6A1F]/25 text-[#C89B2C] text-[9px] font-mono font-bold uppercase tracking-[0.18em]">
              <FaAward className="text-[#C89B2C] text-sm" />
              <span>Officer of the Month Commendation</span>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                {officer.name}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400 mt-2">
                <span className="text-[#C89B2C] font-bold uppercase tracking-widest">{officer.rank}</span>
                <span className="text-slate-800">•</span>
                <span className="flex items-center gap-1">
                  <FaBuilding className="text-[#8B6A1F] text-[10px]" /> {officer.unit}
                </span>
                <span className="text-slate-800">•</span>
                <span className="flex items-center gap-1">
                  <FaIdBadge className="text-[#8B6A1F] text-[10px]" /> Badge: <span className="text-slate-200 font-bold">{officer.badgeNumber}</span>
                </span>
                <span className="text-slate-800">•</span>
                <span>Exp: <span className="text-slate-200 font-bold">{officer.yearsOfService} Years</span></span>
                <span className="text-slate-800">•</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px]">
                  ● Active On Duty
                </span>
              </div>
            </div>

            {/* Specialization Block */}
            <div className="text-xs text-slate-400 font-sans border-l-2 border-[#8B6A1F]/40 pl-3 py-0.5">
              <span className="text-[#C89B2C] font-mono font-bold uppercase tracking-wide text-[9px] block mb-0.5">Core Specialization</span>
              {officer.specialArea}
            </div>

            {/* Citation block */}
            <div className="bg-[#3A2A08]/10 border border-[#8B6A1F]/20 p-4 rounded-lg">
              <span className="text-[9px] font-mono font-bold text-[#C89B2C] uppercase tracking-wider block mb-1">Official Citation Record</span>
              <p className="text-xs italic text-[#E2D5BA]/90 leading-relaxed font-sans">
                "{officer.commendation}"
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Top Performance Metrics */}
        <div className="w-full lg:w-[320px] flex flex-col justify-center gap-3">
          <span className="text-[9px] font-mono font-bold text-[#C89B2C] uppercase tracking-widest text-center lg:text-left block mb-1">Performance Highlights</span>
          
          <div className="grid grid-cols-2 gap-3 font-mono">
            {/* Cases Solved */}
            <div className="bg-slate-950/40 border border-[#8B6A1F]/25 rounded-lg p-4 text-center hover:bg-slate-950/80 transition-colors">
              <span className="text-[8px] text-[#C89B2C] uppercase tracking-wider block mb-1.5">Cases Solved</span>
              <span className="text-2xl font-bold text-white block leading-none">{officer.casesSolvedMonth}</span>
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block mt-2">Previous Month</span>
            </div>

            {/* Clearance Rate */}
            <div className="bg-slate-950/40 border border-[#8B6A1F]/25 rounded-lg p-4 text-center hover:bg-slate-950/80 transition-colors">
              <span className="text-[8px] text-[#C89B2C] uppercase tracking-wider block mb-1.5">Clearance Rate</span>
              <span className="text-2xl font-bold text-[#C89B2C] block leading-none">{officer.clearanceRate}%</span>
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block mt-2">Trial Filing Rate</span>
            </div>

            {/* Career Closures */}
            <div className="bg-slate-950/40 border border-[#8B6A1F]/25 rounded-lg p-4 text-center hover:bg-slate-950/80 transition-colors">
              <span className="text-[8px] text-[#C89B2C] uppercase tracking-wider block mb-1.5">Career Closures</span>
              <span className="text-2xl font-bold text-white block leading-none">{officer.totalCasesClosed}</span>
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block mt-2">CCTNS Logged</span>
            </div>

            {/* Performance Score */}
            <div className="bg-slate-950/40 border border-[#8B6A1F]/25 rounded-lg p-4 text-center hover:bg-[#3a2908]/20 transition-colors">
              <span className="text-[8px] text-[#C89B2C] uppercase tracking-wider block mb-1.5">Performance Score</span>
              <span className="text-2xl font-extrabold text-white block leading-none flex items-center justify-center gap-0.5">
                {performanceScore}<span className="text-xs font-bold text-[#C89B2C]">/100</span>
              </span>
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block mt-2">Audit Telemetry</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerOfTheMonthCard;
