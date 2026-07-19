import React from "react";
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 shadow-xl">
        <p className="font-mono text-xs font-bold text-slate-300 border-b border-slate-800 pb-1 mb-2">
          TIMELINE: {label} 2026
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

const TrendChart = ({ data }) => {
  return (
    <ChartCard
      title="Crime Incidents Trend"
      subtitle="Monthly CCTNS CaseMaster registrations by major crime heads"
    >
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorCyber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#0f172a"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

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
              name="Property Offences"
              dataKey="property_offences"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorProperty)"
            />

            <Area
              type="monotone"
              name="Body Offences"
              dataKey="body_offences"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorBody)"
            />

            <Area
              type="monotone"
              name="Cyber Crimes"
              dataKey="cyber_crimes"
              stroke="#a855f7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCyber)"
            />

            <Area
              type="monotone"
              name="Financial Fraud"
              dataKey="financial_fraud"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorFraud)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default TrendChart;