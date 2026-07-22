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
      <div className="rounded-md border border-slate-800/40 bg-slate-950/98 p-3 shadow-xl font-mono text-[11px]">
        <p className="font-bold text-slate-300">{data.category}</p>
        <p className="text-slate-500 mt-1.5">FIRs: <span className="text-white font-bold">{data.fir_count.toLocaleString("en-IN")}</span></p>
        <p className="text-slate-500">Share: <span className="text-white font-bold">{data.percentage}%</span></p>
      </div>
    );
  }
  return null;
};

const CrimeCategoryChart = ({ data, className = "" }) => {
  if (!data) return null;

  return (
    <ChartCard
      title="Crime Category Distribution"
      className={`h-full flex flex-col ${className}`}
    >
      <div className="flex flex-col gap-7 flex-1 justify-between">
        {/* Donut Chart Container — larger */}
        <div className="relative h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="fir_count"
                nameKey="category"
                innerRadius={76}
                outerRadius={100}
                paddingAngle={2.5}
                stroke="none"
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.9}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Donut Text */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[8px] font-mono tracking-widest text-slate-600 uppercase">TOTAL</span>
            <span className="font-mono text-xl font-bold text-white mt-0.5">
              {data.reduce((sum, item) => sum + item.fir_count, 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Progress Bars Legend */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-bold text-slate-500 uppercase tracking-wide">{item.category}</span>
                </div>
                <div className="text-slate-500 font-mono text-[9px]">
                  <span className="text-slate-300 font-bold">{item.fir_count.toLocaleString("en-IN")}</span>
                  <span className="text-slate-800 px-1">/</span>
                  <span className="text-white font-bold">{item.percentage}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-900/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                    opacity: 0.85
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