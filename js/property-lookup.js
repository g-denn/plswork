const formatCurrency = (value) => new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0
}).format(value);

// Update the displayPropertyData function
function displayPropertyData(data) {
    const propertyResults = document.getElementById('propertyResults');

    // Create the new dashboard HTML
    propertyResults.innerHTML = `
        <div class="dashboard-grid">
            <!-- Main Property Info -->
            <div class="dashboard-card main-info">
                <h3>Property Overview</h3>
                <div class="property-value">
                    <span class="value-label">Estimated Value</span>
                    <span class="value-amount">${formatCurrency(data.propertyData.estimatedValue)}</span>
                </div>
                <div class="property-specs">
                    <div class="spec-item">
                        <i class="fas fa-bed"></i>
                        <span>${data.propertyData.bedrooms} Beds</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-bath"></i>
                        <span>${data.propertyData.bathrooms} Baths</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${data.propertyData.squareFootage.toLocaleString()} sqft</span>
                    </div>
                </div>
            </div>
            
            <!-- Market Analysis -->
            <div class="dashboard-card market-analysis">
                <h3>Market Analysis</h3>
                <div class="trend-metrics">
                    <div class="metric">
                        <span class="metric-label">Yearly Appreciation</span>
                        <span class="metric-value">${data.propertyData.marketTrends.yearlyAppreciation}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Median Price</span>
                        <span class="metric-value">${formatCurrency(data.propertyData.marketTrends.medianPrice)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Days on Market</span>
                        <span class="metric-value">${data.propertyData.marketTrends.daysOnMarket}</span>
                    </div>
                </div>
            </div>
            
            <!-- Neighborhood Info -->
            <div class="dashboard-card neighborhood">
                <h3>Neighborhood</h3>
                <div class="rating-display">
                    <div class="rating-stars">${data.propertyData.neighborhood.rating}/10</div>
                </div>
                <p class="neighborhood-desc">${data.propertyData.neighborhood.description}</p>
            </div>
            
            <!-- Property Details -->
            <div class="dashboard-card details">
                <h3>Property Details</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Property Type</span>
                        <span class="detail-value">${data.propertyData.propertyType}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Year Built</span>
                        <span class="detail-value">${data.propertyData.yearBuilt}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Lot Size</span>
                        <span class="detail-value">${data.propertyData.lotSize}</span>
                    </div>
                </div>
            </div>
            
            <!-- Action Button -->
            <div class="dashboard-card action">
                <a href="/wallet.html" class="tokenize-btn">Start Tokenization Process</a>
            </div>
        </div>
    `;
    
    propertyResults.style.display = 'block';
} 