import React from "react";
import { RiBarChartGroupedLine, RiTimeLine } from "react-icons/ri";

export default function HourlyTrendBar({ hourlyData }) {
  // Compute total incidents per 24 hours across all days
  const hourlyTotals = Array.from({ length: 24 }, (_, hr) => {
    let count = 0;
    let topCategory = "";
    const catCounts = {};

    Object.values(hourlyData || {}).forEach((dayObj) => {
      const cell = dayObj?.[hr];
      if (cell) {
        count += cell.count || 0;
        Object.entries(cell.categories || {}).forEach(([cat, c]) => {
          catCounts[cat] = (catCounts[cat] || 0) + c;
        });
      }
    });

    let maxCatCount = 0;
    Object.entries(catCounts).forEach(([cat, c]) => {
      if (c > maxCatCount) {
        maxCatCount = c;
        topCategory = cat;
      }
    });

    return { hour: hr, count, topCategory: topCategory || "General" };
  });

  const maxVal = Math.max(...hourlyTotals.map((h) => h.count), 1);

  return (
    <div className="bg-[#0b1329]/80 border border-slate-800/80 rounded-2xl p-4.5 backdrop-blur-xl shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
        <div className="flex items-center gap-2">
          <RiBarChartGroupedLine className="text-cyan-400 text-lg" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            24-Hour Diurnal Aggregate Curve
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Total Statewide Incidents by Hour</span>
      </div>

      {/* 24 Bar Visualizer */}
      <div className="flex items-end gap-1.5 h-28 pt-4 px-1">
        {hourlyTotals.map((h) => {
          const heightPercent = Math.round((h.count / maxVal) * 100);
          const isNightSurge = (h.hour >= 1 && h.hour <= 5) || h.hour >= 22;
          const isMiddayPeak = h.hour >= 11 && h.hour <= 15;

          return (
            <div
              key={h.hour}
              className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] font-mono px-2 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none z-20">
                <strong>{String(h.hour).padStart(2, '0')}:00</strong> • {h.count} Cases
              </div>

              {/* Bar */}
              <div
                style={{ height: `${Math.max(8, heightPercent)}%` }}
                className={`w-full rounded-t-md transition-all duration-300 ${
                  isNightSurge
                    ? "bg-gradient-to-t from-rose-600/50 to-rose-400 group-hover:to-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                    : isMiddayPeak
                    ? "bg-gradient-to-t from-amber-600/50 to-amber-400 group-hover:to-amber-300"
                    : "bg-gradient-to-t from-blue-700/40 to-blue-400 group-hover:to-cyan-300"
                }`}
              />

              {/* Label */}
              <span className={`text-[9px] font-mono ${h.hour % 3 === 0 ? "text-slate-400 font-bold" : "text-slate-600"}`}>
                {h.hour % 3 === 0 ? String(h.hour).padStart(2, '0') : "·"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bracket Subtitles */}
      <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/40 text-[10px] font-mono text-center">
        <div className="text-rose-400/90 bg-rose-950/20 py-1 rounded border border-rose-900/30">
          00–06 Night Surge
        </div>
        <div className="text-blue-400/90 bg-blue-950/20 py-1 rounded border border-blue-900/30">
          06–12 Morning
        </div>
        <div className="text-amber-400/90 bg-amber-950/20 py-1 rounded border border-amber-900/30">
          12–18 Afternoon
        </div>
        <div className="text-purple-400/90 bg-purple-950/20 py-1 rounded border border-purple-900/30">
          18–24 Evening
        </div>
      </div>
    </div>
  );
}
