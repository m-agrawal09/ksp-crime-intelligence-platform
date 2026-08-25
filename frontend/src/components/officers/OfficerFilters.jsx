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
    <div 
      className="rounded-sm border border-slate-700/60 shadow-xl bg-slate-900/85 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-sans"
      style={{ padding: "18px 22px" }}
    >
      {/* Search Input on the Left */}
      <div className="flex-1 max-w-md relative flex items-center">
        <input
          type="text"
          name="search"
          placeholder="Filter officers by name or badge ID..."
          value={filters.search || ""}
          onChange={handleSelectChange}
          className="w-full bg-slate-950/80 border border-slate-700/60 rounded-sm py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-all"
          style={{ paddingLeft: "42px", paddingRight: "16px" }}
        />
        <FaSearch className="absolute left-3.5 text-xs text-slate-400 pointer-events-none z-10" />
      </div>

      {/* Select Dropdowns in the Center/Right */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
        
        {/* Unit Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/60 rounded-sm px-3 py-1.5 shadow-sm">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">UNIT:</span>
          <select
            name="unit"
            value={filters.unit || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-blue-400 font-bold outline-none cursor-pointer text-xs font-mono"
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
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/60 rounded-sm px-3 py-1.5 shadow-sm">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">RANK:</span>
          <select
            name="rank"
            value={filters.rank || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-blue-400 font-bold outline-none cursor-pointer text-xs font-mono"
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
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/60 rounded-sm px-3 py-1.5 shadow-sm">
          <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">CRITERIA:</span>
          <select
            name="minClearance"
            value={filters.minClearance || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-blue-400 font-bold outline-none cursor-pointer text-xs font-mono"
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
          className="flex items-center gap-1.5 rounded-sm border border-slate-700/60 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-2 transition-all cursor-pointer font-bold uppercase text-[9.5px] font-mono tracking-widest shadow-sm"
        >
          <FaUndo className="text-[9px]" />
          <span>Reset</span>
        </button>

      </div>

    </div>
  );
};

export default OfficerFilters;
