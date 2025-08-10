import React from 'react';

const SolarPotentialCalculation = ({ 
  isReadyForCalculation, 
  onCalculate, 
  showResults, 
  result, 
  currentRoofNumber, 
  onAddRoof,
  isCalculating = false
}) => {
  
  // Function to get solar potential rating based on percentage
  const getSolarPotentialRating = (percentage) => {
    if (percentage > 95) {
      return { rating: 'Excellent', className: 'excellent', recommended: true };
    } else if (percentage >= 90) {
      return { rating: 'Very Good', className: 'very-good', recommended: true };
    } else if (percentage >= 80) {
      return { rating: 'Good', className: 'good', recommended: true };
    } else if (percentage >= 60) {
      return { rating: 'Medium', className: 'medium', recommended: true };
    } else {
      return { rating: 'Poor', className: 'poor', recommended: false };
    }
  };

  return (
    <>
      {/* Solar Potential Calculation Section */}
      {isReadyForCalculation && !showResults && (
        <div className="solar-potential-section">
          <button 
            type="button"
            className="btn btn-calculate"
            onClick={onCalculate}
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Solar Potential'}
          </button>
        </div>
      )}

      {/* Solar Potential Results */}
      {showResults && result && (
        <div className="solar-potential-results">
          <div className="potential-result-header">
            {(() => {
              const percentage = parseFloat(result.solarPotential);
              const rating = getSolarPotentialRating(percentage);
              
              return (
                <div className="solar-potential-display">
                  <h4>
                    Roof {currentRoofNumber}'s solar potential: {result.solarPotential.toFixed(2)}%
                    <span className={`rating-badge ${rating.className}`}>
                      {rating.rating}
                    </span>
                  </h4>
                  <div className="panel-count-info">
                    <p>Estimated fits for <strong>{result.solarPanelCount || 0} panels</strong></p>
                    <p className="panel-calculation-note">(Based on 2m² per panel)</p>
                  </div>
                  {!rating.recommended && (
                    <p className="not-recommended-warning">
                       Not recommended for solar installation due to low solar potential
                    </p>
                  )}
                </div>
              );
            })()}
            
            <button 
              type="button"
              className="btn btn-add-roof"
              onClick={onAddRoof}
            >
              Add this roof
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SolarPotentialCalculation; 