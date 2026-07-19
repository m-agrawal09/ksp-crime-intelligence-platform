import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";

// Simplified Karnataka state boundary SVG path (viewBox 0 0 215 268)
const KARNATAKA_PATH =
  "M 52,26 C 72,16 105,11 132,13 C 152,12 168,14 180,20 L 188,32 L 185,52 L 178,72 L 172,93 L 165,113 L 160,135 L 152,155 L 144,172 L 133,192 L 118,212 L 104,233 L 92,250 L 80,241 L 64,224 L 47,207 L 34,190 L 24,168 L 21,146 L 23,124 L 25,103 L 27,82 L 30,62 L 36,46 L 46,34 Z";

const HOTSPOTS = [
  { name: "Bengaluru City",  x: 122, y: 184, severity: "HIGH"   },
  { name: "Mysuru District", x:  96, y: 213, severity: "HIGH"   },
  { name: "Belagavi",        x:  57, y:  42, severity: "HIGH"   },
  { name: "Hubli-Dharwad",   x:  68, y:  83, severity: "MEDIUM" },
  { name: "Mangaluru City",  x:  44, y: 207, severity: "MEDIUM" },
  { name: "Kalaburagi",      x: 157, y:  58, severity: "MEDIUM" },
  { name: "Vijayapura",      x: 121, y:  60, severity: "LOW"    },
  { name: "Ballari",         x: 128, y: 124, severity: "LOW"    },
  { name: "Raichur",         x: 147, y: 100, severity: "LOW"    },
  { name: "Davanagere",      x:  89, y: 131, severity: "LOW"    },
  { name: "Shivamogga",      x:  67, y: 150, severity: "LOW"    },
  { name: "Tumakuru",        x: 108, y: 163, severity: "LOW"    },
];

const SEV_CFG = {
  HIGH:   { fill: "#ef4444", pulse: "rgba(239,68,68,0.22)",   r: 6.5, rOuter: 13, filter: "url(#gf-high)"   },
  MEDIUM: { fill: "#f59e0b", pulse: "rgba(245,158,11,0.18)",  r: 4.5, rOuter:  9, filter: "url(#gf-med)"    },
  LOW:    { fill: "#3b82f6", pulse: "rgba(59,130,246,0.15)",  r: 3,   rOuter:  6, filter: "url(#gf-low)"    },
};

const KarnatakaOverviewPanel = () => {
  const highCount = HOTSPOTS.filter(h => h.severity === "HIGH").length;
  const medCount  = HOTSPOTS.filter(h => h.severity === "MEDIUM").length;

  return (
    <div className="rounded-[4px] border border-slate-800/20 bg-slate-900/50 overflow-hidden animate-fade-in-up">

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-3.5 flex items-center justify-between border-b border-slate-800/15">
        <div>
          <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">
            Karnataka Overview
          </h2>
          <p className="text-[9px] text-slate-600 mt-0.5 font-mono uppercase tracking-wider">
            District Crime Hotspot Map
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5">
          {[
            { label: "High",   color: "#ef4444" },
            { label: "Medium", color: "#f59e0b" },
            { label: "Low",    color: "#3b82f6" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[9px] font-mono text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SVG Map ── */}
      <div className="bg-[#060c18] relative">
        <svg
          viewBox="0 0 215 268"
          className="w-full"
          style={{ display: "block" }}
          aria-label="Karnataka district crime hotspot map"
        >
          <defs>
            {/* Glow filters */}
            <filter id="gf-high" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="gf-med" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="gf-low" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Map background gradient */}
            <radialGradient id="map-bg-grad" cx="50%" cy="50%" r="65%">
              <stop offset="0%"   stopColor="#0d1d32" />
              <stop offset="100%" stopColor="#060c18" />
            </radialGradient>

            {/* State fill gradient */}
            <linearGradient id="state-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#1e3a5f" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0f2040" stopOpacity="0.2"  />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="215" height="268" fill="url(#map-bg-grad)" />

          {/* Subtle dot grid */}
          {Array.from({ length: 10 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 32 + 10}
                cy={row * 27 + 12}
                r={0.6}
                fill="rgba(59,130,246,0.1)"
              />
            ))
          )}

          {/* Karnataka state boundary */}
          <path
            d={KARNATAKA_PATH}
            fill="url(#state-fill)"
            stroke="rgba(59,130,246,0.28)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* District hotspot markers */}
          {HOTSPOTS.map((spot) => {
            const cfg = SEV_CFG[spot.severity];
            return (
              <g key={spot.name}>
                {/* Outer pulse ring */}
                <circle cx={spot.x} cy={spot.y} r={cfg.rOuter} fill={cfg.pulse} />
                {/* Mid ring */}
                <circle cx={spot.x} cy={spot.y} r={cfg.r + 2} fill={cfg.fill} opacity={0.15} />
                {/* Glowing dot */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={cfg.r}
                  fill={cfg.fill}
                  filter={cfg.filter}
                  opacity={0.92}
                />
                {/* Bright center */}
                <circle cx={spot.x} cy={spot.y} r={cfg.r * 0.35} fill="white" opacity={0.8} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3.5 border-t border-slate-800/15 bg-slate-900/30 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest block">
            Active Hotspots
          </span>
          <span className="text-amber-400 font-bold font-mono text-[13px] leading-snug">
            {highCount + medCount} Districts
          </span>
        </div>
        <Link
          to="/map"
          className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-blue-400 transition-colors duration-150"
        >
          <FaMapMarkedAlt className="text-[9px]" />
          View Crime Map
        </Link>
      </div>
    </div>
  );
};

export default KarnatakaOverviewPanel;
