import React from "react";
import { FaIdBadge, FaIdCard, FaBuilding, FaClock, FaSyncAlt } from "react-icons/fa";

const OfficerHeader = ({ profile, officerList, onOfficerChange, allowSelector = true }) => {
  if (!profile) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      
      {/* Officer Bio block */}
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 w-full md:w-auto">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden border border-slate-700 shadow-md flex-shrink-0 bg-slate-950">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {profile.name}
            </h1>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
              profile.status === "On Duty" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
              profile.status === "Leave" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              "bg-slate-800 text-slate-400 border-slate-700"
            }`}>
              ● {profile.status}
            </span>
          </div>

          <p className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            {profile.rank}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1.5 font-mono text-[10px] text-slate-400">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <FaIdBadge className="text-slate-500 text-[11px]" />
              <span>BADGE: <span className="text-slate-200 font-bold">{profile.badgeNumber}</span></span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <FaBuilding className="text-slate-500 text-[11px]" />
              <span>UNIT: <span className="text-slate-200 font-bold">{profile.unit}</span></span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <FaIdCard className="text-slate-500 text-[11px]" />
              <span>STATION: <span className="text-slate-200 font-bold">{profile.station}</span></span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <FaClock className="text-slate-500 text-[11px]" />
              <span>SERVICE: <span className="text-slate-200 font-bold">{profile.yearsOfService} Years</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Block (Admin Switcher vs Officer Restricted Badge) */}
      <div className="w-full md:w-80 bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col gap-2">
        <label className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
          {allowSelector ? "Select Active Officer Dossier (Admin View)" : "Personal Performance Dossier"}
        </label>
        
        {allowSelector ? (
          <div className="relative flex items-center">
            <select
              value={profile.badgeNumber}
              onChange={(e) => onOfficerChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
            >
              {officerList.map((off) => (
                <option key={off.badgeNumber} value={off.badgeNumber}>
                  {off.name} ({off.rank.slice(0, 12)}...)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-850 text-xs font-mono text-purple-300 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-bold">Personal Dossier • Restricted View</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default OfficerHeader;
