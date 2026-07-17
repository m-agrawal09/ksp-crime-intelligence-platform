import React from "react";
import { FaEye, FaSyncAlt } from "react-icons/fa";
import { crimeService } from "../../services/crimeService";
import { officerService } from "../../services/officerService";

const ReportConfiguration = ({ config, onConfigChange, onGeneratePreview, isGenerating }) => {
  const districts = crimeService.getDistricts();
  const categories = crimeService.getCategories();
  const officers = officerService.getOfficers();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onConfigChange(name, value);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-850 pb-3 mb-2">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Report Parameters Configuration
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        {/* District selection */}
        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
            Target District
          </label>
          <select
            name="district"
            value={config.district || ""}
            onChange={handleInputChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          >
            <option value="">-- ALL DISTRICTS --</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Category selection */}
        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
            Crime Head
          </label>
          <select
            name="category"
            value={config.category || ""}
            onChange={handleInputChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          >
            <option value="">-- ALL CRIME HEADS --</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Officer selection */}
        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
            Target Officer Profile
          </label>
          <select
            name="officerName"
            value={config.officerName || ""}
            onChange={handleInputChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
          >
            <option value="">-- ALL PERSONNEL --</option>
            {officers.map((off) => (
              <option key={off.badgeNumber} value={off.name}>
                {off.name} ({off.rank.slice(0, 10)}...)
              </option>
            ))}
          </select>
        </div>

        {/* Date Ranges */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={config.startDate || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
            />
          </div>
          <div>
            <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={config.endDate || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Report Format */}
        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onConfigChange("format", "PDF")}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                config.format === "PDF"
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-950 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-white"
              }`}
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => onConfigChange("format", "EXCEL")}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                config.format === "EXCEL"
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-950 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-white"
              }`}
            >
              EXCEL
            </button>
          </div>
        </div>

        {/* Report Scope */}
        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
            Report Scope
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onConfigChange("scope", "Detailed")}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                config.scope === "Detailed"
                  ? "bg-slate-900 border-slate-750 text-white"
                  : "bg-slate-950 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-white"
              }`}
            >
              DETAILED
            </button>
            <button
              type="button"
              onClick={() => onConfigChange("scope", "Summary")}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                config.scope === "Summary"
                  ? "bg-slate-900 border-slate-750 text-white"
                  : "bg-slate-950 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-white"
              }`}
            >
              SUMMARY
            </button>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1.5 block">
            Priority level
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onConfigChange("priority", "Critical")}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                config.priority === "Critical"
                  ? "bg-red-950/20 border-red-500/30 text-red-400"
                  : "bg-slate-950 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-white"
              }`}
            >
              CRITICAL
            </button>
            <button
              type="button"
              onClick={() => onConfigChange("priority", "Routine")}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                config.priority === "Routine"
                  ? "bg-slate-900 border-slate-750 text-white"
                  : "bg-slate-950 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-white"
              }`}
            >
              ROUTINE
            </button>
          </div>
        </div>

        {/* Preview Button */}
        <div>
          <button
            onClick={onGeneratePreview}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs py-2.5 px-4 rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <FaSyncAlt className="text-[10px] animate-spin" />
                GENERATING...
              </>
            ) : (
              <>
                <FaEye className="text-xs" />
                PREVIEW REPORT
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportConfiguration;
