import React, { useState, useEffect, useMemo } from "react";
import { 
  RiTimeLine, 
  RiRadarLine, 
  RiFireLine, 
  RiCarLine, 
  RiFilter3Line, 
  RiRefreshLine,
  RiBuilding2Line,
  RiShieldFlashLine,
  RiSparklingFill
} from "react-icons/ri";
import { diurnalService } from "../../services/diurnalService";
import { recordService } from "../../services/recordService";
import { crimeService } from "../../services/crimeService";
import DiurnalHeatMatrix from "../../components/diurnal/DiurnalHeatMatrix";
import RedZonePulseAlerts from "../../components/diurnal/RedZonePulseAlerts";
import PatrolDeploymentSchedule from "../../components/diurnal/PatrolDeploymentSchedule";
import HourlyTrendBar from "../../components/diurnal/HourlyTrendBar";

export default function DiurnalMatrix() {
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru City");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedCell, setSelectedCell] = useState(null);

  // State to trigger re-renders on database sync
  const [dbVersion, setDbVersion] = useState(0);

  // Subscribe to real-time database changes from recordService
  useEffect(() => {
    const unsubscribe = recordService.subscribe(() => {
      setDbVersion((v) => v + 1);
    });
    return () => unsubscribe();
  }, []);

  const districts = useMemo(() => crimeService.getDistricts() || [], []);
  const categories = useMemo(() => crimeService.getCategories() || [], []);

  // Compute live diurnal matrix & red-zone alerts from database
  const { matrixData, redZoneAlerts, patrolShifts } = useMemo(() => {
    const matrix = diurnalService.getDiurnalMatrix({
      district: selectedDistrict,
      category: selectedCategory,
      severity: selectedSeverity
    });

    const alerts = diurnalService.getRedZoneAlerts();
    const shifts = diurnalService.getPatrolShiftSchedule({
      district: selectedDistrict,
      category: selectedCategory
    });

    return {
      matrixData: matrix,
      redZoneAlerts: alerts,
      patrolShifts: shifts
    };
  }, [selectedDistrict, selectedCategory, selectedSeverity, dbVersion]);

  const handleResetFilters = () => {
    setSelectedDistrict("Bengaluru City");
    setSelectedCategory("ALL");
    setSelectedSeverity("ALL");
    setSelectedCell(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1329]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <RiTimeLine className="text-xs" />
              <span>Spatiotemporal Diurnal Intelligence</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Live Database Connected
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <RiTimeLine className="text-amber-400 text-2xl" />
            <span>Spatiotemporal Diurnal Crime Matrix & Red-Zone Pulsing</span>
          </h1>

          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlating time-of-day (00:00 to 23:00) with days of the week across Karnataka police stations to uncover diurnal crime rhythms and trigger velocity surge alerts.
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District Select */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Districts (Statewide)</option>
            {districts.map((dist, idx) => (
              <option key={idx} value={dist}>
                {dist}
              </option>
            ))}
          </select>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-750 text-white rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Crime Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RiRefreshLine className="text-sm" />
          </button>
        </div>
      </div>

      {/* 4 Executive Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Total Data Points</span>
            <RiTimeLine className="text-blue-400 text-base" />
          </div>
          <p className="text-xl font-bold text-white font-mono">{matrixData.totalIncidents}</p>
          <span className="text-[10px] text-slate-500">In Active Scope</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Active Red-Zones</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <p className="text-xl font-bold text-rose-400 font-mono">{redZoneAlerts.length}</p>
          <span className="text-[10px] text-rose-500/80 font-medium">&gt;25% Surge Flagged</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Peak Diurnal Hour</span>
            <RiFireLine className="text-amber-400 text-base" />
          </div>
          <p className="text-xl font-bold text-amber-400 font-mono">
            {matrixData.topPeaks[0]?.hourRange || "02:00 - 04:00"}
          </p>
          <span className="text-[10px] text-slate-500">{matrixData.topPeaks[0]?.day || "Weekends"}</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Primary Threat Window</span>
            <RiShieldFlashLine className="text-cyan-400 text-base" />
          </div>
          <p className="text-xl font-bold text-cyan-300 font-mono truncate">
            {matrixData.topPeaks[0]?.primaryThreat || "Property Theft"}
          </p>
          <span className="text-[10px] text-slate-500">Night Watch Shift 3</span>
        </div>
      </div>

      {/* 24-Hour Diurnal Aggregate Curve */}
      <HourlyTrendBar hourlyData={matrixData.grid} />

      {/* Red-Zone Radar Pulse Alerts Stream */}
      <RedZonePulseAlerts
        alerts={redZoneAlerts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />

      {/* 24x7 Diurnal Heat Matrix with Interactive FIR Dossier Drawer */}
      <DiurnalHeatMatrix
        matrixData={matrixData}
        selectedCell={selectedCell}
        onSelectCell={setSelectedCell}
      />

      {/* Proactive Tactical Patrol Deployment Schedule */}
      <PatrolDeploymentSchedule shifts={patrolShifts} />
    </div>
  );
}
