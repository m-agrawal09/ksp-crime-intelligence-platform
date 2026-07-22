import React, { useState, useEffect } from "react";
import ConversationSidebar from "../../components/assistant/ConversationSidebar";
import SuggestedPrompts from "../../components/assistant/SuggestedPrompts";
import ChatWindow from "../../components/assistant/ChatWindow";
import ChatInput from "../../components/assistant/ChatInput";
import TrendChart from "../../components/dashboard/TrendChart";
import CrimeCategoryChart from "../../components/dashboard/CrimeCategoryChart";
import AIAlertsList from "../../components/dashboard/AIAlertsList";
import StatCard from "../../components/dashboard/StatCard";
import PredictiveForecastingCard from "../../components/dashboard/PredictiveForecastingCard";
import Loader from "../../components/common/Loader";
import { assistantService } from "../../services/assistantService";
import { fetchDashboardData } from "../../services/dashboardService";
import { RiBrainLine, RiRobot2Line } from "react-icons/ri";
import { TbChartLine } from "react-icons/tb";
import { FaBrain, FaGavel, FaSearch, FaExclamationTriangle, FaHistory, FaRobot } from "react-icons/fa";

const TABS = [
  { id: "copilot", label: "AI Copilot & Search", icon: RiRobot2Line, activeColor: "from-blue-600 to-violet-600" },
  { id: "forecast", label: "Predictive Trend Forecast", icon: TbChartLine, activeColor: "from-violet-600 to-purple-700" },
];

