import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import ChartCard from "./ChartCard";

const COLORS = [
  "#3b82f6", // Property Offences (Blue)
  "#f43f5e", // Offences Against Body (Rose)
  "#f59e0b", // Financial Fraud (Amber)
  "#a855f7", // Cyber Crimes (Purple)
  "#10b981"  // Other SLL (Emerald)
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 shadow-xl font-mono text-[11px]">
        <p className="font-bold text-slate-300">{data.category}</p>
        <p className="text-slate-400 mt-1">FIRs: <span className="text-white font-bold">{data.fir_count.toLocaleString("en-IN")}</span></p>
        <p className="text-slate-400">Share: <span className="text-white font-bold">{data.percentage}%</span></p>
      </div>
    );
  }
  return null;
};

const CrimeCategoryChart = ({ data }) => {
  if (!data) return null;

  return (
    <ChartCard
      title="Crime Category Distribution"
      subtitle="CCTNS CaseVolume segmented by Crime Head"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Donut Chart Container */}
        <div className="relative h-52 w-full lg:w-2/5 flex items-center justify-center flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="fir_count"
                nameKey="category"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                stroke="#0f172a"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Text for Donut */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">TOTAL</span>
            <span className="font-mono text-base font-bold text-white">
              {data.reduce((sum, item) => sum + item.fir_count, 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Detailed Progress Bars List */}
        <div className="flex-1 space-y-4">
          {data.map((item, index) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-bold text-slate-400 uppercase tracking-wide">{item.category}</span>
                </div>
                <div className="text-slate-500 font-mono text-[9px]">
                  <span className="text-slate-300 font-bold">{item.fir_count.toLocaleString("en-IN")}</span>
                  <span className="text-slate-700 px-1.5">/</span>
                  <span className="text-white font-bold">{item.percentage}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full rounded-full bg-slate-950/40 overflow-hidden border border-slate-900/60">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};

export default CrimeCategoryChart;