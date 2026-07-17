import React, { useState } from "react";
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
      color: "text-purple-400 border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5",
      desc: "Compile LLM narrative briefing of critical CaseMaster logs."
    },
    {
      id: "hotspot_analysis",
      label: "Hotspot Analysis",
      icon: FaMapMarkedAlt,
      color: "text-amber-400 border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5",
      desc: "Map geo-coordinates (latitude/longitude) of active incident clusters."
    },
    {
      id: "officer_lookup",
      label: "Officer Lookup",
      icon: FaUserShield,
      color: "text-blue-400 border-blue-500/20 hover:border-blue-500/50 bg-blue-500/5",
      desc: "Query active Employee duties, assignment logs, and case loads."
    },
    {
      id: "crime_pattern_scan",
      label: "Crime Pattern Scan",
      icon: FaFingerprint,
      color: "text-rose-400 border-rose-500/20 hover:border-rose-500/50 bg-rose-500/5",
      desc: "Correlate CrimeSubHead MOs against known ArrestSurrender profiles."
    },
    {
      id: "export_report",
      label: "Export Report",
      icon: FaFileExport,
      color: "text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5",
      desc: "Generate CCTNS IIF-1/IIF-5 state reports in PDF/CSV structures."
    }
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col lg:flex-row gap-5">
      {/* Buttons Console Grid */}
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Operational Control Console
          </h2>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            Execute analytical functions and integrate with Catalyst backends.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5">
          {actions.map((act) => {
            const Icon = act.icon;
            const isCurrent = runningAction === act.id;

            return (
              <button
                key={act.id}
                onClick={() => handleActionClick(act.id, act.label)}
                disabled={runningAction !== null}
                className={`flex flex-col items-center justify-center text-center p-3.5 rounded-lg border transition-all ${act.color} group disabled:opacity-40 disabled:cursor-not-allowed`}
                title={act.desc}
              >
                <div className="relative mb-2">
                  {isCurrent ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-current" />
                  ) : (
                    <Icon className="text-xl transition-transform duration-200 group-hover:scale-110" />
                  )}
                </div>
                <span className="font-mono text-[11px] font-bold tracking-tight">
                  {act.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Outputs Console */}
      <div className="w-full lg:w-80 rounded-lg border border-slate-950 bg-slate-950/80 p-3.5 flex flex-col font-mono text-[10px] h-32 lg:h-auto min-h-[120px]">
        <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5 mb-2 text-slate-400">
          <FaTerminal className="text-[10px] text-blue-500 animate-pulse" />
          <span className="font-bold tracking-wider">TELEMETRY MONITOR</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pr-1 text-slate-400">
          {consoleLogs.map((log, index) => (
            <div key={index} className="leading-normal">
              <span className="text-slate-600 font-semibold pr-1.5">[{log.timestamp}]</span>
              <span className={log.text.startsWith("SUCCESS") ? "text-emerald-400" : log.text.startsWith("ERROR") ? "text-rose-400" : log.text.startsWith("INIT") ? "text-blue-400" : "text-slate-400"}>
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
