import React from 'react';
import { 
  calculateSolarCapacity, 
  calculatePanelCount, 
  calculateAdjustmentFactor 
} from './roofAreaUtils';

const RoofAreaSummary = ({ projectedArea, actualArea, roofAngle }) => {
  if (!projectedArea || projectedArea <= 0) return null;

  const solarCapacity = calculateSolarCapacity(actualArea);
  const panelCount = calculatePanelCount(actualArea);
  const adjustmentFactor = calculateAdjustmentFactor(actualArea, projectedArea);

  return (
    <div className="measurement-summary">
      <div className="summary-card">
        <h4>Measurement Complete</h4>
        <div className="measurement-details">
          <div className="detail-row">
            <span>Horizontal Projected Area:</span>
            <strong>{projectedArea.toFixed(2)} m²</strong>
          </div>
          {roofAngle !== '' && (
            <>
              <div className="detail-row highlight">
                <span>Actual Roof Area:</span>
                <strong>{actualArea.toFixed(2)} m²</strong>
              </div>
              <div className="detail-row">
                <span>Area Adjustment Factor:</span>
                <strong>×{adjustmentFactor.toFixed(3)}</strong>
              </div>
            </>
          )}
          <div className="detail-row">
            <span>Estimated Solar Panel Capacity:</span>
            <strong>~{solarCapacity.toFixed(1)} kW</strong>
          </div>
          <div className="detail-row">
            <span>Approximate Panel Count:</span>
            <strong>~{panelCount} panels</strong>
          </div>
        </div>
        <small className="summary-note">
          *Estimates based on typical residential solar panel specifications (2m² per panel, 150W/m²)
          {roofAngle !== '' && (
            <><br/>**Actual roof area calculated using: Roof Area = Projected Area ÷ cos({roofAngle}°)</>
          )}
        </small>
      </div>
    </div>
  );
};

export default RoofAreaSummary; 