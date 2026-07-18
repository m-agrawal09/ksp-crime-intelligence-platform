// Mock Officer Dossier Service for KSP Command Center

const officersDatabase = {
  "KSP-8821": {
    badgeNumber: "KSP-8821",
    name: "Ramesh Gowda",
    rank: "PSI (Police Sub-Inspector)",
    unit: "Koramangala Police Station",
    station: "Bengaluru City Range",
    yearsOfService: 7,
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop",
    kpis: {
      totalCases: 94,
      activeCases: 12,
      closedCases: 82,
      chargesheetRate: 86,
      avgInvestigationTime: 28,
      detectionRate: 91
    },
    categoryDistribution: [
      { name: "Property Offences", value: 48, color: "#3b82f6" },
      { name: "Cyber Crimes", value: 24, color: "#a855f7" },
      { name: "Financial Fraud", value: 14, color: "#f59e0b font-bold" },
      { name: "Body Offences", value: 8, color: "#f43f5e" }
    ],
    monthlyTrend: [
      { month: "Jan", assigned: 10, resolved: 9 },
      { month: "Feb", assigned: 12, resolved: 11 },
      { month: "Mar", assigned: 8, resolved: 9 },
      { month: "Apr", assigned: 14, resolved: 12 },
      { month: "May", assigned: 11, resolved: 10 },
      { month: "Jun", assigned: 16, resolved: 14 }
    ],
    timeline: [
      { stage: "Case Assigned", date: "2026-07-02", desc: "Commercial burglary Case CCTNS/2026/0244 allocated.", status: "completed" },
      { stage: "Investigation Started", date: "2026-07-04", desc: "CCTV surveillance footage collected from site.", status: "completed" },
      { stage: "Suspect Detained", date: "2026-07-12", desc: "Primary suspect detained in Koramangala.", status: "completed" }
    ],
    workload: {
      highPriority: [
        { caseNo: "CR-2026-0244", title: "Commercial Electronics Burglary", status: "Under Investigation", date: "2026-07-17" }
      ],
      pending: [
        { caseNo: "CR-2026-0312", title: "Vehicle Theft Indiranagar", status: "CCTV Scan Active" }
      ],
      hearings: [
        { docketNo: "DK-2026-088", court: "ACMM Court 4, Bengaluru", date: "2026-07-25", time: "10:30 AM" }
      ],
      recent: [
        { caseNo: "CR-2026-0244", title: "Warehouse Break-in", assigned: "Yesterday" }
      ]
    },
    summary: {
      strongArea: "Property Crime Investigation & Patrol Tracking",
      workloadStatus: "Optimal",
      rating: "4.8 / 5.0",
      aiRecommendation: "Excellent record in rapid recovery of stolen commercial property.",
      lastUpdated: "2026-07-18 20:00 IST"
    }
  },
  "KSP-2015-ACP88": {
    badgeNumber: "KSP-2015-ACP88",
    name: "ACP Rajeshwari N.",
    rank: "Assistant Commissioner of Police",
    unit: "Cyber Crime Division",
    station: "Bengaluru City HQ",
    yearsOfService: 11,
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop",
    kpis: {
      totalCases: 142,
      activeCases: 18,
      closedCases: 124,
      chargesheetRate: 88,
      avgInvestigationTime: 32,
      detectionRate: 92
    },
    categoryDistribution: [
      { name: "Cyber Crimes", value: 78, color: "#a855f7" },
      { name: "Financial Fraud", value: 44, color: "#f59e0b" },
      { name: "Property Offences", value: 12, color: "#3b82f6" },
      { name: "Crimes Against Women", value: 8, color: "#ec4899" }
    ],
    monthlyTrend: [
      { month: "Jan", assigned: 14, resolved: 12 },
      { month: "Feb", assigned: 16, resolved: 15 },
      { month: "Mar", assigned: 12, resolved: 14 },
      { month: "Apr", assigned: 18, resolved: 16 },
      { month: "May", assigned: 15, resolved: 13 },
      { month: "Jun", assigned: 20, resolved: 18 }
    ],
    timeline: [
      { stage: "Case Assigned", date: "2026-06-01", desc: "Cyber fraud incident MasterCase CCTNS/2026/1024 allocated.", status: "completed" },
      { stage: "Investigation Started", date: "2026-06-03", desc: "Digital forensic logs extracted from victim portal.", status: "completed" },
      { stage: "Evidence Collected", date: "2026-06-10", desc: "Server IP addresses traced back to inter-state proxy servers.", status: "completed" },
      { stage: "Arrest Made", date: "2026-06-18", desc: "Accused detrained at transit checkpoint by field operatives.", status: "completed" },
      { stage: "Charge-sheet Filed", date: "2026-06-25", desc: "IIF-5 chargesheet submitted to Cyber Crimes Court.", status: "completed" },
      { stage: "Case Closed", date: "2026-07-02", desc: "Final report approved and filed under judicial custody.", status: "completed" }
    ],
    workload: {
      highPriority: [
        { caseNo: "CR-CYB-2026-094", title: "Ransomware Attack on Regional Medical Grid", status: "Critical Path", date: "2026-07-10" },
        { caseNo: "CR-CYB-2026-102", title: "M-Commerce Bank API Skimming", status: "Under Review", date: "2026-07-12" }
      ],
      pending: [
        { caseNo: "CR-CYB-2026-061", title: "Identify Theft and Phishing Raid", status: "Awaiting Log Analysis" },
        { caseNo: "CR-CYB-2026-088", title: "Corporate Data Exfiltration Threat", status: "Subpoena Issued" }
      ],
      hearings: [
        { docketNo: "DK-CYB-2026-442", court: "Fast Track Cyber Court 2, Bengaluru", date: "2026-07-22", time: "11:00 AM" },
        { docketNo: "DK-CYB-2026-190", court: "Sessions Court 6, Bengaluru", date: "2026-07-29", time: "02:30 PM" }
      ],
      recent: [
        { caseNo: "CR-CYB-2026-118", title: "SIM Swap Scam Targeting Senior Citizens", assigned: "2 days ago" },
        { caseNo: "CR-CYB-2026-120", title: "Unauthorized Ledger Manipulation Audit", assigned: "4 days ago" }
      ]
    },
    summary: {
      strongArea: "Digital Cryptography & Corporate Fraud",
      workloadStatus: "Optimal",
      rating: "4.9 / 5.0",
      aiRecommendation: "Dossier matches profile for Lead Forensic Coordinator. Excellent resolution rates in multi-district financial investigations.",
      lastUpdated: "2026-07-17 18:30 IST"
    }
  },
  "KSP-2010-IN74": {
    badgeNumber: "KSP-2010-IN74",
    name: "Insp. Ravi Kumar",
    rank: "Police Inspector",
    unit: "Narcotics Control Bureau",
    station: "Mangaluru City PS 1",
    yearsOfService: 16,
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
    kpis: {
      totalCases: 198,
      activeCases: 32,
      closedCases: 166,
      chargesheetRate: 84,
      avgInvestigationTime: 45,
      detectionRate: 89
    },
    categoryDistribution: [
      { name: "Narcotics", value: 114, color: "#10b981" },
      { name: "Body Offences", value: 42, color: "#f43f5e" },
      { name: "Property Offences", value: 28, color: "#3b82f6" },
      { name: "Crimes Against Women", value: 14, color: "#ec4899" }
    ],
    monthlyTrend: [
      { month: "Jan", assigned: 18, resolved: 14 },
      { month: "Feb", assigned: 22, resolved: 19 },
      { month: "Mar", assigned: 15, resolved: 16 },
      { month: "Apr", assigned: 25, resolved: 20 },
      { month: "May", assigned: 20, resolved: 22 },
      { month: "Jun", assigned: 28, resolved: 24 }
    ],
    timeline: [
      { stage: "Case Assigned", date: "2026-06-15", desc: "MDMA logistics package intercepted. Allocated under NDPS Act.", status: "completed" },
      { stage: "Investigation Started", date: "2026-06-17", desc: "Courier origin coordinates queried with inter-state units.", status: "completed" },
      { stage: "Evidence Collected", date: "2026-06-22", desc: "Physical evidence weighed, catalogued, and chemical tested.", status: "completed" },
      { stage: "Arrest Made", date: "2026-06-29", desc: "Primary courier network handler detained.", status: "completed" },
      { stage: "Charge-sheet Filed", date: "2026-07-08", desc: "NDPS chargesheet presented to District Court.", status: "completed" },
      { stage: "Case Closed", date: "2026-07-15", desc: "Case transitioned to active judicial trial docket.", status: "completed" }
    ],
    workload: {
      highPriority: [
        { caseNo: "CR-NAR-2026-105", title: "Interstate Synthetics smuggling ring raid", status: "Active Operations", date: "2026-07-14" },
        { caseNo: "CR-NAR-2026-112", title: "Methamphetamine manufacturing lab search", status: "Warrant Issued", date: "2026-07-16" }
      ],
      pending: [
        { caseNo: "CR-NAR-2026-081", title: "Marijuana cultivation surveillance", status: "Drone Scan active" },
        { caseNo: "CR-NAR-2026-095", title: "Retail drug supply logistics trace", status: "Awaiting Custody Order" }
      ],
      hearings: [
        { docketNo: "DK-NAR-2026-312", court: "District NDPS Court, Mangaluru", date: "2026-07-21", time: "10:30 AM" },
        { docketNo: "DK-NAR-2026-204", court: "High Court, Bengaluru Branch", date: "2026-08-04", time: "11:30 AM" }
      ],
      recent: [
        { caseNo: "CR-NAR-2026-121", title: "Cocaine distribution ring arrest", assigned: "1 day ago" },
        { caseNo: "CR-NAR-2026-125", title: "Transit hub baggage seizure", assigned: "3 days ago" }
      ]
    },
    summary: {
      strongArea: "Inter-State Smuggling & Raid Execution",
      workloadStatus: "High Load",
      rating: "4.7 / 5.0",
      aiRecommendation: "Highly suited for field raid coordination. Recommending additional support staff to handle the heavy NDPS case backlog.",
      lastUpdated: "2026-07-17 19:12 IST"
    }
  },
  "KSP-2008-DSP11": {
    badgeNumber: "KSP-2008-DSP11",
    name: "DySP Sharanappa K.",
    rank: "Deputy Superintendent of Police",
    unit: "Financial Crime & Fraud Unit",
    station: "Belagavi Division",
    yearsOfService: 18,
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop",
    kpis: {
      totalCases: 215,
      activeCases: 14,
      closedCases: 201,
      chargesheetRate: 93,
      avgInvestigationTime: 52,
      detectionRate: 95
    },
    categoryDistribution: [
      { name: "Financial Fraud", value: 132, color: "#f59e0b" },
      { name: "Property Offences", value: 45, color: "#3b82f6" },
      { name: "Body Offences", value: 24, color: "#f43f5e" },
      { name: "Cyber Crimes", value: 14, color: "#a855f7" }
    ],
    monthlyTrend: [
      { month: "Jan", assigned: 10, resolved: 8 },
      { month: "Feb", assigned: 12, resolved: 11 },
      { month: "Mar", assigned: 8, resolved: 10 },
      { month: "Apr", assigned: 15, resolved: 12 },
      { month: "May", assigned: 14, resolved: 15 },
      { month: "Jun", assigned: 18, resolved: 16 }
    ],
    timeline: [
      { stage: "Case Assigned", date: "2026-05-10", desc: "Real estate shell company investment fraud allocated.", status: "completed" },
      { stage: "Investigation Started", date: "2026-05-15", desc: "Bank accounts and GSTIN registrations audited.", status: "completed" },
      { stage: "Evidence Collected", date: "2026-05-28", desc: "Forged signatures and fake billing ledgers recovered.", status: "completed" },
      { stage: "Arrest Made", date: "2026-06-12", desc: "Promoters detained at airport trying to flee.", status: "completed" },
      { stage: "Charge-sheet Filed", date: "2026-06-30", desc: "IIF-1 & IIF-5 report submitted to Special Economic Offences Court.", status: "completed" },
      { stage: "Case Closed", date: "2026-07-10", desc: "Judicial assets frozen and case assigned to trial.", status: "completed" }
    ],
    workload: {
      highPriority: [
        { caseNo: "CR-FRD-2026-081", title: "Cooperative Society Embezzlement Audit", status: "Audit Underway", date: "2026-07-05" },
        { caseNo: "CR-FRD-2026-092", title: "Fake Stamp Duty Document Network", status: "Forensics pending", date: "2026-07-08" }
      ],
      pending: [
        { caseNo: "CR-FRD-2026-042", title: "GST Input Tax Credit fraud scan", status: "Awaiting Tax Reports" },
        { caseNo: "CR-FRD-2026-070", title: "Agricultural Subsidy Forgery", status: "Affidavits complete" }
      ],
      hearings: [
        { docketNo: "DK-FRD-2026-118", court: "Special Court for Economic Offences, Belagavi", date: "2026-07-24", time: "11:30 AM" },
        { docketNo: "DK-FRD-2026-054", court: "Sessions Court 2, Belagavi", date: "2026-08-12", time: "03:00 PM" }
      ],
      recent: [
        { caseNo: "CR-FRD-2026-104", title: "Ponzi scheme franchise fraud", assigned: "3 days ago" },
        { caseNo: "CR-FRD-2026-108", title: "Corporate signature forgery trail", assigned: "5 days ago" }
      ]
    },
    summary: {
      strongArea: "Economic Auditing & Corporate Fraud",
      workloadStatus: "Optimal",
      rating: "4.9 / 5.0",
      aiRecommendation: "Highly skilled in forensic auditing and financial tracing. Recommend for high-profile banking investigations.",
      lastUpdated: "2026-07-17 17:45 IST"
    }
  }
};

