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
    <div className="bg-slate-900/60 border border-slate-800 pt-5 pb-5 px-6 rounded-[4px] shadow-lg space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FaFilter className="text-[10px] text-purple-400" /> Officer Performance Criteria Filters
          </h3>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white hover:underline cursor-pointer"
        >
          <FaUndo className="text-[9px]" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search Name or Badge */}
        <div>
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1 block">
            Search Officer / Badge
          </label>
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search name, badge..."
              value={filters.search || ""}
              onChange={handleSelectChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-[4px] pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono transition-colors"
            />
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-600" />
          </div>
        </div>

        {/* Police Unit Filter */}
        <div>
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1 block">
            Police Unit / Division
          </label>
          <select
            name="unit"
            value={filters.unit || ""}
            onChange={handleSelectChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono transition-colors"
          >
            <option value="">-- ALL UNITS --</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Rank Filter */}
        <div>
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1 block">
            Officer Rank
          </label>
          <select
            name="rank"
            value={filters.rank || ""}
            onChange={handleSelectChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono transition-colors"
          >
            <option value="">-- ALL RANKS --</option>
            {ranks.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Clearance Rate Performance Filter */}
        <div>
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1 block">
            Case Clearance Rate
          </label>
          <select
            name="minClearance"
            value={filters.minClearance || ""}
            onChange={handleSelectChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono transition-colors"
          >
            <option value="">-- ALL CLEARANCE RATES --</option>
            <option value="90">90%+ Top Performers</option>
            <option value="85">85%+ High Efficiency</option>
            <option value="80">80%+ Optimal Performance</option>
            <option value="below80">&lt; 80% Needs Attention</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OfficerFilters;
