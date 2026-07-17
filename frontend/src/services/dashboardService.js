/**
 * dashboardService.js
 * 
 * Data client for the Executive Dashboard.
 * Currently returns mock JSON payloads representing Zoho Catalyst Integration Functions.
 * 
 * Architecture Flow:
 * React Components  -->  dashboardService.js  -->  Catalyst SDK (Future)  -->  Catalyst Datastore
 */

// Simulated database values and entities matching the Karnataka Police CCTNS ER Diagram:
// Tables: CaseMaster, ComplainantDetails, ActSectionAssociation, Victim, Accused, ArrestSurrender, 
//         Act, Section, CrimeHead, CrimeSubHead, CaseStatusMaster, Employee, Unit, Court, ChargesheetDetails

const MOCK_CATALYST_DASHBOARD_RESPONSE = {
  status: "success",
  timestamp: "2026-07-17T14:26:00Z",
  data: {
    // 1. KPI Metrics
    kpi_metrics: {
      total_firs: {
        value: 14832,
        change_percent: 4.2,
        comparison_period: "MoM",
        source_table: "CaseMaster",
        source_field: "COUNT(CaseMasterID)",
        last_sync: "2026-07-17 14:00 IST",
        coverage: "All 31 Districts (CCTNS Unit Range)",
        cognizable_count: 12162,
        non_cognizable_count: 2670
      },
      active_investigations: {
        value: 3124,
        change_percent: -1.8,
        comparison_period: "MoM",
        source_table: "CaseMaster",
        source_field: "COUNT(CaseMasterID) WHERE CaseStatusID = 1",
        last_sync: "2026-07-17 14:00 IST",
        coverage: "Statewide Active Units (Unit.UnitID)",
        status_code: "Under Investigation"
      },
      charge_sheet_rate: {
        value: 74.2,
        change_percent: 1.5,
        comparison_period: "vs Q2",
        source_table: "ChargesheetDetails",
        source_field: "COUNT(CSID) WHERE cstype = 'A'",
        last_sync: "2026-07-17 06:00 IST (Daily Batch)",
        coverage: "Judicial Magistrate Courts (Court.CourtID)"
      },
      apprehension_rate: {
        value: 82.5,
        change_percent: 2.1,
        comparison_period: "YoY",
        source_table: "ArrestSurrender",
        source_field: "COUNT(ArrestSurrenderID) WHERE IsAccused = 1",
        last_sync: "2026-07-17 12:00 IST",
        coverage: "Statewide Arrest & Surrender Logs"
      }
    },

    // 2. Crime Trend (CaseMaster grouped by Month and Major Crime Head)
    crime_trends: [
      { month: "Jan", property_offences: 320, body_offences: 210, cyber_crimes: 90, financial_fraud: 150, total_crimes: 770 },
      { month: "Feb", property_offences: 340, body_offences: 190, cyber_crimes: 110, financial_fraud: 160, total_crimes: 800 },
      { month: "Mar", property_offences: 350, body_offences: 220, cyber_crimes: 130, financial_fraud: 180, total_crimes: 880 },
      { month: "Apr", property_offences: 390, body_offences: 240, cyber_crimes: 120, financial_fraud: 190, total_crimes: 940 },
      { month: "May", property_offences: 370, body_offences: 230, cyber_crimes: 150, financial_fraud: 170, total_crimes: 920 },
      { month: "Jun", property_offences: 410, body_offences: 250, cyber_crimes: 180, financial_fraud: 200, total_crimes: 1040 },
      { month: "Jul", property_offences: 435, body_offences: 270, cyber_crimes: 210, financial_fraud: 225, total_crimes: 1140 }
    ],

    // 3. Crime Category Distribution (CaseMaster join CrimeHead)
    crime_distribution: [
      { category: "Property Offences", fir_count: 5854, percentage: 39.5, acts_sections: "IPC Sec 379 / BNS Sec 303 (Theft)", head_id: 1 },
      { category: "Offences Against Body", fir_count: 3604, percentage: 24.3, acts_sections: "IPC Sec 302 / BNS Sec 103 (Murder)", head_id: 2 },
      { category: "Financial Fraud", fir_count: 2476, percentage: 16.7, acts_sections: "IPC Sec 420 / BNS Sec 318 (Cheating)", head_id: 3 },
      { category: "Cyber Crimes", fir_count: 2091, percentage: 14.1, acts_sections: "Information Technology Act Sec 66/66D", head_id: 4 },
      { category: "Other Violations (SLL)", fir_count: 807, percentage: 5.4, acts_sections: "Special & Local Laws (SLL)", head_id: 5 }
    ],

    // 4. AI Alerts (Correlation of CaseMaster, Accused, and ActSectionAssociation)
    ai_alerts: [
      {
        alert_id: "ALT-2026-0891",
        severity: "CRITICAL",
        message: "Pattern Match: Whitefield PS (UnitID: 4120) reports 5 cyber fraud incidents (IT Act Sec 66D) within 12 hours. BriefFacts MO match syndicate active in Bengaluru East.",
        timestamp: "2026-07-17 13:45",
        impacted_jurisdiction: "Whitefield PS, Bengaluru City",
        correlated_cases: ["104434120202600184", "104434120202600185", "104434120202600189"], // CrimeNo format
        status: "NEW"
      },
      {
        alert_id: "ALT-2026-0892",
        severity: "HIGH",
        message: "Potential Crime Pattern: HAL PS (UnitID: 4125) reports 3 residential burglaries (BNS Sec 303) with identical lock-picking details. Historical MO matches Accused Master ID: 2038 (on bail).",
        timestamp: "2026-07-17 11:20",
        impacted_jurisdiction: "HAL PS, Bengaluru City",
        correlated_cases: ["104434125202600210", "104434125202600215"],
        status: "INVESTIGATING"
      },
      {
        alert_id: "ALT-2026-0893",
        severity: "MEDIUM",
        message: "Predictive Analytics anomaly: QuickML forecasts an 18% spike in property thefts (IPC Sec 379) in Koramangala (UnitID: 4108) over the weekend based on CaseMaster timelines.",
        timestamp: "2026-07-17 09:00",
        impacted_jurisdiction: "Koramangala PS, Bengaluru City",
        correlated_cases: [],
        status: "ACKNOWLEDGED"
      }
    ],

    // 5. Recent Critical Cases (Details from CaseMaster join Employee, Accused, and CaseStatusMaster)
    recent_critical_cases: [
      {
        CaseMasterID: 9042,
        CrimeNo: "104434108202600244", // 1 (FIR) + 0443 (Bengaluru Dist) + 4108 (Koramangala Station) + 2026 (Year) + 00244 (Serial)
        CaseNo: "202600244",
        UnitName: "Koramangala Police Station",
        DistrictName: "Bengaluru City",
        CrimeRegisteredDate: "2026-07-17",
        IncidentFromDate: "2026-07-17 04:30",
        act_sections: "IPC Sec 395 (Dacoity) / BNS Sec 310",
        CaseStatusName: "Under Investigation",
        BriefFacts: "Group of five masked individuals entered commercial warehouse, threatened security personnel, and seized electronic equipment valued at 14.5 Lakhs.",
        investigating_officer: {
          EmployeeID: 104,
          FirstName: "Ramesh Gowda",
          KGID: "KSP-8821",
          RankName: "PSI"
        },
        suspects: [
          { AccusedMasterID: 2045, AccusedName: "Kiran Kumar (alias 'Appu')", PersonID: "A1", ApprehensionStatus: "Absconding" },
          { AccusedMasterID: 2046, AccusedName: "Mohan Lal", PersonID: "A2", ApprehensionStatus: "Detained" }
        ],
        risk_index: "CRITICAL"
      },
      {
        CaseMasterID: 9041,
        CrimeNo: "104434120202600184",
        CaseNo: "202600184",
        UnitName: "Whitefield Police Station",
        DistrictName: "Bengaluru City",
        CrimeRegisteredDate: "2026-07-17",
        IncidentFromDate: "2026-07-16 14:00",
        act_sections: "IT Act Sec 66D / IPC Sec 420 (Cheating by Personation)",
        CaseStatusName: "Suspect Apprehended",
        BriefFacts: "Victim received fraudulent communication claiming to be from bank authorities, leading to unauthorized transfer of 4.2 Lakhs via cyber channels.",
        investigating_officer: {
          EmployeeID: 211,
          FirstName: "Suresh Kumar",
          KGID: "KSP-9140",
          RankName: "PSI"
        },
        suspects: [
          { AccusedMasterID: 2038, AccusedName: "Vijay Shankar", PersonID: "A1", ApprehensionStatus: "Judicial Custody" }
        ],
        risk_index: "HIGH"
      },
      {
        CaseMasterID: 9038,
        CrimeNo: "104434125202600092",
        CaseNo: "202600092",
        UnitName: "HAL Police Station",
        DistrictName: "Bengaluru City",
        CrimeRegisteredDate: "2026-07-16",
        IncidentFromDate: "2026-07-15 22:15",
        act_sections: "IPC Sec 302 (Murder) / BNS Sec 103",
        CaseStatusName: "Charge-sheet Submitted",
        BriefFacts: "Homicide resulting from a violent street dispute in HAL 3rd Stage. Murder weapon recovered and logged as evidence in accordance with seizure details.",
        investigating_officer: {
          EmployeeID: 108,
          FirstName: "M. N. Patil",
          KGID: "KSP-7402",
          RankName: "CPI"
        },
        suspects: [
          { AccusedMasterID: 2011, AccusedName: "Ravi Naik", PersonID: "A1", ApprehensionStatus: "Judicial Custody" }
        ],
        risk_index: "CRITICAL"
      },
      {
        CaseMasterID: 9037,
        CrimeNo: "104434130202600312",
        CaseNo: "202600312",
        UnitName: "Indiranagar Police Station",
        DistrictName: "Bengaluru City",
        CrimeRegisteredDate: "2026-07-15",
        IncidentFromDate: "2026-07-15 18:30",
        act_sections: "IPC Sec 379 (Theft) / BNS Sec 303",
        CaseStatusName: "Under Investigation",
        BriefFacts: "Vehicle theft reported in Indiranagar 100 Feet Road. Two-wheeler registered in Karnataka (KA-03-XX-XXXX) stolen from parking spot.",
        investigating_officer: {
          EmployeeID: 154,
          FirstName: "Anitha Rani",
          KGID: "KSP-1140",
          RankName: "ASI"
        },
        suspects: [
          { AccusedMasterID: 2012, AccusedName: "Unknown", PersonID: "A1", ApprehensionStatus: "Unidentified" }
        ],
        risk_index: "MEDIUM"
      }
    ]
  }
};

/**
 * Fetches dashboard analytical intelligence from the database.
 * In production, this will use Zoho Catalyst SDK / Functions.
 */
export const fetchDashboardData = async () => {
  return new Promise((resolve) => {
    // Simulating slight network latency
    setTimeout(() => {
      resolve(MOCK_CATALYST_DASHBOARD_RESPONSE);
    }, 400);
  });
};

/**
 * Triggers a simulated action on the backend (Zoho Catalyst Integration Function).
 */
export const triggerAction = async (actionType, params = {}) => {
  return new Promise((resolve) => {
    console.log(`[Catalyst Function Trigger] Calling function corresponding to action: ${actionType}`, params);
    setTimeout(() => {
      resolve({
        status: "success",
        message: `Successfully executed Zoho Catalyst Function: ${actionType}`,
        executed_at: new Date().toISOString()
      });
    }, 500);
  });
};
