// Mock Report Generator Service for KSP Command Center

const templates = [
  {
    id: "exec_summary",
    title: "Executive Crime Summary",
    desc: "High-level strategic crime overview and threat vector analysis for DG&IGP briefing.",
    icon: "FaFileSignature"
  },
  {
    id: "district_analysis",
    title: "District Crime Analysis",
    desc: "Geospatial incident statistics, hotspot evaluations, and jurisdictional case trends.",
    icon: "FaMapMarkedAlt"
  },
  {
    id: "officer_dossier",
    title: "Officer Performance Report",
    desc: "Dossier auditing case closure success, average detection times, and workload counts.",
    icon: "FaUserTie"
  },
  {
    id: "investigation_brief",
    title: "Investigation Dossier",
    desc: "Detailed life-cycle summary of specific critical CCTNS CaseMaster records.",
    icon: "FaFolderOpen"
  },
  {
    id: "fir_summary",
    title: "FIR Summary",
    desc: "Aggregated overview of newly registered cognizable and non-cognizable offences.",
    icon: "FaClipboardList"
  },
  {
    id: "trend_analysis",
    title: "Crime Trend Analysis",
    desc: "Time-series monthly fluctuations, forecasting models, and MO match alerts.",
    icon: "FaChartLine"
  },
  {
    id: "monthly_brief",
    title: "Monthly Intelligence Brief",
    desc: "Comprehensive monthly audit highlighting threat vectors and tactical advisories.",
    icon: "FaCalendarAlt"
  }
];

const mockRecentReports = [
  { id: "rep-101", title: "Bengaluru_Cyber_Briefing_Q2.pdf", date: "2026-07-17 14:15", size: "1.4 MB", type: "PDF" },
  { id: "rep-102", title: "NDPS_Mangaluru_Raid_Dossier.xlsx", date: "2026-07-16 11:22", size: "842 KB", type: "EXCEL" },
  { id: "rep-103", title: "Officer_Performance_Audit_Belagavi.pdf", date: "2026-07-15 09:30", size: "2.1 MB", type: "PDF" },
  { id: "rep-104", title: "Karnataka_Annual_FIR_Summary.xlsx", date: "2026-07-14 17:45", size: "4.8 MB", type: "EXCEL" }
];

