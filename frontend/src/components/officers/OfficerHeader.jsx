import React from "react";
import {
  FaIdBadge,
  FaIdCard,
  FaBuilding,
  FaClock,
  FaFolderOpen,
  FaSearch,
  FaCheckCircle,
  FaGavel,
  FaRegClock,
  FaUserLock
} from "react-icons/fa";

const OfficerHeader = ({ profile, officerList, onOfficerChange, allowSelector = true }) => {
  if (!profile) return null;

  const kpis = profile.kpis || {
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    chargesheetRate: 0,
    avgInvestigationTime: 0,
    detectionRate: 0
  };

  const cardData = [
    {
      title: "Total Assigned",
      value: kpis.totalCases,
      color: "text-blue-400",
      borderColor: "border-blue-500",
      icon: FaFolderOpen,
      sub: "All-time history"
    },
    {
      title: "Active Tasks",
      value: kpis.activeCases,
      color: "text-amber-400",
      borderColor: "border-amber-500",
      icon: FaSearch,
      sub: "Active dossiers"
    },
    {
      title: "Cases Closed",
      value: kpis.closedCases,
      color: "text-emerald-400",
      borderColor: "border-emerald-500",
      icon: FaCheckCircle,
      sub: "Resolved cases"
    },
    {
      title: "Charge Rate (IIF-5)",
      value: `${kpis.chargesheetRate}%`,
      color: "text-purple-400",
      borderColor: "border-purple-500",
      icon: FaGavel,
      sub: "Court filings"
    },
    {
      title: "Avg Resolution",
      value: `${kpis.avgInvestigationTime} Days`,
      color: "text-cyan-400",
      borderColor: "border-cyan-500",
      icon: FaRegClock,
      sub: "Cycle duration"
    },
    {
      title: "Detection Rate",
      value: `${kpis.detectionRate}%`,
      color: "text-rose-400",
      borderColor: "border-rose-500",
      icon: FaUserLock,
      sub: "Identifications"
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 py-5 px-6 rounded-[4px] shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Officer Profile Info (1/3 width) */}
      <div className="flex flex-col justify-between gap-5 border-b lg:border-b-0 lg:border-r border-slate-800 pb-5 lg:pb-0 lg:pr-6">
        
        {/* Officer Bio block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative h-20 w-20 rounded-[4px] overflow-hidden border border-slate-700 shadow-md flex-shrink-0 bg-slate-950">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-full">
                {profile.name}
              </h1>
              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] border uppercase tracking-wider ${
                profile.status === "On Duty" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                profile.status === "Leave" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-slate-800 text-slate-400 border-slate-700"
              }`}>
                ● {profile.status}
              </span>
            </div>

            <p className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest truncate">
              {profile.rank}
            </p>

            <div className="space-y-1 pt-1.5 font-mono text-[9px] text-slate-400">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaIdBadge className="text-slate-500 text-[10px]" />
                <span>BADGE: <span className="text-slate-200 font-bold">{profile.badgeNumber}</span></span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaBuilding className="text-slate-500 text-[10px]" />
                <span>UNIT: <span className="text-slate-200 font-bold">{profile.unit}</span></span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaIdCard className="text-slate-500 text-[10px]" />
                <span>STATION: <span className="text-slate-200 font-bold">{profile.station}</span></span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaClock className="text-slate-500 text-[10px]" />
                <span>SERVICE: <span className="text-slate-200 font-bold">{profile.yearsOfService} Years</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Officer Selector Block */}
        <div className="w-full bg-slate-950/60 border border-slate-850 p-4 rounded-[4px] flex flex-col gap-1.5">
          <label className="text-[8px] font-mono font-bold tracking-widest text-slate-500 uppercase">
            {allowSelector ? "Select Active Officer Dossier" : "Personal Performance Dossier"}
          </label>
          
          {allowSelector ? (
            <select
              value={profile.badgeNumber}
              onChange={(e) => onOfficerChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-[4px] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
            >
              {officerList.map((off) => (
                <option key={off.badgeNumber} value={off.badgeNumber}>
                  {off.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 border border-slate-855 text-xs font-mono text-purple-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="font-bold">Restricted View</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: 6 KPI Blocks (2/3 width) */}
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 self-center w-full">
        {cardData.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`h-[96px] rounded-[4px] border border-slate-800 bg-slate-900/40 p-4 hover:bg-slate-900/90 border-l-4 ${card.borderColor} shadow-sm flex flex-col justify-between transition-colors`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                  {card.title}
                </span>
                <div className={`rounded-lg bg-slate-800/40 p-1 ${card.color}`}>
                  <Icon className="text-[10px]" />
                </div>
              </div>
              <div className="mt-1 leading-none">
                <h2 className="font-mono text-lg font-bold text-white leading-none">
                  {card.value}
                </h2>
                <span className="text-[8px] font-mono text-slate-500 block mt-0.5 uppercase tracking-wider">
                  {card.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfficerHeader;
