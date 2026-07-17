import React from "react";
import { FaUndo, FaSearch } from "react-icons/fa";
import { crimeService } from "../../services/crimeService";

const MapFilters = ({ filters, onFilterChange, onReset }) => {
  const districts = crimeService.getDistricts();
  const categories = crimeService.getCategories();
  const severities = crimeService.getSeverities();
  const statuses = crimeService.getStatuses();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 border-b border-slate-850 pb-3 mb-4">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Intelligence Query Filters
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-4 items-end">
        {/* District Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">
            District Selection
          </label>
          <select
            name="district"
            value={filters.district || ""}
            onChange={handleSelectChange}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          >
            <option value="">-- ALL DISTRICTS --</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Police Unit Search */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">
            Police Unit / PS
          </label>
          <div className="relative">
            <input
              type="text"
              name="unit"
              placeholder="Search station..."
              value={filters.unit || ""}
              onChange={handleSelectChange}
              className="w-full bg-slate-950 border border-slate-800/80 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700 font-mono transition-colors"
            />
            <FaSearch className="absolute left-2.5 top-3 text-[10px] text-slate-600" />
          </div>
        </div>

        {/* Crime Category */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">
            Crime Category
          </label>
          <select
            name="category"
            value={filters.category || ""}
            onChange={handleSelectChange}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          >
            <option value="">-- ALL CATEGORIES --</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Crime Severity */}
        <div className="flex-1 min-w-[120px]">
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">
            Severity Index
          </label>
          <select
            name="severity"
            value={filters.severity || ""}
            onChange={handleSelectChange}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          >
            <option value="">-- ALL LEVEL --</option>
            {severities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Case Status */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">
            Case Status
          </label>
          <select
            name="status"
            value={filters.status || ""}
            onChange={handleSelectChange}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          >
            <option value="">-- ALL STATUSES --</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="w-full sm:w-auto">
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ""}
            onChange={handleSelectChange}
            className="w-full sm:w-36 bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          />
        </div>

        {/* End Date */}
        <div className="w-full sm:w-auto">
          <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ""}
            onChange={handleSelectChange}
            className="w-full sm:w-36 bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          />
        </div>

        {/* Reset Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-850 hover:bg-slate-800 hover:text-white border border-slate-750 text-slate-300 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all"
          >
            <FaUndo className="text-[9px]" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
