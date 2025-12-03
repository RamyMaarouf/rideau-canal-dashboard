# Rideau Canal Monitoring Dashboard (Node.js)

## Overview
This repository contains the full source code for the public-facing dashboard application. It provides the API backend and the static frontend for visualizing the processed ice safety data.

* **Dashboard Features:** Real-time safety status cards, historical line charts, and status indicators based on ASA-processed data.
* **Technologies used:** **Node.js**, **Express.js**, **@azure/cosmos**, **Vanilla JavaScript** (Frontend logic).

---

## Prerequisites
* Node.js (v20+ recommended)
* Access to your **Azure Cosmos DB Account** (Endpoint and Key).

### Installation
1.  Clone this repository.
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

### Configuration
1.  Create a file named **`.env`** in the root directory.
2.  Populate it with your Azure Cosmos DB connection details, using the structure found in `.env.example`.

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
