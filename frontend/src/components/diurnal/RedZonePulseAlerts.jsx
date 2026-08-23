import React from "react";
import { 
  RiRadarLine, 
  RiAlertFill, 
  RiMapPinLine,
  RiFlashlightLine,
  RiArrowRightLine
} from "react-icons/ri";

export default function RedZonePulseAlerts({
  alerts,
  selectedDistrict,
  onSelectDistrict
}) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const displayedAlerts = alerts.slice(0, 4);

  return (
    <div className="bg-[#0b1329]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-3.5">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 relative" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase font-mono flex items-center gap-2">
              <span>Live Red-Zone Radar Pulse Alerts</span>
            </h3>
            <p className="text-xs text-slate-400">
              Precincts experiencing a <strong className="text-rose-400">&gt;25% incident surge</strong> compared to the 30-day baseline.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {alerts.length} Active Surges Flagged
        </span>
      </div>

      {/* Grid of Red-Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedAlerts.map((alert) => {
          const isSelected = selectedDistrict.toLowerCase().includes(alert.district.toLowerCase()) || 
                             alert.district.toLowerCase().includes(selectedDistrict.toLowerCase());

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isSelected
                  ? "bg-rose-950/40 border-rose-500/80 ring-2 ring-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <RiMapPinLine className="text-rose-400 text-sm shrink-0" />
                    <span className="text-xs font-bold text-white tracking-wide truncate">
                      {alert.district}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                    {alert.spikePercentage}
                  </span>
                </div>

                <div className="bg-[#080e1e] p-2 rounded-lg border border-slate-850 mb-2.5 text-[11px]">
                  <span className="text-slate-400 block text-[10px] font-mono">Dominant Threat:</span>
                  <span className="text-slate-200 font-semibold truncate block">{alert.dominantThreat}</span>
                  <span className="text-amber-400/90 font-mono text-[10px] block mt-0.5">{alert.timeWindow}</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mb-3">
                  {alert.actionDirective}
                </p>
              </div>

              <button
                onClick={() => onSelectDistrict(alert.district)}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-rose-500 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                }`}
              >
                <span>{isSelected ? "● Filtered" : "Filter District"}</span>
                <RiArrowRightLine className="text-xs" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
