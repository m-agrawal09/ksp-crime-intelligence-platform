import React from "react";
import { 
  RiRouteLine, 
  RiUserSearchLine, 
  RiExternalLinkLine,
  RiAlertFill,
  RiBuilding2Line,
  RiMapPinRangeLine
} from "react-icons/ri";

export default function CrossJurisdictionFinder({
  crossDistrictSuspects,
  selectedSuspectId,
  onSelectSuspect
}) {
  return (
    <div className="bg-[#0b1329]/95 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <RiRouteLine className="text-lg" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Cross-Jurisdiction Connection Finder
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                {crossDistrictSuspects.length} Multi-District Targets
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Detects suspects operating across multiple police station silos (Bengaluru, Mysuru, Hubballi, etc.)
            </p>
          </div>
        </div>
      </div>

      {/* Suspect Multi-Jurisdiction List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1">
        {crossDistrictSuspects.map((suspect) => {
          const isSelected = selectedSuspectId === suspect.id;
          return (
            <button
              key={suspect.id}
              onClick={() => onSelectSuspect(suspect.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
              }`}
            >
              {/* Highlight badge on active */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-bl-lg" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate">
                    <span>{suspect.name}</span>
                    {suspect.alias && (
                      <span className="text-[11px] text-amber-400 font-mono font-semibold">
                        {suspect.alias}
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                    <RiAlertFill className="text-red-400 text-xs flex-shrink-0" />
                    <span>{suspect.casesCount} Linked FIRs</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{suspect.districts.length} Districts</span>
                  </p>
                </div>
                
                <span className="p-1.5 rounded-lg bg-slate-800/80 group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 transition-colors">
                  <RiExternalLinkLine className="text-xs" />
                </span>
              </div>

              {/* District Trail Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {suspect.districts.map((dist, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60 flex items-center gap-1"
                  >
                    <RiMapPinRangeLine className="text-[9px] text-blue-400" />
                    <span>{dist}</span>
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
