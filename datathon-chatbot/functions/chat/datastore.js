/**
 * ============================================================================
 * File: functions/chat/datastore.js
 * ----------------------------------------------------------------------------
 * Data Access Layer (Repository) for Zoho Catalyst Data Store
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * • Connect to Catalyst Data Store table "CrimeRecords"
 * • Perform CRUD operations (Get, Create, Update, Delete)
 * • Maintain persistent local Datastore fallback ("datastore_db.json")
 * • Return normalized objects across the platform
 * ============================================================================
 */

const catalyst = require("zcatalyst-sdk-node");
const fs = require("fs");
const path = require("path");

const LOCAL_DB_PATH = path.join(__dirname, "datastore_db.json");
const INITIAL_SEED_PATH = path.join(__dirname, "local_crime_records.json");

const loadLocalDb = () => {
    try {
        if (!fs.existsSync(LOCAL_DB_PATH)) {
            if (fs.existsSync(INITIAL_SEED_PATH)) {
                const initial = fs.readFileSync(INITIAL_SEED_PATH, "utf-8");
                fs.writeFileSync(LOCAL_DB_PATH, initial, "utf-8");
            } else {
                fs.writeFileSync(LOCAL_DB_PATH, "[]", "utf-8");
            }
        }
        const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading local Datastore DB file:", err);
        return [];
    }
};

const saveLocalDb = (data) => {
    try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
        console.error("Error writing to local Datastore DB file:", err);
    }
};

class CrimeRepository {

    constructor(req) {
        try {
            this.app = catalyst.initialize(req);
            this.datastore = this.app.datastore();
            this.table = this.datastore.table("CrimeRecords");
        } catch (err) {
            this.app = null;
            this.table = null;
        }
    }

