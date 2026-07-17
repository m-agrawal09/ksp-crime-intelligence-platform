import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import OfficerHeader from "../../components/officers/OfficerHeader";
import OfficerKpis from "../../components/officers/OfficerKpis";
import OfficerCharts from "../../components/officers/OfficerCharts";
import OfficerTimeline from "../../components/officers/OfficerTimeline";
import OfficerWorkload from "../../components/officers/OfficerWorkload";
import OfficerSummary from "../../components/officers/OfficerSummary";
import { officerService } from "../../services/officerService";

const Officers = () => {
  const [officerList, setOfficerList] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState("");
  const [profile, setProfile] = useState(null);

  // Load officer options on mount
  useEffect(() => {
    const list = officerService.getOfficers();
    setOfficerList(list);
    if (list.length > 0) {
      setSelectedBadge(list[0].badgeNumber);
    }
  }, []);

  // Sync profile when selected officer changes
  useEffect(() => {
    if (selectedBadge) {
      const data = officerService.getOfficerProfile(selectedBadge);
      setProfile(data);
    }
  }, [selectedBadge]);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] font-mono text-xs text-slate-500">
        <div className="relative mb-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-800 border-t-blue-500" />
        </div>
        <div className="animate-pulse tracking-widest uppercase">
          Querying KSP Officer Dossier Master records...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Title Header */}
      <PageHeader
        title="Officer Performance Center"
        subtitle="Operational evaluation of investigation case logs, trial schedules, and resolution metrics"
      />

      {/* 1. Officer Dossier Profile & Selector */}
      <OfficerHeader
        profile={profile}
        officerList={officerList}
        onOfficerChange={setSelectedBadge}
      />

      {/* 2. Key Operational Performance Metrics */}
      <OfficerKpis kpis={profile.kpis} />

      {/* 3. Case Resolutions Trends & Category Breakdown */}
      <OfficerCharts
        monthlyTrend={profile.monthlyTrend}
        categoryDistribution={profile.categoryDistribution}
      />

      {/* 4. Timeline, Workload, & Evaluation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline of Investigation lifecycle */}
        <OfficerTimeline timeline={profile.timeline} />

        {/* Current cases, pending, and court dockets */}
        <OfficerWorkload workload={profile.workload} />

        {/* Intelligence summary evaluation */}
        <OfficerSummary summary={profile.summary} />
        
      </div>
    </div>
  );
};

export default Officers;
