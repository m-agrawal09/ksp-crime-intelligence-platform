import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const MONTH_DATA = [
  { month: "Jan", assigned: 45, resolved: 30 },
  { month: "Feb", assigned: 65, resolved: 48 },
  { month: "Mar", assigned: 52, resolved: 40 },
  { month: "Apr", assigned: 78, resolved: 68 },
  { month: "May", assigned: 90, resolved: 78 },
  { month: "Jun", assigned: 68, resolved: 58 },
  { month: "Jul", assigned: 72, resolved: 62 },
  { month: "Aug", assigned: 65, resolved: 55 }
];

const DEFAULT_CATEGORIES = [
  { name: "Property Offenses", value: 10, color: "#3b82f6" },
  { name: "Cyber Crimes", value: 8, color: "#a855f7" },
  { name: "Financial & Fraud", value: 6, color: "#f59e0b" }
];

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-slate-700/80 bg-[#080d19]/95 p-2.5 shadow-xl font-mono text-xs">
        <p className="text-slate-300 font-bold border-b border-slate-800 pb-1 mb-1.5">{label} 2025</p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <span className="text-slate-400 text-[11px]">{entry.name}:</span>
              <span className="font-bold text-white text-[11px]">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="rounded-md border border-slate-700/80 bg-[#080d19]/95 p-2 shadow-xl font-mono text-xs">
        <span className="text-white font-bold">{entry.name}: {entry.value} cases</span>
      </div>
    );
  }
  return null;
};

const OfficerCharts = ({ monthlyTrend = [], categoryDistribution = [] }) => {
  const chartTrend = (monthlyTrend && monthlyTrend.length >= 6) ? monthlyTrend : MONTH_DATA;
  const categories = (categoryDistribution && categoryDistribution.length > 0) ? categoryDistribution : DEFAULT_CATEGORIES;
  
  const totalCases = categories.reduce((sum, item) => sum + item.value, 0) || 24;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch h-full">
      
      {/* 1. CASE RESOLUTION TREND (7 cols) */}
      <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0c1425]/90 backdrop-blur-md shadow-2xl p-5 font-sans flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                CASE RESOLUTION TREND
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Monthly workload trends compared against completed case closure.
              </p>
            </div>

            {/* Custom Inline Legend */}
            <div className="flex items-center gap-3 font-mono text-[10px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Assigned Cases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Resolved Cases</span>
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="h-[210px] w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartTrend}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorImgAssigned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.001}/>
                </linearGradient>
                <linearGradient id="colorImgResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.001}/>
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 9.5, fontFamily: "monospace" }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={false}
                dy={5}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fill: "#64748b", fontSize: 9.5, fontFamily: "monospace" }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={false}
                dx={-2}
              />

              <Tooltip content={<CustomAreaTooltip />} />

              <Area
                type="monotone"
                name="Assigned Cases"
                dataKey="assigned"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#3b82f6" }}
                activeDot={{ r: 4, fill: "#60a5fa" }}
                fillOpacity={1}
                fill="url(#colorImgAssigned)"
              />

              <Area
                type="monotone"
                name="Resolved Cases"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#10b981" }}
                activeDot={{ r: 4, fill: "#34d399" }}
                fillOpacity={1}
                fill="url(#colorImgResolved)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. PERFORMANCE SNAPSHOT (5 cols) */}
      <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0c1425]/90 backdrop-blur-md shadow-2xl p-5 font-sans flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            PERFORMANCE SNAPSHOT
          </h3>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Proportional division of current active dockets.
          </p>
        </div>

        {/* Donut + Legend Side by Side */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          {/* Donut Chart */}
          <div className="relative h-[150px] w-[150px] flex-shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Central Badge */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-extrabold text-white font-mono leading-none">{totalCases}</span>
              <span className="text-[8.5px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Total Dockets</span>
            </div>
          </div>

          {/* Legend List on Right */}
          <div className="space-y-2 font-sans text-xs flex-1 w-full">
            {categories.map((item) => {
              const pct = totalCases > 0 ? Math.round((item.value / totalCases) * 100) : 0;

              return (
                <div key={item.name} className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2 w-2 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 font-medium text-[11px] truncate">{item.name}</span>
                  </div>
                  <span className="text-slate-200 font-mono text-[11px] font-bold flex-shrink-0">
                    {item.value} <span className="text-slate-400 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default OfficerCharts;
