/**
 * crimeService.js
 * 
 * GIS Crime Map Data Service connected directly to recordService (Zoho Catalyst Datastore).
 * Transforms live FIR records into map pins, district heatmaps, and spatial intelligence.
 */

import { recordService } from "./recordService";

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
  "Crimes Against Women",
  "Special & Local Laws (SLL)"
];

const severitiesList = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const statusesList = [
  "Under Investigation",
  "Suspect Apprehended",
  "Charge-sheet Submitted",
  "Case Closed / Completed"
];

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

const getLiveIncidents = () => {
  const firs = recordService.getRecords();

  return firs.map((r, idx) => {
    const center = districtCoords[r.district] || districtCoords["Bengaluru City"];
    
    return {
      id: r.id,
      caseNo: r.caseNo || r.crimeNo,
      crimeNo: r.crimeNo,
      category: r.crimeHead || "Property Offences",
      severity: r.severity || "MEDIUM",
      status: r.status || "Under Investigation",
      district: r.district || "Bengaluru City",
      unit: r.unit || "City Station",
      date: r.regDate || "2026-07-01",
      lat: Number(r.lat) || center.lat,
      lng: Number(r.lng) || center.lng,
      briefFacts: r.briefFacts || "Incident recorded in CCTNS Datastore.",
      assignedOfficer: {
        name: r.allottedOfficerName || "Unassigned",
        kgid: r.allottedOfficerKgid || "KSP-0000"
      },
      districtCenter: center
    };
  });
};

export const crimeService = {
  getDistricts: () => districtsList,
  getCategories: () => categoriesList,
  getSeverities: () => severitiesList,
  getStatuses: () => statusesList,

  getIncidents: (filters = {}) => {
    let results = getLiveIncidents();

    if (filters.district) {
      results = results.filter((inc) => inc.district === filters.district);
    }
    if (filters.unit) {
      results = results.filter((inc) => inc.unit.toLowerCase().includes(filters.unit.toLowerCase()));
    }
    if (filters.category) {
      results = results.filter((inc) => inc.category === filters.category);
    }
    if (filters.severity) {
      results = results.filter((inc) => inc.severity === filters.severity);
    }
    if (filters.status) {
      results = results.filter((inc) => inc.status === filters.status);
    }
    if (filters.startDate) {
      results = results.filter((inc) => new Date(inc.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      results = results.filter((inc) => new Date(inc.date) <= new Date(filters.endDate));
    }

    return results;
  },

  getDistrictMetrics: (districtName, filteredIncidents) => {
    const live = getLiveIncidents();
    const pool = districtName
      ? live.filter((inc) => inc.district === districtName)
      : filteredIncidents || live;

    const total = pool.length;
    const active = pool.filter((inc) => inc.status !== "Case Closed / Completed").length;
    const chargesheeted = pool.filter((inc) => inc.status === "Case Closed / Completed").length;

    const catDistribution = {};
    categoriesList.forEach((cat) => {
      catDistribution[cat] = pool.filter((inc) => inc.category === cat).length;
    });

    const sevBreakdown = {};
    severitiesList.forEach((sev) => {
      sevBreakdown[sev] = pool.filter((inc) => inc.severity === sev).length;
    });

    const uniqueOfficers = new Set(pool.map((inc) => inc.assignedOfficer.kgid));
    const officersCount = Math.max(1, uniqueOfficers.size);

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
    const pool = filteredIncidents || getLiveIncidents();
    const counts = {};
    districtsList.forEach((d) => {
      counts[d] = pool.filter((inc) => inc.district === d).length;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
};
