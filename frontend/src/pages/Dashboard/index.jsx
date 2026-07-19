import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import StatGrid from "../../components/dashboard/StatGrid";
import TrendChart from "../../components/dashboard/TrendChart";
import CrimeCategoryChart from "../../components/dashboard/CrimeCategoryChart";
import RecentCriticalCases from "../../components/dashboard/RecentCriticalCases";
import QuickActionsPanel from "../../components/dashboard/QuickActionsPanel";
import { fetchDashboardData } from "../../services/dashboardService";
import { recordService } from "../../services/recordService";
import { FaSyncAlt } from "react-icons/fa";

const DISTRICTS = [
  "All Districts (Statewide)",
  "Bengaluru City",
  "Mysuru District",
  "Mangaluru City",
  "Hubli-Dharwad",
  "Belagavi District",
  "Kalaburagi District",
  "Shivamogga",
  "Udupi District",
  "Davanagere",
  "Tumakuru"
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");

  const loadData = async (dist = selectedDistrict) => {
    setError(null);
    try {
      const response = await fetchDashboardData(dist);
      if (response.status === "success") {
        setDashboardData(response.data);
      } else {
        throw new Error("Failed to receive valid status from Catalyst Gateway.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load CCTNS case records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedDistrict);

    // Subscribe to live record updates
    const unsubscribe = recordService.subscribe(() => {
      loadData(selectedDistrict);
    });

    return () => unsubscribe();
  }, [selectedDistrict]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] font-mono text-xs text-slate-500">
        <div className="relative mb-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-800 border-t-blue-500" />
        </div>
        <div className="animate-pulse tracking-widest uppercase">
          Querying Karnataka Police CCTNS Datastore...
        </div>
        <div className="text-[10px] text-slate-600 mt-1.5 uppercase">
          Catalyst Functions: getKPIMetrics, getRecentCriticalCases, getAIIntelligenceAlerts
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] font-mono text-xs text-rose-500 border border-rose-900/30 rounded-xl bg-rose-950/5 p-8 max-w-xl mx-auto">
        <span className="font-bold text-sm uppercase mb-2">Catalyst SDK connection error</span>
        <p className="text-slate-400 text-center mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-rose-900/20 border border-rose-800 hover:bg-rose-900/40 text-rose-300 rounded font-bold transition-all"
        >
          Retry Connection Handshake
        </button>
      </div>
    );
  }

  const { kpi_metrics, crime_trends, crime_distribution, ai_alerts, recent_critical_cases } = dashboardData;

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      {/* 1. Executive Intelligence Header & Briefing Controls */}
      <div className="pb-6 border-b border-slate-900/60 flex flex-col gap-6">
        
        {/* Title and Action Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-mono">
              Executive Intelligence Dashboard
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Karnataka State Police • CCTNS Analytical Briefing & Modus Operandi Console
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto font-mono text-[10px] sm:text-[11px]">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-[#0c0d14] border border-slate-800/40 rounded-[4px] px-3 py-2 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[#a3a3a3] font-bold">TELEMETRY:</span>
              <span className="text-emerald-400 font-bold uppercase">SECURE</span>
            </div>

            {/* Live Date/Time */}
            <div className="bg-[#0c0d14] border border-slate-800/40 rounded-[4px] px-3.5 py-2 text-slate-300 font-bold shadow-sm">
              {new Date().toLocaleDateString("en-IN", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>

            {/* District Filter Dropdown */}
            <div className="flex items-center gap-2 bg-[#0c0d14] border border-slate-800/40 rounded-[4px] px-3 py-2 text-slate-300 shadow-sm">
              <span className="text-slate-500 font-bold uppercase text-[9px]">JURISDICTION:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-blue-400 font-bold outline-none cursor-pointer text-[11px] pr-1"
              >
                <option value="ALL" className="bg-slate-950 text-slate-200">Statewide (All Districts)</option>
                {DISTRICTS.slice(1).map((d) => (
                  <option key={d} value={d} className="bg-slate-950 text-slate-200">{d}</option>
                ))}
              </select>
            </div>

            {/* Sync Core Master */}
            <button
              onClick={() => loadData(selectedDistrict)}
              className="flex items-center gap-2 rounded-[4px] border border-slate-800/40 bg-slate-900/40 px-3.5 py-2 text-slate-400 hover:border-slate-700 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <FaSyncAlt className="text-[10px]" />
              <span>SYNC CORE</span>
            </button>
          </div>
        </div>

        {/* Operational Status Sub-Briefing Strip (No borders, very clean) */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 items-center text-[9px] sm:text-[10px] font-mono tracking-wider text-slate-500 uppercase">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Gateway Link:</span>{" "}
            <span className="text-slate-300 font-bold">CCTNS CAS (CONNECTED)</span>
          </div>

          <div className="text-slate-800">|</div>

          <div>
            <span className="text-slate-500">Active Units:</span>{" "}
            <span className="text-slate-300 font-bold">1,024 Districts & Commands</span>
          </div>

          <div className="text-slate-800">|</div>

          <div>
            <span className="text-slate-500">AI Intelligence Core:</span>{" "}
            <span className="text-blue-400 font-bold">QuickML (ONLINE)</span>
          </div>

          <div className="text-slate-800">|</div>

          <div className="ml-auto text-[9px] text-slate-600">
            LAST SYNC HANDSHAKE: 2026-07-17 14:26:00 IST
          </div>
        </div>
      </div>

      {/* 3. KPI Cards Section */}
      <StatGrid metrics={kpi_metrics} />

      {/* 4. Chart Row: Crime Trend (2/3) and Crime Category Distribution (1/3) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChart data={crime_trends} />
        </div>
        <div className="lg:col-span-1">
          <CrimeCategoryChart data={crime_distribution} />
        </div>
      </div>

      {/* 5. Details Row: Recent Critical Cases (Full Width) */}
      <div className="w-full">
        <RecentCriticalCases cases={recent_critical_cases} />
      </div>

      {/* 6. Command Console Panel */}
      <QuickActionsPanel />
    </div>
  );
};

export default Dashboard;