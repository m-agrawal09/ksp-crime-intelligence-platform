import React, { useState } from "react";
import { 
  RiTimeLine, 
  RiFireLine, 
  RiInformationLine,
  RiFileList3Line,
  RiMapPinLine,
  RiShieldLine
} from "react-icons/ri";

export default function DiurnalHeatMatrix({
  matrixData,
  selectedCell,
  onSelectCell
}) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const { grid, maxCellCount, totalIncidents, topPeaks } = matrixData;

  const days = [
    { key: 0, name: "Mon", full: "Monday" },
    { key: 1, name: "Tue", full: "Tuesday" },
    { key: 2, name: "Wed", full: "Wednesday" },
    { key: 3, name: "Thu", full: "Thursday" },
    { key: 4, name: "Fri", full: "Friday" },
    { key: 5, name: "Sat", full: "Saturday" },
    { key: 6, name: "Sun", full: "Sunday" }
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getCellColor = (count, intensity) => {
    if (count === 0) return "bg-[#091122] border-slate-800/40 text-slate-700 hover:border-slate-600";
    if (intensity < 0.25) return "bg-blue-950/60 border-blue-800/40 text-blue-300 hover:border-blue-400";
    if (intensity < 0.55) return "bg-cyan-950/70 border-cyan-700/50 text-cyan-200 hover:border-cyan-400";
    if (intensity < 0.8) return "bg-amber-950/80 border-amber-500/60 text-amber-200 hover:border-amber-300 font-semibold";
    return "bg-rose-950/90 border-rose-500 text-rose-100 font-bold hover:border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]";
  };

  const activeCell = selectedCell || hoveredCell;

  return (
    <div className="bg-[#0b1329]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Top Bar with Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <RiTimeLine className="text-xs" />
              <span>Diurnal Pattern Analysis</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {totalIncidents} Live Incident Points Mapped
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>24-Hour × 7-Day Diurnal Crime Matrix</span>
          </h2>
        </div>

        {/* Heat Legend */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 text-[10px]">Intensity:</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-[#091122] border border-slate-800" />
            <span className="text-[10px] text-slate-500">0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-blue-950 border border-blue-800" />
            <span className="text-[10px] text-blue-400">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-amber-950 border border-amber-600" />
            <span className="text-[10px] text-amber-400">Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-rose-950 border border-rose-500" />
            <span className="text-[10px] text-rose-400 font-semibold">Peak</span>
          </div>
        </div>
      </div>

      {/* 24x7 Heatmap Grid */}
      <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="min-w-[720px]">
          {/* Hour Numbers Header (00 to 23) */}
          <div className="grid grid-cols-[52px_repeat(24,1fr)] gap-1.5 mb-1.5 text-center font-mono text-[10px] text-slate-400">
            <div className="text-right pr-2 font-bold text-slate-500">Day / Hr</div>
            {hours.map((h) => (
              <div 
                key={h} 
                className={`py-1 rounded font-semibold ${
                  (h >= 1 && h <= 4) ? "text-rose-400 bg-rose-950/20 border border-rose-900/30" : 
                  (h >= 11 && h <= 15) ? "text-amber-400 bg-amber-950/20 border border-amber-900/30" : 
                  "text-slate-400"
                }`}
              >
                {String(h).padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Day Rows */}
          {days.map((d) => (
            <div key={d.key} className="grid grid-cols-[52px_repeat(24,1fr)] gap-1.5 mb-1.5 items-center">
              {/* Day Label */}
              <div className="text-xs font-mono font-bold text-slate-300 pr-2 text-right">
                {d.name}
              </div>

              {/* 24 Hour Cells */}
              {hours.map((h) => {
                const cell = grid?.[d.key]?.[h] || { count: 0 };
                const intensity = maxCellCount > 0 ? cell.count / maxCellCount : 0;
                const isSelected = selectedCell?.dayIndex === d.key && selectedCell?.hour === h;

                return (
                  <button
                    key={h}
                    onClick={() => onSelectCell && onSelectCell(cell)}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-8 rounded-lg border transition-all flex items-center justify-center text-xs font-mono cursor-pointer relative ${
                      getCellColor(cell.count, intensity)
                    } ${isSelected ? "ring-2 ring-amber-400 scale-105 z-10 shadow-lg" : ""}`}
                    title={`${d.full} ${String(h).padStart(2, '0')}:00 • ${cell.count} FIRs`}
                  >
                    {cell.count > 0 ? (
                      <span className="text-[11px] font-bold">{cell.count}</span>
                    ) : (
                      <span className="text-[9px] opacity-20">·</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Hour Intelligence & Sample FIRs Panel */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
          <div className="flex items-center gap-2">
            <RiFileList3Line className="text-amber-400 text-base" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {activeCell ? `${activeCell.dayName || activeCell.day} ${activeCell.timeLabel || ''} Incident Intelligence` : "Click any cell to inspect hourly FIRs"}
            </h4>
          </div>

          {activeCell && activeCell.count > 0 && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {activeCell.count} FIRs Logged
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Shift: {activeCell.hour >= 22 || activeCell.hour < 6 ? "Night Watch 3" : activeCell.hour < 14 ? "Morning 1" : "Evening 2"}
              </span>
            </div>
          )}
        </div>

        {activeCell && activeCell.firs && activeCell.firs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {activeCell.firs.slice(0, 6).map((fir, idx) => (
              <div 
                key={idx}
                className="bg-[#080e1e] p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-blue-400 font-bold">{fir.crimeNo || fir.CrimeNo}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {fir.severity || "MEDIUM"}
                  </span>
                </div>
                <p className="text-slate-200 font-semibold truncate text-[11px] mb-1">
                  {fir.crimeHead}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="truncate">{fir.unit || "Police Station"}</span>
                  <span className="text-amber-400/90 shrink-0 ml-1">{fir.district}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2 text-center">
            Click on any active hour cell on the 24×7 matrix to view all linked FIR records, police units, and offence descriptions.
          </p>
        )}
      </div>
    </div>
  );
}
