import React from "react";
import {
  FaFolderOpen,
  FaSearch,
  FaCheckCircle,
  FaFileAlt,
  FaRegClock,
  FaUserShield,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaGraduationCap,
  FaMedal,
  FaStar,
  FaChevronDown,
  FaCogs
} from "react-icons/fa";

const OfficerHeader = ({ profile, officerList = [], onOfficerChange, allowSelector = true }) => {
  if (!profile) return null;

  const kpis = profile.kpis || {
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    chargesheetRate: 0,
    avgInvestigationTime: 0,
    detectionRate: 0
  };

  const empId = profile.empId || `EMP-${profile.badgeNumber ? profile.badgeNumber.replace(/\D/g, "") || "3047" : "3047"}`;
  const rating = profile.summary?.rating?.replace(" / 5.0", "/5") || "4.8/5";

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c1425]/90 backdrop-blur-md shadow-2xl p-5 sm:p-6 font-sans flex flex-col justify-between h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch h-full">
        
        {/* LEFT: Selected Officer Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-4 lg:pb-0 lg:pr-5">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-3">
              SELECTED OFFICER
            </span>

            {/* Officer Photo & Name & Rating Header */}
            <div className="flex items-start gap-3">
              <div className="h-16 w-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-0.5 shadow-md flex-shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight truncate font-sans">
                    {profile.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold">
                    <FaStar className="text-[10px]" /> {rating}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  <span>Rank: <span className="text-slate-200">{profile.rank || "PSI"}</span></span>
                  <span className="mx-1.5 text-slate-600">|</span>
                  <span>Emp ID: <span className="text-slate-200">{empId}</span></span>
                </div>
              </div>
            </div>

            {/* Metadata List with Icons */}
            <div className="space-y-1.5 pt-3.5 text-xs text-slate-300 font-sans">
              <div className="flex items-center gap-2 text-slate-300">
                <FaMapMarkerAlt className="text-blue-400 text-xs flex-shrink-0" />
                <span className="truncate">{profile.station || "South Zone"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaBuilding className="text-blue-400 text-xs flex-shrink-0" />
                <span className="truncate">{profile.unit || "Law & Order - Crime Against Women"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaCalendarAlt className="text-blue-400 text-xs flex-shrink-0" />
                <span>{profile.yearsOfService || "12"} Years of Service</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaGraduationCap className="text-blue-400 text-xs flex-shrink-0" />
                <span className="truncate">{profile.summary?.strongArea || "Trained in Cyber Crimes & Evidence Handling"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaMedal className="text-amber-400 text-xs flex-shrink-0" />
                <span>Awards: 2 Comm. Medals</span>
              </div>
            </div>
          </div>

          {/* Dynamic Dropdown: SELECT OFFICER */}
          <div className="pt-2">
            <label className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-1">
              SELECT OFFICER
            </label>
            <div className="relative">
              <select
                value={profile.badgeNumber}
                onChange={(e) => onOfficerChange(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-md py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-blue-500 font-sans cursor-pointer appearance-none shadow-inner"
              >
                {officerList.map((off) => (
                  <option key={off.badgeNumber} value={off.badgeNumber}>
                    {off.name} (EMP-{off.badgeNumber.replace(/\D/g, "") || "3047"})
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none" />
            </div>
          </div>

        </div>

        {/* RIGHT: 2x3 KPI GRID (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 self-center w-full">
          
          {/* Card 1: TOTAL ASSIGNED */}
          <div className="bg-[#080d19] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">TOTAL ASSIGNED</span>
              <div className="h-6 w-6 rounded bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                <FaCogs className="text-[10px]" />
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-extrabold text-white font-mono leading-none">{kpis.totalCases || 12}</span>
            </div>
            <span className="text-[9.5px] text-slate-400 font-sans">All Time Case History</span>
          </div>

          {/* Card 2: ACTIVE WORKLOAD */}
          <div className="bg-[#080d19] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">ACTIVE WORKLOAD</span>
              <div className="h-6 w-6 rounded bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <FaFolderOpen className="text-[10px]" />
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-extrabold text-white font-mono leading-none">{kpis.activeCases || 5}</span>
            </div>
            <span className="text-[9.5px] text-slate-400 font-sans">Open Investigations</span>
          </div>

          {/* Card 3: CASES CLOSED */}
          <div className="bg-[#080d19] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">CASES CLOSED</span>
              <div className="h-6 w-6 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <FaCheckCircle className="text-[10px]" />
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-extrabold text-white font-mono leading-none">{kpis.closedCases || 8}</span>
            </div>
            <span className="text-[9.5px] text-slate-400 font-sans">This Year</span>
          </div>

          {/* Card 4: FILING RATE */}
          <div className="bg-[#080d19] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">FILING RATE</span>
              <div className="flex items-center gap-1">
                <span className="text-rose-400 text-[10px] font-mono font-bold">↓ 5%</span>
                <div className="h-6 w-6 rounded bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                  <FaFileAlt className="text-[10px]" />
                </div>
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-extrabold text-white font-mono leading-none">{kpis.chargesheetRate || 82}%</span>
            </div>
            <span className="text-[9.5px] text-slate-400 font-sans">Tip % ChargeSheet</span>
          </div>

          {/* Card 5: AVG RESOLUTION */}
          <div className="bg-[#080d19] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">AVG RESOLUTION</span>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 text-[10px] font-mono font-bold">↑ 12%</span>
                <div className="h-6 w-6 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <FaRegClock className="text-[10px]" />
                </div>
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-extrabold text-white font-mono leading-none">{kpis.avgInvestigationTime || 38}d</span>
            </div>
            <span className="text-[9.5px] text-slate-400 font-sans">Case Duration</span>
          </div>

          {/* Card 6: DETECTION RATE */}
          <div className="bg-[#080d19] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">DETECTION RATE</span>
              <div className="flex items-center gap-1">
                <span className="text-rose-400 text-[10px] font-mono font-bold">↓ 8%</span>
                <div className="h-6 w-6 rounded bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                  <FaUserShield className="text-[10px]" />
                </div>
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-extrabold text-white font-mono leading-none">{kpis.detectionRate || 52}%</span>
            </div>
            <span className="text-[9.5px] text-slate-400 font-sans">Suspect Identification</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OfficerHeader;
