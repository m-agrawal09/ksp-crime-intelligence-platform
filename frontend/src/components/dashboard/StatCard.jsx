import React, { useState } from "react";
import { FaInfoCircle, FaArrowUp, FaArrowDown } from "react-icons/fa";

/* ── Inline SVG sparkline ─────────────────────────────────────────── */
const Sparkline = ({ data, color, id }) => {
  if (!data || data.length < 2) return null;
  const W = 100, H = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H * 0.85,
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
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="2.5" fill={color} />
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

  const sparkId = (title || "card").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const isPositive = !String(change).startsWith("-");

  // Extract color hex from Tailwind class for accent line
  const accentHex =
    color.includes("blue")    ? "#3b82f6" :
    color.includes("amber")   ? "#f59e0b" :
    color.includes("emerald") ? "#10b981" :
    color.includes("rose")    ? "#f43f5e" : "#3b82f6";

  return (
    <div
      className="relative overflow-hidden rounded-[4px] border border-slate-800/25 bg-slate-900/60 transition-all duration-200 hover:border-slate-700/40 hover:bg-slate-900/80 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 shadow-sm animate-fade-in-up"
      onMouseEnter={() => setShowMetadata(true)}
      onMouseLeave={() => setShowMetadata(false)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${accentHex}55, ${accentHex}11)` }} />

      {/* Card body */}
      <div className="px-5 pt-5 pb-4">

        {/* ── Row 1: Label + Icon ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <span
            className="text-[9px] font-bold tracking-[0.18em] text-slate-500 uppercase leading-tight pt-0.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {title}
          </span>
          <div className={`flex-shrink-0 rounded-[3px] border border-slate-800/30 bg-slate-800/20 p-2 ${color}`}>
            {Icon ? <Icon className="text-[13px]" /> : <FaInfoCircle className="text-[13px]" />}
          </div>
        </div>

        {/* ── Row 2: Metric value ── */}
        <div className="mb-3">
          <span
            className="text-[2.6rem] font-extrabold tracking-tight text-white leading-none tabular-nums"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {value}
          </span>
        </div>

        {/* ── Row 3: Change + subText ── */}
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-1 text-[10px] font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {isPositive
              ? <FaArrowUp className="text-[8px]" />
              : <FaArrowDown className="text-[8px]" />}
            <span>{change}</span>
          </div>
          {subText && (
            <span
              className="text-[9px] text-slate-600 tracking-wide"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {subText}
            </span>
          )}
        </div>

        {/* ── Row 4: Sparkline ── */}
        {sparkData && (
          <div className="-mx-1">
            <Sparkline data={sparkData} color={sparkColor || accentHex} id={sparkId} />
          </div>
        )}
      </div>

      {/* ── Hover metadata overlay ── */}
      <div
        className={`absolute inset-0 flex flex-col justify-between bg-slate-950/97 px-5 pt-5 pb-4 transition-all duration-200 ${
          showMetadata
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${accentHex}55, ${accentHex}11)` }} />

        <div>
          <div className="flex items-center gap-1.5 border-b border-slate-800/30 pb-2.5 mb-3.5">
            <FaInfoCircle className="text-[9px] text-blue-400/70" />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Operational Metadata
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span
                className="text-[8px] text-slate-600 block uppercase tracking-[0.14em] mb-0.5"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Data Source
              </span>
              <span
                className="text-[11px] text-slate-300 font-medium"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {dataSource}
              </span>
            </div>
            <div>
              <span
                className="text-[8px] text-slate-600 block uppercase tracking-[0.14em] mb-0.5"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Coverage
              </span>
              <span
                className="text-[11px] text-slate-300 font-medium"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {coverage}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between border-t border-slate-800/25 pt-2.5"
        >
          <span
            className="text-[8px] text-slate-600 uppercase tracking-[0.14em]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Last Sync
          </span>
          <span
            className="text-[10px] text-slate-400 font-medium"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {lastSync}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;