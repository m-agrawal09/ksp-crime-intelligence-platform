import React from "react";
import { FaFire, FaHistory, FaFolderOpen } from "react-icons/fa";

// ── Helpers ─────────────────────────────────────────────────────────────────

// Compute a human-readable relative time from a date string
const getRelativeTime = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};

const getSeverityStyle = (severity) => {
  switch (severity) {
    case "CRITICAL": return { dot: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#fca5a5" };
    case "HIGH":     return { dot: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: "#fcd34d" };
    case "MEDIUM":   return { dot: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)",  text: "#93c5fd" };
    default:         return { dot: "#475569", bg: "rgba(71,85,105,0.08)", border: "rgba(71,85,105,0.18)",  text: "#64748b" };
  }
};

const getStatusStyle = (status) => {
  if (status === "Charge-sheet Submitted") return { color: "#34d399", label: "Chargesheeted" };
  if (status === "Suspect Apprehended")    return { color: "#60a5fa", label: "Apprehended" };
  if (status === "Under Investigation")    return { color: "#fbbf24", label: "Investigating" };
  return { color: "#64748b", label: status };
};

// ── Shared card wrapper ──────────────────────────────────────────────────────
const StripCard = ({ children, className = "" }) => (
  <div className={`bg-slate-900/35 border border-slate-800/35 rounded-xl flex flex-col ${className}`}
    style={{ padding: "20px 22px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
    {children}
  </div>
);

// Section header with left accent bar
const StripHeader = ({ icon: Icon, label, iconColor = "text-blue-400", accentColor = "#3b82f6" }) => (
  <div style={{ borderBottom: "1px solid rgba(51,65,85,0.18)", paddingBottom: 12, marginBottom: 16 }}
    className="flex items-center gap-2.5 flex-shrink-0">
    <span style={{ display: "inline-block", width: 2, height: 13, borderRadius: 2, background: accentColor, flexShrink: 0 }} />
    <Icon className={`${iconColor} text-xs flex-shrink-0`} />
    <span className="text-[9px] font-mono font-bold tracking-[0.14em] text-slate-400 uppercase">{label}</span>
  </div>
);

// ── Component ────────────────────────────────────────────────────────────────
const IntelligenceStrip = ({ hotspots, recentIncidents, totalCount, activeCount }) => {
  const activePercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const closedCount = totalCount - activeCount;
  const closedPercentage = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;

  const rankColors = [
    { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.28)",  text: "#fca5a5", dot: "#ef4444" },
    { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.28)", text: "#fcd34d", dot: "#f59e0b" },
    { bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.18)", text: "#fcd34d", dot: "#f59e0b" },
    { bg: "rgba(59,130,246,0.07)", border: "rgba(59,130,246,0.18)", text: "#93c5fd", dot: "#3b82f6" },
    { bg: "rgba(59,130,246,0.05)", border: "rgba(59,130,246,0.14)", text: "#93c5fd", dot: "#3b82f6" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

      {/* ── 1. Top Hotspot Districts ── */}
      <StripCard>
        <StripHeader icon={FaFire} label="Top Hotspots" iconColor="text-red-400" accentColor="#ef4444" />
        <div className="flex-1 flex flex-col gap-2.5 font-mono">
          {hotspots && hotspots.length > 0 ? (
            hotspots.map((item, index) => {
              const rank = rankColors[index] || rankColors[4];
              return (
                <div key={item.name}
                  style={{ background: rank.bg, border: `1px solid ${rank.border}`, borderRadius: 8, padding: "10px 13px" }}
                  className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span style={{
                      background: "rgba(0,0,0,0.25)", border: `1px solid ${rank.border}`, color: rank.text,
                      width: 20, height: 20, borderRadius: 5,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 700, flexShrink: 0
                    }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-300 text-[10px] font-mono truncate">
                      {item.name.replace(" District", "").replace(" City", "").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span style={{ color: rank.dot, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{item.count}</span>
                    <span className="text-[8px] text-slate-600 font-mono">cases</span>
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-slate-600 text-xs font-mono py-2">No data found</span>
          )}
        </div>
      </StripCard>

      {/* ── 2. Live Incident Feed (Timeline style) ── */}
      <StripCard>
        <StripHeader icon={FaHistory} label="Live Incident Feed" iconColor="text-blue-400" accentColor="#3b82f6" />
        <div className="flex-1 flex flex-col overflow-hidden">
          {recentIncidents && recentIncidents.length > 0 ? (
            recentIncidents.slice(0, 3).map((inc, i) => {
              const sev = getSeverityStyle(inc.severity);
              const status = getStatusStyle(inc.status);
              const isLast = i === recentIncidents.slice(0, 3).length - 1;
              return (
                <div key={inc.id} className="feed-entry flex gap-3"
                  style={{ paddingBottom: isLast ? 0 : 14, marginBottom: isLast ? 0 : 14,
                    borderBottom: isLast ? "none" : "1px solid rgba(51,65,85,0.12)" }}>

                  {/* Timeline track */}
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 16, paddingTop: 2 }}>
                    {/* Severity dot */}
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%", background: sev.dot,
                      boxShadow: `0 0 6px ${sev.dot}55`, flexShrink: 0,
                      border: `1.5px solid rgba(255,255,255,0.2)`, display: "block"
                    }} />
                    {/* Vertical connector line */}
                    {!isLast && (
                      <span style={{
                        flex: 1, width: 1, background: "rgba(51,65,85,0.25)",
                        marginTop: 4, display: "block", minHeight: 24
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top row: case number + relative time */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-[10px] font-mono truncate">{inc.caseNo}</span>
                      <span className="text-[8px] text-slate-600 font-mono flex-shrink-0">{getRelativeTime(inc.date)}</span>
                    </div>

                    {/* Crime type chip */}
                    <div className="mb-1.5">
                      <span style={{
                        display: "inline-block", background: sev.bg, border: `1px solid ${sev.border}`,
                        color: sev.text, fontSize: 8, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        padding: "1.5px 6px", borderRadius: 4
                      }}>
                        {inc.category}
                      </span>
                    </div>

                    {/* District / Unit */}
                    <div className="text-[9px] text-slate-500 font-sans mb-1.5 truncate">
                      {inc.district} · {inc.unit?.replace(" Police Station", " PS")}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: status.color, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: 8, color: status.color, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-slate-600 block py-3 text-xs font-mono">No active feeds</span>
          )}
        </div>
      </StripCard>

      {/* ── 3. Investigation Status ── */}
      <StripCard>
        <StripHeader icon={FaFolderOpen} label="Investigation Status" iconColor="text-amber-400" accentColor="#f59e0b" />
        <div className="flex-1 flex flex-col gap-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 9, padding: "11px 13px" }}>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider block mb-1.5">Active</span>
              <span className="text-2xl font-bold font-mono text-amber-400 block leading-none mb-1">{activeCount}</span>
              <span className="text-[8px] text-slate-600 font-mono">{activePercentage}% of total</span>
            </div>
            <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 9, padding: "11px 13px" }}>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider block mb-1.5">Resolved</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 block leading-none mb-1">{closedCount}</span>
              <span className="text-[8px] text-slate-600 font-mono">{closedPercentage}% of total</span>
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
            <div className="flex justify-between mt-2 text-[8px] font-mono text-slate-600">
              <span>Under Active Scrutiny</span>
              <span>{activePercentage}%</span>
            </div>
          </div>

          {/* Total */}
          <div style={{ borderTop: "1px solid rgba(51,65,85,0.18)", paddingTop: 12 }}
            className="flex justify-between items-center font-mono">
            <span className="text-[8px] text-slate-600 uppercase tracking-wider">Total Registered</span>
            <span className="text-2xl font-bold text-white leading-none">{totalCount}</span>
          </div>
        </div>
      </StripCard>

    </div>
  );
};

export default IntelligenceStrip;
