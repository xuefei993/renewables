import React, { useState } from 'react';
import { postcodeService } from '../../../services/postcodeService';

const PostcodeInput = ({ onLocationSelect, isLoading, setIsLoading }) => {
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPostcode(value);
    setError('');
  };

  const handleSearch = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await postcodeService.validatePostcode(postcode);
      
      if (result.success) {
        onLocationSelect({
          type: 'postcode',
          postcode: result.data.postcode,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          location: `${result.data.admin_district}, ${result.data.region}`,
          country: result.data.country
        });
      } else {
        setError(result.error || 'Invalid postcode');
      }
    } catch (error) {
      setError('Failed to validate postcode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="postcode-input-container">
      <h3>Enter Your Postcode</h3>
      <p>Enter your UK postcode to find your exact location</p>
      
      <div className="input-group">
        <input
          type="text"
          value={postcode}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="e.g., SW1A 1AA"
          className={`postcode-input ${error ? 'error' : ''}`}
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !postcode.trim()}
          className="btn btn-primary search-btn"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <span>Warning: {error}</span>
        </div>
      )}
      
      <div className="postcode-examples">
        <small>
          <strong>Examples:</strong> KY16 8DE (St Andrews), SW1A 1AA (Westminster), M1 1AA (Manchester)
        </small>
      </div>
    </div>
  );
};

export default PostcodeInput; 