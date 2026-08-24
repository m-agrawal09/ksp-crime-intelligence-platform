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
    <div 
      className="bg-slate-900/85 border border-slate-700/60 rounded-md backdrop-blur-md shadow-xl flex flex-col gap-3.5"
      style={{ padding: "20px 24px" }}
    >
      {/* Top Row: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search suspect, alias ('Speedy'), FIR, station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-7 py-2 bg-slate-950/80 border border-slate-700/70 rounded-md text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/40 transition-all font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
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
            className="px-3 py-2 bg-slate-950/80 border border-slate-700/70 rounded-md text-xs text-slate-200 focus:outline-none focus:border-blue-400 font-medium cursor-pointer hover:border-slate-600 transition-colors"
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
            className="px-3 py-2 bg-slate-950/80 border border-slate-700/70 rounded-md text-xs text-slate-200 focus:outline-none focus:border-blue-400 font-medium cursor-pointer hover:border-slate-600 transition-colors"
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
            className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulationActive
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/50 hover:bg-blue-600/30"
                : "bg-amber-600/20 text-amber-300 border border-amber-500/50 hover:bg-amber-600/30"
            }`}
            title={isSimulationActive ? "Pause Physics Simulation" : "Resume Physics Simulation"}
          >
            {isSimulationActive ? <RiPauseFill className="text-sm" /> : <RiPlayFill className="text-sm" />}
            <span>{isSimulationActive ? "Physics Live" : "Physics Frozen"}</span>
          </button>

          <button
            onClick={onResetView}
            className="px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 rounded-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            title="Recenter & Reset Zoom"
          >
            <RiFocus2Line className="text-sm text-blue-400" />
            <span className="hidden sm:inline">Recenter</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Node Type Toggles */}
      <div className="flex flex-wrap items-center gap-2 pt-2.5 px-1 border-t border-slate-700/50">
        <span className="text-[10.5px] font-mono text-slate-400 uppercase font-bold tracking-wider mr-1">
          Entity Layers:
        </span>

        {Object.entries(NODE_COLORS).map(([typeKey, config]) => {
          const isActive = activeNodeTypes[typeKey];
          return (
            <button
              key={typeKey}
              onClick={() => toggleNodeType(typeKey)}
              className={`px-2.5 py-1 rounded-sm text-[11px] font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 border-slate-600/80 text-slate-100 shadow-sm"
                  : "bg-slate-950/70 border-slate-800 text-slate-500 line-through opacity-50"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: config.base,
                  boxShadow: isActive ? `0 0 6px ${config.base}` : "none"
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
