import React from 'react';
import { getOrientationLabel } from './roofLabelUtils';

const RoofSelectionList = ({ addedRoofs, onRoofsUpdate }) => {
  if (addedRoofs.length === 0) return null;

  // Function to get solar potential rating based on percentage
  const getSolarPotentialRating = (percentage) => {
    if (percentage > 95) {
      return { rating: 'Excellent', className: 'excellent' };
    } else if (percentage >= 90) {
      return { rating: 'Very Good', className: 'very-good' };
    } else if (percentage >= 80) {
      return { rating: 'Good', className: 'good' };
    } else if (percentage >= 60) {
      return { rating: 'Medium', className: 'medium' };
    } else {
      return { rating: 'Poor', className: 'poor' };
    }
  };

  const handleRoofSelectionChange = (roofId, selected) => {
    const updatedRoofs = addedRoofs.map(roof => 
      roof.id === roofId ? { ...roof, selected } : roof
    );
    onRoofsUpdate(updatedRoofs);
  };

  return (
    <div className="roof-selection-section">
      <h4>Select Roofs for Solar Installation</h4>
      <p className="selection-instruction">
        Choose which roofs you want to install solar panels on. You can select multiple roofs or change your selection anytime.
      </p>
      
      <div className="roofs-selection-grid">
        {addedRoofs.map((roof) => {
          const rating = getSolarPotentialRating(roof.solarPotential);
          
          return (
            <div key={roof.id} className={`roof-selection-card ${roof.selected ? 'selected' : ''}`}>
              <div className="roof-selection-header">
                <h5>Roof {roof.id}</h5>
                <label className="selection-checkbox">
                  <input
                    type="checkbox"
                    checked={roof.selected}
                    onChange={(e) => handleRoofSelectionChange(roof.id, e.target.checked)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              
              <div className="roof-selection-summary">
                <div className="summary-text">
                  <div className="roof-basic-info">
                    {roof.area.toFixed(0)} m² • {getOrientationLabel(roof.orientation)}
                  </div>
                  <div className="solar-potential-info">
                    Solar Potential: {roof.solarPotential.toFixed(1)}%
                    <span className={`rating-badge-small ${rating.className}`}>
                      {rating.rating}
                    </span>
                  </div>
                  <div className="solar-panel-info">
                    Estimated fits for {roof.solarPanelCount || 0} panels
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoofSelectionList; 