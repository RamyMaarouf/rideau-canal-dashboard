# Rideau Canal Dashboard API Endpoints

The dashboard runs on an Express server and exposes two primary GET endpoints to retrieve data from Azure Cosmos DB.

## 1. Get Latest Aggregation Data

This endpoint retrieves the most recent aggregated data points (one for each location) to populate the status cards (Ice Thickness, Temperature, and Safety Status).

* **URL:** `/api/latest`
* **Method:** `GET`
* **Response:** `application/json` (Array of up to 3 objects)
* **Example Response Body:**
    ```json
    [
      {
        "location": "dows-lake",
        "AvgIceThickness_cm": 28.5,
        "AvgSurfaceTemp_C": -5.2,
        "SafetyStatus": "Safe"
      },
      // ... two more location objects
    ]
    ```

## 2. Get Historical Trend Data

This endpoint retrieves the last 15 aggregated data points across all locations to populate the historical charts.

* **URL:** `/api/history`
* **Method:** `GET`
* **Response:** `application/json` (Array of 15 objects)
* **Example Response Body:**
    ```json
    [
      {
        "WindowEndTime": "2025-12-03T09:00:00.000Z",
        "location": "nac",
        "AvgIceThickness_cm": 31.0,
        "AvgSurfaceTemp_C": -4.0,
        "SafetyStatus": "UnSafe"
      },
      // ... 14 more aggregation objects
    ]
    ```