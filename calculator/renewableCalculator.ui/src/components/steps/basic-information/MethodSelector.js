import React from 'react';

const MethodSelector = ({ activeMethod, onMethodChange, onShowHelp }) => {
  return (
    <div className="method-selector">
      <div className="method-selector-header">
        <h2>Find Your Location</h2>
        <button 
          className="help-icon-btn"
          onClick={onShowHelp}
          aria-label="Get help about location information"
          title="Get help about location information"
        >
          ?
        </button>
      </div>
      <p>Choose how you'd like to tell us your location to get personalized climate data.</p>
      
      <div className="method-tabs">
        <button
          className={`method-tab ${activeMethod === 'postcode' ? 'active' : ''}`}
          onClick={() => onMethodChange('postcode')}
        >
          Postcode
        </button>
        <button
          className={`method-tab ${activeMethod === 'location' ? 'active' : ''}`}
          onClick={() => onMethodChange('location')}
        >
          Current Location
        </button>
        <button
          className={`method-tab ${activeMethod === 'city' ? 'active' : ''}`}
          onClick={() => onMethodChange('city')}
        >
          Select City
        </button>
      </div>
    </div>
  );
};

export default MethodSelector; 