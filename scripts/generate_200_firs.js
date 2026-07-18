/**
 * generate_200_firs.js
 * 
 * Generates 200 diverse, realistic CCTNS FIR crime records formatted according
 * to the OFFICIAL POLICE FIR SYSTEM ER DIAGRAM SCHEMA:
 * 
 * Tables Included:
 * - CaseMaster (PK: CaseMasterID, CrimeNo, CaseNo, CrimeRegisteredDate, PolicePersonID, PoliceStationID, CaseCategoryID, GravityOffenceID, CrimeMajorHeadID, CrimeMinorHeadID, CaseStatusID, CourtID, IncidentFromDate, IncidentToDate, InfoReceivedPSDate, latitude, longitude, BriefFacts)
 * - ComplainantDetails (ComplainantID, CaseMasterID, ComplainantName, AgeYear, OccupationID, ReligionID, CasteID, GenderID)
 * - ActSectionAssociation (CaseMasterID, ActID, SectionID, ActOrderID, SectionOrderID)
 * - Victim (VictimMasterID, CaseMasterID, VictimName, AgeYear, GenderID, VictimPolice)
 * - Accused (AccusedMasterID, CaseMasterID, AccusedName, AgeYear, GenderID, PersonID)
 * - ArrestSurrender (ArrestSurrenderID, CaseMasterID, ArrestSurrenderTypeID, ArrestSurrenderDate, IOID, AccusedMasterID, IsAccused)
 * - ChargesheetDetails (CSID, CaseMasterID, csdate, cstype, PolicePersonID)
 */

const fs = require("fs");
const path = require("path");

