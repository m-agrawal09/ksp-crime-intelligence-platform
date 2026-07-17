// Mock Crime Incident Database and Service for KSP GIS Command Center

const districtsList = [
  "Bengaluru City",
  "Mysuru District",
  "Mangaluru City",
  "Hubli-Dharwad",
  "Belagavi District",
  "Kalaburagi District",
  "Shivamogga",
  "Udupi District",
  "Davanagere",
  "Tumakuru"
];

const categoriesList = [
  "Property Offences",
  "Body Offences",
  "Cyber Crimes",
  "Financial Fraud",
  "Narcotics",
  "Crimes Against Women"
];

const severitiesList = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const statusesList = [
  "Under Investigation",
  "Suspect Apprehended",
  "Charge-sheet Submitted",
  "Case Closed"
];

// District Center Coordinates
const districtCoords = {
  "Bengaluru City": { lat: 12.9716, lng: 77.5946 },
  "Mysuru District": { lat: 12.2958, lng: 76.6394 },
  "Mangaluru City": { lat: 12.9141, lng: 74.8560 },
  "Hubli-Dharwad": { lat: 15.3647, lng: 75.1240 },
  "Belagavi District": { lat: 15.8497, lng: 74.4977 },
  "Kalaburagi District": { lat: 17.3291, lng: 76.8343 },
  "Shivamogga": { lat: 13.9299, lng: 75.5681 },
  "Udupi District": { lat: 13.3409, lng: 74.7421 },
  "Davanagere": { lat: 14.4644, lng: 75.9218 },
  "Tumakuru": { lat: 13.3392, lng: 77.1140 }
};

// Generate 100 random incidents close to the district centers
const generateIncidents = () => {
  const incidents = [];
  let idCounter = 1000;

  const officers = [
    { name: "Insp. Ravi Kumar", kgid: "KGID8832" },
    { name: "Insp. Sharanappa K.", kgid: "KGID7741" },
    { name: "Insp. Meena Hegde", kgid: "KGID9201" },
    { name: "Insp. Siddesh M.", kgid: "KGID4412" },
    { name: "Insp. Prakash Patil", kgid: "KGID6549" }
  ];

  const facts = {
    "Property Offences": [
      "Housebreaking by night and theft of gold ornaments reported from residential area.",
      "Theft of motor vehicle parked in front of owner's commercial building.",
      "Daylight robbery at a jewellery store by two masked suspects on a motorcycle.",
      "Larceny of copper wiring from an active electrical sub-station yard."
    ],
    "Body Offences": [
      "Riotous brawl and assault involving local gang members outside an eatery.",
      "Homicide reported following a heated domestic dispute over property.",
      "Attempted murder case registered after weapon assault near railway junction.",
      "Kidnapping complaint filed for missing minor male student during transit."
    ],
    "Cyber Crimes": [
      "Phishing campaign targeted regional cooperative banks, compromising active accounts.",
      "Unauthorized access and data exfiltration from private company database.",
      "Identity theft and subsequent fraudulent loan applications on mobile portal.",
      "Cryptocurrency scam promising high yields, resulting in massive retail loss."
    ],
    "Financial Fraud": [
      "Real estate Ponzi scheme defrauding multiple senior citizens of life savings.",
      "Corporate embezzlement of funds by Chief Accounts Officer using forged checks.",
      "GST credit fraud involving shell companies issuing fake tax invoices.",
      "Credit card skimming network operating across major high-street retail malls."
    ],
    "Narcotics": [
      "Seizure of commercial quantity of MDMA crystal package from transit courier.",
      "Interception of inter-state transport container carrying marijuana bags.",
      "Raid at farm-house party leading to arrest of local peddlers and drug seizure.",
      "Possession case registered against individual smuggling synthetic narcotics."
    ],
    "Crimes Against Women": [
      "Dowry harassment case filed under 498A IPC by complainant's family.",
      "Sexual assault case registered after victim filed statement at women's cell.",
      "Stalking and cyber-harassment complaint lodged against multiple social profiles.",
      "Kidnapping of female victim by acquaintance for forced nuptials."
    ]
  };

  // Ensure deterministic seed or just random close distributions
  for (let i = 0; i < 120; i++) {
    idCounter++;
    const district = districtsList[i % districtsList.length];
    const category = categoriesList[i % categoriesList.length];
    const severity = severitiesList[(i * 3) % severitiesList.length];
    const status = statusesList[(i * 7) % statusesList.length];
    
    // Slight offset from district center to scatter markers
    const center = districtCoords[district];
    const offsetLat = (Math.sin(i) * 0.12);
    const offsetLng = (Math.cos(i) * 0.12);
    const lat = center.lat + offsetLat;
    const lng = center.lng + offsetLng;

    const officer = officers[i % officers.length];
    const categoryFacts = facts[category];
    const briefFacts = categoryFacts[i % categoryFacts.length];
    const year = 2026;
    const month = String(((i * 2) % 6) + 1).padStart(2, "0"); // Jan - June
    const day = String((i % 28) + 1).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    incidents.push({
      id: idCounter,
      caseNo: `CCTNS/2026/${idCounter}`,
      crimeNo: `CR-${district.slice(0, 3).toUpperCase()}-2026-${String(idCounter).slice(1)}`,
      category,
      severity,
      status,
      district,
      unit: `${district.replace(" District", "").replace(" City", "")} Police Station ${String((i % 3) + 1)}`,
      date,
      lat,
      lng,
      briefFacts,
      assignedOfficer: officer,
      districtCenter: center
    });
  }

  return incidents;
};

