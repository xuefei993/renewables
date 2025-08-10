import React, { useState } from 'react';
import { locationService } from '../../../services/locationService';

const LocationInput = ({ onLocationSelect, isLoading, setIsLoading }) => {
  const [error, setError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setIsLoading(true);
    setError('');

    try {
      const locationResult = await locationService.getCurrentLocation();
      
      if (locationResult.success) {
        const { latitude, longitude } = locationResult.data;
        
        // 尝试获取邮编
        const postcodeResult = await locationService.coordinatesToPostcode(latitude, longitude);
        
        onLocationSelect({
          type: 'geolocation',
          latitude,
          longitude,
          postcode: postcodeResult.success ? postcodeResult.data.postcode : 'Unknown',
          location: 'Current Location',
          accuracy: locationResult.data.accuracy
        });
      } else {
        setError(locationResult.error || 'Failed to get location');
      }
    } catch (error) {
      setError(error.error || 'Location access failed');
    } finally {
      setIsGettingLocation(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="location-input-container">
      <h3>Use Current Location</h3>
      <p>Allow location access to automatically detect your coordinates</p>
      
      <button
        onClick={handleGetLocation}
        disabled={isLoading}
        className="btn btn-secondary location-btn"
      >
        {isGettingLocation ? (
          <>
            <span className="spinner">Loading</span>
            Getting Location...
          </>
        ) : (
          <>
            Get My Location
          </>
        )}
      </button>
      
      {error && (
        <div className="error-message">
          <span>Warning: {error}</span>
        </div>
      )}
      
      <div className="location-info">
        <small>
          <strong>Note:</strong> Your browser will ask for permission to access your location.
          This data is only used to find climate information for your area.
        </small>
      </div>
    </div>
  );
};

export default LocationInput; 