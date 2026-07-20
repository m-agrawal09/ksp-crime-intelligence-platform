import React from "react";
import { FaFire, FaHistory, FaFolderOpen } from "react-icons/fa";

// Shared card wrapper
const StripCard = ({ children, className = "" }) => (
  <div className={`bg-slate-900/35 border border-slate-800/35 rounded-xl p-6 shadow-lg flex flex-col ${className}`}>
    {children}
  </div>
);

// Section header with left accent bar
const StripHeader = ({ icon: Icon, label, iconColor = "text-blue-400", accentColor = "#3b82f6" }) => (
  <div style={{ borderBottom: "1px solid rgba(51,65,85,0.2)", paddingBottom: 10, marginBottom: 14 }}
    className="flex items-center gap-2.5 flex-shrink-0">
    <span style={{ display: "inline-block", width: 2, height: 12, borderRadius: 2, background: accentColor, flexShrink: 0 }} />
    <Icon className={`${iconColor} text-xs flex-shrink-0`} />
    <span className="text-[9px] font-mono font-bold tracking-[0.14em] text-slate-400 uppercase">{label}</span>
  </div>
);

const IntelligenceStrip = ({ hotspots, recentIncidents, totalCount, activeCount }) => {
  const activePercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const closedCount = totalCount - activeCount;
  const closedPercentage = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;

  const rankColors = [
    { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#fca5a5", dot: "#ef4444" },
    { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", text: "#fcd34d", dot: "#f59e0b" },
    { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: "#fcd34d", dot: "#f59e0b" },
    { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: "#93c5fd", dot: "#3b82f6" },
    { bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.15)", text: "#93c5fd", dot: "#3b82f6" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

      {/* 1. Top Hotspot Districts */}
      <StripCard>
        <StripHeader icon={FaFire} label="Top Hotspots" iconColor="text-red-400" accentColor="#ef4444" />
        <div className="flex-1 space-y-2 font-mono">
          {hotspots && hotspots.length > 0 ? (
            hotspots.map((item, index) => {
              const rank = rankColors[index] || rankColors[4];
              return (
                <div key={item.name} style={{ background: rank.bg, border: `1px solid ${rank.border}`, borderRadius: 8, padding: "9px 12px" }}
                  className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span style={{ background: rank.bg, border: `1px solid ${rank.border}`, color: rank.text, width: 18, height: 18,
                      borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 700, flexShrink: 0 }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-300 text-[10px] font-mono truncate">
                      {item.name.replace(" District", "").replace(" City", "").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span style={{ color: rank.dot, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700 }}>{item.count}</span>
                    <span className="text-[8px] text-slate-600 font-mono">cases</span>
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-slate-600 text-xs font-mono">No data found</span>
          )}
        </div>
      </StripCard>

      {/* 2. Live Incident Feed */}
      <StripCard>
        <StripHeader icon={FaHistory} label="Live Incident Feed" iconColor="text-blue-400" accentColor="#3b82f6" />
        <div className="flex-1 space-y-3 font-mono text-[9px] leading-relaxed overflow-hidden">
          {recentIncidents && recentIncidents.length > 0 ? (
            recentIncidents.slice(0, 3).map((inc, i) => (
              <div key={inc.id} className="flex gap-3"
                style={{ paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? "1px solid rgba(51,65,85,0.15)" : "none" }}>
                <div style={{ width: 2, flexShrink: 0, borderRadius: 2, background: "#3b82f6", marginTop: 2, marginBottom: i < 2 ? 0 : 0, alignSelf: "stretch", minHeight: 12 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-bold text-slate-300 text-[10px] truncate">{inc.caseNo}</span>
                    <span className="text-[8px] text-slate-600 flex-shrink-0">{inc.date}</span>
                  </div>
                  <p className="text-slate-500 font-sans line-clamp-2 leading-relaxed text-[9px]">{inc.briefFacts}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: inc.status === "Charge-sheet Submitted" ? "#10b981" : inc.status === "Suspect Apprehended" ? "#3b82f6" : "#f59e0b", display: "inline-block", flexShrink: 0 }} />
                    <span className="text-[8px] text-slate-600 font-mono">{inc.status}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className="text-slate-600 block py-2">No active feeds</span>
          )}
        </div>
      </StripCard>

      {/* 3. Investigation Status */}
      <StripCard>
        <StripHeader icon={FaFolderOpen} label="Investigation Status" iconColor="text-amber-400" accentColor="#f59e0b" />
        <div className="flex-1 flex flex-col gap-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 8, padding: "10px 12px" }}>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Active</span>
              <span className="text-xl font-bold font-mono text-amber-400 block">{activeCount}</span>
              <span className="text-[8px] text-slate-600">{activePercentage}% of total</span>
            </div>
            <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, padding: "10px 12px" }}>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Resolved</span>
              <span className="text-xl font-bold font-mono text-emerald-400 block">{closedCount}</span>
              <span className="text-[8px] text-slate-600">{closedPercentage}% of total</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center font-mono mb-2">
              <span className="text-[8px] text-slate-600 uppercase tracking-wider">Active / Total Cases</span>
              <span className="text-[11px] font-bold text-white">
                {activeCount} <span className="text-slate-600 text-[9px]">/ {totalCount}</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-950/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${activePercentage}%`, background: "linear-gradient(to right, #f59e0b, #ef4444)" }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[8px] font-mono text-slate-600">
              <span>Under Active Scrutiny</span>
              <span>{activePercentage}%</span>
            </div>
          </div>

          {/* Divider + total */}
          <div style={{ borderTop: "1px solid rgba(51,65,85,0.2)", paddingTop: 10 }}
            className="flex justify-between items-center font-mono">
            <span className="text-[8px] text-slate-600 uppercase tracking-wider">Total Registered</span>
            <span className="text-xl font-bold text-white">{totalCount}</span>
          </div>
        </div>
      </StripCard>

    </div>
  );
};

export default IntelligenceStrip;
