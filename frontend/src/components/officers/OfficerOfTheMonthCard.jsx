import React from "react";
import { FaTrophy, FaMedal, FaCheckCircle, FaStar, FaAward, FaBuilding, FaIdBadge } from "react-icons/fa";

const OfficerOfTheMonthCard = ({ officer }) => {
  if (!officer) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/25 p-6 sm:p-8 shadow-2xl font-sans">
      {/* Background Decorative Glow & Crown Icon */}
      <div className="absolute -right-10 -bottom-10 opacity-10 text-amber-400 pointer-events-none">
        <FaTrophy className="text-[220px]" />
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Column: Trophy Badge & Officer Photo & Bio */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-auto">
          {/* Avatar Frame with Gold Medal Badge */}
          <div className="relative flex-shrink-0">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/20 bg-slate-950 p-1">
              <img
                src={officer.avatar}
                alt={officer.name}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/30 whitespace-nowrap">
              <FaTrophy className="text-[10px]" /> TOP PERFORMER
            </div>
          </div>

          {/* Officer Details */}
          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
              <FaMedal className="text-amber-400 text-xs" />
              <span>OFFICER OF THE MONTH • PREVIOUS MONTH (JUNE/JULY 2026)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              {officer.name}
              <FaCheckCircle className="text-blue-400 text-base" title="Verified Command Dossier" />
            </h2>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider">{officer.rank}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 flex items-center gap-1">
                <FaBuilding className="text-slate-500 text-[11px]" /> {officer.unit}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <FaIdBadge className="text-slate-500 text-[11px]" /> BADGE: {officer.badgeNumber}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-xl font-sans leading-relaxed pt-1">
              <span className="text-amber-300 font-semibold font-mono">Specialization:</span> {officer.specialArea}
            </p>
          </div>
        </div>

        {/* Right Column: Performance Highlights Grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 text-center shadow-inner">
            <span className="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider block mb-1">
              Cases Solved (Prev Month)
            </span>
            <span className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
              {officer.casesSolvedMonth} <span className="text-xs font-normal text-slate-400">cases</span>
            </span>
            <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">Highest in State</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center shadow-inner">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Clearance Rate
            </span>
            <span className="text-2xl font-bold text-emerald-400">
              {officer.clearanceRate}%
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Top Resolution Tier</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1 shadow-inner">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Total Career Closures
            </span>
            <span className="text-2xl font-bold text-blue-400">
              {officer.totalCasesClosed}
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Logged CCTNS Reports</span>
          </div>
        </div>

      </div>

      {/* Bottom Commendation Banner */}
      <div className="mt-5 border-t border-amber-500/20 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-300">
          <FaStar className="text-amber-400 text-sm flex-shrink-0" />
          <span className="text-[11px] font-bold tracking-wide">{officer.commendation}</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg self-end sm:self-auto">
          <FaAward className="text-amber-400" /> Authorized by Director General of Police, Karnataka
        </div>
      </div>
    </div>
  );
};

export default OfficerOfTheMonthCard;
