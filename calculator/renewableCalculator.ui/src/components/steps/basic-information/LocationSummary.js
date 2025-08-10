import React from 'react';

const LocationSummary = ({ locationData }) => {
  if (!locationData) return null;

  return (
    <div className="location-summary">
      <div className="summary-card">
        <h4>Location Found</h4>
        <div className="location-details">
          <div className="detail-row">
            <span>Location:</span>
            <strong>{locationData.location}</strong>
          </div>
          <div className="detail-row">
            <span>Postcode:</span>
            <strong>{locationData.postcode}</strong>
          </div>
          <div className="detail-row">
            <span>Coordinates:</span>
            <strong>{locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}</strong>
          </div>
          <div className="detail-row">
            <span>Method:</span>
            <strong>
              {locationData.type === 'postcode' ? 'Postcode' : 
               locationData.type === 'geolocation' ? 'Current Location' : 'City Selection'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSummary; 