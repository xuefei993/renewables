import React from 'react';

const RoofHelpModals = ({ 
  showAngleTooltip, 
  showShadingTooltip, 
  showUtilisationTooltip, 
  onToggleAngleTooltip, 
  onToggleShadingTooltip, 
  onToggleUtilisationTooltip 
}) => {
  return (
    <>
      {/* Roof Angle Help Modal */}
      {showAngleTooltip && (
        <div className="field-help-overlay" onClick={onToggleAngleTooltip}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>Roof Angle Impact</h3>
              <button className="field-help-close-btn" onClick={onToggleAngleTooltip} aria-label="Close help">×</button>
            </div>
            <div className="field-help-content">
              <div className="help-image-container">
                <img 
                  src="/images/help/roof_angle_guide.png" 
                  alt="Roof Angle Guide Illustration" 
                  className="help-guide-image"
                />
              </div>
              <p><strong>How roof angle affects your roof area calculation:</strong></p>
              <p>The roof angle determines the actual surface area available for solar panels. Google Maps measures the horizontal projected area (as seen from above), but the actual roof surface is larger when the roof is angled.</p>
              <p><strong>Calculation Formula:</strong></p>
              <p>Actual Roof Area = Projected Area ÷ cos(roof angle)</p>
              <p><strong>Examples:</strong></p>
              <p>• <strong>Flat roof (0°):</strong> Actual area = projected area (no change)</p>
              <p>• <strong>30° roof:</strong> Actual area is 15% larger (×1.15)</p>
              <p>• <strong>45° roof:</strong> Actual area is 41% larger (×1.41)</p>
              <p><strong>Why this matters:</strong></p>
              <p>A steeper roof provides more actual surface area for solar panels than what appears when viewed from above. This directly affects how many solar panels can be installed and your potential energy generation.</p>
            </div>
          </div>
        </div>
      )}

      {/* Roof Shading Help Modal */}
      {showShadingTooltip && (
        <div className="field-help-overlay" onClick={onToggleShadingTooltip}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>Roof Shading Guide</h3>
              <button 
                className="field-help-close-btn"
                onClick={onToggleShadingTooltip}
                aria-label="Close help"
              >
                ×
              </button>
            </div>
            <div className="field-help-content">
              <p>Roof shading affects solar panel performance throughout the day. Choose the option that best describes your roof's shading condition:</p>
              
              <p><strong>No Shading (1.0)</strong></p>
              <p>Roof surroundings are unobstructed, with full sunlight all day.</p>
              
              <p><strong>Light Shading (0.90)</strong></p>
              <p>Small portion blocked in early morning/evening, but no obstruction during midday.</p>
              
              <p><strong>Moderate Shading (0.70)</strong></p>
              <p>One side has close-range obstruction, reducing sunlight hours by half.</p>
              
              <p><strong>Heavy Shading (0.50)</strong></p>
              <p>Two or more sides obstructed, roof is in shadow most of the time.</p>
              
              <p><strong>Extreme Shading (0.20)</strong></p>
              <p>Almost no sunlight from dawn to dusk, sun cannot reach the roof. Solar installation not recommended.</p>
            </div>
          </div>
        </div>
      )}

      {/* Roof Utilisation Help Modal */}
      {showUtilisationTooltip && (
        <div className="field-help-overlay" onClick={onToggleUtilisationTooltip}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>Roof Utilisation Guide</h3>
              <button 
                className="field-help-close-btn"
                onClick={onToggleUtilisationTooltip}
                aria-label="Close help"
              >
                ×
              </button>
            </div>
            <div className="field-help-content">
              <p>Roof utilisation refers to how suitable your roof is for solar panel installation based on its shape, obstacles, and complexity:</p>
              
              <p><strong>Minimal Obstacles</strong></p>
              <p>Regular shape, no obstacles, unobstructed. Typical rectangular roof, clean new construction.</p>
              
              <p><strong>Slightly Complex</strong></p>
              <p>Few skylights/chimneys, slightly irregular edges. Common residential roof, light trapezoidal shape.</p>
              
              <p><strong>Moderately Complex</strong></p>
              <p>Irregular boundaries, multiple obstacles, significant trapezoidal shape. Multiple chimneys/courtyards or complex edges.</p>
              
              <p><strong>Highly Complex</strong></p>
              <p>Many protrusions, severely irregular boundaries, difficult module placement. Old or multi-slope roofs.</p>
              
              <p><strong>Extremely Complex</strong></p>
              <p>Narrow, fragmented roof, extremely poor layout. Almost impossible to arrange panels at scale.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoofHelpModals; 