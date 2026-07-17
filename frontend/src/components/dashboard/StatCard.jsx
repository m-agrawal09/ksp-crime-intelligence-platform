import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "text-blue-500",
  borderColor = "border-blue-500",
  lastSync,
  dataSource,
  coverage,
  subText
}) => {
  const [showMetadata, setShowMetadata] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:p-7 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 ${borderColor} border-l-4`}
      onMouseEnter={() => setShowMetadata(true)}
      onMouseLeave={() => setShowMetadata(false)}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {title}
          </span>
          <h2 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
            {value}
          </h2>
        </div>
        <div className={`rounded-lg bg-slate-800/40 p-2.5 ${color}`}>
          <Icon className="text-xl" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs font-medium ${change.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
          {change}
        </span>
        {subText && (
          <span className="text-2xs font-mono text-slate-500">
            {subText}
          </span>
        )}
      </div>

      {/* Operational Metadata Panel (appears on hover) */}
      <div
        className={`absolute inset-0 flex flex-col justify-between bg-slate-950/95 p-6 lg:p-7 transition-all duration-300 ${
          showMetadata ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <FaInfoCircle className="text-xs text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Operational Metadata
            </span>
          </div>

          <div className="mt-3 space-y-2 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">DATA SOURCE:</span>
              <span className="text-slate-300">{dataSource}</span>
            </div>
            <div>
              <span className="text-slate-500 block">COVERAGE:</span>
              <span className="text-slate-300">{coverage}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-850 pt-2 font-mono text-[10px]">
          <span className="text-slate-500">LAST SYNC:</span>
          <span className="text-slate-400">{lastSync}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;