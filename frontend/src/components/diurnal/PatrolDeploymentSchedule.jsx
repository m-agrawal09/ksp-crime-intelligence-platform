import React from "react";
import {
  RiCarLine,
  RiCalendarScheduleLine
} from "react-icons/ri";

export default function PatrolDeploymentSchedule({ shifts }) {
  if (!shifts || shifts.length === 0) return null;

  return (
    <div className="bg-[#0b1329]/60 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <RiCalendarScheduleLine className="text-blue-400 text-sm" />
          <span>Recommended Shift Patrol Deployments</span>
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Based on diurnal risk peaks</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {shifts.map((shift, idx) => {
          const isCritical = shift.riskLevel.includes("CRITICAL");
          const isHigh = shift.riskLevel.includes("HIGH");

          return (
            <div
              key={idx}
              className={`rounded-xl p-3.5 border ${isCritical
                  ? "bg-rose-950/20 border-rose-900/40"
                  : isHigh
                    ? "bg-amber-950/20 border-amber-900/40"
                    : "bg-slate-900/40 border-slate-800/60"
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white font-mono">
                  {shift.shiftName.split(':')[0]}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${isCritical
                    ? "bg-rose-500/20 text-rose-300"
                    : isHigh
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}>
                  {shift.timeRange} HRS
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium mb-1">
                {shift.threatFocus}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                <RiCarLine className="text-xs" />
                <span>{shift.recommendedUnits}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
