import React from "react";
import { FaShieldAlt, FaInfoCircle, FaUsers, FaClipboardCheck, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";

const IntelligencePanel = ({ selectionName, metrics, selectedMarker, onDossierClose }) => {
  // If a marker is selected, render the incident dossier card first
  const renderDossier = () => {
    if (!selectedMarker) return null;

    const getSeverityStyle = (sev) => {
      switch (sev) {
        case "CRITICAL": return "text-red-400 bg-red-950/20 border-red-500/30";
        case "HIGH": return "text-amber-400 bg-amber-950/20 border-amber-500/30";
        case "MEDIUM": return "text-blue-400 bg-blue-950/20 border-blue-500/30";
        default: return "text-slate-400 bg-slate-800/20 border-slate-700/30";
      }
    };

    const getStatusStyle = (status) => {
      switch (status) {
        case "Charge-sheet Submitted": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
        case "Suspect Apprehended": return "text-blue-400 border-blue-500/20 bg-blue-500/5";
        default: return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      }
    };

    return (
      <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 blur-2xl rounded-full" />
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FaFileAlt className="text-blue-400 text-sm" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
              CASE MASTER DOSSIER
            </span>
          </div>
          <button
            onClick={onDossierClose}
            className="text-[10px] font-mono font-bold text-slate-500 hover:text-white transition-colors uppercase cursor-pointer"
          >
            Clear [X]
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[9px] block">CASE / CRIME NUMBER:</span>
            <span className="text-white font-bold text-sm block">{selectedMarker.caseNo}</span>
            <span className="text-slate-500 text-[9px] block mt-0.5">{selectedMarker.crimeNo}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 text-[9px] block">SEVERITY LEVEL:</span>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase mt-0.5 ${getSeverityStyle(selectedMarker.severity)}`}>
                ● {selectedMarker.severity}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] block">CASE STATUS:</span>
              <span className={`inline-block text-[9px] px-2 py-0.5 rounded border uppercase mt-0.5 ${getStatusStyle(selectedMarker.status)}`}>
                {selectedMarker.status}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 text-[9px] block">JURISDICTION / UNIT:</span>
            <span className="text-slate-200 block">{selectedMarker.unit}</span>
            <span className="text-slate-400 block text-[10px] font-bold">{selectedMarker.district.toUpperCase()}</span>
          </div>

          <div>
            <span className="text-slate-500 text-[9px] block">ASSIGNED INVESTIGATING OFFICER:</span>
            <span className="text-white font-bold block">{selectedMarker.assignedOfficer.name}</span>
            <span className="text-slate-500 text-[9px] block">KGID: {selectedMarker.assignedOfficer.kgid}</span>
          </div>

          <div>
            <span className="text-slate-500 text-[9px] block">BRIEF FACT RECORD:</span>
            <p className="text-[11px] leading-relaxed text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-900 font-sans mt-1">
              {selectedMarker.briefFacts}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-850 pt-2.5 text-[9px] text-slate-500">
            <span>REGISTERED DATE:</span>
            <span className="text-slate-300 font-bold">{selectedMarker.date}</span>
          </div>
        </div>
      </div>
    );
  };

  const chargeSheetRate = metrics.total > 0 ? Math.round((metrics.chargesheeted / metrics.total) * 100) : 0;

  // Spacing helper
  const categoryColors = {
    "Property Offences": "bg-blue-500",
    "Body Offences": "bg-rose-500",
    "Cyber Crimes": "bg-purple-500",
    "Financial Fraud": "bg-amber-500",
    "Narcotics": "bg-emerald-500",
    "Crimes Against Women": "bg-pink-500"
  };

  return (
    <div className="space-y-5">
      {/* Dossier Card */}
      {renderDossier()}

      {/* 1. District Title & KPI Summary */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <FaMapMarkerAlt className="text-blue-400 text-sm" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            {selectedMarker ? "Incident Context Location" : "Spatial Summary"}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block">
              SELECTED ZONE / DISTRICT:
            </span>
            <span className="text-base font-bold text-white uppercase tracking-wide font-sans block mt-1">
              {metrics.name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-850 pt-3.5 text-center font-mono">
            <div>
              <span className="text-[9px] text-slate-500 block">TOTAL</span>
              <span className="text-lg font-bold text-white block mt-0.5">{metrics.total}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">ACTIVE</span>
              <span className="text-lg font-bold text-amber-500 block mt-0.5">{metrics.active}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">CHARGE RATE</span>
              <span className="text-lg font-bold text-emerald-400 block mt-0.5">{chargeSheetRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Crime Head Distribution */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <FaShieldAlt className="text-blue-400 text-sm" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Crime Head Distribution
          </h2>
        </div>

        <div className="space-y-3 font-mono text-[10px]">
          {Object.entries(metrics.catDistribution).map(([cat, count]) => {
            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
            const barColor = categoryColors[cat] || "bg-slate-500";
            
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="truncate max-w-[200px]" title={cat}>{cat}</span>
                  <span className="font-bold text-white">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Severity Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <FaInfoCircle className="text-blue-400 text-sm" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Severity Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px]">
          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-850">
            <span className="text-red-500 font-bold block">CRITICAL</span>
            <span className="text-base font-bold text-white mt-1 block">{metrics.sevBreakdown.CRITICAL || 0}</span>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-850">
            <span className="text-amber-500 font-bold block">HIGH</span>
            <span className="text-base font-bold text-white mt-1 block">{metrics.sevBreakdown.HIGH || 0}</span>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-850">
            <span className="text-blue-500 font-bold block">MEDIUM</span>
            <span className="text-base font-bold text-white mt-1 block">{metrics.sevBreakdown.MEDIUM || 0}</span>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded border border-slate-850">
            <span className="text-slate-400 font-bold block">LOW</span>
            <span className="text-base font-bold text-white mt-1 block">{metrics.sevBreakdown.LOW || 0}</span>
          </div>
        </div>
      </div>

      {/* 4. Assigned Officers */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-blue-400">
            <FaUsers className="text-base" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Assigned Officers
            </h3>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
              Unique personnel in current selection
            </p>
          </div>
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {metrics.officersCount}
        </div>
      </div>

      {/* 5. Recent Incidents Summary */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
          <FaClipboardCheck className="text-blue-400 text-sm" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Recent Incidents
          </h2>
        </div>

        <div className="space-y-2.5">
          {metrics.recentIncidents && metrics.recentIncidents.length > 0 ? (
            metrics.recentIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-slate-950/40 border border-slate-850 hover:border-slate-800/80 p-3 rounded-lg flex flex-col gap-1.5 transition-all text-[10px] font-mono leading-normal"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-slate-200 truncate">{inc.caseNo}</span>
                  <span className="text-[8px] text-slate-500">{inc.date}</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans line-clamp-2">
                  {inc.briefFacts}
                </p>
                <div className="flex justify-between items-center text-[8px] text-slate-500 border-t border-slate-900/80 pt-1.5 mt-0.5">
                  <span className="uppercase text-slate-400">{inc.category.slice(0, 16)}...</span>
                  <span className="text-slate-400 font-bold">{inc.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500 font-mono text-xs">
              No matching records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligencePanel;
