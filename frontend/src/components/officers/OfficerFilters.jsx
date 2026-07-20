import React from "react";
import { FaFilter, FaSearch, FaUndo } from "react-icons/fa";

const OfficerFilters = ({
  filters,
  onFilterChange,
  onReset,
  ranks = [],
  units = []
}) => {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="bg-slate-900/35 border border-slate-800/30 rounded-xl px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-sans shadow-lg">
      
      {/* Search Input on the Left */}
      <div className="flex-1 max-w-md relative">
        <input
          type="text"
          name="search"
          placeholder="Filter officers by name or badge ID..."
          value={filters.search || ""}
          onChange={handleSelectChange}
          className="w-full bg-slate-950/60 border border-slate-800/50 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-600/50 font-mono transition-all"
        />
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500" />
      </div>

      {/* Select Dropdowns in the Center/Right */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
        
        {/* Unit Dropdown */}
        <div className="flex items-center gap-2 bg-[#060c18]/50 border border-slate-800/40 rounded-lg px-3 py-1.5 shadow-sm">
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">UNIT:</span>
          <select
            name="unit"
            value={filters.unit || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-purple-400 font-bold outline-none cursor-pointer text-xs"
          >
            <option value="" className="bg-slate-950 text-slate-400">-- ALL UNITS --</option>
            {units.map((u) => (
              <option key={u} value={u} className="bg-slate-950 text-slate-200">
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Rank Dropdown */}
        <div className="flex items-center gap-2 bg-[#060c18]/50 border border-slate-800/40 rounded-lg px-3 py-1.5 shadow-sm">
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">RANK:</span>
          <select
            name="rank"
            value={filters.rank || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-purple-400 font-bold outline-none cursor-pointer text-xs"
          >
            <option value="" className="bg-slate-950 text-slate-400">-- ALL RANKS --</option>
            {ranks.map((r) => (
              <option key={r} value={r} className="bg-slate-950 text-slate-200">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Clearance Dropdown */}
        <div className="flex items-center gap-2 bg-[#060c18]/50 border border-slate-800/40 rounded-lg px-3 py-1.5 shadow-sm">
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">CRITERIA:</span>
          <select
            name="minClearance"
            value={filters.minClearance || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-purple-400 font-bold outline-none cursor-pointer text-xs"
          >
            <option value="" className="bg-slate-950 text-slate-400">-- ALL METRICS --</option>
            <option value="90" className="bg-slate-950 text-slate-200">90%+ Top Tier</option>
            <option value="85" className="bg-slate-950 text-slate-200">85%+ High Efficiency</option>
            <option value="80" className="bg-slate-950 text-slate-200">80%+ Optimal</option>
            <option value="below80" className="bg-slate-950 text-slate-200">&lt; 80% Scrutiny</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800/50 bg-slate-900/30 px-3.5 py-2 text-slate-500 hover:border-slate-700/50 hover:text-white transition-all cursor-pointer font-bold uppercase text-[9px] tracking-widest shadow-sm"
        >
          <FaUndo className="text-[8px]" />
          <span>Reset</span>
        </button>

      </div>

    </div>
  );
};

export default OfficerFilters;
