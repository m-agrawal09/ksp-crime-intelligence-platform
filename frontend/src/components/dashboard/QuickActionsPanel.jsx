import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaMapMarkedAlt,
  FaUserShield,
  FaFingerprint,
  FaFileExport,
  FaTerminal
} from "react-icons/fa";
import { triggerAction } from "../../services/dashboardService";

const QuickActionsPanel = () => {
  const [runningAction, setRunningAction] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([
    { timestamp: "14:26:00", text: "CCTNS Core Application Software (CAS) v4.2 client initialized." },
    { timestamp: "14:26:02", text: "ML Engine (QuickML) connection established. Hotspot forecasting online." }
  ]);

  const addLog = (text) => {
    const time = new Date().toLocaleTimeString("en-IN", { hour12: false });
    setConsoleLogs((prev) => [{ timestamp: time, text }, ...prev].slice(0, 8));
  };

  const handleActionClick = async (actionId, label) => {
    if (runningAction) return;

    setRunningAction(actionId);
    addLog(`INIT: Triggering operational function: ${actionId} (${label})...`);

    try {
      const response = await triggerAction(actionId, { timestamp: new Date().toISOString() });
      addLog(`SUCCESS: ${response.message}`);
    } catch (err) {
      addLog(`ERROR: Failed executing operational function: ${actionId}. Code 500.`);
    } finally {
      setRunningAction(null);
    }
  };

  const actions = [
    {
      id: "generate_ai_brief",
      label: "Generate AI Brief",
      icon: FaBrain,
      color: "text-purple-400 border-purple-500/10 hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-purple-500/5",
      desc: "Compile LLM narrative briefing of critical CaseMaster logs.",
      isAction: true
    },
    {
      id: "hotspot_analysis",
      label: "Hotspot Analysis",
      icon: FaMapMarkedAlt,
      color: "text-amber-400 border-amber-500/10 hover:border-amber-500/40 hover:bg-amber-500/5 hover:shadow-amber-500/5",
      desc: "Map geo-coordinates (latitude/longitude) of active incident clusters.",
      path: "/map"
    },
    {
      id: "officer_lookup",
      label: "Officer Lookup",
      icon: FaUserShield,
      color: "text-blue-400 border-blue-500/10 hover:border-blue-500/40 hover:bg-blue-500/5 hover:shadow-blue-500/5",
      desc: "Query active Employee duties, assignment logs, and case loads.",
      path: "/officers"
    },
    {
      id: "crime_pattern_scan",
      label: "Crime Pattern Scan",
      icon: FaFingerprint,
      color: "text-rose-400 border-rose-500/10 hover:border-rose-500/40 hover:bg-rose-500/5 hover:shadow-rose-500/5",
      desc: "Correlate CrimeSubHead MOs against known ArrestSurrender profiles.",
      path: "/insights-forecast"
    },
    {
      id: "export_report",
      label: "Export Report",
      icon: FaFileExport,
      color: "text-emerald-400 border-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-emerald-500/5",
      desc: "Generate CCTNS IIF-1/IIF-5 state reports in PDF/CSV structures.",
      path: "/reports"
    }
  ];

  const cardBaseStyle = "flex flex-col text-left p-5 rounded-[4px] border border-slate-800/40 hover:border-slate-800 transition-all duration-300 group bg-slate-950/20 relative overflow-hidden min-h-[160px] shadow-sm";

  return (
    <div className="space-y-8">
      {/* Section 5: Command Operations Panel */}
      <div className="rounded-[4px] border border-slate-800/40 bg-slate-900/60 py-5 px-6 shadow-lg flex flex-col gap-6">
        <div>
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Command Operations Hub
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Navigate to specialized analytical modules or execute system-wide control scripts.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {actions.map((act) => {
            const Icon = act.icon;
            const isCurrent = runningAction === act.id;

            const iconElement = (
              <div className="relative">
                {isCurrent ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-current" />
                ) : (
                  <Icon className="text-lg transition-transform duration-200 group-hover:scale-110" />
                )}
              </div>
            );

            if (act.isAction) {
              return (
                <button
                  key={act.id}
                  onClick={() => handleActionClick(act.id, act.label)}
                  disabled={runningAction !== null}
                  className={`${cardBaseStyle} ${act.color} disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
                  title={act.desc}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-[4px] bg-slate-950/60 border border-slate-850 group-hover:border-current transition-colors text-slate-400 group-hover:text-current">
                    {iconElement}
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-slate-200 mt-4 group-hover:text-white transition-colors">
                    {act.label}
                  </span>
                  <span className="text-[10px] leading-relaxed text-slate-400 mt-1.5 font-sans">
                    {act.desc}
                  </span>
                  <span className="mt-auto pt-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-slate-500 group-hover:text-purple-400 transition-colors uppercase border-t border-slate-900/40 mt-3">
                    <span>RUN UTILITY ⚡</span>
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={act.id}
                to={act.path}
                className={`${cardBaseStyle} ${act.color}`}
                title={act.desc}
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-[4px] bg-slate-950/60 border border-slate-850 group-hover:border-current transition-colors text-slate-400 group-hover:text-current">
                  {iconElement}
                </div>
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-slate-200 mt-4 group-hover:text-white transition-colors">
                  {act.label}
                </span>
                <span className="text-[10px] leading-relaxed text-slate-400 mt-1.5 font-sans">
                  {act.desc}
                </span>
                <span className="mt-auto pt-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-slate-500 group-hover:text-current transition-colors uppercase border-t border-slate-900/40 mt-3">
                  <span>LAUNCH MODULE →</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 6: Live System Telemetry Console */}
      <div className="rounded-[4px] border border-slate-800/40 bg-[#0c0d14] py-5 px-6 flex flex-col font-mono text-[10px] h-[240px] shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-900/60 pb-2.5 mb-3 text-slate-400">
          <div className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
          </div>
          <span className="font-bold tracking-wider uppercase text-slate-200">Live System Telemetry Console</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin pr-1 text-slate-400 select-none">
          {consoleLogs.map((log, index) => (
            <div key={index} className="leading-normal flex items-start gap-2 border-b border-slate-900/20 pb-1.5">
              <span className="text-blue-400 font-bold tracking-tight">[{log.timestamp}]</span>
              <span className={log.text.startsWith("SUCCESS") ? "text-emerald-400 font-bold" : log.text.startsWith("ERROR") ? "text-rose-400 font-bold" : log.text.startsWith("INIT") ? "text-cyan-400" : "text-slate-300"}>
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
