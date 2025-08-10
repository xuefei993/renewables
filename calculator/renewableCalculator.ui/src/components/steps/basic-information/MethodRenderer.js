import React from 'react';
import PostcodeInput from '../address-input/PostcodeInput';
import LocationInput from '../address-input/LocationInput';
import CitySelector from '../address-input/CitySelector';

const MethodRenderer = ({ 
  activeMethod, 
  onLocationSelect, 
  isLoading, 
  setIsLoading 
}) => {
  switch (activeMethod) {
    case 'postcode':
      return (
        <PostcodeInput
          onLocationSelect={onLocationSelect}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      );
    case 'location':
      return (
        <LocationInput
          onLocationSelect={onLocationSelect}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      );
    case 'city':
      return (
        <CitySelector
          onLocationSelect={onLocationSelect}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      );
    default:
      return null;
  }
};

export default MethodRenderer; 