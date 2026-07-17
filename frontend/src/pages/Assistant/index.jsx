import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import ConversationSidebar from "../../components/assistant/ConversationSidebar";
import AssistantHeader from "../../components/assistant/AssistantHeader";
import SuggestedPrompts from "../../components/assistant/SuggestedPrompts";
import ChatWindow from "../../components/assistant/ChatWindow";
import ChatInput from "../../components/assistant/ChatInput";
import ContextPanel from "../../components/assistant/ContextPanel";
import { assistantService } from "../../services/assistantService";

const Assistant = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [recentQueries, setRecentQueries] = useState([
    "Query total cases in Bengaluru",
    "ACP Rajeshwari Dossier Run",
    "Identify AePS fraud signatures"
  ]);

  // Load sessions on mount
  useEffect(() => {
    const list = assistantService.getSessions();
    setSessions(list);
    if (list.length > 0) {
      setActiveSessionId(list[0].id);
      setMessages(assistantService.getSessionMessages(list[0].id));
    }
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
    // 1. Append user message
    const userMsg = { sender: "officer", text };
    setMessages((prev) => [...prev, userMsg]);
    
    // 2. Add to query log
    setRecentQueries((prev) => [text, ...prev].slice(0, 10));
    
    // 3. Trigger loader
    setIsTyping(true);

    try {
      // 4. Query service mock
      const replyText = await assistantService.queryAssistant(text);
      
      // 5. Append AI message
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
        title="AI Intelligence Workspace"
        subtitle="Operational natural language search, CCTNS record compilation, and threat forecasting briefs"
      />

      {/* Three Column Copilot Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* Left Column: Sessions History (1 col span) */}
        <div className="md:col-span-1 lg:col-span-1">
          <ConversationSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
          />
        </div>

        {/* Center Panel: Main AI Copilot Workspace (2 col spans in md, 3 in lg) */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-5">
          {/* Main Welcome Header banner */}
          <AssistantHeader />

          {/* Chat Flow Zone */}
          <ChatWindow messages={messages} isTyping={isTyping} />

          {/* Suggestions prompt helper (only visible if chat workspace is empty) */}
          {messages.length === 0 && (
            <SuggestedPrompts onPromptClick={handleSend} />
          )}

          {/* Interactive Chat Prompt Input */}
          <ChatInput onSend={handleSend} onClear={handleClear} disabled={isTyping} />
        </div>

        {/* Right Column: AI Context Panel (1 col span) */}
        <div className="md:col-span-1 lg:col-span-1">
          <ContextPanel recentQueries={recentQueries} />
        </div>

      </div>
    </div>
  );
};

export default Assistant;