const generateReportContent = (templateId, config) => {
  const districtName = config.district || "STATE OF KARNATAKA (ALL ZONES)";
  const category = config.category || "ALL CRIME CLASSIFICATIONS";
  const officerName = config.officerName || "ALL DISTRICT PERSONNEL";
  const scope = config.scope || "Detailed";
  const priority = config.priority || "Routine";
  const dateRange = `${config.startDate || "2026-01-01"} TO ${config.endDate || "2026-07-17"}`;

  // Build dynamic content blocks depending on selected template
  switch (templateId) {
    case "exec_summary":
      return {
        title: "EXECUTIVE CRIME SUMMARY",
        subtitle: `STRATEGIC ANOMALY BRIEFING FOR ${districtName.toUpperCase()}`,
        classification: priority === "Critical" ? "SECRET / MOST IMMEDIATE" : "RESTRICTED",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        meta: {
          district: districtName,
          category,
          officer: officerName,
          dateRange,
          scope,
          priority
        },
        summary: `This intelligence document provides an aggregated threat vector overview for ${districtName}. Specifically targeting ${category} between ${dateRange}, audit logs indicate localized variance. Under active command of ${officerName}, case detection averages continue to align with state guidelines.`,
        kpis: [
          { label: "TOTAL ASSIGNED FIRs", value: "14,832" },
          { label: "UNDER ACTIVE INTAKE", value: "1,482" },
          { label: "CHARGE-SHEET RATE", value: "78.2%" }
        ],
        findings: [
          `Spike in registered ${category} complaints noticed in high-density commercial hubs within ${districtName}.`,
          "Digital forensics indicates proxy routing setups originating from interstate borders.",
          "Coordination with local ISP grids confirms IP location nodes are being spoofed."
        ],
        recommendations: [
          "Deploy 4 additional cyber forensic specialists to the primary incident divisions.",
          "Authorize immediate freeze of transaction assets tied to flagged ledger IDs.",
          "Initiate joint border agency patrols under the IT Act framework."
        ]
      };

    case "district_analysis":
      return {
        title: "DISTRICT CRIME ANALYSIS",
        subtitle: `GEOSPATIAL DENSITY AUDIT - ${districtName.toUpperCase()}`,
        classification: "RESTRICTED",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        meta: {
          district: districtName,
          category,
          officer: "N/A - GEOSPATIAL AUDIT",
          dateRange,
          scope,
          priority
        },
        summary: `Geospatial evaluation of crime incident clusters inside ${districtName}. Our GIS tracking identifies three active hotspots showing increased registered counts under ${category}.`,
        kpis: [
          { label: "HOTSPOT CLUSTERS", value: "3 Divisions" },
          { label: "TOTAL SPATIAL CASES", value: "642" },
          { label: "ACTIVE JURISDICTION", value: "31 Districts" }
        ],
        findings: [
          `Bengaluru Central division shows a 14% elevated threat density for ${category}.`,
          "Incident distribution correlates with urban migration and high commuter volume.",
          "Coastal transit hubs in Mangaluru show elevated cargo scan alerts."
        ],
        recommendations: [
          "Implement high-resolution CCTV camera grids at all flagged entry-point toll gates.",
          "Redirect mobile GIS patrol vans to the Central division during peak business hours.",
          "Establish secondary scanning loops at marine cargo terminals."
        ]
      };

    case "officer_dossier":
      return {
        title: "OFFICER PERFORMANCE REPORT",
        subtitle: `DOSSIER EVALUATION: ${officerName.toUpperCase()}`,
        classification: "CONFIDENTIAL / INTERNAL USE ONLY",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        meta: {
          district: districtName,
          category,
          officer: officerName,
          dateRange,
          scope,
          priority
        },
        summary: `Operational audit evaluating case workload, detection success rates, and charge-sheet cycles for ${officerName}. Data is pulled directly from CaseMaster registers.`,
        kpis: [
          { label: "TOTAL DOSSIER CASES", value: "142 Assigned" },
          { label: "CLOSURE RATE SUCCESS", value: "92%" },
          { label: "AVG CLOSURE TIME", value: "32 Days" }
        ],
        findings: [
          `${officerName} demonstrates exceptional efficiency in handling complex corporate fraud and cyber forensic cases.`,
          "Active caseload is currently optimal, with no pending backlog crossing 45 days.",
          "Avg case resolution time is 13 days faster than the district average."
        ],
        recommendations: [
          "Recommending officer for the Lead Technical Investigator role for upcoming banking audits.",
          "Authorize additional support assistants to manage routine NDPS filing duties.",
          "Nominate dossier for the President's Meritorious Service Medal."
        ]
      };

    default:
      return {
        title: "INTELLIGENCE REPORT BRIEF",
        subtitle: `${templates.find(t => t.id === templateId)?.title.toUpperCase() || "REPORT"}`,
        classification: "RESTRICTED",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        meta: {
          district: districtName,
          category,
          officer: officerName,
          dateRange,
          scope,
          priority
        },
        summary: `Standard intelligence compilation report regarding CCTNS datastore audits. Formulated for jurisdictional evaluate purposes.`,
        kpis: [
          { label: "REGISTERED ENTRIES", value: "14,832" },
          { label: "AUDITED CASES", value: "488" },
          { label: "SUCCESS RATIO", value: "86.4%" }
        ],
        findings: [
          "All district registers compiled under CCTNS CAS v4.2 specifications.",
          "No integrity logs discrepancies identified in current search loops."
        ],
        recommendations: [
          "Maintain weekly automatic master data synchronization schedules.",
          "Conduct routine backup handshakes with Zia NLP nodes."
        ]
      };
  }
};

export const reportService = {
  getTemplates: () => templates,
  
  getRecentReports: () => mockRecentReports,
  
  generateReport: async (templateId, config) => {
    // Simulate generation queue delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateReportContent(templateId, config);
  }
};
