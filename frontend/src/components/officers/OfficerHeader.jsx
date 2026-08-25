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
  FaUserLock,
  FaAngleDoubleUp,
  FaAngleDoubleDown
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
      icon: FaFolderOpen,
      sub: "All-time case history",
      trend: <span className="text-[9px] text-blue-400 font-bold flex items-center gap-0.5"><FaAngleDoubleUp /> Stable</span>
    },
    {
      title: "Active Workload",
      value: kpis.activeCases,
      color: "text-amber-400",
      icon: FaSearch,
      sub: "Under investigation",
      trend: kpis.activeCases > 15 ? (
        <span className="text-[9px] text-rose-400 font-bold flex items-center gap-0.5"><FaAngleDoubleUp /> High</span>
      ) : (
        <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5"><FaAngleDoubleDown /> Optimal</span>
      )
    },
    {
      title: "Cases Closed",
      value: kpis.closedCases,
      color: "text-emerald-400",
      icon: FaCheckCircle,
      sub: "Resolved closures",
      trend: <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5"><FaAngleDoubleUp /> +8% MoM</span>
    },
    {
      title: "Filing Rate",
      value: `${kpis.chargesheetRate}%`,
      color: "text-purple-400",
      icon: FaGavel,
      sub: "IIF-5 chargesheets",
      trend: <span className="text-[9px] text-purple-400 font-bold flex items-center gap-0.5"><FaAngleDoubleUp /> High</span>
    },
    {
      title: "Avg Resolution",
      value: `${kpis.avgInvestigationTime}d`,
      color: "text-cyan-400",
      icon: FaRegClock,
      sub: "Cycle duration",
      trend: <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5"><FaAngleDoubleDown /> -2.4d</span>
    },
    {
      title: "Detection Rate",
      value: `${kpis.detectionRate}%`,
      color: "text-rose-400",
      icon: FaUserLock,
      sub: "Suspect identification",
      trend: <span className="text-[9px] text-rose-400 font-bold flex items-center gap-0.5"><FaAngleDoubleUp /> +1.2%</span>
    }
  ];

  return (
    <div
      className="rounded-sm border border-slate-700/60 shadow-xl bg-slate-900/85 backdrop-blur-md grid grid-cols-1 lg:grid-cols-3 gap-8"
      style={{ padding: "24px 26px" }}
    >
      {/* Left Column: Bio profile (1/3 width) */}
      <div className="flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 pb-6 lg:pb-0 lg:pr-8">
        
        {/* Profile Card details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Portrait Photo frame */}
          <div className="relative h-24 w-24 rounded-sm overflow-hidden border border-slate-600 bg-slate-950 p-0.5 flex-shrink-0 shadow-md">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-full w-full object-cover rounded-sm"
            />
          </div>

          {/* Bio Details */}
          <div className="space-y-1 flex-1 min-w-0 pl-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-full">
                {profile.name}
              </h1>
              <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider ${
                profile.status === "On Duty" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                profile.status === "Leave" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                "bg-slate-800 text-slate-400 border-slate-700"
              }`}>
                ● {profile.status}
              </span>
            </div>

            <p className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest truncate">
              {profile.rank}
            </p>

            <div className="space-y-1.5 pt-2 font-mono text-[10px] text-slate-300">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaIdBadge className="text-blue-400 text-xs flex-shrink-0" />
                <span>BADGE: <span className="text-white font-bold">{profile.badgeNumber}</span></span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaBuilding className="text-blue-400 text-xs flex-shrink-0" />
                <span>DIVISION: <span className="text-slate-200 font-semibold">{profile.unit}</span></span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaIdCard className="text-blue-400 text-xs flex-shrink-0" />
                <span>STATION: <span className="text-slate-200 font-semibold">{profile.station}</span></span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <FaClock className="text-blue-400 text-xs flex-shrink-0" />
                <span>TENURE: <span className="text-slate-200 font-semibold">{profile.yearsOfService} Years Active</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Dossier Selection Dropdown */}
        <div className="w-full bg-slate-950/80 border border-slate-700/60 p-3.5 rounded-sm flex flex-col gap-2 shadow-sm">
          <label className="text-[8.5px] font-mono font-bold tracking-widest text-slate-400 uppercase block pl-0.5">
            {allowSelector ? "Dossier Selector Hub" : "Active Officer dossier"}
          </label>
          
          {allowSelector ? (
            <select
              value={profile.badgeNumber}
              onChange={(e) => onOfficerChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono transition-colors cursor-pointer"
            >
              {officerList.map((off) => (
                <option key={off.badgeNumber} value={off.badgeNumber}>
                  {off.name} ({off.badgeNumber})
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 rounded-sm bg-[#060c18] border border-slate-700/60 text-xs font-mono text-blue-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-bold">Command View Restricted</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: 6 KPI Cards (2/3 width) */}
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 self-center w-full">
        {cardData.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-sm border border-slate-700/60 bg-slate-950/80 hover:bg-slate-950 hover:border-blue-500/50 px-4 py-3.5 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-150 h-[104px] relative"
            >
              {/* Absolute trend tag at top right */}
              <div className="absolute top-2 right-2.5">
                {card.trend}
              </div>

              {/* Centered Title with Inline Icon right after it */}
              <span className="text-[10.5px] font-bold tracking-wider text-slate-300 uppercase font-mono flex items-center justify-center gap-1.5 leading-relaxed pt-1">
                {card.title}
                <Icon className={card.color} />
              </span>

              {/* Centered Value */}
              <h2 className="font-mono text-2xl font-extrabold text-white leading-normal my-1">
                {card.value}
              </h2>

              {/* Centered Subtitle */}
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider leading-relaxed">
                {card.sub}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default OfficerHeader;
