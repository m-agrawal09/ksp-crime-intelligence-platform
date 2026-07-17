import React from "react";
import { FaFire, FaHistory, FaFolderOpen, FaLayerGroup } from "react-icons/fa";

const IntelligenceStrip = ({ hotspots, recentIncidents, totalCount, activeCount }) => {
  const activePercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Top Hotspot Districts */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <FaFire className="text-red-500 text-sm animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
            Top Hotspots
          </span>
        </div>
        
        <div className="flex-1 space-y-1.5 font-mono text-[10px]">
          {hotspots && hotspots.length > 0 ? (
            hotspots.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center text-slate-300">
                <span className="truncate max-w-[140px]">
                  {index + 1}. {item.name.replace(" District", "").replace(" City", "").toUpperCase()}
                </span>
                <span className="font-bold text-red-400">{item.count} Cases</span>
              </div>
            ))
          ) : (
            <span className="text-slate-500">No data found</span>
          )}
        </div>
      </div>

      {/* 2. Recent Incidents Ticker */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <FaHistory className="text-blue-400 text-sm" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
            Live Case Feeds
          </span>
        </div>
        
        <div className="flex-1 space-y-2 font-mono text-[9px] leading-relaxed">
          {recentIncidents && recentIncidents.length > 0 ? (
            recentIncidents.slice(0, 2).map((inc) => (
              <div key={inc.id} className="border-l-2 border-l-blue-500 pl-2">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span className="truncate max-w-[120px]">{inc.caseNo}</span>
                  <span className="text-slate-500 text-[8px]">{inc.date}</span>
                </div>
                <p className="text-slate-400 line-clamp-1 font-sans">{inc.briefFacts}</p>
              </div>
            ))
          ) : (
            <span className="text-slate-500 block py-2">No active feeds</span>
          )}
        </div>
      </div>

      {/* 3. Active Investigations */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <FaFolderOpen className="text-amber-500 text-sm" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
            Investigation Status
          </span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-end font-mono mb-1.5">
            <span className="text-[10px] text-slate-400">ACTIVE TASKS:</span>
            <span className="text-sm font-bold text-white">
              {activeCount} <span className="text-[10px] text-slate-500">/ {totalCount}</span>
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${activePercentage}%` }}
            />
          </div>
          <span className="text-[8px] font-mono text-slate-500 text-right mt-1.5 block">
            {activePercentage}% UNDER ACTIVE SCRUTINY
          </span>
        </div>
      </div>

      {/* 4. Crime Legend */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <FaLayerGroup className="text-purple-400 text-sm" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
            Radar Map Legend
          </span>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1.5 font-mono text-[8px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>PROPERTY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>BODY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <span>CYBER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>FRAUD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>NARCOTICS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            <span>WOMEN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceStrip;