    /**
     * Normalize raw Catalyst Datastore row object into official ER Diagram CaseMaster model
     */
    normalizeRow(row) {
        const id = String(row.CaseMasterID || row.ROWID || row.id || Date.now());
        const crimeNo = row.CrimeNo || row.crimeNo || `1044300062026${String(id).padStart(5, "0")}`;
        const caseNo = row.CaseNo || row.caseNo || `2026${String(id).padStart(5, "0")}`;

        return {
            // Official ER Diagram Table Attributes
            CaseMasterID: Number(row.CaseMasterID || row.ROWID || id),
            CrimeNo: crimeNo,
            CaseNo: caseNo,
            CrimeRegisteredDate: row.CrimeRegisteredDate || row.regDate || row.CrimeDate || "2026-07-17",
            PolicePersonID: Number(row.PolicePersonID || 201),
            PoliceStationID: Number(row.PoliceStationID || 301),
            CaseCategoryID: Number(row.CaseCategoryID || 1),
            GravityOffenceID: Number(row.GravityOffenceID || 1),
            CrimeMajorHeadID: Number(row.CrimeMajorHeadID || 1),
            CrimeMinorHeadID: Number(row.CrimeMinorHeadID || 101),
            CaseStatusID: Number(row.CaseStatusID || 1),
            CourtID: Number(row.CourtID || 501),
            IncidentFromDate: row.IncidentFromDate || `${row.regDate || "2026-07-17"}T10:00:00`,
            IncidentToDate: row.IncidentToDate || `${row.regDate || "2026-07-17"}T11:30:00`,
            InfoReceivedPSDate: row.InfoReceivedPSDate || `${row.regDate || "2026-07-17"}T12:00:00`,
            latitude: Number(row.latitude || row.lat || row.Latitude || 12.9716),
            longitude: Number(row.longitude || row.lng || row.Longitude || 77.5946),
            BriefFacts: row.BriefFacts || row.Description || row.briefFacts || "FIR incident registered into CCTNS.",

            // Relational Child Data Objects
            ComplainantDetails: row.ComplainantDetails || {
                ComplainantID: 3000,
                ComplainantName: row.ComplainantName || row.complainantName || "Citizen Complainant",
                AgeYear: 38,
                OccupationID: 1,
                ReligionID: 1,
                CasteID: 1,
                GenderID: 1
            },

            ActSectionAssociation: row.ActSectionAssociation || [
                {
                    CaseMasterID: Number(row.CaseMasterID || id),
                    ActID: "IPC",
                    SectionID: row.actSections || row.ActSections || "IPC Sec 379",
                    ActOrderID: 1,
                    SectionOrderID: 1
                }
            ],

            Victim: row.Victim || [
                {
                    VictimMasterID: 4000,
                    VictimName: "Victim Person",
                    AgeYear: 30,
                    GenderID: 1,
                    VictimPolice: "0"
                }
            ],

            Accused: row.Accused || [
                {
                    AccusedMasterID: 5000,
                    AccusedName: row.AccusedName || row.accusedName || "Unidentified Suspect",
                    AgeYear: 28,
                    GenderID: 1,
                    PersonID: "A1"
                }
            ],

            ArrestSurrender: row.ArrestSurrender || [
                {
                    ArrestSurrenderID: 6000,
                    ArrestSurrenderTypeID: 1,
                    ArrestSurrenderDate: row.regDate || "2026-07-17",
                    IOID: Number(row.PolicePersonID || 201),
                    IsAccused: 1
                }
            ],

            ChargesheetDetails: row.ChargesheetDetails || {
                CSID: 7000,
                csdate: row.regDate || "2026-07-17",
                cstype: "U",
                PolicePersonID: Number(row.PolicePersonID || 201)
            },

            // UI Display Helper Attributes
            id: `fir-${id}`,
            ROWID: Number(id),
            crimeNo: crimeNo,
            caseNo: caseNo,
            regDate: row.CrimeRegisteredDate || row.regDate || row.CrimeDate || "2026-07-17",
            district: row.District || row.district || "Bengaluru City",
            District: row.District || row.district || "Bengaluru City",
            unit: row.PoliceStation || row.unit || row.policeStation || "City Station 1",
            PoliceStation: row.PoliceStation || row.unit || row.policeStation || "City Station 1",
            crimeHead: row.CrimeCategory || row.crimeHead || row.category || "Property Offences",
            CrimeCategory: row.CrimeCategory || row.crimeHead || row.category || "Property Offences",
            crimeSubHead: row.crimeSubHead || "Commercial Theft",
            actSections: row.ActSections || row.actSections || "IPC Sec 379",
            ActSections: row.ActSections || row.actSections || "IPC Sec 379",
            severity: row.Severity || row.severity || "MEDIUM",
            Severity: row.Severity || row.severity || "MEDIUM",
            status: row.Status || row.status || "Under Investigation",
            Status: row.Status || row.status || "Under Investigation",
            complainantName: (row.ComplainantDetails && row.ComplainantDetails.ComplainantName) || row.ComplainantName || row.complainantName || "Citizen Complainant",
            ComplainantName: (row.ComplainantDetails && row.ComplainantDetails.ComplainantName) || row.ComplainantName || row.complainantName || "Citizen Complainant",
            allottedOfficerName: row.OfficerName || row.allottedOfficerName || row.officer || "Ramesh Gowda",
            OfficerName: row.OfficerName || row.allottedOfficerName || row.officer || "Ramesh Gowda",
            allottedOfficerRank: row.allottedOfficerRank || "PSI",
            allottedOfficerKgid: row.allottedOfficerKgid || "KSP-8821",
            accusedName: (row.Accused && row.Accused[0] && row.Accused[0].AccusedName) || row.AccusedName || row.accusedName || "Unidentified Suspect",
            AccusedName: (row.Accused && row.Accused[0] && row.Accused[0].AccusedName) || row.AccusedName || row.accusedName || "Unidentified Suspect",
            briefFacts: row.BriefFacts || row.Description || row.briefFacts || "Incident investigation active.",
            Description: row.BriefFacts || row.Description || row.briefFacts || "Incident investigation active.",
            propertyDescription: row.propertyDescription || "Evidence logged into CCTNS",
            estimatedValue: Number(row.estimatedValue || 250000),
            officialReportImage: row.officialReportImage || "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop",
            lat: Number(row.latitude || row.lat || row.Latitude || 12.9716),
            lng: Number(row.longitude || row.lng || row.Longitude || 77.5946),
            locationStreet: row.locationStreet || row.LocationStreet || row.District || "Main Road"
        };
    }

    /**
     * Fetch all crime records from Catalyst Datastore
     */
    async getAllCrimeRecords(filters = {}) {
        let rows;
        try {
            if (this.table) {
                rows = await this.table.getAllRows();
            } else {
                rows = loadLocalDb();
            }
        } catch (err) {
            console.warn("[Catalyst Datastore] Datastore query fallback to local DB persistence:", err.message);
            rows = loadLocalDb();
        }

        let normalized = rows.map((r) => this.normalizeRow(r));

        // Filter by district if provided
        if (filters.district) {
            normalized = normalized.filter((r) => r.district.toLowerCase() === filters.district.toLowerCase());
        }

        // Filter by category
        if (filters.category) {
            normalized = normalized.filter((r) => r.crimeHead.toLowerCase() === filters.category.toLowerCase());
        }

        return normalized;
    }

    /**
     * Alias for getCrimeAnalyticsData used by chat function
     */
    async getCrimeAnalyticsData(filters = {}) {
        return this.getAllCrimeRecords(filters);
    }