const InsightsForecast = () => {
  const [activeTab, setActiveTab] = useState("copilot");

  // Chat state
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const list = assistantService.getSessions();
    setSessions(list);
    if (list.length > 0) {
      setActiveSessionId(list[0].id);
      setMessages(assistantService.getSessionMessages(list[0].id));
    }
    fetchDashboardData().then((res) => {
      if (res?.data) setDashboardData(res.data);
      setLoadingData(false);
    });
  }, []);

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setMessages(assistantService.getSessionMessages(id));
  };

  const handleNewSession = () => {
    const newId = `session-temp-${Date.now()}`;
    setSessions((prev) => [{ id: newId, title: "New Session", timestamp: "Just now", status: "active" }, ...prev]);
    setActiveSessionId(newId);
    setMessages([]);
  };

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { sender: "officer", text }]);
    setIsTyping(true);
    try {
      const replyText = await assistantService.queryAssistant(text);
      setMessages((prev) => [...prev, { sender: "assistant", text: replyText }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "assistant", text: "Error: Failed to process request." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => setMessages([]);

  return (
    <div className="flex flex-col gap-6" style={{ minHeight: "calc(100vh - 160px)" }}>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5"
        style={{ borderBottom: "1px solid rgba(51,65,85,0.3)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RiBrainLine className="text-purple-400 text-lg animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-purple-400/80 uppercase tracking-widest">
              QuickML Engine v4.2 · Active
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-space tracking-tight">
            AI Insights & Forecast
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Natural language intelligence search, predictive crime forecasting, and automated anomaly detection.
          </p>
        </div>

        {/* Live indicator */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl self-start sm:self-auto"
          style={{
            background: "rgba(34,197,94,0.07)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-semibold">CCTNS Live Connected</span>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex justify-center">
        <div className="flex items-center gap-0 p-1" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(51,65,85,0.3)", borderRadius: 0 }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 px-6 py-3.5 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${isActive ? "text-white shadow-md" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                  }`}
                style={{
                  borderRadius: 0,
                  ...(isActive ? {
                    backgroundImage: `linear-gradient(135deg, ${tab.activeColor.includes("blue") ? "#2563eb" : tab.activeColor.includes("violet") ? "#7c3aed" : "#e11d48"}, ${tab.activeColor.includes("rose") ? "#b91c1c" : "#6d28d9"})`,
                  } : { background: "transparent" })
                }}
              >
                <Icon className="text-base" />
                {tab.label}
                {tab.id === "alerts" && dashboardData?.ai_alerts?.length > 0 && (
                  <span className="ml-1 bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {dashboardData.ai_alerts.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ TAB 1: AI COPILOT ══ */}
      {activeTab === "copilot" && (
        <div
          className="flex flex-1 rounded-2xl overflow-hidden"
          style={{
            height: "calc(100vh - 310px)",
            minHeight: 520,
            border: "1px solid rgba(51,65,85,0.4)",
            background: "rgba(6,13,26,0.8)",
          }}
        >
          {/* Sidebar: Sessions */}
          {sidebarOpen && (
            <div
              className="flex-shrink-0 flex flex-col"
              style={{
                width: 220,
                borderRight: "1px solid rgba(51,65,85,0.3)",
                background: "rgba(10,18,30,0.7)",
              }}
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid rgba(51,65,85,0.25)" }}>
                <div className="flex items-center gap-2">
                  <FaHistory className="text-xs text-slate-500" />
                  <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider">Sessions</span>
                </div>
              </div>

              {/* Sidebar content */}
              <div className="flex-1 overflow-hidden">
                <ConversationSidebar
                  sessions={sessions}
                  activeSessionId={activeSessionId}
                  onSelectSession={handleSelectSession}
                  onNewSession={handleNewSession}
                />
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat top bar */}
            <div
              className="flex items-center justify-between px-5 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(51,65,85,0.25)" }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen((p) => !p)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  title="Toggle session sidebar"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2" width="12" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="6.25" width="12" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{ width: 28, height: 28, background: "linear-gradient(135deg,rgba(37,99,235,0.25),rgba(124,58,237,0.25))", border: "1px solid rgba(37,99,235,0.3)" }}
                  >
                    <FaRobot className="text-xs text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white font-space">KSP AI Copilot</p>
                    <p className="text-[10px] font-mono text-emerald-400">● Online · CCTNS Live</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ChatWindow messages={messages} isTyping={isTyping} />

            {/* Suggested Prompts (shown only when empty) */}
            {messages.length === 0 && (
              <div className="px-5 pb-3 flex-shrink-0">
                <SuggestedPrompts onPromptClick={handleSend} />
              </div>
            )}

            {/* Chat Input */}
            <ChatInput onSend={handleSend} onClear={handleClear} disabled={isTyping} />
          </div>
        </div>
      )}

      {/* ══ TAB 2: PREDICTIVE FORECAST ══ */}
      {activeTab === "forecast" && (
        <div>
          {loadingData ? (
            <Loader message="Loading QuickML Time-Series Predictive Models..." />
          ) : (
            <div className="flex flex-col" style={{ gap: "2rem" }}>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Forecasted Theft Spike"
                  value="+18.4%"
                  change="QuickML Model"
                  icon={FaBrain}
                  color="text-purple-400"
                  borderColor="border-purple-500"
                  dataSource="CaseMaster + UnitID 4108"
                  coverage="Koramangala Police Station"
                  lastSync="QuickML Realtime"
                  subText="Property Theft Spike"
                />
                <StatCard
                  title="Predicted Charge-sheet Rate"
                  value="76.8%"
                  change="+2.6% Projection"
                  icon={FaGavel}
                  color="text-emerald-400"
                  borderColor="border-emerald-500"
                  dataSource="ChargesheetDetails ML"
                  coverage="Judicial Magistrate Courts"
                  lastSync="Daily Batch Run"
                  subText="Final Report Type 'A'"
                />
                <StatCard
                  title="Cyber Fraud Velocity"
                  value="210 / Mo"
                  change="+14.2% MoM Risk"
                  icon={FaSearch}
                  color="text-amber-400"
                  borderColor="border-amber-500"
                  dataSource="ActSection IT Sec 66D"
                  coverage="Bengaluru East Range"
                  lastSync="Hourly Telemetry"
                  subText="AePS Clone Scams"
                />
                <StatCard
                  title="Pattern Anomaly Index"
                  value="HIGH (0.78)"
                  change="3 Active Alerts"
                  icon={FaExclamationTriangle}
                  color="text-rose-400"
                  borderColor="border-rose-500"
                  dataSource="QuickML Anomaly Matrix"
                  coverage="Statewide Alert Grid"
                  lastSync="Live Stream"
                  subText="Correlated Case Clusters"
                />
              </div>

              {/* Executive Forecast Narrative */}
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(37,99,235,0.06) 100%)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-xl"
                    style={{ width: 44, height: 44, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
                  >
                    <RiBrainLine className="text-xl text-purple-400" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest mb-1">
                        Executive Forecast Summary · QuickML Intelligence Report
                      </p>
                      <h3 className="text-base font-bold text-white font-space">
                        Statewide Crime Outlook — Q3 2025
                      </h3>
                    </div>
                    <p className="text-sm text-slate-400 font-inter leading-relaxed">
                      The QuickML predictive analytics engine correlates multi-year CCTNS{" "}
                      <code className="text-purple-300/80 font-mono text-[11px] bg-purple-900/20 px-1 rounded">CaseMaster</code>{" "}
                      timestamps with geographic unit boundaries (
                      <code className="text-purple-300/80 font-mono text-[11px] bg-purple-900/20 px-1 rounded">UnitID</code>
                      ). Based on seasonal variance and repeat Offence Section spikes, property theft incidents in urban
                      police ranges are projected to rise by <strong className="text-white">18.4%</strong> over upcoming weekends.
                      Cyber fraud escalation in Bengaluru East follows an accelerating +14.2% monthly trend driven by AePS
                      cloning operations. Tactical deployment recommendations have been dispatched to precinct shift supervisors.
                    </p>
                    <p className="text-sm text-slate-400 font-inter leading-relaxed">
                      High confidence zones include <strong className="text-white">Koramangala (86% theft probability)</strong>,{" "}
                      <strong className="text-white">Mangaluru Port Zone (narcotics, 61%)</strong>, and{" "}
                      <strong className="text-white">Bengaluru East cyber corridor (74%)</strong>. All predictions are
                      model-generated from{" "}
                      <code className="text-emerald-400 font-mono text-[11px]">{"{"}recordCount{"}"}</code> active FIR records
                      with an 88.4% confidence index across a 12-week forward window.
                    </p>
                  </div>
                </div>
              </div>

              {/* Forecast Intelligence Card (Probabilities + What-Ifs + Threat Zones) */}
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ background: "rgba(8,18,32,0.6)", border: "1px solid rgba(51,65,85,0.35)" }}
              >
                <PredictiveForecastingCard />
              </div>

              {/* Charts Section */}
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TbChartLine className="text-purple-400 text-sm" />
                  Historical Trend Charts · Supporting Forecast Data
                </p>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <TrendChart data={dashboardData?.crime_trends || []} />
                  </div>
                  <div className="lg:col-span-1">
                    <CrimeCategoryChart data={dashboardData?.crime_distribution || []} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ TAB 3: AI ANOMALY ALERTS ══ */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          {loadingData ? (
            <Loader message="Fetching AI Anomaly & Threat Detection Alerts..." />
          ) : (
            <div className="max-w-4xl mx-auto">
              <AIAlertsList alerts={dashboardData?.ai_alerts || []} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightsForecast;
