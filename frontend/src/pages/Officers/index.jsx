import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import OfficerHeader from "../../components/officers/OfficerHeader";
import OfficerFilters from "../../components/officers/OfficerFilters";
import OfficerOfTheMonthCard from "../../components/officers/OfficerOfTheMonthCard";
import OfficerKpis from "../../components/officers/OfficerKpis";
import OfficerCharts from "../../components/officers/OfficerCharts";
import OfficerTimeline from "../../components/officers/OfficerTimeline";
import OfficerWorkload from "../../components/officers/OfficerWorkload";
import OfficerSummary from "../../components/officers/OfficerSummary";
import AddOfficerModal from "../../components/officers/AddOfficerModal";
import { officerService } from "../../services/officerService";
import { recordService } from "../../services/recordService";
import { useAuth } from "../../context/AuthContext";
import { FaUserPlus } from "react-icons/fa";

const Officers = () => {
  const [officerList, setOfficerList] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState("");
  const [profile, setProfile] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    unit: "",
    rank: "",
    minClearance: ""
  });

  const { currentUser, isAdmin, registerOfficer } = useAuth();

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      unit: "",
      rank: "",
      minClearance: ""
    });
  };

  const reloadOfficerList = () => {
    const list = officerService.getOfficers();
    setOfficerList(list);
    return list;
  };

  // Load officer options on mount from online database & restrict based on role
  useEffect(() => {
    const init = async () => {
      await officerService.fetchRemoteOfficers();
      const list = reloadOfficerList();
      if (list.length > 0) {
        if (!isAdmin && currentUser) {
          const match = list.find(
            (o) =>
              o.badgeNumber === currentUser.badge ||
              o.badgeNumber === currentUser.kgid ||
              o.name.toLowerCase().includes(currentUser.name.toLowerCase())
          );
          if (match) {
            setSelectedBadge(match.badgeNumber);
          } else {
            const newProf = await officerService.addOfficer({
              name: currentUser.name,
              rank: currentUser.rank || "Police Inspector",
              badgeNumber: currentUser.badge || currentUser.kgid,
              unit: currentUser.unit || "State Range",
              station: "Karnataka Police Command",
              yearsOfService: "5",
              specialArea: "Field Operations & Cyber Intelligence",
              avatar: currentUser.avatar
            });
            reloadOfficerList();
            setSelectedBadge(newProf.badgeNumber);
          }
        } else if (!selectedBadge) {
          setSelectedBadge(list[0].badgeNumber);
        }
      }
    };
    init();
  }, [isAdmin, currentUser]);

  // Sync profile when selected officer changes
  useEffect(() => {
    if (selectedBadge) {
      const data = officerService.getOfficerProfile(selectedBadge);
      setProfile(data);
    }
  }, [selectedBadge]);

  const handleAddOfficer = async (formData) => {
    // 1. Create officer profile in database (await online Catalyst API POST)
    const newProfile = await officerService.addOfficer(formData);

    // 2. Register officer user account in auth service
    registerOfficer({
      ...formData,
      badge: newProfile.badgeNumber,
      kgid: newProfile.badgeNumber
    });

    // 3. Reload list & select new officer
    reloadOfficerList();
    setSelectedBadge(newProfile.badgeNumber);
  };

  const filteredOfficerList = useMemo(() => {
    return officerList.filter((off) => {
      const prof = officerService.getOfficerProfile(off.badgeNumber);
      if (!prof) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchName = prof.name.toLowerCase().includes(q);
        const matchBadge = prof.badgeNumber.toLowerCase().includes(q);
        if (!matchName && !matchBadge) return false;
      }

      if (filters.unit && !prof.unit.toLowerCase().includes(filters.unit.toLowerCase())) {
        return false;
      }

      if (filters.rank && !prof.rank.toLowerCase().includes(filters.rank.toLowerCase())) {
        return false;
      }

      if (filters.minClearance) {
        const rate = prof.kpis.chargesheetRate || 0;
        if (filters.minClearance === "below80") {
          if (rate >= 80) return false;
        } else {
          if (rate < Number(filters.minClearance)) return false;
        }
      }

      return true;
    });
  }, [officerList, filters]);

  const uniqueRanks = useMemo(() => Array.from(new Set(officerList.map((o) => o.rank).filter(Boolean))), [officerList]);
  const uniqueUnits = useMemo(() => Array.from(new Set(officerList.map((o) => o.unit).filter(Boolean))), [officerList]);
  const officerOfTheMonth = useMemo(() => officerService.getOfficerOfTheMonth(), [officerList]);

  // Keep selectedBadge aligned with filtered list
  useEffect(() => {
    if (filteredOfficerList.length > 0) {
      const exists = filteredOfficerList.some((o) => o.badgeNumber === selectedBadge);
      if (!exists && isAdmin) {
        setSelectedBadge(filteredOfficerList[0].badgeNumber);
      }
    }
  }, [filteredOfficerList, selectedBadge, isAdmin]);

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6">
        <PageHeader
          title="Officer Performance Center"
          subtitle="Operational evaluation of investigation case logs, trial schedules, and resolution metrics"
        />

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-[4px] bg-purple-600 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-purple-500 transition-all self-start md:self-auto active:scale-95 border-none outline-none cursor-pointer"
          >
            <FaUserPlus className="text-base" />
            <span>Add New Officer</span>
          </button>
        )}
      </div>

      {/* Officer of the Month Spotlight Banner */}
      <OfficerOfTheMonthCard officer={officerOfTheMonth} />

      {/* Multi-Criteria Filters Bar (Admin & Officer view) */}
      <OfficerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        ranks={uniqueRanks}
        units={uniqueUnits}
      />

      {/* 1. Officer Dossier Profile & Selector (Merged with KPIs) */}
      <OfficerHeader
        profile={profile}
        officerList={filteredOfficerList}
        onOfficerChange={setSelectedBadge}
        allowSelector={isAdmin}
      />

      {/* 2. Case Resolutions Trends & Category Breakdown with Navy Radial Glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.12)_0%,transparent_75%)] pointer-events-none" />
        <div className="relative z-10">
          <OfficerCharts
            monthlyTrend={profile.monthlyTrend}
            categoryDistribution={profile.categoryDistribution}
          />
        </div>
      </div>

      {/* 4. Timeline, Workload, & Evaluation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline of Investigation lifecycle */}
        <OfficerTimeline timeline={profile.timeline} />

        {/* Current cases, pending, and court dockets */}
        <OfficerWorkload workload={profile.workload} />

        {/* Intelligence summary evaluation */}
        <OfficerSummary summary={profile.summary} />
        
      </div>

      {/* Add New Officer Modal (Admin right) */}
      <AddOfficerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOfficer}
      />
    </div>
  );
};

export default Officers;
