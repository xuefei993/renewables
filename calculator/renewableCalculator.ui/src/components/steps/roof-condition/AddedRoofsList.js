import React from 'react';

const AddedRoofsList = ({ addedRoofs, onRemoveRoof, showTotal = false }) => {
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

  const getOrientationLabel = (orientation) => {
    const orientationMap = {
      'n': 'North', 'ne': 'Northeast', 'e': 'East', 'se': 'Southeast',
      's': 'South', 'sw': 'Southwest', 'w': 'West', 'nw': 'Northwest'
    };
    return orientationMap[orientation] || orientation;
  };

  const getShadingLabel = (shading) => {
    const shadingMap = {
      'no-shading': 'No Shading',
      'light': 'Light Shading',
      'moderate': 'Moderate Shading',
      'heavy': 'Heavy Shading',
      'extreme': 'Extreme Shading'
    };
    return shadingMap[shading] || shading;
  };

  const getUtilisationLabel = (utilisation) => {
    const utilisationMap = {
      'minimal-obstacles': 'Minimal Obstacles',
      'slightly-complex': 'Slightly Complex',
      'moderately-complex': 'Moderately Complex',
      'highly-complex': 'Highly Complex',
      'extremely-complex': 'Extremely Complex'
    };
    return utilisationMap[utilisation] || utilisation;
  };

  return (
    <div className="added-roofs-list">
      <h3>Added Roofs ({addedRoofs.length})</h3>

      <div className="roofs-grid">
        {addedRoofs.map((roof) => {
          const rating = getSolarPotentialRating(roof.solarPotential);
          
          return (
            <div key={roof.id} className="roof-card">
              {/* Close button positioned absolutely in top-right corner */}
              <button 
                className="remove-roof-btn"
                onClick={() => onRemoveRoof(roof.id)}
                title="Remove this roof"
              >
                ×
              </button>
              
              <div className="roof-header">
                <h4>Roof {roof.id}</h4>
              </div>
              
              <div className="roof-details">
                <div className="roof-detail">
                  <span className="detail-label">Area:</span>
                  <span className="detail-value">{roof.area.toFixed(2)} m²</span>
                </div>
                <div className="roof-detail">
                  <span className="detail-label">Orientation:</span>
                  <span className="detail-value">{getOrientationLabel(roof.orientation)}</span>
                </div>
                <div className="roof-detail">
                  <span className="detail-label">Angle:</span>
                  <span className="detail-value">{roof.angle}°</span>
                </div>
                <div className="roof-detail">
                  <span className="detail-label">Shading:</span>
                  <span className="detail-value">{getShadingLabel(roof.shading)}</span>
                </div>
                <div className="roof-detail">
                  <span className="detail-label">Utilisation:</span>
                  <span className="detail-value">{getUtilisationLabel(roof.utilisation)}</span>
                </div>
                <div className="roof-detail">
                  <span className="detail-label">Estimated Fits For:</span>
                  <span className="detail-value">{roof.solarPanelCount || 0} panels</span>
                </div>
                <div className="roof-detail solar-potential">
                  <span className="detail-label">Solar Potential:</span>
                  <span className="detail-value">
                    {roof.solarPotential.toFixed(2)}%
                    <span className={`rating-badge-small ${rating.className}`}>
                      {rating.rating}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Total Solar Potential - Only show when requested */}
      {showTotal && (
        <div className="total-potential">
          <h4>Total Solar Potential: {addedRoofs.reduce((sum, roof) => sum + roof.solarPotential, 0).toFixed(2)}%</h4>
          <h4>Total Estimated Fits For: {addedRoofs.reduce((sum, roof) => sum + (roof.solarPanelCount || 0), 0)} panels</h4>
        </div>
      )}
    </div>
  );
};

export default AddedRoofsList; 