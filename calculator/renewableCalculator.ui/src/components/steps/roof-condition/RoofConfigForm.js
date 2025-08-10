import React from 'react';
import { getRoofAngleOptions } from './roofLabelUtils';

const RoofConfigForm = ({ 
  roofConfig, 
  onConfigChange, 
  onShowAngleTooltip, 
  onShowShadingTooltip, 
  onShowUtilisationTooltip 
}) => {
  const roofAngleOptions = getRoofAngleOptions();

  return (
    <div className="config-grid">
      <div className="form-group">
        <label htmlFor="roofOrientation">Roof Orientation</label>
        <select
          id="roofOrientation"
          value={roofConfig.roofOrientation}
          onChange={(e) => onConfigChange('roofOrientation', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select orientation</option>
          <option value="n">North (N)</option>
          <option value="ne">Northeast (NE)</option>
          <option value="ene">East-Northeast (ENE)</option>
          <option value="e">East (E)</option>
          <option value="ese">East-Southeast (ESE)</option>
          <option value="se">Southeast (SE)</option>
          <option value="s">South (S)</option>
          <option value="sw">Southwest (SW)</option>
          <option value="wsw">West-Southwest (WSW)</option>
          <option value="w">West (W)</option>
          <option value="wnw">West-Northwest (WNW)</option>
          <option value="nw">Northwest (NW)</option>
        </select>
      </div>

      <div className="form-group">
        <div className="form-label-with-help">
          <label htmlFor="roofAngle">Roof Angle</label>
          <button 
            type="button"
            className="field-help-btn"
            onClick={onShowAngleTooltip}
            aria-label="Learn about roof angle impact"
          >
            ?
          </button>
        </div>
        <select
          id="roofAngle"
          value={roofConfig.roofAngle}
          onChange={(e) => onConfigChange('roofAngle', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select angle</option>
          {roofAngleOptions.map(angle => (
            <option key={angle} value={angle}>{angle}° {angle === 0 ? '(Flat)' : ''}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <div className="form-label-with-help">
          <label htmlFor="roofShading">Roof Shading</label>
          <button 
            type="button"
            className="field-help-btn"
            onClick={onShowShadingTooltip}
            aria-label="Learn about roof shading levels"
          >
            ?
          </button>
        </div>
        <select
          id="roofShading"
          value={roofConfig.roofShading}
          onChange={(e) => onConfigChange('roofShading', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select shading level</option>
          <option value="no-shading">No Shading</option>
          <option value="light">Light Shading</option>
          <option value="moderate">Moderate Shading</option>
          <option value="heavy">Heavy Shading</option>
          <option value="extreme">Extreme Shading</option>
        </select>
      </div>

      <div className="form-group">
        <div className="form-label-with-help">
          <label htmlFor="roofUtilisation">Roof Utilisation</label>
          <button 
            type="button"
            className="field-help-btn"
            onClick={onShowUtilisationTooltip}
            aria-label="Learn about roof utilisation levels"
          >
            ?
          </button>
        </div>
        <select
          id="roofUtilisation"
          value={roofConfig.roofUtilisation}
          onChange={(e) => onConfigChange('roofUtilisation', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select complexity level</option>
          <option value="minimal-obstacles">Minimal Obstacles</option>
          <option value="slightly-complex">Slightly Complex</option>
          <option value="moderately-complex">Moderately Complex</option>
          <option value="highly-complex">Highly Complex</option>
          <option value="extremely-complex">Extremely Complex</option>
        </select>
      </div>
    </div>
  );
};

export default RoofConfigForm; 