    /**
     * Create new crime record in Catalyst Datastore
     */
    async createCrimeRecord(recordData) {
        const newRow = {
            ROWID: Date.now(),
            CrimeNo: recordData.crimeNo || `KSP/${Math.floor(1000 + Math.random() * 9000)}/2026`,
            District: recordData.district || "Bengaluru City",
            PoliceStation: recordData.unit || "City Station 1",
            OfficerName: recordData.allottedOfficerName || "Insp. Ravi Kumar",
            CrimeCategory: recordData.crimeHead || "Property Offences",
            Status: recordData.status || "Under Investigation",
            CrimeDate: recordData.regDate || new Date().toISOString().split("T")[0],
            Latitude: Number(recordData.lat) || 12.9716,
            Longitude: Number(recordData.lng) || 77.5946,
            Severity: recordData.severity || "MEDIUM",
            Description: recordData.briefFacts || "Registered FIR entry",
            ComplainantName: recordData.complainantName || "Complainant",
            ComplainantPhone: recordData.complainantPhone || "+91 98450 00000",
            ActSections: recordData.actSections || "IPC Section 379",
            AccusedName: recordData.accusedName || "Unidentified Suspect",
            LocationStreet: recordData.locationStreet || recordData.district || "City Center"
        };

        try {
            if (this.table) {
                const inserted = await this.table.insertRow(newRow);
                return this.normalizeRow(inserted);
            }
        } catch (err) {
            console.warn("[Catalyst Datastore] Direct table insert fallback to local DB:", err.message);
        }

        const db = loadLocalDb();
        db.unshift(newRow);
        saveLocalDb(db);
        return this.normalizeRow(newRow);
    }

    /**
     * Update crime record in Catalyst Datastore
     */
    async updateCrimeRecord(id, recordData) {
        try {
            if (this.table) {
                const updatedRow = {
                    ROWID: id,
                    CrimeNo: recordData.crimeNo,
                    District: recordData.district,
                    PoliceStation: recordData.unit,
                    OfficerName: recordData.allottedOfficerName,
                    CrimeCategory: recordData.crimeHead,
                    Status: recordData.status,
                    CrimeDate: recordData.regDate,
                    Latitude: Number(recordData.lat),
                    Longitude: Number(recordData.lng),
                    Severity: recordData.severity,
                    Description: recordData.briefFacts,
                    ComplainantName: recordData.complainantName,
                    ComplainantPhone: recordData.complainantPhone,
                    ActSections: recordData.actSections,
                    AccusedName: recordData.accusedName,
                    LocationStreet: recordData.locationStreet
                };
                const updated = await this.table.updateRow(updatedRow);
                return this.normalizeRow(updated);
            }
        } catch (err) {
            console.warn("[Catalyst Datastore] Direct table update fallback to local DB:", err.message);
        }

        const db = loadLocalDb();
        const idx = db.findIndex((r) => String(r.ROWID || r.id) === String(id));
        if (idx !== -1) {
            db[idx] = {
                ...db[idx],
                CrimeNo: recordData.crimeNo || db[idx].CrimeNo,
                District: recordData.district || db[idx].District,
                PoliceStation: recordData.unit || db[idx].PoliceStation,
                OfficerName: recordData.allottedOfficerName || db[idx].OfficerName,
                CrimeCategory: recordData.crimeHead || db[idx].CrimeCategory,
                Status: recordData.status || db[idx].Status,
                CrimeDate: recordData.regDate || db[idx].CrimeDate,
                Latitude: recordData.lat ? Number(recordData.lat) : db[idx].Latitude,
                Longitude: recordData.lng ? Number(recordData.lng) : db[idx].Longitude,
                Severity: recordData.severity || db[idx].Severity,
                Description: recordData.briefFacts || db[idx].Description,
                ComplainantName: recordData.complainantName || db[idx].ComplainantName,
                ComplainantPhone: recordData.complainantPhone || db[idx].ComplainantPhone,
                ActSections: recordData.actSections || db[idx].ActSections,
                AccusedName: recordData.accusedName || db[idx].AccusedName,
                LocationStreet: recordData.locationStreet || db[idx].LocationStreet
            };
            saveLocalDb(db);
            return this.normalizeRow(db[idx]);
        }
        throw new Error(`Record with ID ${id} not found in Datastore.`);
    }

    /**
     * Delete crime record from Catalyst Datastore
     */
    async deleteCrimeRecord(id) {
        try {
            if (this.table) {
                await this.table.deleteRow(id);
                return { success: true, id };
            }
        } catch (err) {
            console.warn("[Catalyst Datastore] Direct table delete fallback to local DB:", err.message);
        }

        const db = loadLocalDb();
        const filtered = db.filter((r) => String(r.ROWID || r.id) !== String(id));
        saveLocalDb(filtered);
        return { success: true, id };
    }
}

module.exports = CrimeRepository;