/**
 * translations/index.js
 * 
 * Complete Bilingual Translation Dictionary (English ↔ Kannada / ಕನ್ನಡ)
 * for Karnataka State Police — AI Crime Intelligence Command Platform.
 */

export const translations = {
  EN: {
    // Navbar & Header
    brandTitle: "Karnataka State Police",
    brandSubtitle: "AI Crime Intelligence Platform",
    telemetryStatus: "TELEMETRY: SECURE",
    jurisdiction: "JURISDICTION:",
    allDistricts: "Statewide (All Districts)",
    logout: "Logout",
    settings: "Settings",
    commandDirector: "COMMAND DIRECTOR",
    adminRole: "ADMIN",
    officerRole: "PSI / OFFICER",

    // Sidebar Navigation
    navDashboard: "Executive Dashboard",
    navCrimeMap: "GIS Crime Map",
    navInsights: "AI Insights & Forecast",
    navOfficers: "Officer Roster",
    navRecords: "Manage FIR Records",
    navReports: "Reports & Briefings",
    navSettings: "System Settings",

    // Executive Intelligence Dashboard
    dashTitle: "Executive Intelligence Dashboard",
    dashSubtitle: "Karnataka State Police • CCTNS Analytical Briefing",
    cctnsStatus: "CCTNS CAS (CONNECTED)",
    activeUnitsCount: "1,024 DISTRICTS & COMMANDS",
    quickmlStatus: "QUICKML (ONLINE)",

    kpiTotalFirs: "TOTAL REGISTERED FIRS",
    kpiActiveInvestigations: "ACTIVE INVESTIGATIONS",
    kpiChargesheetRate: "CHARGE-SHEET RATE (IIF-5)",
    kpiArrestRate: "SUSPECT ARREST RATE (IIF-3)",
    fromLastMonth: "from last month",
    fromLastQuarter: "vs last quarter",
    yoyTracking: "YoY tracking",

    monthlyCrimeTrend: "MONTHLY CRIME INCIDENTS TREND",
    crimeCategoryDistribution: "CRIME CATEGORY DISTRIBUTION",
    karnatakaLiveMap: "KARNATAKA LIVE MAP",
    districtClustersLive: "DISTRICT CLUSTERS • LIVE",
    aiPoweredInsights: "AI-POWERED INSIGHTS",

    // Crime Heads / Categories
    catProperty: "Property Offences",
    catBody: "Body Offences",
    catCyber: "Cyber Crimes",
    catFinancial: "Financial Fraud",
    catNarcotics: "Narcotics",
    catSLL: "Special & Local Laws (SLL)",
    catWomen: "Crimes Against Women",

    // GIS Crime Map Page
    mapTitle: "Karnataka GIS Spatial Crime Map",
    mapSubtitle: "Real-time Geospatial Hotspot Clusters & Precinct Analytics",
    mapActiveIncidents: "Active Incident Markers",
    mapFilterCategory: "Filter by Category",
    mapFilterSeverity: "Filter by Severity",
    mapFilterDistrict: "Filter by District",
    mapAllCategories: "All Categories",
    mapAllSeverities: "All Severities",
    mapAllDistricts: "All Districts",
    mapPrecinctPanel: "Precinct Intelligence Dossier",
    mapSelectPinPrompt: "Select any incident pin on the map to view spatial forensics",

    // AI Assistant & Forecast Page
    aiTitle: "AI Intelligence Copilot & Predictive Forecast",
    aiSubtitle: "QuickML GLM-4.7 Powered Natural Language Querying & Spatial Risk Analytics",
    aiCopilotHeader: "KSP Command Copilot",
    aiInputPlaceholder: "Ask command copilot (e.g. 'Show top cybercrime hotspots in Bengaluru')...",
    aiSuggestedTitle: "Suggested Analytical Queries",
    aiRiskForecast: "Spatio-Temporal Anomaly Forecast",
    aiRiskHigh: "High Risk Density",
    aiRiskMedium: "Moderate Vigilance",

    // Manage Records (FIR) Page
    recordsTitle: "CCTNS FIR Records Directory",
    recordsSubtitle: "Full Cloud Persistence & Relational Datastore Management",
    btnRegisterFir: "+ Register New FIR",
    searchPlaceholder: "Search FIR No, Complainant, Accused, or Brief Facts...",
    thCrimeNo: "FIR / Crime No",
    thRegDate: "Reg Date",
    thDistrictUnit: "District & Police Station",
    thCategorySeverity: "Category & Severity",
    thComplainant: "Complainant",
    thAccused: "Accused Suspect",
    thStatus: "Case Status",
    thActions: "Actions",

    // FIR Form Modal & Actions
    modalTitleCreate: "Register New FIR Record",
    modalTitleEdit: "Modify FIR Details",
    lblComplainantName: "Complainant Name",
    lblComplainantPhone: "Complainant Phone",
    lblComplainantAddress: "Complainant Address",
    lblDistrict: "District",
    lblPoliceStation: "Police Station / Unit",
    lblCrimeHead: "Crime Major Category",
    lblSeverity: "Severity Classification",
    lblAccusedName: "Accused Suspect Name",
    lblBriefFacts: "Brief Incident Facts",
    lblEstimatedValue: "Property / Loss Value (₹)",
    btnSubmitFir: "Save & File FIR Record",
    btnCancel: "Cancel",

    // Officer Roster Page
    officersTitle: "Police Officer Roster & Performance Analytics",
    officersSubtitle: "Cloud Dossiers, Case Resolution Rates & Workload Distribution",
    thOfficerName: "Officer Name",
    thRankKgid: "Rank & KGID",
    thUsername: "Command Username",
    thPassword: "Current Password",
    thStationUnit: "Station / Unit",
    btnOverridePassword: "Override Password",
    lblSelectOfficer: "Select Officer Account",
    lblNewPassword: "Set Override Password",

    // Reports Page
    reportsTitle: "Executive Reports & Command Intelligence Briefs",
    reportsSubtitle: "Export Printable Briefings & Analytical PDF Reports",
    btnGenerateReport: "Generate Intelligence Brief",
    btnPrint: "Print / Export PDF",

    // Settings Page
    settingsTitle: "Command System Settings & Credentials",
    settingsSubtitle: "Security PIN Configuration & System Access Control",
    lblCurrentPin: "Current Command PIN",
    lblNewPin: "New Security PIN",
    btnUpdatePin: "Update Security PIN",

    // Login Page
    loginTitle: "KSP Command Center Login",
    loginSubtitle: "Authorized Law Enforcement Personnel Only",
    lblUsername: "Officer Username / KGID",
    lblPassword: "Password",
    btnLogin: "Authenticate & Enter Command Center",

    // Status Values
    statusActive: "Under Investigation",
    statusClosed: "Case Closed / Completed",
    statusApprehended: "Suspect Apprehended",
    severityCritical: "CRITICAL",
    severityHigh: "HIGH",
    severityMedium: "MEDIUM",
    severityLow: "LOW"
  },

  KN: {
    // Navbar & Header
    brandTitle: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
    brandSubtitle: "ಎಐ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ ಮತ್ತು ನಿಯಂತ್ರಣ ವೇದಿಕೆ",
    telemetryStatus: "ಟೆಲಿಮೆಟ್ರಿ: ಸುರಕ್ಷಿತ",
    jurisdiction: "ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ:",
    allDistricts: "ರಾಜ್ಯಾದ್ಯಂತ (ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು)",
    logout: "ನಿರ್ಗಮಿಸಿ",
    settings: "ಸಂಯೋಜನೆಗಳು",
    commandDirector: "ಕಮಾಂಡ್ ನಿರ್ದೇಶಕರು",
    adminRole: "ಅಡ್ಮಿನ್",
    officerRole: "ಪಿಎಸ್‌ಐ / ಅಧಿಕಾರಿ",

    // Sidebar Navigation
    navDashboard: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navCrimeMap: "ಜಿಐಎಸ್ ಅಪರಾಧ ಭೂಪಟ",
    navInsights: "ಎಐ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಸಹಾಯಕ",
    navOfficers: "ಅಧಿಕಾರಿಗಳ ಕಾರ್ಯಕ್ಷಮತೆ ಪಟ್ಟಿ",
    navRecords: "ಎಫ್‌ಐಆರ್ ದಾಖಲೆ ನಿರ್ವಹಣೆ",
    navReports: "ವರದಿಗಳು ಮತ್ತು ವಿವರಣೆಗಳು",
    navSettings: "ವ್ಯವಸ್ಥೆಯ ಸಂಯೋಜನೆಗಳು",

    // Executive Intelligence Dashboard
    dashTitle: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಪರಾಧ ಪತ್ತೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    dashSubtitle: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ • ಸಿಸಿಟಿಎನ್‌ಎಸ್ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಮಾಹಿತಿ",
    cctnsStatus: "ಸಿಸಿಟಿಎನ್‌ಎಸ್ ನೆಟ್‌ವರ್ಕ್ (ಸಂಪರ್ಕಿತ)",
    activeUnitsCount: "1,024 ಪೊಲೀಸ್ ಠಾಣೆಗಳು & ಕಮಾಂಡ್‌ಗಳು",
    quickmlStatus: "ಕ್ವಿಕ್‌ಎಮ್‌ಎಲ್ ಎಐ (ಸಕ್ರಿಯ)",

    kpiTotalFirs: "ಒಟ್ಟು ನೋಂದಾಯಿತ ಎಫ್‌ಐಆರ್‌ಗಳು",
    kpiActiveInvestigations: "ಸಕ್ರಿಯ ತನಿಖೆಗಳು",
    kpiChargesheetRate: "ದೋಷಾರೋಪಣೆ ಪಟ್ಟಿ ದರ (IIF-5)",
    kpiArrestRate: "ಶಂಕಿತರ ಬಂಧನ ದರ (IIF-3)",
    fromLastMonth: "ಕಳೆದ ತಿಂಗಳಿಗಿಂತ",
    fromLastQuarter: "ಕಳೆದ ತ್ರೈಮಾಸಿಕಕ್ಕಿಂತ",
    yoyTracking: "ವಾರ್ಷಿಕ ಪ್ರಗತಿ",

    monthlyCrimeTrend: "ಮಾಸಿಕ ಅಪರಾಧ ಘಟನೆಗಳ ಪ್ರವೃತ್ತಿ",
    crimeCategoryDistribution: "ಅಪರಾಧ ವರ್ಗಗಳ ಹಂಚಿಕೆ",
    karnatakaLiveMap: "ಕರ್ನಾಟಕ ನೆರಳು ಭೂಪಟ",
    districtClustersLive: "ಜಿಲ್ಲಾವಾರು ಮಾಹಿತಿ • ಸಕ್ರಿಯ",
    aiPoweredInsights: "ಎಐ ಆಧರಿತ ವಿಶ್ಲೇಷಣೆಗಳು",

    // Crime Heads / Categories
    catProperty: "ಆಸ್ತಿ ಅಪರಾಧಗಳು (ಕಳವು / ದರೋಡೆ)",
    catBody: "ದೇಹ ಸಂಬಂಧಿ ಅಪರಾಧಗಳು (ಹಲ್ಲೆ/ಕೊಲೆ)",
    catCyber: "ಸೈಬರ್ ಅಪರಾಧಗಳು",
    catFinancial: "ಆರ್ಥಿಕ ವಂಚನೆ",
    catNarcotics: "ಮಾದಕ ದ್ರವ್ಯ ನಿಗ್ರಹ (NDPS)",
    catSLL: "ವಿಶೇಷ ಮತ್ತು ಸ್ಥಳೀಯ ಕಾಯ್ದೆಗಳು (SLL)",
    catWomen: "ಮಹಿಳೆಯರ ಮೇಲಿನ ಅಪರಾಧಗಳು",

    // GIS Crime Map Page
    mapTitle: "ಕರ್ನಾಟಕ ಜಿಐಎಸ್ ಅಪರಾಧ ಭೂಪಟ",
    mapSubtitle: "ನೈಜ ಸಮಯದ ಸ್ಥಳೀಯ ಅಪರಾಧ ಸಾಂದ್ರತೆ ಮತ್ತು ಠಾಣೆಗಳ ವಿಶ್ಲೇಷಣೆ",
    mapActiveIncidents: "ಸಕ್ರಿಯ ಘಟನೆಗಳ ಸೂಚಕಗಳು",
    mapFilterCategory: "ವರ್ಗದಿಂದ ವಿಂಗಡಿಸಿ",
    mapFilterSeverity: "ತೀವ್ರತೆಯಿಂದ ವಿಂಗಡಿಸಿ",
    mapFilterDistrict: "ಜಿಲ್ಲೆಯಿಂದ ವಿಂಗಡಿಸಿ",
    mapAllCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    mapAllSeverities: "ಎಲ್ಲಾ ತೀವ್ರತೆಗಳು",
    mapAllDistricts: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    mapPrecinctPanel: "ಠಾಣಾ ಮಟ್ಟದ ಅಪರಾಧ ವಿವರ",
    mapSelectPinPrompt: "ಸ್ಥಳೀಯ ತನಿಖಾ ವಿವರ ನೋಡಲು ಭೂಪಟದ ಗುರುತನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    // AI Assistant & Forecast Page
    aiTitle: "ಎಐ ಅಪರಾಧ ತನಿಖಾ ಸಹಾಯಕ ಮತ್ತು ಮುನ್ಸೂಚನೆ",
    aiSubtitle: "ಕ್ವಿಕ್‌ಎಮ್‌ಎಲ್ ಜಿಎಲ್‌ಎಮ್-4.7 ಎಐ ಆಧಾರಿತ ನೈಸರ್ಗಿಕ ಭಾಷಾ ಪ್ರಶ್ನೋತ್ತರ",
    aiCopilotHeader: "ಕೆಎಸ್‌ಪಿ ಕಮಾಂಡ್ ಕೊಪೈಲಟ್",
    aiInputPlaceholder: "ಎಐ ಸಹಾಯಕರನ್ನು ಕೇಳಿ (ಉದಾ: 'ಬೆಂಗಳೂರಿನ ಸೈಬರ್ ಅಪರಾಧಗಳನ್ನು ತೋರಿಸಿ')...",
    aiSuggestedTitle: "ಸೂಚಿಸಿದ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಪ್ರಶ್ನೆಗಳು",
    aiRiskForecast: "ಸ್ಥಳೀಯ ಅಪರಾಧ ಅಪಾಯದ ಮುನ್ಸೂಚನೆ",
    aiRiskHigh: "ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಲಯ",
    aiRiskMedium: "ಮಧ್ಯಮ ಜಾಗರೂಕತೆ ವಲಯ",

    // Manage Records (FIR) Page
    recordsTitle: "ಸಿಸಿಟಿಎನ್‌ಎಸ್ ಎಫ್‌ಐಆರ್ ದಾಖಲೆಗಳ ಪಟ್ಟಿ",
    recordsSubtitle: "ಕ್ಲೌಡ್ ಡಾಟಾಸ್ಟೋರ್ ಮೂಲಕ ಪೂರ್ಣ ದಾಖಲೆ ನಿರ್ವಹಣೆ",
    btnRegisterFir: "+ ಹೊಸ ಎಫ್‌ಐಆರ್ ನೋಂದಾಯಿಸಿ",
    searchPlaceholder: "ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ, ದೂರುದಾರರು, ಆರೋಪಿಗಳು ಅಥವಾ ವಿವರ ಹುಡುಕಿ...",
    thCrimeNo: "ಎಫ್‌ಐಆರ್ / ಅಪರಾಧ ಸಂಖ್ಯೆ",
    thRegDate: "ನೋಂದಾಯಿತ ದಿನಾಂಕ",
    thDistrictUnit: "ಜಿಲ್ಲೆ ಮತ್ತು ಪೊಲೀಸ್ ಠಾಣೆ",
    thCategorySeverity: "ವರ್ಗ ಮತ್ತು ತೀವ್ರತೆ",
    thComplainant: "ದೂರುದಾರರು",
    thAccused: "ಆರೋಪಿ/ಶಂಕಿತರು",
    thStatus: "ತನಿಖೆಯ ಹಂತ",
    thActions: "ಕ್ರಿಯೆಗಳು",

    // FIR Form Modal & Actions
    modalTitleCreate: "ಹೊಸ ಎಫ್‌ಐಆರ್ ನೋಂದಾಯಿಸಿ",
    modalTitleEdit: "ಎಫ್‌ಐಆರ್ ವಿವರ ತಿದ್ದುಪಡಿ",
    lblComplainantName: "ದೂರುದಾರರ ಹೆಸರು",
    lblComplainantPhone: "ದೂರುದಾರರ ದೂರವಾಣಿ",
    lblComplainantAddress: "ದೂರುದಾರರ ವಿಳಾಸ",
    lblDistrict: "ಜಿಲ್ಲೆ",
    lblPoliceStation: "ಪೋಲಿಸ್ ಠಾಣೆ / ಯುನಿಟ್",
    lblCrimeHead: "ಅಪರಾಧದ ಪ್ರಮುಖ ವರ್ಗ",
    lblSeverity: "ತೀವ್ರತೆಯ ವರ್ಗೀಕರಣ",
    lblAccusedName: "ಆರೋಪಿಯ ಹೆಸರು",
    lblBriefFacts: "ಘಟನೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರ",
    lblEstimatedValue: "ಆಸ್ತಿ/ನಷ್ಟದ ಮೌಲ್ಯ (₹)",
    btnSubmitFir: "ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಿ ಸಲ್ಲಿಸಿ",
    btnCancel: "ರದ್ದುಮಾಡಿ",

    // Officer Roster Page
    officersTitle: "ಪೊಲೀಸ್ ಅಧಿಕಾರಿಗಳ ಪಟ್ಟಿ ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆ",
    officersSubtitle: "ಕ್ಲೌಡ್ ವಿವರಗಳು, ಪ್ರಕರಣಗಳ ಪರಿಹಾರ ದರ ಮತ್ತು ಕೆಲಸದ ಹಂಚಿಕೆ",
    thOfficerName: "ಅಧಿಕಾರಿಯ ಹೆಸರು",
    thRankKgid: "ಹುದ್ದೆ ಮತ್ತು ಕೆಜಿಐಡಿ",
    thUsername: "ಲಾಗಿನ್ ಹೆಸರು",
    thPassword: "ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್",
    thStationUnit: "ಠಾಣೆ / ಯುನಿಟ್",
    btnOverridePassword: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
    lblSelectOfficer: "ಅಧಿಕಾರಿಯ ಖಾತೆ ಆಯ್ಕೆಮಾಡಿ",
    lblNewPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ",

    // Reports Page
    reportsTitle: "ಕಾರ್ಯನಿರ್ವಾಹಕ ವರದಿಗಳು ಮತ್ತು ಸಾರಾಂಶಗಳು",
    reportsSubtitle: "ಮುದ್ರಿಸಬಹುದಾದ ಅಪರಾಧ ವರದಿಗಳು ಮತ್ತು ಪೀಡಿಎಫ್ ರಫ್ತು",
    btnGenerateReport: "ಅಪರಾಧ ಸಾರಾಂಶ ವರದಿ ತಯಾರಿಸಿ",
    btnPrint: "ಪಿಡಿಎಫ್ ಮುದ್ರಿಸಿ / ರಫ್ತುಮಾಡಿ",

    // Settings Page
    settingsTitle: "ವ್ಯವಸ್ಥೆಯ ಸಂಯೋಜನೆಗಳು ಮತ್ತು ಭದ್ರತೆ",
    settingsSubtitle: "ಸುರಕ್ಷತಾ ಪಿನ್ ಮತ್ತು ಕಮಾಂಡ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    lblCurrentPin: "ಪ್ರಸ್ತುತ ಕಮಾಂಡ್ ಪಿನ್",
    lblNewPin: "ಹೊಸ ಸುರಕ್ಷತಾ ಪಿನ್",
    btnUpdatePin: "ಪಿನ್ ನವೀಕರಿಸಿ",

    // Login Page
    loginTitle: "ಕೆಎಸ್‌ಪಿ ಕಮಾಂಡ್ ಸೆಂಟರ್ ಲಾಗಿನ್",
    loginSubtitle: "ಅಧಿಕೃತ ಪೊಲೀಸ್ ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ಪ್ರವೇಶ",
    lblUsername: "ಅಧಿಕಾರಿಯ ಲಾಗಿನ್ ಹೆಸರು / KGID",
    lblPassword: "ಪಾಸ್‌ವರ್ಡ್",
    btnLogin: "ಪ್ರವೇಶಿಸಿ (ಕಮಾಂಡ್ ಸೆಂಟರ್)",

    // Status Values
    statusActive: "ತನಿಖೆಯಲ್ಲಿದೆ",
    statusClosed: "ಪ್ರಕರಣ ಮುಕ್ತಾಯಗೊಂಡಿದೆ",
    statusApprehended: "ಶಂಕಿತರನ್ನು ಬಂಧಿಸಲಾಗಿದೆ",
    severityCritical: "ಅತಿ ತೀವ್ರ (CRITICAL)",
    severityHigh: "ಹೆಚ್ಚಿನ ತೀವ್ರತೆ (HIGH)",
    severityMedium: "ಮಧ್ಯಮ (MEDIUM)",
    severityLow: "ಸಾಮಾನ್ಯ (LOW)"
  }
};
