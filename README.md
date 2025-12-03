# Rideau Canal Monitoring Dashboard (Node.js)

## Overview
This repository contains the full source code for the public-facing dashboard application. It provides the API backend and the static frontend for visualizing the processed ice safety data.

* **Dashboard Features:** Real-time safety status cards, historical line charts, and status indicators based on ASA-processed data.
* **Technologies used:** **Node.js**, **Express.js**, **@azure/cosmos**, **Vanilla JavaScript** (Frontend logic).

---

## Prerequisites
* Node.js (v20+ recommended)
* Access to your **Azure Cosmos DB Account** (Endpoint and Key).

---

## Installation
1.  Clone this repository.
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

---

## Configuration
1.  Create a file named **`.env`** in the root directory.
2.  Populate it with your Azure Cosmos DB connection details, using the structure found in `.env.example`.

---

## API Endpoints
The Express server (`server.js`) exposes two endpoints for the dashboard frontend.

| Endpoint | Method | Description | Example Response |
| :--- | :--- | :--- | :--- |
| **`/api/latest`** | `GET` | Retrieves the **most recent** aggregated record for each of the three locations (used for Status Cards). | Array of 3 objects (one per location). |
| **`/api/history`** | `GET` | Retrieves the **last 15 records** across all locations in chronological order (used for historical line charts). | Array of up to 15 objects. |

### Example Request/Response
**Request:** `GET /api/latest`
**Response Body (Excerpt):**
```json
[
  {
    "location": "dows-lake",
    "AvgIceThickness_cm": 28.5,
    "SafetyStatus": "Caution"
  }
]
```

---

## Deployment to Azure App Service

The application is deployed to Azure App Service (Linux) via GitHub Actions for CI/CD.

### Step-by-step Deployment Guide (High-Level)
* Ensure a working GitHub Actions workflow is linked to this repository and an Azure App Service instance.
* Push code to the main branch to trigger a deployment.
* Critical Step: The PORT variable must be exposed and the startup command configured correctly.

### Configuration Settings

All sensitive credentials MUST be set as Application Settings in the Azure Portal, not hardcoded.
* COSMOS_ENDPOINT: Full URI including port 443.
* COSMOS_KEY: Securely stored secret.
* PORT: Required for the Node.js process to bind correctly on the Linux host.

---

## Dashboard Features

* Real-time Updates: Data is fetched from the /api/latest endpoint every few seconds.
* Charts and Visualizations: Historical data is presented in line graphs to easily identify safety trends.
* Safety Status Indicators: The UI uses color coding (Green/Safe, Yellow/Caution, Red/Unsafe) based on the SafetyStatus field from Cosmos DB.

---

## Troubleshooting

### Common Issues and Fixes:
* "Application Error" on Azure: This means the Node.js server crashed. Check the App Service Log Stream for the specific error (usually a bad environment variable or an incorrect Startup Command).
* App Service loads but shows no data: Check the Networking settings on your Cosmos DB instance to ensure "Allow access from Azure services" is enabled, preventing a network connection block.
* Slow performance: Verify that your Cosmos DB Partition Key (/documentId) is being used effectively in your Node.js queries to minimize Request Units (RUs).