const OFFICERS_STORAGE_KEY = "ksp_custom_officers_v1";

const loadCustomOfficers = () => {
  try {
    const raw = localStorage.getItem(OFFICERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
};

const saveCustomOfficers = (customMap) => {
  try {
    localStorage.setItem(OFFICERS_STORAGE_KEY, JSON.stringify(customMap));
  } catch (err) {
    console.error("Failed saving custom officers:", err);
  }
};

import { recordService } from "./recordService";

const getAuthUserByBadgeOrName = (badgeNumber, name) => {
  try {
    const raw = localStorage.getItem("ksp_auth_users_v2");
    if (!raw) return null;
    const users = JSON.parse(raw);
    return users.find(
      (u) =>
        u.badge === badgeNumber ||
        u.kgid === badgeNumber ||
        (u.name && name && u.name.toLowerCase().trim() === name.toLowerCase().trim())
    );
  } catch (err) {
    return null;
  }
};

export const officerService = {
  getOfficers: () => {
    const customMap = loadCustomOfficers();
    const mergedMap = { ...officersDatabase, ...customMap };
    
    return Object.keys(mergedMap).map(key => {
      const authUser = getAuthUserByBadgeOrName(key, mergedMap[key].name);
      return {
        badgeNumber: key,
        name: authUser?.name || mergedMap[key].name,
        rank: authUser?.rank || mergedMap[key].rank,
        unit: authUser?.unit || mergedMap[key].unit,
        avatar: authUser?.avatar || mergedMap[key].avatar
      };
    });
  },
  
  getOfficerProfile: (badgeNumber) => {
    const customMap = loadCustomOfficers();
    const mergedMap = { ...officersDatabase, ...customMap };
    const base = mergedMap[badgeNumber];
    if (!base) return null;

    // Sync avatar & user edits from auth database
    const authUser = getAuthUserByBadgeOrName(badgeNumber, base.name);
    const updatedAvatar = authUser?.avatar || base.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop";
    const updatedName = authUser?.name || base.name;
    const updatedUnit = authUser?.unit || base.unit;
    const updatedRank = authUser?.rank || base.rank;

    // Merge live dynamic analytics from recordService
    const liveStats = recordService.getOfficerAnalytics(updatedName);

    return {
      ...base,
      name: updatedName,
      unit: updatedUnit,
      rank: updatedRank,
      avatar: updatedAvatar,
      kpis: {
        ...base.kpis,
        totalCases: liveStats.totalCases,
        activeCases: liveStats.activeCases,
        closedCases: liveStats.closedCases,
        chargesheetRate: liveStats.chargesheetRate,
        detectionRate: Math.min(98, liveStats.chargesheetRate + 5)
      },
      workload: {
        ...base.workload,
        highPriority: liveStats.highPriority.length > 0 ? liveStats.highPriority : base.workload.highPriority,
        pending: liveStats.pending.length > 0 ? liveStats.pending : base.workload.pending,
        recent: liveStats.recent.length > 0 ? liveStats.recent : base.workload.recent
      }
    };
  },

  addOfficer: (officerData) => {
    const { name, rank, badgeNumber, unit, station, yearsOfService, specialArea, username, password, avatar } = officerData;
    const badgeKey = badgeNumber || `KSP-2026-${Date.now().toString().slice(-4)}`;
    
    const newProfile = {
      badgeNumber: badgeKey,
      name,
      rank: rank || "Police Inspector",
      unit: unit || "General Crime Unit",
      station: station || "Bengaluru Range",
      yearsOfService: Number(yearsOfService) || 5,
      status: "On Duty",
      avatar: avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop",
      username: username || "",
      kpis: {
        totalCases: 24,
        activeCases: 6,
        closedCases: 18,
        chargesheetRate: 85,
        avgInvestigationTime: 35,
        detectionRate: 90
      },
      categoryDistribution: [
        { name: "Property Offences", value: 12, color: "#3b82f6" },
        { name: "Cyber Crimes", value: 8, color: "#a855f7" },
        { name: "Financial Fraud", value: 4, color: "#f59e0b" }
      ],
      monthlyTrend: [
        { month: "Jan", assigned: 4, resolved: 3 },
        { month: "Feb", assigned: 5, resolved: 4 },
        { month: "Mar", assigned: 3, resolved: 4 },
        { month: "Apr", assigned: 6, resolved: 5 },
        { month: "May", assigned: 4, resolved: 4 },
        { month: "Jun", assigned: 5, resolved: 4 }
      ],
      timeline: [
        { stage: "Officer Onboarded", date: new Date().toISOString().split("T")[0], desc: `Officer registered into CCTNS active duty roster by Admin.`, status: "completed" }
      ],
      workload: {
        highPriority: [
          { caseNo: "CR-2026-001", title: "Active Jurisdiction CCTNS Monitoring", status: "Active", date: "Today" }
        ],
        pending: [],
        hearings: [],
        recent: []
      },
      summary: {
        strongArea: specialArea || "Field Investigation & Case Tracking",
        workloadStatus: "Optimal",
        rating: "5.0 / 5.0",
        aiRecommendation: "Dossier initialized. Active for case assignments.",
        lastUpdated: "Just now"
      }
    };

    const customMap = loadCustomOfficers();
    customMap[badgeKey] = newProfile;
    saveCustomOfficers(customMap);

    return newProfile;
  },

  getOfficerOfTheMonth: () => {
    const customMap = loadCustomOfficers();
    const mergedMap = { ...officersDatabase, ...customMap };
    const list = Object.keys(mergedMap);
    if (!list || list.length === 0) return null;

    let bestOfficer = null;
    let maxScore = -1;

    list.forEach((badge) => {
      const prof = officerService.getOfficerProfile(badge);
      if (!prof) return;

      const closed = prof.kpis?.closedCases || 0;
      const rate = prof.kpis?.chargesheetRate || 0;
      const score = closed * 2 + rate * 1.5;

      if (score > maxScore) {
        maxScore = score;
        bestOfficer = {
          badgeNumber: prof.badgeNumber,
          name: prof.name,
          rank: prof.rank,
          unit: prof.unit,
          station: prof.station || "Karnataka Police HQ",
          yearsOfService: prof.yearsOfService || 10,
          avatar: prof.avatar,
          casesSolvedMonth: Math.max(12, Math.round(closed / 5) + 4),
          totalCasesClosed: closed,
          clearanceRate: rate,
          detectionRate: prof.kpis?.detectionRate || 92,
          specialArea: prof.summary?.strongArea || "Field Operations & Investigation",
          commendation: "Awarded Director General's Honor Star for highest case resolution and investigation efficiency in previous month."
        };
      }
    });

    return bestOfficer;
  }
};
