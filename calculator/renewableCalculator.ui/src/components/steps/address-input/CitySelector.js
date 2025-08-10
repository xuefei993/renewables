import React, { useState, useEffect } from 'react';
import { getAllRegions, getRegionsByCountry } from '../../../api';
import { postcodeService } from '../../../services/postcodeService';

const CitySelector = ({ onLocationSelect, isLoading, setIsLoading }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState('');
  
  // Data from API
  const [allRegionsData, setAllRegionsData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Load all regions data on component mount
  useEffect(() => {
    const loadRegionsData = async () => {
      try {
        setDataLoading(true);
        const response = await getAllRegions();
        const regionsData = response.data;
        
        setAllRegionsData(regionsData);
        
        // Extract unique countries
        const uniqueCountries = [...new Set(regionsData.map(region => region.country))];
        setCountries(uniqueCountries);
        
      } catch (error) {
        console.error('Failed to load regions data:', error);
        setError('Failed to load location data. Please try again.');
      } finally {
        setDataLoading(false);
      }
    };

    loadRegionsData();
  }, []);

  // Update regions when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryRegions = allRegionsData.filter(region => region.country === selectedCountry);
      setRegions(countryRegions);
      setCities([]);
    } else {
      setRegions([]);
      setCities([]);
    }
  }, [selectedCountry, allRegionsData]);

  // Update cities when region changes
  useEffect(() => {
    if (selectedRegion) {
      const regionData = allRegionsData.find(region => 
        region.country === selectedCountry && region.name === selectedRegion
      );
      if (regionData) {
        setCities(regionData.cities || []);
      }
    } else {
      setCities([]);
    }
  }, [selectedRegion, selectedCountry, allRegionsData]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedRegion('');
    setSelectedCity('');
    setError('');
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedCity('');
    setError('');
  };

  const handleCityChange = async (e) => {
    const cityValue = e.target.value;
    setSelectedCity(cityValue);
    setError('');

    if (cityValue) {
      setIsLoading(true);
      
      try {
        const cityData = cities.find(city => city.name === cityValue);
        if (cityData) {
          const result = await postcodeService.validatePostcode(cityData.postcode);
          
          if (result.success) {
            onLocationSelect({
              type: 'city',
              postcode: result.data.postcode,
              latitude: result.data.latitude,
              longitude: result.data.longitude,
              location: `${cityData.name}, ${selectedRegion}, ${selectedCountry}`,
              country: result.data.country,
              city: cityData.name,
              region: selectedRegion
            });
          } else {
            setError(`Failed to get coordinates for ${cityData.name}`);
          }
        }
      } catch (error) {
        setError('Failed to validate city location');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (dataLoading) {
    return (
      <div className="city-selector-container">
        <h3>Select Your City</h3>
        <div className="loading-message">
          <span>Loading location data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="city-selector-container">
      <h3>Select Your City</h3>
      <p>Choose your location from our city database</p>
      
      <div className="selector-group">
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            disabled={isLoading || dataLoading}
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {selectedCountry && (
          <div className="form-group">
            <label htmlFor="region">Region</label>
            <select
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
              disabled={isLoading || dataLoading}
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedRegion && (
          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              value={selectedCity}
              onChange={handleCityChange}
              disabled={isLoading || dataLoading}
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>Warning: {error}</span>
        </div>
      )}

      {isLoading && selectedCity && (
        <div className="loading-message">
          <span>Getting coordinates for {selectedCity}...</span>
        </div>
      )}
    </div>
  );
};

export default CitySelector; 