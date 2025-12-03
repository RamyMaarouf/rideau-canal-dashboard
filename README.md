# Rideau Canal Monitoring Dashboard (Node.js)

This repository contains the Node.js Express server and the static frontend files that power the live web dashboard. This application connects to Azure Cosmos DB to retrieve processed sensor data and display it to the user.

## Prerequisites

1.  **Node.js**
2.  Access to your **Azure Cosmos DB Account** (Endpoint and Key).

## Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone [repository URL]
    cd rideau-canal-dashboard
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Configure .env:** Create a file named `.env` and populate it with your Cosmos DB credentials, referencing the format in `.env.example`.
4.  **Run the Server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:8080`.

## Azure Deployment

This application is designed for Continuous Deployment via **GitHub Actions** to Azure App Service (Linux).

* **Startup Command:** Ensure the App Service is configured to use the correct startup file: `node server.js`
* **Application Settings:** All Cosmos DB credentials **must** be set as Application Settings (`COSMOS_ENDPOINT`, `COSMOS_KEY`, etc.) in the Azure Portal, as the `.env` file is not deployed.

A detailed description of the API endpoints is available in the `docs/` folder.