const database = generateIncidents();

export const crimeService = {
  getDistricts: () => districtsList,
  getCategories: () => categoriesList,
  getSeverities: () => severitiesList,
  getStatuses: () => statusesList,
  
  getIncidents: (filters = {}) => {
    let results = [...database];
    
    if (filters.district) {
      results = results.filter(inc => inc.district === filters.district);
    }
    if (filters.unit) {
      results = results.filter(inc => inc.unit.toLowerCase().includes(filters.unit.toLowerCase()));
    }
    if (filters.category) {
      results = results.filter(inc => inc.category === filters.category);
    }
    if (filters.severity) {
      results = results.filter(inc => inc.severity === filters.severity);
    }
    if (filters.status) {
      results = results.filter(inc => inc.status === filters.status);
    }
    if (filters.startDate) {
      results = results.filter(inc => new Date(inc.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      results = results.filter(inc => new Date(inc.date) <= new Date(filters.endDate));
    }
    
    return results;
  },

  getDistrictMetrics: (districtName, filteredIncidents) => {
    // If no district is specified, aggregate globally or use currently filtered set
    const pool = districtName 
      ? database.filter(inc => inc.district === districtName)
      : filteredIncidents || database;

    const total = pool.length;
    const active = pool.filter(inc => inc.status === "Under Investigation" || inc.status === "Suspect Apprehended").length;
    const chargesheeted = pool.filter(inc => inc.status === "Charge-sheet Submitted").length;

    // Categories Breakdown
    const catDistribution = {};
    categoriesList.forEach(cat => {
      catDistribution[cat] = pool.filter(inc => inc.category === cat).length;
    });

    // Severity Breakdown
    const sevBreakdown = {};
    severitiesList.forEach(sev => {
      sevBreakdown[sev] = pool.filter(inc => inc.severity === sev).length;
    });

    // Assigned Officers unique count
    const uniqueOfficers = new Set(pool.map(inc => inc.assignedOfficer.kgid));
    const officersCount = uniqueOfficers.size === 0 ? 5 : uniqueOfficers.size;

    // Recent Incidents (latest 3)
    const sortedIncidents = [...pool].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentIncidents = sortedIncidents.slice(0, 3);

    return {
      name: districtName || "Karnataka State (All Filters)",
      total,
      active,
      chargesheeted,
      catDistribution,
      sevBreakdown,
      officersCount,
      recentIncidents
    };
  },

  getHotspotDistricts: (filteredIncidents) => {
    const pool = filteredIncidents || database;
    const counts = {};
    districtsList.forEach(d => {
      counts[d] = pool.filter(inc => inc.district === d).length;
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
};
