import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

/* ── Inline SVG sparkline ─────────────────────────────────────────── */
const Sparkline = ({ data, color, id }) => {
  if (!data || data.length < 2) return null;
  const W = 100, H = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H * 0.82,
  }));

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${W},${H} L 0,${H} Z`;
  const last = pts[pts.length - 1];
  const gradId = `sg-${id}`;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      overflow="visible"
      className="w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="2.2" fill={color} />
    </svg>
  );
};

/* ── StatCard ─────────────────────────────────────────────────────── */
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color      = "text-blue-500",
  borderColor = "border-blue-500",
  lastSync,
  dataSource,
  coverage,
  subText,
  sparkData,
  sparkColor,
}) => {
  const [showMetadata, setShowMetadata] = useState(false);

  // Derive a stable gradient ID from the title
  const sparkId = (title || "card").replace(/[^a-z0-9]/gi, "").toLowerCase();

  return (
    <div
      className="relative overflow-hidden rounded-[4px] border border-slate-800/20 bg-slate-900/50 px-6 pt-6 pb-4 lg:px-7 lg:pt-7 min-h-[188px] transition-all duration-200 hover:border-slate-700/35 hover:bg-slate-900/75 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 shadow-sm animate-fade-in-up"
      onMouseEnter={() => setShowMetadata(true)}
      onMouseLeave={() => setShowMetadata(false)}
    >
      {/* Top row: title + icon */}
      <div className="flex items-start justify-between">
        <span className="text-[9px] font-bold tracking-widest text-slate-600 uppercase font-mono">
          {title}
        </span>
        <div className={`rounded-[3px] bg-slate-800/15 p-2 ${color}`}>
          {Icon ? <Icon className="text-sm" /> : <FaInfoCircle className="text-sm" />}
        </div>
      </div>

      {/* Metric value */}
      <h2 className="mt-3 font-mono text-5xl font-extrabold tracking-tight text-white leading-none">
        {value}
      </h2>

      {/* Change + subtext */}
      <div className="mt-3.5 flex items-center justify-between">
        <span
          className={`text-[11px] font-bold font-mono tracking-wide ${
            String(change).startsWith("-") ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {change}
        </span>
        {subText && (
          <span className="text-[9px] font-mono text-slate-600">{subText}</span>
        )}
      </div>

      {/* Sparkline */}
      {sparkData && (
        <div className="mt-3 -mx-1">
          <Sparkline data={sparkData} color={sparkColor || "#3b82f6"} id={sparkId} />
        </div>
      )}

      {/* ── Hover metadata overlay ── */}
      <div
        className={`absolute inset-0 flex flex-col justify-between bg-slate-950/96 px-6 pt-6 pb-5 lg:px-7 lg:pt-7 transition-all duration-200 ${
          showMetadata
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5 border-b border-slate-800/30 pb-2">
            <FaInfoCircle className="text-[10px] text-blue-400/70" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Operational Metadata
            </span>
          </div>

          <div className="mt-3.5 space-y-2.5 font-mono text-[11px]">
            <div>
              <span className="text-slate-600 block text-[9px] uppercase tracking-widest mb-0.5">
                DATA SOURCE
              </span>
              <span className="text-slate-300">{dataSource}</span>
            </div>
            <div>
              <span className="text-slate-600 block text-[9px] uppercase tracking-widest mb-0.5">
                COVERAGE
              </span>
              <span className="text-slate-300">{coverage}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/25 pt-2.5 font-mono text-[10px]">
          <span className="text-slate-600 uppercase tracking-widest text-[9px]">LAST SYNC</span>
          <span className="text-slate-400">{lastSync}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;