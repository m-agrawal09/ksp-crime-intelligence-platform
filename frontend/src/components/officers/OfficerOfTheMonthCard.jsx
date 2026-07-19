import React from "react";
import { FaTrophy, FaMedal, FaCheckCircle, FaStar, FaAward, FaBuilding, FaIdBadge } from "react-icons/fa";

const OfficerOfTheMonthCard = ({ officer }) => {
  if (!officer) return null;

  return (
    <div className="relative overflow-hidden rounded-[4px] border border-[#8B6A1F]/40 bg-gradient-to-br from-[#0c0d12] via-[#241905] to-[#120e03] py-5 px-6 shadow-2xl font-sans">
      {/* Subtle Background Decorative Glow & Trophy Silhouette Watermark (3% opacity) */}
      <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-[#C89B2C] pointer-events-none">
        <FaTrophy className="text-[240px]" />
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Column: Trophy Badge & Officer Photo & Bio */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-auto">
          {/* Avatar Frame with Gold Medal Badge */}
          <div className="relative flex-shrink-0">
            <div className="h-32 w-32 sm:h-[136px] sm:w-[136px] rounded-[4px] overflow-hidden border border-[#8B6A1F] bg-slate-950 p-1 flex-shrink-0 shadow-lg">
              <img
                src={officer.avatar}
                alt={officer.name}
                className="h-full w-full object-cover rounded-[2px]"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#C89B2C] text-slate-950 px-3 py-0.5 rounded-[4px] text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-[#C89B2C]/30 whitespace-nowrap">
              <FaTrophy className="text-[10px]" /> TOP PERFORMER
            </div>
          </div>

          {/* Officer Details */}
          <div className="text-center sm:text-left space-y-2.5 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[4px] bg-[#3A2A08]/40 border border-[#8B6A1F]/40 text-[#C89B2C] text-[10px] font-mono font-bold uppercase tracking-[0.15em] shadow-sm">
              <FaTrophy className="text-[#C89B2C] text-xs" />
              <span>OFFICER OF THE MONTH COMMENDATION • JUNE/JULY 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              {officer.name}
              <FaCheckCircle className="text-[#C89B2C] text-lg" title="Verified Command Dossier" />
            </h2>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs font-mono">
              <span className="text-[#C89B2C] font-bold uppercase tracking-widest">{officer.rank}</span>
              <span className="text-slate-700">•</span>
              <span className="text-[#E2D5BA] flex items-center gap-1.5">
                <FaBuilding className="text-[#8B6A1F] text-[11px]" /> {officer.unit}
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-[#E2D5BA] flex items-center gap-1.5">
                <FaIdBadge className="text-[#8B6A1F] text-[11px]" /> BADGE: <span className="text-white font-bold">{officer.badgeNumber}</span>
              </span>
            </div>

            <p className="text-xs text-[#E2D5BA]/80 max-w-xl font-sans leading-relaxed pt-1">
              <span className="text-[#C89B2C] font-semibold font-mono">Specialization:</span> {officer.specialArea}
            </p>
          </div>
        </div>

        {/* Right Column: Performance Highlights Grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          <div className="bg-slate-950/80 border border-[#8B6A1F]/30 rounded-[4px] p-3.5 text-center shadow-inner">
            <span className="text-[10px] text-[#C89B2C] font-bold uppercase tracking-wider block mb-1">
              Cases Solved (Prev Month)
            </span>
            <span className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              {officer.casesSolvedMonth} <span className="text-xs font-normal text-slate-400">cases</span>
            </span>
            <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">Highest in State</span>
          </div>

          <div className="bg-slate-950/80 border border-[#8B6A1F]/20 rounded-[4px] p-3.5 text-center shadow-inner">
            <span className="text-[10px] text-[#E2D5BA] uppercase tracking-wider block mb-1">
              Clearance Rate
            </span>
            <span className="text-2xl font-bold text-[#C89B2C]">
              {officer.clearanceRate}%
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Top Resolution Tier</span>
          </div>

          <div className="bg-slate-950/80 border border-[#8B6A1F]/20 rounded-[4px] p-3.5 text-center col-span-2 sm:col-span-1 shadow-inner">
            <span className="text-[10px] text-[#E2D5BA] uppercase tracking-wider block mb-1">
              Total Career Closures
            </span>
            <span className="text-2xl font-bold text-[#C89B2C]">
              {officer.totalCasesClosed}
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Logged CCTNS Reports</span>
          </div>
        </div>

      </div>

      {/* Bottom Commendation Banner (Thin Gold Information Strip) */}
      <div className="mt-5 border border-[#8B6A1F]/40 bg-[#3A2A08]/15 px-4 py-2.5 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#E2D5BA]">
          <FaMedal className="text-[#C89B2C] text-sm flex-shrink-0" />
          <span className="text-[11px] font-bold tracking-wide">{officer.commendation}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#C89B2C] bg-slate-950/80 border border-[#8B6A1F]/30 px-3 py-1 rounded-[4px] self-end sm:self-auto">
          <FaAward className="text-[#C89B2C]" /> Authorized by DGP, Karnataka Police Command
        </div>
      </div>
    </div>
  );
};

export default OfficerOfTheMonthCard;
