import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import ChartCard from "../dashboard/ChartCard";

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 shadow-xl">
        <p className="font-mono text-xs font-bold text-slate-300 border-b border-slate-800 pb-1 mb-2">
          MONTH: {label} 2026
        </p>
        <div className="space-y-1.5 font-mono text-[11px]">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-400">{entry.name}:</span>
              </div>
              <span className="font-bold text-white">{entry.value} cases</span>
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
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 shadow-xl font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: entry.payload.color || entry.color }}
          />
          <span>{entry.name}:</span>
          <span className="font-bold text-white">{entry.value} cases</span>
        </div>
      </div>
    );
  }
  return null;
};

const OfficerCharts = ({ monthlyTrend, categoryDistribution }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      
      {/* 1. Monthly Case Resolution Trend (2/3 width) */}
      <div className="lg:col-span-2">
        <ChartCard
          title="Monthly Case Resolution Trend"
          subtitle="Assigned cases vs resolved closures by month"
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomAreaTooltip />} />

                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "#94a3b8",
                    paddingBottom: "10px"
                  }}
                />

                <Area
                  type="monotone"
                  name="Assigned Cases"
                  dataKey="assigned"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAssigned)"
                />

                <Area
                  type="monotone"
                  name="Resolved Cases"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 2. Case Distribution by Category (1/3 width) */}
      <div className="lg:col-span-1">
        <ChartCard
          title="Distribution by Crime Head"
          subtitle="Workload breakdown by crime classification"
        >
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={7}
                  layout="horizontal"
                  wrapperStyle={{
                    fontSize: "9px",
                    fontFamily: "monospace",
                    color: "#94a3b8",
                    paddingTop: "10px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

    </div>
  );
};

export default OfficerCharts;
