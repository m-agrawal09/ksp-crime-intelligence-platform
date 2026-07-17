import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import StatGrid from "../../components/dashboard/StatGrid";
import TrendChart from "../../components/dashboard/TrendChart";
import CrimeCategoryChart from "../../components/dashboard/CrimeCategoryChart";
import RecentCriticalCases from "../../components/dashboard/RecentCriticalCases";
import QuickActionsPanel from "../../components/dashboard/QuickActionsPanel";
import { fetchDashboardData } from "../../services/dashboardService";
import { FaSyncAlt } from "react-icons/fa";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDashboardData();
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
    loadData();
  }, []);

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
    <div className="space-y-8 md:space-y-10 lg:space-y-12">
      {/* 1. Header Area */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Executive Intelligence Dashboard"
          subtitle="CCTNS Analytical Console & Automated Modus Operandi Matching"
        />
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-mono text-slate-400 hover:border-slate-700 hover:text-white transition-all self-start md:self-auto"
        >
          <FaSyncAlt className="text-[10px]" />
          Sync Core Master
        </button>
      </div>

      {/* 2. Command-Center Status Strip */}
      <div className="rounded-lg border border-slate-950 bg-slate-950/80 px-4 py-2.5 flex flex-wrap gap-x-6 gap-y-2 items-center text-[10px] font-mono tracking-wider text-slate-500 uppercase">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-bold">System Status:</span>
          <span className="text-emerald-400 font-bold">OPERATIONAL</span>
        </div>

        <div className="hidden sm:block text-slate-700">|</div>

        <div>
          <span className="text-slate-500">Gateway:</span>{" "}
          <span className="text-slate-300 font-bold">CCTNS CAS (Connected)</span>
        </div>

        <div className="hidden sm:block text-slate-700">|</div>

        <div>
          <span className="text-slate-500">Active Jurisdiction:</span>{" "}
          <span className="text-slate-300 font-bold">31 Districts / 1,024 Units</span>
        </div>

        <div className="hidden md:block text-slate-700">|</div>

        <div className="hidden md:block">
          <span className="text-slate-500">AI Engine:</span>{" "}
          <span className="text-blue-400 font-bold">QuickML (Online)</span>
        </div>

        <div className="hidden xl:block text-slate-700">|</div>

        <div className="hidden xl:block ml-auto text-[9px] text-slate-600">
          Last Client Pull: 2026-07-17 14:26:00 IST
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