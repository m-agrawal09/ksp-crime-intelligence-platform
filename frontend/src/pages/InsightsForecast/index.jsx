import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import ConversationSidebar from "../../components/assistant/ConversationSidebar";
import AssistantHeader from "../../components/assistant/AssistantHeader";
import SuggestedPrompts from "../../components/assistant/SuggestedPrompts";
import ChatWindow from "../../components/assistant/ChatWindow";
import ChatInput from "../../components/assistant/ChatInput";
import ContextPanel from "../../components/assistant/ContextPanel";
import TrendChart from "../../components/dashboard/TrendChart";
import CrimeCategoryChart from "../../components/dashboard/CrimeCategoryChart";
import AIAlertsList from "../../components/dashboard/AIAlertsList";
import StatCard from "../../components/dashboard/StatCard";
import PredictiveForecastingCard from "../../components/dashboard/PredictiveForecastingCard";
import Loader from "../../components/common/Loader";
import { assistantService } from "../../services/assistantService";
import { fetchDashboardData } from "../../services/dashboardService";
import { RiBrainLine, RiRobot2Line, RiAlertLine } from "react-icons/ri";
import { TbChartLine } from "react-icons/tb";
import { FaBrain, FaGavel, FaSearch, FaExclamationTriangle } from "react-icons/fa";

const InsightsForecast = () => {
  const [activeTab, setActiveTab] = useState("copilot"); // "copilot" | "forecast" | "alerts"
  
  // Chat Copilot State
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [recentQueries, setRecentQueries] = useState([
    "Query total cases in Bengaluru",
    "ACP Rajeshwari Dossier Run",
    "Identify AePS fraud signatures"
  ]);

  // Dashboard / Forecast Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Load Copilot Sessions
    const list = assistantService.getSessions();
    setSessions(list);
    if (list.length > 0) {
      setActiveSessionId(list[0].id);
      setMessages(assistantService.getSessionMessages(list[0].id));
    }

    // Load Dashboard & Forecast Data
    fetchDashboardData().then((res) => {
      if (res && res.data) {
        setDashboardData(res.data);
      }
      setLoadingData(false);
    });
  }, []);

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setMessages(assistantService.getSessionMessages(id));
  };

  const handleNewSession = () => {
    const newId = `session-temp-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Intelligence Session",
      timestamp: "Just now",
      status: "active"
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setMessages([]);
  };

  const handleSend = async (text) => {
    const userMsg = { sender: "officer", text };
    setMessages((prev) => [...prev, userMsg]);
    setRecentQueries((prev) => [text, ...prev].slice(0, 10));
    setIsTyping(true);

    try {
      const replyText = await assistantService.queryAssistant(text);
      const aiMsg = { sender: "assistant", text: replyText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = { sender: "assistant", text: "Error: Failed to process natural language request." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Title Header */}
      <PageHeader
        title="AI Insights & Forecast"
        subtitle="Operational natural language search, automated threat anomaly alerts, and QuickML predictive trend forecasting"
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 p-1.5 border border-slate-800">
          <button
            onClick={() => setActiveTab("copilot")}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
              activeTab === "copilot"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <RiRobot2Line className="text-base" />
            <span>AI Copilot & Search</span>
          </button>

          <button
            onClick={() => setActiveTab("forecast")}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
              activeTab === "forecast"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <TbChartLine className="text-base" />
            <span>Predictive Trend Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
              activeTab === "alerts"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <RiAlertLine className="text-base" />
            <span>AI Anomaly Alerts</span>
            {dashboardData?.ai_alerts?.length > 0 && (
              <span className="ml-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-300 border border-rose-500/30 font-bold">
                {dashboardData.ai_alerts.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <RiBrainLine className="text-purple-400 text-base animate-pulse" />
          <span>QuickML Engine v4.2 Active</span>
        </div>
      </div>

      {/* Tab 1: AI Copilot & Natural Language Search */}
      {activeTab === "copilot" && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-stretch">
          {/* Left Column: Sessions History */}
          <div className="md:col-span-1 lg:col-span-1">
            <ConversationSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
            />
          </div>

          {/* Center Panel: Main AI Copilot Workspace */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-5">
            <AssistantHeader />
            <ChatWindow messages={messages} isTyping={isTyping} />
            {messages.length === 0 && (
              <SuggestedPrompts onPromptClick={handleSend} />
            )}
            <ChatInput onSend={handleSend} onClear={handleClear} disabled={isTyping} />
          </div>

          {/* Right Column: Context Panel */}
          <div className="md:col-span-1 lg:col-span-1">
            <ContextPanel recentQueries={recentQueries} />
          </div>
        </div>
      )}

      {/* Tab 2: Predictive Analytics & Trend Forecast */}
      {activeTab === "forecast" && (
        <div className="space-y-6">
          {loadingData ? (
            <Loader message="Loading QuickML Time-Series Predictive Models..." />
          ) : (
            <>
              {/* QuickML Forecast KPI Summary Cards */}
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
                  dataSource="ChargesheetDetails ML Model"
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

              {/* Dynamic Spatio-Temporal Predictive Risk & Patrol Advisory Card */}
              <PredictiveForecastingCard />

              {/* Forecast Charts Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <TrendChart data={dashboardData?.crime_trends || []} />
                </div>
                <div className="lg:col-span-1">
                  <CrimeCategoryChart data={dashboardData?.crime_distribution || []} />
                </div>
              </div>

              {/* Predictive Summary Banner */}
              <div className="rounded-xl border border-purple-900/50 bg-slate-900/80 p-6 backdrop-blur-md">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <RiBrainLine className="text-base" /> QuickML Time-Series Forecasting Intelligence
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 font-sans">
                  The QuickML predictive analytics engine correlates multi-year CCTNS <code className="text-purple-300">CaseMaster</code> timestamps with geographic unit boundaries (<code className="text-purple-300">UnitID</code>). Based on seasonal variance and repeat Offence Section spikes, property theft incidents in urban police ranges are projected to rise over upcoming weekends. Tactical deployment recommendations have been dispatched to precinct shift supervisors.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 3: AI Threat Anomaly Alerts */}
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
