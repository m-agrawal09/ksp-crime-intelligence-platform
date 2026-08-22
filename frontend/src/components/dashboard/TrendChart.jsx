import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import ChartCard from "./ChartCard";
import { FaChartLine, FaArrowUp, FaCalendarAlt } from "react-icons/fa";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0);
    return (
      <div className="rounded-none border border-slate-700/60 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-md font-mono text-xs space-y-2.5">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-2">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <FaCalendarAlt className="text-blue-400 text-[10px]" />
            {label} 2026
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-none">
            {total} FIRs
          </span>
        </div>

        <div className="space-y-2">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-8 text-[11px]">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-none flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}` }}
                />
                <span className="text-slate-300 font-medium">{entry.name}</span>
              </div>
              <span className="font-bold text-white tabular-nums">{entry.value.toLocaleString("en-IN")} Cases</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TrendChart = ({ data, className = "" }) => {
  const [viewMode, setViewMode] = useState("total"); // "total" | "category"

  // Quick analytics calculations for mini bottom summary bar
  const totalCasesSum = data ? data.reduce((acc, d) => acc + (d.total_crimes || 0), 0) : 0;
  const avgMonthlyCases = data && data.length > 0 ? Math.round(totalCasesSum / data.length) : 0;
  const peakMonthObj = data && data.length > 0 ? [...data].sort((a, b) => (b.total_crimes || 0) - (a.total_crimes || 0))[0] : null;

  const toggleControl = (
    <div className="inline-flex items-center gap-3 bg-slate-900/60 border border-slate-700/40 backdrop-blur-md rounded-none p-1.5 text-[11px] font-mono shadow-sm z-10">
      <button
        onClick={() => setViewMode("total")}
        className={`px-4 py-2 rounded-none font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap text-[10px] ${
          viewMode === "total"
            ? "bg-blue-600 text-white shadow-sm border border-blue-400/40"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
        }`}
      >
        Overall Trend
      </button>
      <button
        onClick={() => setViewMode("category")}
        className={`px-4 py-2 rounded-none font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap text-[10px] ${
          viewMode === "category"
            ? "bg-blue-600 text-white shadow-sm border border-blue-400/40"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
        }`}
      >
        Category-Wise
      </button>
    </div>
  );

  return (
    <ChartCard
      title="Monthly Crime Incidents Trend"
      action={toggleControl}
      className={`h-full flex flex-col ${className}`}
    >
      <div className="flex flex-col flex-1 justify-between gap-4 pt-2">
        {/* Main Area Chart Container */}
        <div className="h-[370px] w-full flex-1 min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 16, left: -18, bottom: 0 }}
            >
              <defs>
                {/* Luminous Multi-stop Linear Gradients */}
                <linearGradient id="colorTotalGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>

                <linearGradient id="colorTheftGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#facc15" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#eab308" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorAssaultGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8c38" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMurderGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPropertyGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCyberGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 4"
                vertical={false}
                strokeOpacity={0.6}
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />

              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {viewMode === "category" && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color: "#94a3b8",
                    paddingBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                />
              )}

              {/* Render Single Overall Crime Trend */}
              {viewMode === "total" ? (
                <Area
                  type="monotone"
                  name="Overall Incidents (Statewide)"
                  dataKey="total_crimes"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotalGlow)"
                  dot={{ stroke: "#38bdf8", strokeWidth: 2, fill: "#0369a1", r: 4.5 }}
                  activeDot={{ r: 7, stroke: "#ffffff", strokeWidth: 2.5, fill: "#38bdf8" }}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              ) : (
                /* Render Category Breakdown Lines */
                <>
                  <Area
                    type="monotone"
                    name="Theft"
                    dataKey="theft"
                    stroke="#eab308"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTheftGlow)"
                    dot={{ stroke: "#eab308", strokeWidth: 1.5, fill: "#713f12", r: 3.5 }}
                    activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2, fill: "#eab308" }}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />

                  <Area
                    type="monotone"
                    name="Assault"
                    dataKey="assault"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAssaultGlow)"
                    dot={{ stroke: "#f97316", strokeWidth: 1.5, fill: "#7c2d12", r: 3.5 }}
                    activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2, fill: "#f97316" }}
                    isAnimationActive={true}
                    animationDuration={950}
                    animationEasing="ease-out"
                  />

                  <Area
                    type="monotone"
                    name="Murder"
                    dataKey="murder"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMurderGlow)"
                    dot={{ stroke: "#ef4444", strokeWidth: 1.5, fill: "#7f1d1d", r: 3.5 }}
                    activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2, fill: "#ef4444" }}
                    isAnimationActive={true}
                    animationDuration={1100}
                    animationEasing="ease-out"
                  />

                  <Area
                    type="monotone"
                    name="Property Related"
                    dataKey="property_related"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPropertyGlow)"
                    dot={{ stroke: "#3b82f6", strokeWidth: 1.5, fill: "#1e3a8a", r: 3.5 }}
                    activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2, fill: "#3b82f6" }}
                    isAnimationActive={true}
                    animationDuration={1250}
                    animationEasing="ease-out"
                  />

                  <Area
                    type="monotone"
                    name="Cyber Crime"
                    dataKey="cyber_crime"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCyberGlow)"
                    dot={{ stroke: "#a855f7", strokeWidth: 1.5, fill: "#581c87", r: 3.5 }}
                    activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2, fill: "#a855f7" }}
                    isAnimationActive={true}
                    animationDuration={1400}
                    animationEasing="ease-out"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Glassmorphic Summary Bar at Chart Bottom */}
        <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-[10px]">
          <div className="bg-slate-900/40 border border-slate-800/50 p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-blue-400 text-xs" />
              <span className="text-slate-400 uppercase tracking-wider">7-Mo Average</span>
            </div>
            <span className="font-bold text-white text-xs">{avgMonthlyCases} FIRs/mo</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/50 p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-amber-400 text-xs" />
              <span className="text-slate-400 uppercase tracking-wider">Peak Month</span>
            </div>
            <span className="font-bold text-amber-300 text-xs">{peakMonthObj ? `${peakMonthObj.month} (${peakMonthObj.total_crimes})` : "N/A"}</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/50 p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <FaArrowUp className="text-emerald-400 text-xs" />
              <span className="text-slate-400 uppercase tracking-wider">Trend Rate</span>
            </div>
            <span className="font-bold text-emerald-400 text-xs">+4.2% MoM</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

export default TrendChart;