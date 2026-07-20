import React from "react";
import { FaShieldAlt, FaInfoCircle, FaUsers, FaClipboardCheck, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";

// ── Shared card wrapper ──────────────────────────────────────────────────────
const IntelCard = ({ children, className = "" }) => (
  <div className={`bg-slate-900/35 border border-slate-800/35 rounded-xl p-6 shadow-lg relative overflow-hidden ${className}`}>
    {children}
  </div>
);

// ── Section header with left-accent bar ─────────────────────────────────────
const SectionHeader = ({ icon: Icon, label, iconColor = "text-blue-400", accentColor = "#3b82f6" }) => (
  <div style={{ borderBottom: "1px solid rgba(51,65,85,0.2)", marginBottom: 14, paddingBottom: 10 }}
    className="flex items-center gap-2.5">
    <span style={{ display: "inline-block", width: 2, height: 12, borderRadius: 2, background: accentColor, flexShrink: 0 }} />
    <Icon className={`${iconColor} text-xs flex-shrink-0`} />
    <h2 className="text-[9px] font-mono font-bold tracking-[0.14em] text-slate-400 uppercase">
      {label}
    </h2>
  </div>
);

const IntelligencePanel = ({ selectionName, metrics, selectedMarker, onDossierClose }) => {
  // If a marker is selected, render the incident dossier card first
  const renderDossier = () => {
    if (!selectedMarker) return null;

    const getSeverityStyle = (sev) => {
      switch (sev) {
        case "CRITICAL": return "text-red-400 bg-red-950/20 border-red-500/25";
        case "HIGH": return "text-amber-400 bg-amber-950/20 border-amber-500/25";
        case "MEDIUM": return "text-blue-400 bg-blue-950/20 border-blue-500/25";
        default: return "text-slate-400 bg-slate-800/20 border-slate-700/25";
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
      <IntelCard className="border-blue-500/20">
        <SectionHeader icon={FaFileAlt} label="Case Master Dossier" accentColor="#3b82f6" />

        <div className="space-y-4 font-mono text-xs">
          <div>
            <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-0.5">Case / Crime Number</span>
            <span className="text-white font-bold text-sm block leading-tight">{selectedMarker.caseNo}</span>
            <span className="text-slate-600 text-[9px] block mt-0.5">{selectedMarker.crimeNo}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1">Severity</span>
              <span className={`inline-block text-[9px] font-bold px-2 py-1 rounded-md border uppercase ${getSeverityStyle(selectedMarker.severity)}`}>
                ● {selectedMarker.severity}
              </span>
            </div>
            <div>
              <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1">Status</span>
              <span className={`inline-block text-[8px] px-2 py-1 rounded-md border uppercase ${getStatusStyle(selectedMarker.status)}`}>
                {selectedMarker.status}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1">Jurisdiction / Unit</span>
            <span className="text-slate-300 block text-[11px]">{selectedMarker.unit}</span>
            <span className="text-slate-500 block text-[9px] font-bold mt-0.5">{selectedMarker.district.toUpperCase()}</span>
          </div>

          <div>
            <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1">Investigating Officer</span>
            <span className="text-white font-bold block text-[11px]">{selectedMarker.assignedOfficer.name}</span>
            <span className="text-slate-600 text-[8px] block mt-0.5">KGID: {selectedMarker.assignedOfficer.kgid}</span>
          </div>

          <div>
            <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1.5">Brief Fact Record</span>
            <p className="text-[10px] leading-relaxed text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800/30 font-sans">
              {selectedMarker.briefFacts}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/25 text-[8px] text-slate-600">
            <span>REGISTERED DATE</span>
            <span className="text-slate-400 font-bold">{selectedMarker.date}</span>
          </div>
        </div>

        <button
          onClick={onDossierClose}
          className="absolute top-4 right-5 text-[9px] font-mono font-bold text-slate-600 hover:text-slate-300 transition-colors uppercase cursor-pointer"
        >
          Clear ✕
        </button>
      </IntelCard>
    );
  };

  const chargeSheetRate = metrics.total > 0 ? Math.round((metrics.chargesheeted / metrics.total) * 100) : 0;

  const categoryColors = {
    "Property Offences": "#3b82f6",
    "Body Offences": "#f43f5e",
    "Cyber Crimes": "#a855f7",
    "Financial Fraud": "#f59e0b",
    "Narcotics": "#10b981",
    "Crimes Against Women": "#ec4899"
  };

  return (
    <div className="space-y-4">
      {/* Dossier Card */}
      {renderDossier()}

      {/* 1. Karnataka Overview / Spatial Summary */}
      <IntelCard>
        <SectionHeader icon={FaMapMarkerAlt} label={selectedMarker ? "Incident Context" : "Spatial Summary"} />
        <div className="space-y-4">
          <div>
            <span className="text-[8px] font-mono font-bold tracking-wider text-slate-600 uppercase block mb-1">
              Selected Zone / District
            </span>
            <span className="text-base font-bold text-white uppercase tracking-wide font-sans block">
              {metrics.name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/20 text-center font-mono">
            <div>
              <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1">Total</span>
              <span className="text-xl font-bold text-white block">{metrics.total}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1">Active</span>
              <span className="text-xl font-bold text-amber-400 block">{metrics.active}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-600 uppercase tracking-wider block mb-1">Charge Rate</span>
              <span className="text-xl font-bold text-emerald-400 block">{chargeSheetRate}%</span>
            </div>
          </div>
        </div>
      </IntelCard>

      {/* 2. Crime Category Breakdown */}
      <IntelCard>
        <SectionHeader icon={FaShieldAlt} label="Crime Head Distribution" accentColor="#6366f1" iconColor="text-indigo-400" />
        <div className="space-y-3.5 font-mono text-[10px]">
          {Object.entries(metrics.catDistribution).map(([cat, count]) => {
            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
            const barColor = categoryColors[cat] || "#475569";
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span className="truncate max-w-[170px]" title={cat}>{cat}</span>
                  <span className="font-bold text-slate-300 ml-2 flex-shrink-0">{count} <span className="text-slate-600">({pct}%)</span></span>
                </div>
                <div className="h-1 w-full bg-slate-950/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </IntelCard>

      {/* 3. Severity Breakdown */}
      <IntelCard>
        <SectionHeader icon={FaInfoCircle} label="Severity Breakdown" accentColor="#ef4444" iconColor="text-red-400" />
        <div className="space-y-2.5 font-mono text-xs">
          {[
            { label: "CRITICAL", count: metrics.sevBreakdown.CRITICAL || 0, color: "#ef4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)" },
            { label: "HIGH",     count: metrics.sevBreakdown.HIGH || 0,     color: "#f59e0b", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)" },
            { label: "MEDIUM",   count: metrics.sevBreakdown.MEDIUM || 0,   color: "#3b82f6", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.15)" },
            { label: "LOW",      count: metrics.sevBreakdown.LOW || 0,      color: "#475569", bg: "rgba(71,85,105,0.06)", border: "rgba(71,85,105,0.15)" },
          ].map(({ label, count, color, bg, border }) => {
            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
            return (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "8px 12px" }}
                className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ color: color, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{count}</span>
                  <span className="text-slate-600 text-[9px]">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </IntelCard>

      {/* 4. Assigned Officers */}
      <IntelCard className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/8 border border-blue-500/15 text-blue-400">
            <FaUsers className="text-sm" />
          </div>
          <div>
            <h3 className="text-[9px] font-bold text-slate-300 font-mono uppercase tracking-wider">
              Officers Deployed
            </h3>
            <p className="text-[9px] text-slate-600 font-sans mt-0.5">
              Unique personnel in selection
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {metrics.officersCount}
        </div>
      </IntelCard>

      {/* 5. Recent Incidents */}
      <IntelCard>
        <SectionHeader icon={FaClipboardCheck} label="Recent Incidents" accentColor="#10b981" iconColor="text-emerald-400" />
        <div className="space-y-2">
          {metrics.recentIncidents && metrics.recentIncidents.length > 0 ? (
            metrics.recentIncidents.map((inc) => (
              <div
                key={inc.id}
                className="border border-slate-800/25 hover:border-slate-700/35 p-3.5 rounded-lg flex flex-col gap-1.5 transition-colors duration-150 text-[10px] font-mono bg-slate-950/25 hover:bg-slate-900/30"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-slate-300 truncate">{inc.caseNo}</span>
                  <span className="text-[8px] text-slate-600 flex-shrink-0">{inc.date}</span>
                </div>
                <p className="text-slate-500 text-[9px] font-sans line-clamp-2 leading-relaxed">
                  {inc.briefFacts}
                </p>
                <div className="flex justify-between items-center text-[8px] text-slate-600 border-t border-slate-800/20 pt-1.5 mt-0.5">
                  <span className="uppercase text-slate-500">{inc.category.slice(0, 18)}</span>
                  <span className="text-slate-500 font-bold">{inc.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-600 font-mono text-xs">
              No matching records found.
            </div>
          )}
        </div>
      </IntelCard>
    </div>
  );
};

export default IntelligencePanel;
