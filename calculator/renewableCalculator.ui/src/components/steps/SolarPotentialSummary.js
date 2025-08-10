import React from "react";
import { 
  getSolarPotentialRating, 
  getOrientationLabel, 
  getShadingLabel, 
  getUtilisationLabel,
  calculateSolarTotals 
} from "./resultsUtils";

const SolarPotentialSummary = ({ selectedRoofs }) => {
  if (selectedRoofs.length === 0) {
    return (
      <div className="results-section">
        <div className="no-roofs-message">
          <h3>No Solar Installation Selected</h3>
          <p>You haven't selected any roofs for solar panel installation. Please go back to the roof configuration step to add and select roofs.</p>
        </div>
      </div>
    );
  }

  const { totalSelectedArea, totalSolarPanels, averageSolarPotential } = calculateSolarTotals(selectedRoofs);
  const rating = getSolarPotentialRating(averageSolarPotential);

  return (
    <div className="results-section solar-potential-section">
      <div className="solar-potential-card">
        <h3>Solar Potential Summary</h3>
        
        {/* Total Summary */}
        <div className="total-summary">
          <div className="total-summary-grid">
            <div className="total-stat-item">
              <span className="stat-label">Selected Roofs</span>
              <span className="stat-value">{selectedRoofs.length} roof{selectedRoofs.length > 1 ? 's' : ''}</span>
            </div>
            <div className="total-stat-item">
              <span className="stat-label">Total Area</span>
              <span className="stat-value">{totalSelectedArea.toFixed(0)} m²</span>
            </div>
            <div className="total-stat-item">
              <span className="stat-label">Total Estimated Panels</span>
              <span className="stat-value">Fits for {totalSolarPanels} panels</span>
            </div>
            <div className="total-stat-item">
              <span className="stat-label">Average Solar Potential</span>
              <span className="stat-value">
                {averageSolarPotential.toFixed(1)}%
                <span className={`rating-badge ${rating.className}`}>
                  {rating.rating}
                </span>
              </span>
            </div>
          </div>

          {!rating.recommended && (
            <div className="warning-message">
              The average solar potential is rated as "Poor". Solar installation may not be cost-effective for your property.
            </div>
          )}
        </div>

        {/* Individual Roof Details */}
        <div className="individual-roofs">
          <h4>Individual Roof Details</h4>
          <div className="roof-list">
            {selectedRoofs.map((roof, index) => {
              const roofRating = getSolarPotentialRating(roof.solarPotential);
              return (
                <div key={roof.id} className="roof-summary-item">
                  <div className="roof-summary-header">
                    <h5>Roof {roof.id}</h5>
                    <span className={`rating-badge-small ${roofRating.className}`}>
                      {roofRating.rating}
                    </span>
                  </div>
                  <div className="roof-summary-details">
                    <div className="roof-summary-grid">
                      <div className="summary-detail">
                        <span>Area:</span>
                        <span>{roof.area.toFixed(0)} m²</span>
                      </div>
                      <div className="summary-detail">
                        <span>Orientation:</span>
                        <span>{getOrientationLabel(roof.orientation)}</span>
                      </div>
                      <div className="summary-detail">
                        <span>Angle:</span>
                        <span>{roof.angle}°</span>
                      </div>
                      <div className="summary-detail">
                        <span>Shading:</span>
                        <span>{getShadingLabel(roof.shading)}</span>
                      </div>
                      <div className="summary-detail">
                        <span>Obstacles:</span>
                        <span>{getUtilisationLabel(roof.utilisation)}</span>
                      </div>
                      <div className="summary-detail">
                        <span>Estimated Fits For:</span>
                        <span>{roof.solarPanelCount || 0} panels</span>
                      </div>
                      <div className="summary-detail solar-potential-highlight">
                        <span>Solar Potential:</span>
                        <span className="solar-potential-value">
                          {roof.solarPotential.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarPotentialSummary; 