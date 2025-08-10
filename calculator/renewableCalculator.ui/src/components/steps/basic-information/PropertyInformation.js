import React from 'react';

const PropertyInformation = ({ 
  locationData, 
  propertyInfo, 
  onPropertyInfoChange, 
  onToggleTooltip 
}) => {
  if (!locationData) return null; // Only show after location is selected

  return (
    <div className="property-information">
      <h3>Basic Property Information</h3>
      <p>Tell us about your property to get more accurate recommendations.</p>
      
      <div className="property-form">
        <div className="form-group">
          <div className="form-label-with-help">
            <label htmlFor="propertyType">Property Type</label>
            <button 
              className="field-help-btn"
              onClick={() => onToggleTooltip('propertyType')}
              type="button"
              aria-label="Get help about property type"
            >
              ?
            </button>
          </div>
          <select
            id="propertyType"
            value={propertyInfo.propertyType}
            onChange={(e) => onPropertyInfoChange('propertyType', e.target.value)}
            className="form-select"
          >
            <option value="">Select property type</option>
            <option value="detached">Detached</option>
            <option value="semi-detached">Semi-detached</option>
            <option value="terraced">Terraced</option>
            <option value="end-terraced">End-terraced</option>
          </select>
        </div>

        <div className="form-group">
          <div className="form-label-with-help">
            <label htmlFor="buildingYear">Building Year</label>
            <button 
              className="field-help-btn"
              onClick={() => onToggleTooltip('buildingYear')}
              type="button"
              aria-label="Get help about building year"
            >
              ?
            </button>
          </div>
          <select
            id="buildingYear"
            value={propertyInfo.buildingYear}
            onChange={(e) => onPropertyInfoChange('buildingYear', e.target.value)}
            className="form-select"
          >
            <option value="">Select building year</option>
            <option value="before-1930">Before 1930</option>
            <option value="1930-1980">1930-1980</option>
            <option value="1981-2002">1981-2002</option>
            <option value="after-2003">After 2003 (if unsure, choose this)</option>
          </select>
        </div>

        <div className="form-group">
          <div className="form-label-with-help">
            <label htmlFor="epcRating">EPC Rating</label>
            <button 
              className="field-help-btn"
              onClick={() => onToggleTooltip('epcRating')}
              type="button"
              aria-label="Get help about EPC rating"
            >
              ?
            </button>
          </div>
          <select
            id="epcRating"
            value={propertyInfo.epcRating}
            onChange={(e) => onPropertyInfoChange('epcRating', e.target.value)}
            className="form-select"
          >
            <option value="">Select EPC rating</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D (if unsure, choose this - UK average)</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
          <small className="form-helper">
            <a 
              href="https://www.gov.uk/find-energy-certificate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="helper-link"
            >
              Find my property's energy certificate
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default PropertyInformation; 