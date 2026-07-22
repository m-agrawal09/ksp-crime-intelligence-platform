const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Chatbot QuickML environment variables
process.env.QUICKML_ENDPOINT = process.env.QUICKML_ENDPOINT || "https://api.catalyst.zoho.in/quickml/v1/project/56116000000017001/glm/chat";
process.env.QUICKML_ACCESS_TOKEN = process.env.QUICKML_ACCESS_TOKEN || "1000.0e26964d6e4af7a82438935cde1f3d98.77d250c9050d46c136223b403c654026";
process.env.CATALYST_ORG_ID = process.env.CATALYST_ORG_ID || "60077759815";

// Load functions & repository
const chatHandler = require("./datathon-chatbot/functions/chat/index.js");
const insightsHandler = require("./datathon-chatbot/functions/insights/index.js");
const CrimeRepository = require("./datathon-chatbot/functions/chat/datastore.js");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`[Request] ${req.method} ${pathname}`);

    // Mock Express res methods
    const mockRes = {
        status: (code) => {
            res.statusCode = code;
            return mockRes;
        },
        send: (data) => {
            if (!res.headersSent) {
                res.setHeader("Content-Type", "application/json");
            }
            res.end(typeof data === "object" ? JSON.stringify(data) : data);
            return mockRes;
        }
    };

    const repo = new CrimeRepository(req);

    // 1. Zoho Catalyst Datastore REST API Routes: /api/records
    if (pathname === "/api/records" && req.method === "GET") {
        try {
            const records = await repo.getAllCrimeRecords(parsedUrl.query);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, data: records }));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    } else if (pathname === "/api/records" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", async () => {
            try {
                const recordData = JSON.parse(body || "{}");
                const newRecord = await repo.createCrimeRecord(recordData);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, data: newRecord }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
    } else if (pathname.startsWith("/api/records/") && req.method === "PUT") {
        const id = pathname.replace("/api/records/", "");
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", async () => {
            try {
                const recordData = JSON.parse(body || "{}");
                const updated = await repo.updateCrimeRecord(id, recordData);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, data: updated }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
    } else if (pathname.startsWith("/api/records/") && req.method === "DELETE") {
        const id = pathname.replace("/api/records/", "");
        try {
            const result = await repo.deleteCrimeRecord(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, data: result }));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    } else if (pathname === "/api/officers" && req.method === "GET") {
        try {
            const officers = await repo.getAllOfficerRecords();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, data: officers }));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    } else if (pathname === "/api/officers" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", async () => {
            try {
                const officerData = JSON.parse(body || "{}");
                const newOfficer = await repo.createOfficerRecord(officerData);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, data: newOfficer }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
    } else if (pathname === "/api/chat" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", async () => {
            try {
                const reqJson = body ? JSON.parse(body) : {};
                const mockReq = {
                    body: reqJson,
                    headers: req.headers,
                    method: req.method,
                    url: req.url
                };
                await chatHandler(mockReq, mockRes);
            } catch (err) {
                console.error("Error running chat handler:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Internal server error: " + err.message }));
            }
        });
    } else if (pathname === "/api/insights" && req.method === "GET") {
        const mockReq = {
            body: {},
            headers: req.headers,
            method: req.method,
            url: req.url
        };
        try {
            await insightsHandler(mockReq, mockRes);
        } catch (err) {
            console.error("Error running insights handler:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: "Internal server error: " + err.message }));
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Not Found" }));
    }
});

server.listen(PORT, () => {
    console.log(`Local Catalyst Gateway running at http://localhost:${PORT}`);
});
