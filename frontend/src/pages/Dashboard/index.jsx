import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import StatGrid from "../../components/dashboard/StatGrid";
import TrendChart from "../../components/dashboard/TrendChart";
import CrimeCategoryChart from "../../components/dashboard/CrimeCategoryChart";
import RecentCriticalCases from "../../components/dashboard/RecentCriticalCases";
import QuickActionsPanel from "../../components/dashboard/QuickActionsPanel";
import KarnatakaOverviewPanel from "../../components/dashboard/KarnatakaOverviewPanel";
import AIInsightsBanner from "../../components/dashboard/AIInsightsBanner";
import { fetchDashboardData } from "../../services/dashboardService";
import { recordService } from "../../services/recordService";
import { FaSyncAlt, FaCalendarAlt, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

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
  "Tumakuru",
  "Chikkamagaluru",
  "Bidar",
  "Mandya",
  "Dakshina Kannada",
  "Hassan",
  "Uttara Kannada"
];

const Dashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (district = selectedDistrict) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDashboardData(district);
      if (res.status === "success") {
        setDashboardData(res.data);
      } else {
        setError(res.error || "Failed to load dashboard data");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-xs text-slate-500" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
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
          onClick={() => loadData(selectedDistrict)}
          className="px-4 py-2 bg-rose-900/20 border border-rose-800 hover:bg-rose-900/40 text-rose-300 rounded font-bold transition-all"
        >
          Retry Connection Handshake
        </button>
      </div>
    );
  }

  const { kpi_metrics, crime_trends, crime_distribution, ai_alerts, recent_critical_cases } = dashboardData;

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── 1. Executive Intelligence Header ── */}
      <div className="pb-7 border-b border-slate-900/40 flex flex-col gap-5 animate-fade-in-up">

        {/* Title + Controls row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white leading-none font-space tracking-tight">
              Executive Intelligence Dashboard
            </h1>
            <p className="text-[11px] text-slate-500 mt-2 tracking-wide font-space">
              Karnataka State Police &bull; CCTNS Analytical Briefing
            </p>
          </div>

          {/* Unified Controls Container (Straight Corners + Extra Breathing Room) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 self-start lg:self-auto bg-slate-900/60 border border-slate-700/40 rounded-none px-5 py-3 sm:px-6 sm:py-3.5 shadow-sm backdrop-blur-md text-xs font-mono font-medium text-slate-300">
            
            {/* Live Telemetry Indicator */}
            <div className="flex items-center gap-2 pr-4 sm:pr-5 border-r border-slate-800/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold">TELEMETRY:</span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono tracking-wider">SECURE</span>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-2 pr-4 sm:pr-5 border-r border-slate-800/80">
              <FaCalendarAlt className="text-blue-400 text-xs flex-shrink-0" />
              <span className="text-xs font-mono font-medium text-slate-200">
                {new Date().toLocaleDateString("en-IN", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* District Jurisdiction Selector */}
            <div className="flex items-center gap-2 pr-4 sm:pr-5 border-r border-slate-800/80">
              <FaMapMarkerAlt className="text-blue-400 text-xs flex-shrink-0" />
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">JURISDICTION:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-blue-400 hover:text-blue-300 font-bold font-mono outline-none cursor-pointer text-xs pr-1"
              >
                <option value="ALL" className="bg-slate-950 text-slate-200">Statewide (All Districts)</option>
                {DISTRICTS.slice(1).map((d) => (
                  <option key={d} value={d} className="bg-slate-950 text-slate-200">{d}</option>
                ))}
              </select>
            </div>

            {/* Sync Core Button */}
            <button
              onClick={() => loadData(selectedDistrict)}
              className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors cursor-pointer group font-mono text-xs active:scale-95"
              title="Refresh Dashboard Data"
            >
              <FaSyncAlt className="text-xs text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-bold tracking-wider">SYNC CORE</span>
            </button>
          </div>
        </div>

        {/* Status strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-[9px] sm:text-[10px] tracking-wider text-slate-500 uppercase font-space font-bold">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">Gateway Link:</span>{" "}
            <span className="text-slate-400 font-bold">CCTNS CAS (CONNECTED)</span>
          </div>
          <div className="text-slate-800/60">&bull;</div>
          <div>
            <span className="text-slate-600">Active Units:</span>{" "}
            <span className="text-slate-400 font-bold">1,024 Districts &amp; Commands</span>
          </div>
          <div className="text-slate-800/60">&bull;</div>
          <div>
            <span className="text-slate-600">AI Intelligence Core:</span>{" "}
            <span className="text-blue-400 font-bold">QuickML (ONLINE)</span>
          </div>
          <div className="ml-auto text-[9px] text-slate-700 font-mono">
            LAST SYNC HANDSHAKE: 2026-07-17 14:26:00 IST
          </div>
        </div>
      </div>

      {/* ── 2. Main Grid: Left content + Right sidebar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-8 items-start">

        {/* LEFT: Primary intelligence content */}
        <div className="flex flex-col gap-8 min-w-0">

          {/* KPI Cards */}
          <div className="animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <StatGrid metrics={kpi_metrics} />
          </div>

          {/* Chart Row: Trend (2/3) + Category (1/3) */}
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <div className="lg:col-span-2">
              <TrendChart data={crime_trends} />
            </div>
            <div className="lg:col-span-1">
              <CrimeCategoryChart data={crime_distribution} />
            </div>
          </div>

          {/* Critical Cases Feed */}
          <div className="animate-fade-in-up" style={{ animationDelay: '180ms' }}>
            <RecentCriticalCases cases={recent_critical_cases} />
          </div>
        </div>

        {/* RIGHT: Intelligence sidebar */}
        <div className="flex flex-col gap-6 xl:sticky xl:top-10 xl:self-start animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <KarnatakaOverviewPanel />
          <AIInsightsBanner />
        </div>
      </div>

      {/* ── 3. Command Console (full width below grid) ── */}
      <div className="animate-fade-in-up" style={{ animationDelay: '220ms' }}>
        <QuickActionsPanel />
      </div>

    </div>
  );
};

export default Dashboard;