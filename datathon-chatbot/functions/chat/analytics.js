/**
 * ============================================================================
 * File: functions/chat/analytics.js
 * ----------------------------------------------------------------------------
 * Crime Analytics Engine
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * Converts raw Catalyst Data Store records into structured KPIs.
 *
 * The LLM should NEVER receive raw records.
 * It should receive summarized analytics only.
 *
 * This reduces:
 * • Token usage
 * • Hallucinations
 * • Response time
 *
 * ============================================================================
 */

/**
 * Returns top N items from an object sorted by value.
 *
 * Example:
 * {
 *   Bengaluru: 120,
 *   Mysuru: 95
 * }
 */
function getTopItems(counter, limit = 5) {

    return Object.entries(counter)

        .sort((a, b) => b[1] - a[1])

        .slice(0, limit)

        .map(([name, count]) => ({
            name,
            count
        }));

}

/**
 * Groups records by a given field.
 */
function countBy(records, field) {

    const counts = {};

    for (const record of records) {

        const value = record[field] || "Unknown";

        counts[value] = (counts[value] || 0) + 1;

    }

    return counts;

}

/**
 * Calculates monthly crime trend.
 */
function calculateMonthlyTrend(records) {

    const trend = {};

    records.forEach(record => {

        if (!record.crimeDate) return;

        const month = new Date(record.crimeDate)

            .toLocaleString("default", {

                month: "short",

                year: "numeric"

            });

        trend[month] = (trend[month] || 0) + 1;

    });

    return trend;

}

/**
 * Calculates pending / resolved cases.
 */
function calculateCaseStatus(records) {

    let pending = 0;

    let resolved = 0;

    records.forEach(record => {

        const status =

            (record.status || "").toLowerCase();

        if (

            status.includes("pending")

        ) {

            pending++;

        }

        else {

            resolved++;

        }

    });

    return {

        pending,

        resolved

    };

}

/**
 * Generates all analytics.
 */
function generateAnalytics(records) {

    /**
     * District statistics.
     */
    const districtCounter =

        countBy(records, "district");

    /**
     * Crime category statistics.
     */
    const categoryCounter =

        countBy(records, "category");

    /**
     * Officer statistics.
     */
    const officerCounter =

        countBy(records, "officer");

    /**
     * Monthly trend.
     */
    const monthlyTrend =

        calculateMonthlyTrend(records);

    /**
     * Pending vs resolved.
     */
    const statusSummary =

        calculateCaseStatus(records);

    /**
     * Total records.
     */
    const totalCases =

        records.length;

    /**
     * Hotspots.
     *
     * Later we'll cluster latitude & longitude.
     */
    const hotspots =

        records.filter(r =>

            r.latitude && r.longitude

        ).length;

    /**
     * Final analytics object.
     */
    return {

        generatedAt:

            new Date().toISOString(),

        totalCases,

        districtRanking:

            getTopItems(districtCounter),

        crimeCategories:

            getTopItems(categoryCounter),

        officerPerformance:

            getTopItems(officerCounter),

        monthlyTrend,

        caseStatus:

            statusSummary,

        hotspotCount:

            hotspots

    };

}

module.exports = {

    generateAnalytics

};