const districtsList = [
  { id: 101, name: "Bengaluru City" },
  { id: 102, name: "Mysuru District" },
  { id: 103, name: "Mangaluru City" },
  { id: 104, name: "Hubli-Dharwad" },
  { id: 105, name: "Belagavi District" },
  { id: 106, name: "Kalaburagi District" },
  { id: 107, name: "Shivamogga" },
  { id: 108, name: "Udupi District" },
  { id: 109, name: "Davanagere" },
  { id: 110, name: "Tumakuru" },
  { id: 111, name: "Ballari" },
  { id: 112, name: "Chikkamagaluru" }
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

const majorHeads = [
  { id: 1, name: "Property Offences", subId: 101, subName: "Commercial Dacoity & Theft", act: "IPC / BNS", sec: "IPC Sec 395 / 379" },
  { id: 2, name: "Offences Against Body", subId: 102, subName: "Homicide & Assault", act: "IPC / BNS", sec: "IPC Sec 302 / 324" },
  { id: 3, name: "Cyber Crimes", subId: 103, subName: "Financial Cyber Fraud", act: "IT Act", sec: "IT Act Sec 66D / Sec 420" },
  { id: 4, name: "Financial Fraud", subId: 104, subName: "Corporate Embezzlement", act: "IPC / GST", sec: "IPC Sec 409 / 468" },
  { id: 5, name: "Narcotics", subId: 105, subName: "Commercial NDPS Seizure", act: "NDPS Act", sec: "NDPS Act Sec 20(b)" },
  { id: 6, name: "Crimes Against Women", subId: 106, subName: "Harassment & Stalking", act: "IPC / POCSO", sec: "IPC Sec 354D / 498A" }
];

const employees = [
  { id: 201, name: "Ramesh Gowda", rank: "PSI", kgid: "KSP-8821", rankId: 1, unitId: 301 },
  { id: 202, name: "ACP Rajeshwari N.", rank: "ACP", kgid: "KSP-2015-ACP88", rankId: 4, unitId: 302 },
  { id: 203, name: "Insp. Ravi Kumar", rank: "Inspector", kgid: "KSP-2010-IN74", rankId: 2, unitId: 303 },
  { id: 204, name: "DySP Sharanappa K.", rank: "DySP", kgid: "KSP-2008-DSP11", rankId: 3, unitId: 304 },
  { id: 205, name: "Insp. Meena Hegde", rank: "Inspector", kgid: "KSP-2012-MH44", rankId: 2, unitId: 305 },
  { id: 206, name: "Insp. Siddesh M.", rank: "Inspector", kgid: "KSP-2014-SM12", rankId: 2, unitId: 306 }
];

const caseStatuses = [
  { id: 1, name: "Under Investigation", cstype: "U" },
  { id: 2, name: "Suspect Apprehended", cstype: "U" },
  { id: 3, name: "Charge-sheet Submitted", cstype: "A" },
  { id: 4, name: "Case Closed / Completed", cstype: "A" }
];

const sampleComplainants = [
  "Siddharth Malhotra", "Ananya Deshmukh", "Head Constable N. Swamy", "Sub-Inspector K. Shetty",
  "Venkatesh Rao", "Basavaraj Patil", "GST Inspector Ramesh G.", "Mahantesh K."
];

const sampleAccused = [
  "Kiran Kumar (alias 'Appu')", "Vijay Shankar", "Ravi Naik", "Mohammed Ismail",
  "S. K. Murthy", "Anil Agarwal", "Sanjeev Kumar", "Ganesh & Group"
];

const reportImages = [
  "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop"
];

const records = [];

for (let i = 1; i <= 200; i++) {
  const caseMasterId = 2000 + i;
  const distObj = districtsList[(i - 1) % districtsList.length];
  const majorHead = majorHeads[i % majorHeads.length];
  const emp = employees[i % employees.length];
  const statusObj = caseStatuses[(i * 7) % caseStatuses.length];
  const gravityId = (i % 2 === 0) ? 1 : 2; // 1: Heinous, 2: Non-Heinous
  const severity = (gravityId === 1 && i % 3 === 0) ? "CRITICAL" : (i % 2 === 0) ? "HIGH" : "MEDIUM";
  
  const monthNum = String(((i % 7) + 1)).padStart(2, "0"); // Jan to Jul
  const dayNum = String(((i * 3) % 28) + 1).padStart(2, "0");
  const regDate = `2026-${monthNum}-${dayNum}`;
  
  // Format structured CrimeNo: 1 digit Category (1) + 4 digit DistID (1044) + 4 digit UnitID (3001) + 4 digit Year (2026) + 5 digit Serial
  const serialNo = String(i).padStart(5, "0");
  const crimeNo = `1044300062026${serialNo}`;
  const caseNo = `2026${serialNo}`; // Last 9 digits from CrimeNo

  const center = districtCoords[distObj.name] || { lat: 12.9716 + (Math.sin(i) * 1.2), lng: 77.5946 + (Math.cos(i) * 1.2) };
  const lat = +(center.lat + (Math.sin(i * 1.7) * 0.08)).toFixed(4);
  const lng = +(center.lng + (Math.cos(i * 1.7) * 0.08)).toFixed(4);

  const compName = sampleComplainants[i % sampleComplainants.length];
  const accName = sampleAccused[i % sampleAccused.length];
  const stationName = `${distObj.name.replace(" District", "").replace(" City", "")} Police Station ${((i % 4) + 1)}`;

  const record = {
    // Official CaseMaster ER Diagram Primary & Foreign Keys
    CaseMasterID: caseMasterId,
    CrimeNo: crimeNo,
    CaseNo: caseNo,
    CrimeRegisteredDate: regDate,
    PolicePersonID: emp.id,
    PoliceStationID: 300 + ((i % 10) + 1),
    CaseCategoryID: 1, // 1: FIR
    GravityOffenceID: gravityId,
    CrimeMajorHeadID: majorHead.id,
    CrimeMinorHeadID: majorHead.subId,
    CaseStatusID: statusObj.id,
    CourtID: 501 + (i % 5),
    IncidentFromDate: `${regDate}T10:00:00`,
    IncidentToDate: `${regDate}T11:30:00`,
    InfoReceivedPSDate: `${regDate}T12:00:00`,
    latitude: lat,
    longitude: lng,
    BriefFacts: `${majorHead.name} (${majorHead.subName}) registered at ${stationName}, ${distObj.name}. Case logged under ${majorHead.sec}. Investigating Officer: ${emp.name}.`,

    // Official Relational Child Objects
    ComplainantDetails: {
      ComplainantID: 3000 + i,
      CaseMasterID: caseMasterId,
      ComplainantName: compName,
      AgeYear: 35 + (i % 25),
      OccupationID: 1,
      ReligionID: 1,
      CasteID: 1,
      GenderID: 1
    },

    ActSectionAssociation: [
      {
        CaseMasterID: caseMasterId,
        ActID: majorHead.act,
        SectionID: majorHead.sec,
        ActOrderID: 1,
        SectionOrderID: 1
      }
    ],

    Victim: [
      {
        VictimMasterID: 4000 + i,
        CaseMasterID: caseMasterId,
        VictimName: `Victim Person ${i}`,
        AgeYear: 30 + (i % 20),
        GenderID: 1,
        VictimPolice: "0"
      }
    ],

    Accused: [
      {
        AccusedMasterID: 5000 + i,
        CaseMasterID: caseMasterId,
        AccusedName: accName,
        AgeYear: 28 + (i % 15),
        GenderID: 1,
        PersonID: "A1"
      }
    ],

    ArrestSurrender: [
      {
        ArrestSurrenderID: 6000 + i,
        CaseMasterID: caseMasterId,
        ArrestSurrenderTypeID: 1,
        ArrestSurrenderDate: regDate,
        ArrestSurrenderStateId: 29,
        ArrestSurrenderDistrictId: distObj.id,
        PoliceStationID: 300 + ((i % 10) + 1),
        IOID: emp.id,
        CourtID: 501 + (i % 5),
        AccusedMasterID: 5000 + i,
        IsAccused: 1,
        IsComplainantAccused: 0
      }
    ],

    ChargesheetDetails: {
      CSID: 7000 + i,
      CaseMasterID: caseMasterId,
      csdate: regDate,
      cstype: statusObj.cstype,
      PolicePersonID: emp.id
    },

    // Flat UI Helper Attributes
    id: `fir-${caseMasterId}`,
    ROWID: caseMasterId,
    regDate: regDate,
    district: distObj.name,
    District: distObj.name,
    unit: stationName,
    PoliceStation: stationName,
    crimeHead: majorHead.name,
    CrimeCategory: majorHead.name,
    crimeSubHead: majorHead.subName,
    actSections: majorHead.sec,
    ActSections: majorHead.sec,
    severity: severity,
    Severity: severity,
    status: statusObj.name,
    Status: statusObj.name,
    complainantName: compName,
    ComplainantName: compName,
    allottedOfficerName: emp.name,
    OfficerName: emp.name,
    allottedOfficerRank: emp.rank,
    allottedOfficerKgid: emp.kgid,
    accusedName: accName,
    AccusedName: accName,
    briefFacts: `${majorHead.name} (${majorHead.subName}) registered at ${stationName}, ${distObj.name}. Case logged under ${majorHead.sec}. Investigating Officer: ${emp.name}.`,
    Description: `${majorHead.name} (${majorHead.subName}) registered at ${stationName}, ${distObj.name}. Case logged under ${majorHead.sec}. Investigating Officer: ${emp.name}.`,
    propertyDescription: majorHead.name.includes("Property") ? "Stolen goods / cash recovered" : "Evidence catalogued under mahazar",
    estimatedValue: (i % 5) * 150000 + 50000,
    officialReportImage: reportImages[i % reportImages.length],
    lat: lat,
    Latitude: lat,
    lng: lng,
    Longitude: lng,
    locationStreet: `${distObj.name} Station Limit Road`
  };

  records.push(record);
}

// 1. Write to local_crime_records.json
const localSeedPath = path.join(__dirname, "../datathon-chatbot/functions/chat/local_crime_records.json");
fs.writeFileSync(localSeedPath, JSON.stringify(records, null, 2), "utf-8");

// 2. Write to datastore_db.json
const datastoreDbPath = path.join(__dirname, "../datathon-chatbot/functions/chat/datastore_db.json");
fs.writeFileSync(datastoreDbPath, JSON.stringify(records, null, 2), "utf-8");

console.log(`[ER Diagram Seeder] Generated 200 ER Diagram compliant CCTNS records into local_crime_records.json and datastore_db.json!`);
