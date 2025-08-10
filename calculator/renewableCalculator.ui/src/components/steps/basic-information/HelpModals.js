import React from 'react';
import { helpContent } from './helpContent';

// Main help modal for location information
export const LocationHelpModal = ({ showHelp, onClose }) => {
  if (!showHelp) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h3>Location Information Help</h3>
          <button 
            className="help-close-btn" 
            onClick={onClose}
            aria-label="Close help"
          >
            ×
          </button>
        </div>
        
        <div className="help-content">
          <div className="help-section">
            <h4>Why do we need your location?</h4>
            <p>Your location is essential for calculating accurate renewable energy potential. We use it to:</p>
            <ul>
              <li><strong>Solar radiation data:</strong> Get historical solar irradiance data from NASA satellites for your exact location</li>
              <li><strong>Weather patterns:</strong> Retrieve 5-year average temperature, wind, and precipitation data</li>
              <li><strong>Seasonal variations:</strong> Understand how solar and heat pump performance varies throughout the year</li>
              <li><strong>Local climate factors:</strong> Account for regional differences in renewable energy potential</li>
            </ul>
          </div>

          <div className="help-section">
            <h4>Location methods:</h4>
            <ul>
              <li><strong>Postcode (Recommended):</strong> Most accurate - uses official UK postcode database for precise coordinates</li>
              <li><strong>Device Location:</strong> Quick option - uses your device's GPS (requires permission)</li>
              <li><strong>City Selection:</strong> Manual selection - choose from hierarchical list of UK locations</li>
            </ul>
          </div>

          <div className="help-section">
            <h4>Privacy & Data:</h4>
            <p>Your location data is only used for climate calculations and is not stored or shared. All weather data comes from public scientific databases (NASA POWER and Open-Meteo).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field-specific help modal
export const FieldHelpModal = ({ activeTooltip, onClose }) => {
  if (!activeTooltip) return null;

  const help = helpContent[activeTooltip];
  
  return (
    <div className="field-help-overlay" onClick={onClose}>
      <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="field-help-header">
          <h3>{help.title}</h3>
          <button 
            className="field-help-close-btn" 
            onClick={onClose}
            aria-label="Close help"
          >
            ×
          </button>
        </div>
        
        <div className="field-help-content">
          {help.content.map((line, index) => (
            line === "" ? <br key={index} /> : <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}; 