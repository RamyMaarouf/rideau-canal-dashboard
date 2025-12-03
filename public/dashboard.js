// public/dashboard.js

const CARD_COLORS = {
    'Safe': 'alert-success',
    'Caution': 'alert-warning',
    'Unsafe': 'alert-danger'
};

const UPDATE_INTERVAL = 30000; // Auto-refresh every 30 seconds (as requested)

let iceChart;

// --- 1. Real-time Card Renderer ---
function renderLiveCards(data) {
    const container = document.getElementById('live-data-cards');
    container.innerHTML = '';
    
    // Check if data is empty (ASA job hasn't processed anything yet)
    if (data.length === 0) {
        container.innerHTML = '<div class="col-12 text-center alert alert-info">Awaiting the first 5-minute aggregation window from Azure Stream Analytics...</div>';
        return;
    }

    // Sort data for consistent display order
    data.sort((a, b) => a.location.localeCompare(b.location)); 

    data.forEach(item => {
        const locationName = item.location.replace('-', ' ').toUpperCase();
        const safetyClass = CARD_COLORS[item.SafetyStatus] || 'alert-info';
        
        const cardHtml = `
            <div class="col-md-4 mb-4">
                <div class="card safety-card ${safetyClass}">
                    <div class="card-body">
                        <h5 class="card-title">${locationName}</h5>
                        <p class="card-text">Status: <strong>${item.SafetyStatus}</strong></p>
                        <p class="card-text">Avg. Ice Thickness: <strong>${item.AvgIceThickness_cm} cm</strong></p>
                        <p class="card-text">Avg. Surface Temp: <strong>${item.AvgSurfaceTemp_C}°C</strong></p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });

    document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
}

// --- 2. Chart Renderer (Handles updates) ---
function setupChart(historicalData) {
    if (!historicalData || historicalData.length === 0) return;

    // Organize data by location
    const locations = Array.from(new Set(historicalData.map(d => d.location))).sort();
    
    const datasets = locations.map(location => {
        const locationData = historicalData.filter(d => d.location === location);
        
        let color = '#007bff'; // Default blue
        if (location === 'dows-lake') color = '#dc3545'; // Red
        if (location === 'fifth-avenue') color = '#ffc107'; // Yellow
        if (location === 'nac') color = '#28a745'; // Green

        return {
            label: location.replace('-', ' ').toUpperCase(),
            data: locationData.map(d => ({ 
                x: new Date(d.WindowEndTime), 
                y: d.AvgIceThickness_cm 
            })),
            borderColor: color,
            backgroundColor: color + '40', // Semi-transparent fill
            tension: 0.4 
        };
    });

    const ctx = document.getElementById('ice-thickness-chart').getContext('2d');
    
    if (iceChart) {
        // Update existing chart data if it exists
        iceChart.data.datasets = datasets;
        iceChart.update();
    } else {
        // Initialize new chart
        iceChart = new Chart(ctx, {
            type: 'line',
            data: { datasets: datasets },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: { 
                            unit: 'minute',
                            tooltipFormat: 'MMM d, HH:mm',
                            displayFormats: { minute: 'HH:mm' }
                        },
                        title: { display: true, text: 'Time (UTC)' }
                    },
                    y: {
                        title: { display: true, text: 'Average Ice Thickness (cm)' },
                        min: 25, 
                        max: 40,
                    }
                }
            }
        });
    }
}

// --- 3. Data Fetching Logic ---
async function fetchAndRender() {
    try {
        // 1. Fetch latest data for the cards
        const latestResponse = await fetch('/api/latest');
        const latestData = await latestResponse.json();
        renderLiveCards(latestData);

        // 2. Fetch historical data for the chart
        const historyResponse = await fetch('/api/history');
        const historyData = await historyResponse.json();
        setupChart(historyData);
        
    } catch (error) {
        console.error('Error fetching data from API:', error);
        // Display a failure message on the dashboard if API is down
        document.getElementById('live-data-cards').innerHTML = '<div class="col-12 text-center alert alert-danger">🚨 Error connecting to Node.js API. Is the server running?</div>';
    }
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    fetchAndRender();
    // Set interval for continuous refreshing
    setInterval(fetchAndRender, UPDATE_INTERVAL); 
});