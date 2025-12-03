// server.js

require('dotenv').config();
const express = require('express');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
const PORT = process.env.PORT || 8080;

// --- Cosmos DB Configuration ---
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;

if (!endpoint || !key) {
    console.error("FATAL ERROR: Cosmos DB credentials not set in .env file.");
    process.exit(1);
}

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// Serve static files (HTML, JS) from the 'public' directory
app.use(express.static('public'));

// ----------------------------------------------------------------------
// --- API Endpoint 1: Get Latest Aggregation Data (For Status Cards) ---
// ----------------------------------------------------------------------
app.get('/api/latest', async (req, res) => {
    try {
        // Query to get the latest aggregation record for each of the three locations
        // ORDER BY DESC and LIMIT 3 should return the most recent record for each location.
        const querySpec = {
            query: `
                SELECT c.location, c.AvgIceThickness_cm, c.AvgSurfaceTemp_C, c.SafetyStatus
                FROM c
                WHERE c.documentId = "SensorAggregations"
                ORDER BY c.WindowEndTime DESC
                OFFSET 0 LIMIT 3
            `
        };

        const { resources } = await container.items.query(querySpec).fetchAll();
        
        // Use a map to ensure we only return one record per location (the most recent one found)
        const latestData = {};
        resources.forEach(item => {
            if (!latestData[item.location]) {
                latestData[item.location] = item;
            }
        });

        res.json(Object.values(latestData));
    } catch (error) {
        console.error("Error fetching latest data from Cosmos DB:", error);
        res.status(500).json({ error: "Failed to query latest data." });
    }
});

// ---------------------------------------------------------------------
// --- API Endpoint 2: Get Historical Trend Data (For Charts) ---
// ---------------------------------------------------------------------
app.get('/api/history', async (req, res) => {
    try {
        // Query to get the last 12 aggregation windows (60 minutes of data at 5-min intervals)
        const querySpec = {
            query: `
                SELECT TOP 15 * FROM c
                WHERE c.documentId = "SensorAggregations"
                ORDER BY c.WindowEndTime DESC
            `
        };

        const { resources } = await container.items.query(querySpec).fetchAll();
        
        // Return data in chronological order for the chart (asc)
        res.json(resources.sort((a, b) => new Date(a.WindowEndTime) - new Date(b.WindowEndTime)));

    } catch (error) {
        console.error("Error fetching historical data from Cosmos DB:", error);
        res.status(500).json({ error: "Failed to query historical data." });
    }
});


// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Serving static files from ${__dirname}/public`);
});