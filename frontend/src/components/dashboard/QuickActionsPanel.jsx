import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaMapMarkedAlt,
  FaUserShield,
  FaFingerprint,
  FaFileExport,
  FaCog,
} from "react-icons/fa";
import { triggerAction } from "../../services/dashboardService";

const QuickActionsPanel = () => {
  const [runningAction, setRunningAction] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([
    { timestamp: "14:26:00", level: "INFO", text: "CCTNS Core Application Software (CAS) v4.2 client initialized." },
    { timestamp: "14:26:02", level: "INFO", text: "QuickML Service Online. Hotspot forecasting active." },
    { timestamp: "14:26:04", level: "INFO", text: "Zia Insights Engine Active." },
    { timestamp: "14:26:06", level: "INFO", text: "Data Sync Successful across 1,024 units." },
    { timestamp: "14:26:08", level: "INFO", text: "All Systems Operational." },
  ]);

  const addLog = (text, level = "INFO") => {
    const time = new Date().toLocaleTimeString("en-IN", { hour12: false });
    setConsoleLogs((prev) =>
      [{ timestamp: time, level, text }, ...prev].slice(0, 10)
    );
  };

  const handleActionClick = async (actionId, label) => {
    if (runningAction) return;
    setRunningAction(actionId);
    addLog(`Triggering operational function: ${label}...`, "INIT");
    try {
      const response = await triggerAction(actionId, { timestamp: new Date().toISOString() });
      addLog(response.message, "SUCCESS");
    } catch {
      addLog(`Failed executing: ${actionId}. Code 500.`, "ERROR");
    } finally {
      setRunningAction(null);
    }
  };

  const actions = [
    {
      id: "generate_ai_brief",
      label: "AI Insights & Forecast",
      icon: FaBrain,
      color: "text-purple-400",
      hoverBorder: "hover:border-purple-500/20",
      hoverBg: "hover:bg-purple-500/5",
      desc: "AI Analysis & Predictions",
      isAction: true,
    },
    {
      id: "hotspot_analysis",
      label: "Crime Map",
      icon: FaMapMarkedAlt,
      color: "text-amber-400",
      hoverBorder: "hover:border-amber-500/20",
      hoverBg: "hover:bg-amber-500/5",
      desc: "Interactive Heatmap",
      path: "/map",
    },
    {
      id: "officer_lookup",
      label: "Officer Performance",
      icon: FaUserShield,
      color: "text-blue-400",
      hoverBorder: "hover:border-blue-500/20",
      hoverBg: "hover:bg-blue-500/5",
      desc: "Performance Analytics",
      path: "/officers",
    },
    {
      id: "export_report",
      label: "Reports",
      icon: FaFileExport,
      color: "text-emerald-400",
      hoverBorder: "hover:border-emerald-500/20",
      hoverBg: "hover:bg-emerald-500/5",
      desc: "Analytics & Exports",
      path: "/reports",
    },
    {
      id: "crime_pattern_scan",
      label: "Manage Records",
      icon: FaFingerprint,
      color: "text-rose-400",
      hoverBorder: "hover:border-rose-500/20",
      hoverBg: "hover:bg-rose-500/5",
      desc: "FIR & Data Management",
      path: "/records",
    },
    {
      id: "settings",
      label: "Settings",
      icon: FaCog,
      color: "text-slate-400",
      hoverBorder: "hover:border-slate-500/20",
      hoverBg: "hover:bg-slate-500/5",
      desc: "System Configuration",
      path: "/settings",
    },
  ];

  const cardBase =
    "flex flex-col text-left p-5 rounded-[4px] border border-slate-800/12 transition-all duration-200 group bg-slate-950/20 relative overflow-hidden min-h-[160px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25 cursor-pointer";

  const renderIcon = (act) => {
    const Icon = act.icon;
    const isCurrent = runningAction === act.id;
    return (
      <div
        className={`flex items-center justify-center h-11 w-11 rounded-[3px] bg-slate-900/40 border border-slate-800/20 transition-colors ${act.color}`}
      >
        {isCurrent ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-current" />
        ) : (
          <Icon className="text-sm" />
        )}
      </div>
    );
  };

  const levelColor = (level) => {
    if (level === "SUCCESS") return "text-emerald-400 font-bold";
    if (level === "ERROR")   return "text-rose-400 font-bold";
    if (level === "INIT")    return "text-blue-400";
    return "text-slate-400";
  };

  return (
    /* ── Side-by-side grid: Command Hub (left) + Telemetry Console (right) ── */
    <div className="grid grid-cols-[1fr_340px] gap-7">

      {/* ── LEFT: Command Operations Hub ── */}
      <div className="rounded-[4px] border border-slate-800/15 bg-slate-900/40 py-7 px-7 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">
            Command Operations Hub
          </h2>
          <p className="text-[11px] text-slate-500 font-sans mt-1.5">
            Navigate to specialized analytical modules or execute system-wide control scripts.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5 stagger-children">
          {actions.map((act) => {
            if (act.isAction) {
              return (
                <button
                  key={act.id}
                  onClick={() => handleActionClick(act.id, act.label)}
                  disabled={runningAction !== null}
                  className={`${cardBase} ${act.color} ${act.hoverBorder} ${act.hoverBg} disabled:opacity-40 disabled:cursor-not-allowed animate-fade-in-up`}
                  title={act.desc}
                >
                  {renderIcon(act)}
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-slate-300 mt-4 group-hover:text-white transition-colors duration-150 leading-tight">
                    {act.label}
                  </span>
                  <span className="text-[9px] leading-relaxed text-slate-600 mt-1 font-sans">
                    {act.desc}
                  </span>
                  <span className="mt-auto pt-3 block text-[9px] font-mono tracking-widest text-slate-700 group-hover:text-purple-400 transition-colors uppercase border-t border-slate-800/12 mt-4">
                    RUN ⚡
                  </span>
                </button>
              );
            }
            return (
              <Link
                key={act.id}
                to={act.path}
                className={`${cardBase} ${act.color} ${act.hoverBorder} ${act.hoverBg} animate-fade-in-up`}
                title={act.desc}
              >
                {renderIcon(act)}
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-slate-300 mt-4 group-hover:text-white transition-colors duration-150 leading-tight">
                  {act.label}
                </span>
                <span className="text-[9px] leading-relaxed text-slate-600 mt-1 font-sans">
                  {act.desc}
                </span>
                <span className="mt-auto pt-3 block text-[9px] font-mono tracking-widest text-slate-700 group-hover:text-current transition-colors uppercase border-t border-slate-800/12 mt-4">
                  LAUNCH →
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Live System Telemetry Console ── */}
      <div className="rounded-[4px] border border-slate-800/15 bg-[#060b14] py-6 px-6 flex flex-col font-mono shadow-sm">
        {/* Console header */}
        <div className="flex items-center justify-between border-b border-slate-900/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
            </div>
            <span className="font-bold tracking-widest uppercase text-[10px] text-slate-400">
              Live Telemetry Console
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider">
            ● LIVE
          </span>
        </div>

        {/* Log entries */}
        <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin pr-1">
          {consoleLogs.map((log, i) => (
            <div
              key={i}
              className="leading-normal flex items-start gap-2.5 border-b border-slate-900/10 pb-2.5 text-[10px]"
            >
              <span className="text-cyan-700 font-bold tracking-tight flex-shrink-0 whitespace-nowrap">
                [{log.timestamp}]
              </span>
              <span className={`text-[9px] font-bold tracking-wider flex-shrink-0 ${
                log.level === "SUCCESS" ? "text-emerald-500" :
                log.level === "ERROR"   ? "text-rose-500"    :
                log.level === "INIT"    ? "text-blue-500"    :
                "text-slate-600"
              }`}>
                {log.level}
              </span>
              <span className={levelColor(log.level)}>
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default QuickActionsPanel;
