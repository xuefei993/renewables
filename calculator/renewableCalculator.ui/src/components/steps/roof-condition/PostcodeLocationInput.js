import React, { useState } from 'react';

const PostcodeLocationInput = ({ onLocationChange }) => {
  const [postcode, setPostcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Use the same postcode service as in BasicInformation
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode.trim()}`);
      const data = await response.json();

      if (data.status === 200) {
        const location = {
          lat: data.result.latitude,
          lng: data.result.longitude,
          postcode: data.result.postcode,
          location: `${data.result.admin_ward}, ${data.result.admin_district}`,
          country: data.result.country
        };
        onLocationChange(location);
      } else {
        setError('Invalid postcode. Please check and try again.');
      }
    } catch (err) {
      setError('Unable to find location. Please check your postcode.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="postcode-location-input">
      <form onSubmit={handleSubmit} className="postcode-form">
        <div className="input-group">
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            placeholder="Enter postcode (e.g. SW1A 1AA)"
            className="postcode-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading || !postcode.trim()}
          >
            {isLoading ? 'Locating...' : 'Locate'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default PostcodeLocationInput; 