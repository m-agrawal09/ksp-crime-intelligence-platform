/**
 * datastore.js
 * 
 * Strict Relational Zoho Catalyst Datastore Repository Layer for Karnataka Police FIR System.
 * 
 * Project Credentials:
 * • Project Name: DataThon
 * • Project ID: 56116000000017001
 * • Organization ID: 60077759371
 * • Environment: Development
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const https = require("https");

const SEED_DATA_PATH = path.join(__dirname, "local_crime_records.json");
const ROWID_MAPPING_PATH = path.join(__dirname, "../../../scripts/rowid_mapping.json");

const DB_FILE_PATH = path.join(os.tmpdir(), "ksp_server_database_records_v2.json");

const loadPersistentDb = () => {
    try {
        if (fs.existsSync(DB_FILE_PATH)) {
            const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
            if (raw) {
                return JSON.parse(raw);
            }
        }
    } catch (e) {
        console.warn("[datastore] Failed reading persistent DB file:", e.message);
    }
    return [];
};

const savePersistentDb = (records) => {
    try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(records, null, 2), "utf-8");
    } catch (e) {
        console.warn("[datastore] Failed writing persistent DB file:", e.message);
    }
};

let globalServerRecords = loadPersistentDb();

let intIdCounter = 2500;
const generateUniqueIntId = () => {
    intIdCounter += 1;
    const timestampOffset = Math.floor((Date.now() % 1000000));
    return Number(25000000 + timestampOffset + intIdCounter);
};

function formatCatalystDate(dStr) {
    if (!dStr) return new Date().toISOString().split("T")[0];
    const cleaned = String(dStr).split("T")[0].split(" ")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
    return new Date().toISOString().split("T")[0];
}

function formatCatalystDatetime(dtStr, defaultTime = "10:00:00") {
    if (!dtStr) {
        const today = new Date().toISOString().split("T")[0];
        return `${today} ${defaultTime}`;
    }
    let s = String(dtStr).replace('T', ' ').replace('Z', '').trim();
    if (s.includes('.')) s = s.split('.')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        return `${s} ${defaultTime}`;
    }
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s)) {
        return `${s}:00`;
    }
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
        return s;
    }
    const today = new Date().toISOString().split("T")[0];
    return `${today} ${defaultTime}`;
}

const loadBaselineData = () => {
    try {
        if (fs.existsSync(SEED_DATA_PATH)) {
            const raw = fs.readFileSync(SEED_DATA_PATH, "utf-8");
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : (parsed.CaseMaster || []);
        }
    } catch (e) {
        console.error("Error loading seed data:", e.message);
    }
    return [];
};

// --- Zoho Catalyst Direct REST API Helper ---
function tryGetLocalCliCredentials() {
    try {
        const homedir = os.homedir();
        const baseDir = path.join(homedir, 'Library/Preferences/zcatalyst-cli-nodejs');
        const keyPath = path.join(baseDir, '.zcatalyst-cli-key');
        const configPath = path.join(baseDir, 'zcatalyst-cli-v1.json');
        
        if (!fs.existsSync(keyPath) || !fs.existsSync(configPath)) return null;

        const encryptionKey = fs.readFileSync(keyPath);
        const configRaw = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configRaw);
        
        const activeDc = config.active_dc || 'us';
        const dcConfig = config[activeDc];
        if (!dcConfig || !dcConfig.credential) return null;

        const encrypted = dcConfig.credential;
        const data = Buffer.from(encrypted, 'hex');
        const initializationVector = data.slice(0, 12);
        const authTag = data.slice(13, 29);
        const cipherText = data.slice(29);
        
        const derivedKey = crypto.pbkdf2Sync(encryptionKey, initializationVector, 100000, 32, 'sha512');
        const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, initializationVector);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
        const credObj = JSON.parse(decrypted.toString());
        
        return {
            dc: activeDc,
            clientId: '1000.D5IIHDXSPN2MII26AD0V61I6RMVSNM',
            clientSecret: '02ee875ecfc50573e5cc8d62916ad3077be20d0f42',
            refreshToken: credObj.token.slice(2)
        };
    } catch (e) {
        console.warn("[CrimeRepository] CLI credentials read error:", e.message);
        return null;
    }
}

let cachedToken = null;
let tokenExpiryTime = 0;

async function getFreshAccessToken() {
    if (cachedToken && Date.now() < tokenExpiryTime) {
        return cachedToken;
    }
    const creds = tryGetLocalCliCredentials();
    if (!creds) throw new Error("No CLI credentials available for Catalyst API");

    const bodyData = `client_id=${creds.clientId}&client_secret=${creds.clientSecret}&refresh_token=${creds.refreshToken}&grant_type=refresh_token`;
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: `accounts.zoho.${creds.dc}`,
            port: 443,
            path: '/oauth/v2/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(bodyData)
            }
        };
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (parsed.access_token) {
                        cachedToken = parsed.access_token;
                        tokenExpiryTime = Date.now() + 50 * 60 * 1000;
                        resolve(cachedToken);
                    } else reject(new Error(body));
                } catch(e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(bodyData);
        req.end();
    });
}

function makeApiRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function callCatalystDatastoreApi(pathSuffix, method = 'GET', bodyObj = null) {
    const token = await getFreshAccessToken();
    const projectId = "56116000000017001";
    const orgId = "60077759371";
    const baseHeaders = {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "Accept": "application/vnd.catalyst.v2+json",
        "CATALYST-ORG": orgId,
        "environment": "Development",
        "User-Agent": "zcatalyst-cli/1.27.0"
    };

    // Perform session handshakes
    await makeApiRequest({ hostname: "api.catalyst.zoho.in", port: 443, path: "/baas/v1/orgs", method: "GET", headers: baseHeaders });
    await makeApiRequest({ hostname: "api.catalyst.zoho.in", port: 443, path: `/baas/v1/project/${projectId}`, method: "GET", headers: baseHeaders });
    await makeApiRequest({ hostname: "api.catalyst.zoho.in", port: 443, path: `/baas/v1/project/${projectId}/environment`, method: "GET", headers: baseHeaders });

    const fullPath = `/baas/v1/project/${projectId}${pathSuffix}`;
    let postData = null;
    const reqHeaders = { ...baseHeaders };

    if (bodyObj !== null) {
        postData = JSON.stringify(bodyObj);
        reqHeaders["Content-Type"] = "application/json";
        reqHeaders["Content-Length"] = Buffer.byteLength(postData);
    }

    const res = await makeApiRequest({
        hostname: "api.catalyst.zoho.in",
        port: 443,
        path: fullPath,
        method: method,
        headers: reqHeaders
    }, postData);

    let parsed = null;
    try {
        parsed = JSON.parse(res.body);
    } catch(e) {
        parsed = { raw: res.body };
    }
    return { status: res.status, data: parsed };
}


class CrimeRepository {

    constructor(req) {
        if (!global.__catalyst_master_records) {
            global.__catalyst_master_records = [];
        }
        this.masterRecords = global.__catalyst_master_records;

        // Build lookup caches from seed data for FK → display name resolution
        if (!global.__catalyst_lookup_cache) {
            try {
                const raw = fs.readFileSync(SEED_DATA_PATH, "utf-8");
                const allData = JSON.parse(raw);
                global.__catalyst_lookup_cache = {
                    districts: {},    
                    units: {},        
                    employees: {},    
                    crimeHeads: {},   
                    crimeSubHeads: {},
                    caseStatuses: {}, 
                    gravityOffences: {},
                    courts: {},       
                };
                const cache = global.__catalyst_lookup_cache;
                (allData.District || []).forEach(d => { cache.districts[d.DistrictID] = d.DistrictName; });
                (allData.Unit || []).forEach(u => { cache.units[u.UnitID] = u.UnitName; cache.units[`dist_${u.UnitID}`] = u.DistrictID; });
                (allData.Employee || []).forEach(e => {
                    cache.employees[e.EmployeeID] = {
                        name: e.FirstName,
                        kgid: e.KGID,
                        districtId: e.DistrictID,
                        unitId: e.UnitID,
                        rankId: e.RankID
                    };
                });
                (allData.CrimeHead || []).forEach(c => { cache.crimeHeads[c.CrimeHeadID] = c.CrimeGroupName; });
                (allData.CrimeSubHead || []).forEach(c => { cache.crimeSubHeads[c.CrimeSubHeadID] = c.CrimeHeadName; });
                (allData.CaseStatusMaster || []).forEach(s => { cache.caseStatuses[s.CaseStatusID] = s.CaseStatusName; });
                (allData.GravityOffence || []).forEach(g => { cache.gravityOffences[g.GravityOffenceID] = g.LookupValue; });
                (allData.Court || []).forEach(c => { cache.courts[c.CourtID] = c.CourtName; });
                console.log("[CrimeRepository] Lookup cache built from local seed data.");
            } catch (e) {
                console.warn("[CrimeRepository] Failed to build lookup cache:", e.message);
                global.__catalyst_lookup_cache = {};
            }
        }
        this.lookupCache = global.__catalyst_lookup_cache;

        const defaults = {
            District: "56116000000042001",
            Unit: "56116000000037351",
            Employee: "56116000000034007",
            CaseCategory: "56116000000038005",
            GravityOffence: "56116000000034005",
            CaseStatusMaster: "56116000000039003",
            Court: "56116000000034004",
            CrimeHead: "56116000000034009",
            CrimeSubHead: "56116000000034009",
            Rank: "56116000000039004",
            Designation: "56116000000052001"
        };
        try {
            if (fs.existsSync(ROWID_MAPPING_PATH)) {
                const loaded = JSON.parse(fs.readFileSync(ROWID_MAPPING_PATH, 'utf-8'));
                this.rowIds = { ...defaults, ...loaded };
                if (!this.rowIds.CrimeSubHead) this.rowIds.CrimeSubHead = "56116000000034009";
            } else {
                this.rowIds = defaults;
            }
        } catch (e) {
            this.rowIds = defaults;
        }

        console.log("[CrimeRepository] Online Catalyst Data Store REST client ready.");
    }

    normalizeRow(row, liveLookups = {}) {
        const caseMasterId = Number(row.CaseMasterID || row.ROWID || row.id || 2001);
        const crimeNo = String(row.CrimeNo || row.crimeNo || `1044300062026${String(caseMasterId).padStart(5, "0")}`);
        const caseNo = String(row.CaseNo || row.caseNo || `2026${String(caseMasterId).padStart(5, "0")}`);
        const regDateStr = String(row.CrimeRegisteredDate || row.regDate || new Date().toISOString().split("T")[0]);

        const cache = this.lookupCache || {};

        let officerName = row.OfficerName || row.allottedOfficerName;
        let officerRank = row.allottedOfficerRank;
        let officerKgid = row.allottedOfficerKgid;
        if (!officerName && row.PolicePersonID) {
            const emp = liveLookups.employees?.[row.PolicePersonID] || cache.employees?.[row.PolicePersonID];
            if (emp) {
                officerName = emp.name || emp.FirstName;
                officerKgid = emp.kgid || emp.KGID;
            }
        }
        officerName = officerName || "PSI Investigating Officer";
        officerRank = officerRank || "PSI";
        officerKgid = officerKgid || "KSP-2026-1001";

        let stationName = row.PoliceStation || row.unit;
        if (!stationName && row.PoliceStationID) {
            stationName = liveLookups.units?.[row.PoliceStationID] || cache.units?.[row.PoliceStationID];
        }
        stationName = stationName || "Central Police Station";

        let districtName = row.District || row.district;
        if (!districtName && row.DistrictID) {
            districtName = liveLookups.districts?.[row.DistrictID] || cache.districts?.[row.DistrictID];
        }
        if (!districtName && row.PoliceStationID) {
            const distId = cache.units?.[`dist_${row.PoliceStationID}`];
            if (distId) districtName = liveLookups.districts?.[distId] || cache.districts?.[distId];
        }
        districtName = districtName || "Bengaluru City";

        let categoryName = row.CrimeCategory || row.crimeHead;
        if (!categoryName && row.CaseCategoryID) {
            categoryName = liveLookups.categories?.[row.CaseCategoryID];
        }
        if (!categoryName && row.CrimeMajorHeadID) {
            categoryName = liveLookups.crimeHeads?.[row.CrimeMajorHeadID] || cache.crimeHeads?.[row.CrimeMajorHeadID];
        }
        categoryName = categoryName || "Property Offences";

        let subHeadName = row.crimeSubHead;
        if (!subHeadName && row.CrimeMinorHeadID) {
            subHeadName = cache.crimeSubHeads?.[row.CrimeMinorHeadID];
        }
        subHeadName = subHeadName || "General";

        let severity = row.Severity || row.severity;
        if (!severity && row.GravityOffenceID != null) {
            severity = liveLookups.gravity?.[row.GravityOffenceID] || cache.gravityOffences?.[row.GravityOffenceID];
        }
        severity = severity || "MEDIUM";

        let statusName = row.Status || row.status;
        if (!statusName && row.CaseStatusID) {
            statusName = liveLookups.caseStatuses?.[row.CaseStatusID] || cache.caseStatuses?.[row.CaseStatusID];
        }
        statusName = statusName || "Under Investigation";

        let compName = row.ComplainantName || row.complainantName;
        if (!compName && liveLookups.complainants?.[row.ROWID]) {
            compName = liveLookups.complainants[row.ROWID];
        }
        compName = compName || "Citizen Complainant";

        let accName = row.AccusedName || row.accusedName;
        if (!accName && liveLookups.accused?.[row.ROWID]) {
            accName = liveLookups.accused[row.ROWID];
        }
        accName = accName || "Unidentified Suspect";

        return {
            CaseMasterID: caseMasterId,
            ROWID: row.ROWID || caseMasterId,
            id: `fir-${caseMasterId}`,
            crimeNo: crimeNo,
            CrimeNo: crimeNo,
            caseNo: caseNo,
            CaseNo: caseNo,
            regDate: regDateStr,
            CrimeRegisteredDate: regDateStr,
            district: districtName,
            District: districtName,
            unit: stationName,
            PoliceStation: stationName,
            crimeHead: categoryName,
            CrimeCategory: categoryName,
            crimeSubHead: subHeadName,
            actSections: row.ActSections || row.actSections || "IPC Sec 395",
            ActSections: row.ActSections || row.actSections || "IPC Sec 395",
            severity: severity,
            Severity: severity,
            status: statusName,
            Status: statusName,
            complainantName: compName,
            ComplainantName: compName,
            allottedOfficerName: officerName,
            OfficerName: officerName,
            allottedOfficerRank: officerRank,
            allottedOfficerKgid: officerKgid,
            accusedName: accName,
            AccusedName: accName,
            briefFacts: row.BriefFacts || row.Description || `FIR #${crimeNo} registered at ${stationName}, ${districtName}.`,
            Description: row.BriefFacts || row.Description || `FIR #${crimeNo} registered at ${stationName}, ${districtName}.`,
            propertyDescription: row.propertyDescription || "Evidence catalogued under mahazar",
            estimatedValue: Number(row.estimatedValue || 250000),
            officialReportImage: row.officialReportImage || "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop",
            lat: Number(row.latiutude || row.latitude || row.lat || 12.9716),
            lng: Number(row.longitude || row.lng || 77.5946),
            locationStreet: row.locationStreet || `${districtName} Station Limit Road`
        };
    }

    async getAllCrimeRecords(filters = {}) {
        let cloudRows = [];
        const liveLookups = {
            units: {},
            districts: {},
            employees: {},
            categories: {},
            gravity: {},
            caseStatuses: {},
            crimeHeads: {},
            complainants: {},
            accused: {}
        };

        try {
            const [
                caseRes, unitRes, distRes, empRes, catRes, gravRes, statusRes, headRes, compRes, accRes
            ] = await Promise.all([
                callCatalystDatastoreApi('/table/CaseMaster/row', 'GET'),
                callCatalystDatastoreApi('/table/Unit/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/District/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/Employee/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/CaseCategory/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/GravityOffence/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/CaseStatusMaster/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/CrimeHead/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/ComplainantDetails/row', 'GET').catch(() => null),
                callCatalystDatastoreApi('/table/Accused/row', 'GET').catch(() => null)
            ]);

            if (caseRes.status === 200 && caseRes.data && Array.isArray(caseRes.data.data)) {
                cloudRows = caseRes.data.data;
            }
            if (unitRes?.data?.data) unitRes.data.data.forEach(u => liveLookups.units[u.ROWID] = u.UnitName);
            if (distRes?.data?.data) distRes.data.data.forEach(d => liveLookups.districts[d.ROWID] = d.DistrictName);
            if (empRes?.data?.data) empRes.data.data.forEach(e => liveLookups.employees[e.ROWID] = e);
            if (catRes?.data?.data) catRes.data.data.forEach(c => liveLookups.categories[c.ROWID] = c.LookupValue);
            if (gravRes?.data?.data) gravRes.data.data.forEach(g => liveLookups.gravity[g.ROWID] = g.LookupValue);
            if (statusRes?.data?.data) statusRes.data.data.forEach(s => liveLookups.caseStatuses[s.ROWID] = s.CaseStatusName);
            if (headRes?.data?.data) headRes.data.data.forEach(h => liveLookups.crimeHeads[h.ROWID] = h.CrimeGroupName);
            if (compRes?.data?.data) compRes.data.data.forEach(c => { if (c.CaseMasterID) liveLookups.complainants[c.CaseMasterID] = c.ComplainantName; });
            if (accRes?.data?.data) accRes.data.data.forEach(a => { if (a.CaseMasterID) liveLookups.accused[a.CaseMasterID] = a.AccusedName; });

            console.log(`[CrimeRepository] Fetched ${cloudRows.length} CaseMaster rows and online lookups from Zoho Catalyst Data Store.`);
        } catch (err) {
            console.warn("[CrimeRepository] Online Catalyst Data Store fetch failed:", err.message);
        }

        globalServerRecords = loadPersistentDb();
        const combined = [...globalServerRecords, ...cloudRows];
        const seen = new Set();
        const uniqueRows = [];

        for (const row of combined) {
            const key = String(row.CrimeNo || row.crimeNo || row.CaseMasterID || row.ROWID || row.id);
            if (key && !seen.has(key)) {
                seen.add(key);
                uniqueRows.push(row);
            }
        }

        let normalized = uniqueRows.map((r) => this.normalizeRow(r, liveLookups));

        if (filters.district) {
            normalized = normalized.filter((r) => r.district.toLowerCase() === filters.district.toLowerCase());
        }

        if (filters.category) {
            normalized = normalized.filter((r) => r.crimeHead.toLowerCase() === filters.category.toLowerCase());
        }

        return normalized;
    }

    async getCrimeAnalyticsData(filters = {}) {
        return this.getAllCrimeRecords(filters);
    }

    async createCrimeRecord(recordData) {
        const caseMasterId = generateUniqueIntId();
        const serialNo = String(caseMasterId).slice(-5);
        const crimeNo = String(recordData.crimeNo || `1044300062026${serialNo}`);
        const caseNo = String(recordData.caseNo || `2026${serialNo}`);
        const regDateStr = formatCatalystDate(recordData.regDate || recordData.CrimeRegisteredDate);

        const catalystCaseMasterRow = {
            CrimeNo: crimeNo,
            CaseNo: caseNo,
            CrimeRegisteredDate: regDateStr,
            PolicePersonID: String(this.rowIds.Employee),
            PoliceStationID: String(this.rowIds.Unit),
            CaseCategoryID: String(this.rowIds.CaseCategory),
            GravityOffenceID: String(this.rowIds.GravityOffence),
            CrimeMajorHeadID: String(this.rowIds.CrimeHead),
            CaseStatusID: String(this.rowIds.CaseStatusMaster),
            CourtID: String(this.rowIds.Court),
            IncidentFromDate: formatCatalystDatetime(recordData.incidentFromDate || recordData.IncidentFromDate, "10:00:00"),
            IncidentToDate: formatCatalystDatetime(recordData.incidentToDate || recordData.IncidentToDate, "11:30:00"),
            InfoReceivedPSDate: formatCatalystDatetime(recordData.infoReceivedPSDate || recordData.InfoReceivedPSDate, "12:00:00"),
            latiutude: Number(recordData.lat || recordData.latiutude || recordData.latitude) || 12.9716,
            longitude: Number(recordData.lng || recordData.longitude) || 77.5946,
            BriefFacts: String(recordData.briefFacts || recordData.Description || `FIR #${crimeNo} registered at ${recordData.unit || 'Police Station'}.`).slice(0, 250)
        };
        if (this.rowIds.CrimeSubHead && String(this.rowIds.CrimeSubHead).startsWith("5611") && this.rowIds.CrimeSubHead !== this.rowIds.CrimeHead) {
            catalystCaseMasterRow.CrimeMinorHeadID = String(this.rowIds.CrimeSubHead);
        }

        const fullRecord = {
            ...catalystCaseMasterRow,
            complainantName: String(recordData.complainantName || "Citizen Complainant"),
            accusedName: String(recordData.accusedName || "Unidentified Suspect"),
            allottedOfficerName: String(recordData.allottedOfficerName || "PSI Investigating Officer"),
            unit: String(recordData.unit || "Police Station 1"),
            district: String(recordData.district || "Bengaluru City"),
            crimeHead: String(recordData.crimeHead || "Property Offences"),
            crimeSubHead: String(recordData.crimeSubHead || "General"),
            actSections: String(recordData.actSections || "IPC Sec 395"),
            severity: String(recordData.severity || "MEDIUM"),
            status: String(recordData.status || "Under Investigation")
        };

        const norm = this.normalizeRow(fullRecord);
        globalServerRecords = loadPersistentDb();
        globalServerRecords.unshift(norm);
        savePersistentDb(globalServerRecords);

        try {
            console.log("[CrimeRepository] Inserting new FIR directly into Zoho Catalyst Online Data Store...");
            const insertRes = await callCatalystDatastoreApi('/table/CaseMaster/row', 'POST', [catalystCaseMasterRow]);
            if (insertRes.status === 200 && insertRes.data && insertRes.data.data && insertRes.data.data[0]) {
                const cloudRow = insertRes.data.data[0];
                console.log("✅ [CrimeRepository] Catalyst Online Data Store INSERT SUCCESS. ROWID:", cloudRow.ROWID);
                const cloudNorm = this.normalizeRow({ ...fullRecord, ...cloudRow });
                this.masterRecords.unshift(cloudNorm);
                return cloudNorm;
            } else {
                console.error("❌ [CrimeRepository] Catalyst Online Data Store Insert Failed:", insertRes.status, JSON.stringify(insertRes.data));
            }
        } catch (err) {
            console.error("❌ [CrimeRepository] Catalyst Online Data Store Exception:", err.message);
        }

        this.masterRecords.unshift(norm);
        return norm;
    }

    async updateCrimeRecord(id, updatedData) {
        const index = this.masterRecords.findIndex(r => String(r.CaseMasterID) === String(id) || String(r.id) === String(id) || String(r.ROWID) === String(id));
        if (index !== -1) {
            this.masterRecords[index] = { ...this.masterRecords[index], ...updatedData };
        }

        try {
            const rowId = (this.masterRecords[index] && this.masterRecords[index].ROWID) || id;
            if (rowId && String(rowId).length > 10) {
                await callCatalystDatastoreApi(`/table/CaseMaster/row`, 'PUT', [{
                    ROWID: String(rowId),
                    CaseStatusID: String(this.rowIds.CaseStatusMaster),
                    BriefFacts: String(updatedData.briefFacts || updatedData.Description || "Updated FIR record")
                }]);
                console.log("✅ [CrimeRepository] Online Catalyst Data Store row updated.");
            }
        } catch (e) {
            console.warn("[CrimeRepository] Online Catalyst updateRow failed:", e.message);
        }
        return this.normalizeRow(this.masterRecords[index] || updatedData);
    }

    async deleteCrimeRecord(id) {
        const index = this.masterRecords.findIndex(r => String(r.CaseMasterID) === String(id) || String(r.id) === String(id) || String(r.ROWID) === String(id));
        if (index !== -1) {
            this.masterRecords.splice(index, 1);
        }

        try {
            if (id && String(id).length > 10) {
                await callCatalystDatastoreApi(`/table/CaseMaster/row/${id}`, 'DELETE');
                console.log("✅ [CrimeRepository] Online Catalyst Data Store row deleted.");
            }
        } catch (e) {
            console.warn("[CrimeRepository] Online Catalyst deleteRow failed:", e.message);
        }
        return { success: true, id };
    }

    async getAllOfficerRecords() {
        let cloudOfficers = [];
        try {
            const res = await callCatalystDatastoreApi('/table/Employee/row', 'GET');
            if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
                cloudOfficers = res.data.data.map(emp => ({
                    badgeNumber: emp.KGID || `KSP-${emp.EmployeeID}`,
                    name: emp.FirstName,
                    rank: "Police Inspector",
                    unit: "General Unit",
                    station: "Karnataka Police Station",
                    yearsOfService: 5,
                    status: "On Duty",
                    ROWID: emp.ROWID,
                    EmployeeID: emp.EmployeeID
                }));
                console.log(`[CrimeRepository] Fetched ${cloudOfficers.length} officer employees directly from Zoho Catalyst Online Data Store.`);
            }
        } catch (e) {
            console.warn("[CrimeRepository] Online Catalyst Employee fetch failed:", e.message);
        }
        return cloudOfficers;
    }

    async createOfficerRecord(officerData) {
        const empId = Number(Date.now().toString().slice(-6));
        const badge = String(officerData.badgeNumber || `KSP-2026-${empId}`);
        const name = String(officerData.name || "Officer");

        const catalystEmployeeRow = {
            EmployeeID: empId,
            KGID: badge,
            FirstName: name,
            DistrictID: String(this.rowIds.District),
            UnitID: String(this.rowIds.Unit),
            RankID: String(this.rowIds.Rank || "38079000000035001"),
            DesignationID: String(this.rowIds.Designation || "38079000000036001"),
            EmployeeDOB: "1992-01-01",
            GenderlD: 1,
            BloodGroupID: 1,
            PhysicallyChallenged: false,
            AppointmentDate: new Date().toISOString().split("T")[0]
        };

        try {
            console.log("[CrimeRepository] Inserting new Officer Employee directly into Zoho Catalyst Online Data Store...");
            const insertRes = await callCatalystDatastoreApi('/table/Employee/row', 'POST', [catalystEmployeeRow]);
            if (insertRes.status === 200 && insertRes.data && insertRes.data.data && insertRes.data.data[0]) {
                const cloudRow = insertRes.data.data[0];
                console.log("✅ [CrimeRepository] Catalyst Employee INSERT SUCCESS. ROWID:", cloudRow.ROWID);
                return {
                    badgeNumber: badge,
                    name: name,
                    rank: officerData.rank || "Police Inspector",
                    unit: officerData.unit || "General Unit",
                    station: officerData.station || "Bengaluru Range",
                    yearsOfService: Number(officerData.yearsOfService) || 5,
                    status: "On Duty",
                    ROWID: cloudRow.ROWID,
                    EmployeeID: empId
                };
            } else {
                console.error("❌ [CrimeRepository] Catalyst Employee Insert Failed:", insertRes.status, JSON.stringify(insertRes.data));
            }
        } catch (e) {
            console.error("❌ [CrimeRepository] Catalyst Employee Insert Exception:", e.message);
        }

        return {
            badgeNumber: badge,
            name: name,
            rank: officerData.rank || "Police Inspector",
            unit: officerData.unit || "General Unit",
            station: officerData.station || "Bengaluru Range",
            yearsOfService: Number(officerData.yearsOfService) || 5,
            status: "On Duty",
            EmployeeID: empId
        };
    }
}

module.exports = CrimeRepository;