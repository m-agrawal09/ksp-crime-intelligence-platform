const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

// Register mock zcatalyst-sdk-node in the module cache
const mockCatalyst = {
    initialize: () => ({
        datastore: () => ({
            table: () => ({
                getAllRows: async () => {
                    throw new Error("Local mock datastore enabled");
                }
            })
        })
    })
};

// Intercept require calls to zcatalyst-sdk-node
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'zcatalyst-sdk-node') {
        return mockCatalyst;
    }
    return originalRequire.apply(this, arguments);
};

// Set environment variables
process.env.QUICKML_ENDPOINT = process.env.QUICKML_ENDPOINT || "https://api.catalyst.zoho.in/quickml/v1/project/mock/glm/chat";
process.env.QUICKML_ACCESS_TOKEN = process.env.QUICKML_ACCESS_TOKEN || "YOUR_OAUTH_TOKEN";
process.env.CATALYST_ORG_ID = process.env.CATALYST_ORG_ID || "60077759371";

// Load functions
const chatHandler = require("./datathon-chatbot/functions/chat/index.js");
const insightsHandler = require("./datathon-chatbot/functions/insights/index.js");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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

    if (pathname === "/api/chat" && req.method === "POST") {
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
