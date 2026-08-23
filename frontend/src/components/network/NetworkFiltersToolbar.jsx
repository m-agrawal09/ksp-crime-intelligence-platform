import React from "react";
import { 
  RiSearchLine, 
  RiFilter3Line, 
  RiRefreshLine, 
  RiFocus2Line,
  RiPlayFill,
  RiPauseFill
} from "react-icons/ri";
import { networkService } from "../../services/networkService";

const { NODE_COLORS } = networkService;

export default function NetworkFiltersToolbar({
  searchTerm,
  setSearchTerm,
  selectedDistrict,
  setSelectedDistrict,
  selectedCategory,
  setSelectedCategory,
  activeNodeTypes,
  toggleNodeType,
  isSimulationActive,
  setIsSimulationActive,
  onResetView,
  districts,
  categories
}) {
  return (
    <div className="bg-[#0b1329]/90 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Top Row: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search suspect, alias ('Speedy'), FIR, station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            <option value="ALL">All Districts ({districts.length})</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            <option value="ALL">All Crime Heads</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Graph Physics & View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulationActive(!isSimulationActive)}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulationActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30"
                : "bg-amber-600/20 text-amber-400 border border-amber-500/40 hover:bg-amber-600/30"
            }`}
            title={isSimulationActive ? "Pause Physics Simulation" : "Resume Physics Simulation"}
          >
            {isSimulationActive ? <RiPauseFill className="text-sm" /> : <RiPlayFill className="text-sm" />}
            <span>{isSimulationActive ? "Physics Live" : "Physics Frozen"}</span>
          </button>

          <button
            onClick={onResetView}
            className="p-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Recenter & Reset Zoom"
          >
            <RiFocus2Line className="text-base" />
            <span className="hidden sm:inline">Recenter</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Node Type Toggles */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">
          Entity Layers:
        </span>

        {Object.entries(NODE_COLORS).map(([typeKey, config]) => {
          const isActive = activeNodeTypes[typeKey];
          return (
            <button
              key={typeKey}
              onClick={() => toggleNodeType(typeKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 border-slate-700 text-white shadow-sm"
                  : "bg-slate-950/60 border-slate-850 text-slate-500 line-through opacity-60"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: config.base,
                  boxShadow: isActive ? `0 0 8px ${config.base}` : "none"
                }}
              />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
