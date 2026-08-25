import React from "react";
import { FaSearch, FaUndo, FaChevronDown } from "react-icons/fa";

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
    <div className="rounded-lg border border-slate-800 bg-[#0c1425]/90 backdrop-blur-md px-4 py-3 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
      
      {/* Search Input on the Left */}
      <div className="flex-1 max-w-sm relative flex items-center">
        <input
          type="text"
          name="search"
          placeholder="Search by name or badge ID..."
          value={filters.search || ""}
          onChange={handleSelectChange}
          className="w-full bg-[#080d19] border border-slate-800 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans transition-all"
        />
        <FaSearch className="absolute left-3 text-xs text-slate-500 pointer-events-none" />
      </div>

      {/* Select Dropdowns on the Right */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        
        {/* Unit Dropdown */}
        <div className="flex items-center gap-2 bg-[#080d19] border border-slate-800 rounded-md px-3 py-1.5 shadow-sm">
          <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider">UNIT</span>
          <select
            name="unit"
            value={filters.unit || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-sans appearance-none pr-4"
          >
            <option value="" className="bg-slate-950 text-slate-400">All Units</option>
            {units.map((u) => (
              <option key={u} value={u} className="bg-slate-950 text-slate-200">
                {u}
              </option>
            ))}
          </select>
          <FaChevronDown className="text-[9px] text-slate-500 -ml-3 pointer-events-none" />
        </div>

        {/* Rank Dropdown */}
        <div className="flex items-center gap-2 bg-[#080d19] border border-slate-800 rounded-md px-3 py-1.5 shadow-sm">
          <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider">RANK</span>
          <select
            name="rank"
            value={filters.rank || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-sans appearance-none pr-4"
          >
            <option value="" className="bg-slate-950 text-slate-400">All Ranks</option>
            {ranks.map((r) => (
              <option key={r} value={r} className="bg-slate-950 text-slate-200">
                {r}
              </option>
            ))}
          </select>
          <FaChevronDown className="text-[9px] text-slate-500 -ml-3 pointer-events-none" />
        </div>

        {/* Criteria Dropdown */}
        <div className="flex items-center gap-2 bg-[#080d19] border border-slate-800 rounded-md px-3 py-1.5 shadow-sm">
          <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider">CRITERIA</span>
          <select
            name="minClearance"
            value={filters.minClearance || ""}
            onChange={handleSelectChange}
            className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-sans appearance-none pr-4"
          >
            <option value="" className="bg-slate-950 text-slate-400">All Metrics</option>
            <option value="90" className="bg-slate-950 text-slate-200">90%+ Top Tier</option>
            <option value="85" className="bg-slate-950 text-slate-200">85%+ High Efficiency</option>
            <option value="80" className="bg-slate-950 text-slate-200">80%+ Optimal</option>
            <option value="below80" className="bg-slate-950 text-slate-200">&lt; 80% Scrutiny</option>
          </select>
          <FaChevronDown className="text-[9px] text-slate-500 -ml-3 pointer-events-none" />
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#080d19] hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 transition-all cursor-pointer font-bold text-xs shadow-sm"
        >
          <FaUndo className="text-[9px]" />
          <span>Reset</span>
        </button>

      </div>
    </div>
  );
};

export default OfficerFilters;
