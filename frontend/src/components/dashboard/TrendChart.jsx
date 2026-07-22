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
      <div className="rounded-md border border-slate-800/40 bg-slate-950/98 p-3.5 shadow-xl shadow-black/40">
        <p className="font-mono text-[10px] font-bold text-slate-400 border-b border-slate-800/40 pb-1.5 mb-2.5 uppercase tracking-wider">
          {label} 2026
        </p>
        <div className="space-y-2 font-mono text-[11px]">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-500">{entry.name}</span>
              </div>
              <span className="font-bold text-white tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TrendChart = ({ data, className = "" }) => {
  return (
    <ChartCard
      title="Crime Incidents Trend"
      subtitle="Monthly CCTNS CaseMaster registrations by major crime heads"
      className={`h-full flex flex-col ${className}`}
    >
      <div className="h-[430px] w-full flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.18}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorCyber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.18}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.18}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="2 5"
              vertical={false}
              strokeOpacity={0.7}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#334155", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />

            <YAxis
              tick={{ fill: "#334155", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
              iconSize={7}
              wrapperStyle={{
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#475569",
                paddingBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            />

            <Area
              type="monotone"
              name="Property Offences"
              dataKey="property_offences"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProperty)"
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
            />

            <Area
              type="monotone"
              name="Body Offences"
              dataKey="body_offences"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBody)"
              isAnimationActive={true}
              animationDuration={1050}
              animationEasing="ease-out"
            />

            <Area
              type="monotone"
              name="Cyber Crimes"
              dataKey="cyber_crimes"
              stroke="#a855f7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCyber)"
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />

            <Area
              type="monotone"
              name="Financial Fraud"
              dataKey="financial_fraud"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFraud)"
              isAnimationActive={true}
              animationDuration={1350}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default TrendChart;