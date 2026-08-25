import React from "react";
import { FaAward, FaArrowRight, FaFileAlt, FaPercentage, FaHourglassHalf, FaClipboardList, FaMedal } from "react-icons/fa";

const OfficerOfTheMonthCard = ({ officer, onSelectProfile }) => {
  if (!officer) return null;

  const empId = officer.empId || `EMP-${officer.badgeNumber ? officer.badgeNumber.replace(/\D/g, "") || "2568" : "2568"}`;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c1425]/90 backdrop-blur-md shadow-2xl p-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Featured Officer Dossier (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Officer Photo & Active Tag */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="h-28 w-28 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-0.5 shadow-md">
                <img
                  src={officer.avatar}
                  alt={officer.name}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE</span>
              </div>
            </div>

            {/* Officer Info Details */}
            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              {/* Gold Commissionerate Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                <span>OFFICER OF THE NORTH COMMISSIONERATE</span>
              </div>

              {/* Name & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {officer.name}
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  {officer.rank || "Police Sub-Inspector"} • <span className="text-slate-300">{officer.unit || "Vehicle Section"}</span>
                </p>
              </div>

              {/* 4 Metadata Columns Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                <div>
                  <span className="text-[9.5px] text-slate-400 block">Employee ID</span>
                  <span className="font-bold text-white">{empId}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block">Badge No.</span>
                  <span className="font-bold text-white">{officer.badgeNumber}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block">Experience</span>
                  <span className="font-bold text-white">{officer.yearsOfService} Years</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block">Rank</span>
                  <span className="font-bold text-white">{officer.rank || "PSI"}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectProfile && onSelectProfile(officer.badgeNumber)}
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors"
                >
                  <span>View Full Profile</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Special Citation Award */}
          <div className="bg-amber-500/5 border border-amber-500/20 px-4 py-2.5 rounded-lg flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <FaAward className="text-xs" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-amber-400 font-mono text-[10px] uppercase tracking-wider block">
                SPECIAL CITATION AWARD
              </span>
              <p className="text-slate-300 text-xs italic font-sans mt-0.5 leading-snug">
                "{officer.commendation || "Awarded Director General's Honor Star for highest case resolution and investigation efficiency in previous month."}"
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Performance Highlights (5 cols, 2x2 grid) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
          <div className="mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              PERFORMANCE HIGHLIGHTS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* 1. Cases Solved with Sparkline */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FaFileAlt className="text-xs" />
                </div>
                {/* SVG Mini Sparkline */}
                <svg className="w-14 h-6 text-emerald-400" viewBox="0 0 60 24" fill="none">
                  <path d="M2 18 L15 14 L28 17 L42 8 L58 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-2">
                <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block">CASES SOLVED</span>
                <span className="text-2xl font-extrabold text-white font-mono block leading-tight">{officer.casesSolvedMonth || 12}</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">All Time</span>
              </div>
            </div>

            {/* 2. Clearance Rate */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="h-8 w-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FaPercentage className="text-xs" />
              </div>
              <div className="mt-2">
                <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block">CLEARANCE RATE</span>
                <span className="text-2xl font-extrabold text-white font-mono block leading-tight">{officer.clearanceRate || 85}%</span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                  <span>vs Last Month 78%</span>
                  <span className="text-emerald-400 font-bold font-mono">↑ 7%</span>
                </div>
              </div>
            </div>

            {/* 3. Cases in Queue */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="h-8 w-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FaHourglassHalf className="text-xs" />
              </div>
              <div className="mt-2">
                <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block">CASES IN QUEUE</span>
                <span className="text-2xl font-extrabold text-white font-mono block leading-tight">6</span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                  <span>vs Last Month 8</span>
                  <span className="text-emerald-400 font-bold font-mono">↓ 2</span>
                </div>
              </div>
            </div>

            {/* 4. Pending Tasks */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="h-8 w-8 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FaClipboardList className="text-xs" />
              </div>
              <div className="mt-2">
                <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider block">PENDING TASKS</span>
                <span className="text-2xl font-extrabold text-white font-mono block leading-tight">
                  87 <span className="text-xs font-normal text-slate-400">/ 200</span>
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                  <span>vs Last Month 120</span>
                  <span className="text-emerald-400 font-bold font-mono">↓ 33</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OfficerOfTheMonthCard;
