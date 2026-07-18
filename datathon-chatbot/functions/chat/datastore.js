/**
 * ============================================================================
 * File: functions/chat/datastore.js
 * ----------------------------------------------------------------------------
 * Data Access Layer (Repository)
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * • Connect to Catalyst Data Store
 * • Fetch crime records
 * • Apply filters
 * • Return normalized objects
 *
 * IMPORTANT
 * ----------------------------------------------------------------------------
 * The rest of the backend NEVER talks directly to Catalyst.
 *
 * Only this file knows how data is stored.
 * ============================================================================
 */

const catalyst = require("zcatalyst-sdk-node");

/**
 * Repository
 */
class CrimeRepository {

    /**
     * Constructor
     */
    constructor(req) {

        /**
         * Initialize Catalyst App
         */
        this.app = catalyst.initialize(req);

        /**
         * Data Store instance
         */
        this.datastore = this.app.datastore();

        /**
         * Table Name
         *
         * Change this after creating
         * your Catalyst Data Store table.
         */
        this.table = this.datastore.table("CrimeRecords");

    }

    /**
     * Fetch crime records.
     *
     * @param {Object} filters
     *
     * Example
     * {
     *    district: "Bengaluru",
     *    startDate: "...",
     *    endDate: "..."
     * }
     */
    async getCrimeAnalyticsData(filters = {}) {

        try {

            /**
             * TODO:
             * Replace with your Catalyst query.
             *
             * Depending on Catalyst version,
             * this may use:
             *
             * executeZCQLQuery()
             * OR
             * getAllRows()
             * OR
             * query()
             */

            let rows;
            try {
                rows = await this.table.getAllRows();
            } catch (err) {
                console.warn("Catalyst Datastore offline. Using local_crime_records.json fallback.");
                const fs = require("fs");
                const path = require("path");
                const localPath = path.join(__dirname, "local_crime_records.json");
                if (fs.existsSync(localPath)) {
                    rows = JSON.parse(fs.readFileSync(localPath, "utf-8"));
                } else {
                    throw err;
                }
            }

            /**
             * Normalize records.
             *
             * Keeps the rest of the backend
             * independent from Catalyst.
             */

            return rows.map((row) => ({

                id: row.ROWID || row.id,

                district: row.District || row.district,

                policeStation: row.PoliceStation || row.policeStation,

                officer: row.OfficerName || row.officer,

                category: row.CrimeCategory || row.category,

                status: row.Status || row.status,

                crimeDate: row.CrimeDate || row.crimeDate,

                latitude: row.Latitude || row.latitude,

                longitude: row.Longitude || row.longitude,

                severity: row.Severity || row.severity,

                description: row.Description || row.description

            }));

        }

        catch (error) {

            console.error(
                "DataStore Error:",
                error
            );

            throw new Error(
                "Unable to fetch crime records."
            );

        }

    }

}

module.exports = CrimeRepository;