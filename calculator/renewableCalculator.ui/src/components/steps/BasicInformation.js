import React, { useState } from 'react';
import ClimateChart from './address-input/ClimateChart';
import MethodSelector from './basic-information/MethodSelector';
import MethodRenderer from './basic-information/MethodRenderer';
import LocationSummary from './basic-information/LocationSummary';
import PropertyInformation from './basic-information/PropertyInformation';
import { LocationHelpModal, FieldHelpModal } from './basic-information/HelpModals';

const BasicInformation = ({ data, onDataChange, onNext }) => {
  const [activeMethod, setActiveMethod] = useState('postcode');
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Property information state
  const [propertyInfo, setPropertyInfo] = useState({
    propertyType: '',
    buildingYear: '',
    epcRating: ''
  });

  const handleLocationSelect = (location) => {
    setLocationData(location);
    // Save location data to parent component
    const updatedData = {
      ...propertyInfo, // Include property info
      locationMethod: location.type,
      postcode: location.postcode,
      latitude: location.latitude,
      longitude: location.longitude,
      location: location.location,
      country: location.country,
      city: location.city,
      region: location.region
    };
    onDataChange(updatedData);
  };

  // Handle property information changes
  const handlePropertyInfoChange = (field, value) => {
    const updatedPropertyInfo = { ...propertyInfo, [field]: value };
    setPropertyInfo(updatedPropertyInfo);
    
    // If location data exists, update parent component data
    if (locationData) {
      const updatedData = {
        ...updatedPropertyInfo,
        locationMethod: locationData.type,
        postcode: locationData.postcode,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        location: locationData.location,
        country: locationData.country,
        city: locationData.city,
        region: locationData.region
      };
      onDataChange(updatedData);
    }
  };

  // Show/hide help tooltip
  const toggleTooltip = (field) => {
    setActiveTooltip(activeTooltip === field ? null : field);
  };

  const handleMethodChange = (method) => {
    setActiveMethod(method);
    setLocationData(null); // Clear previous data
  };

  const handleNext = () => {
    // Check if location data and property info are complete
    if (locationData && propertyInfo.propertyType && propertyInfo.buildingYear && propertyInfo.epcRating) {
      onNext();
    }
  };

  // Check if all required information is complete
  const isFormComplete = locationData && 
                         propertyInfo.propertyType && 
                         propertyInfo.buildingYear && 
                         propertyInfo.epcRating;

  return (
    <div className="step-container address-input-step">
      <MethodSelector
        activeMethod={activeMethod}
        onMethodChange={handleMethodChange}
        onShowHelp={() => setShowHelp(true)}
      />
      
      <div className="method-content">
        <MethodRenderer
          activeMethod={activeMethod}
          onLocationSelect={handleLocationSelect}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>

      <LocationSummary locationData={locationData} />

      {locationData && (
        <ClimateChart
          latitude={locationData.latitude}
          longitude={locationData.longitude}
          location={locationData.location}
        />
      )}

      <PropertyInformation
        locationData={locationData}
        propertyInfo={propertyInfo}
        onPropertyInfoChange={handlePropertyInfoChange}
        onToggleTooltip={toggleTooltip}
      />

      <div className="button-group">
        <div></div>
        <button
          className={`btn btn-primary ${!isFormComplete ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!isFormComplete || isLoading}
        >
          Next: House Details
        </button>
      </div>

      <LocationHelpModal 
        showHelp={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
      
      <FieldHelpModal 
        activeTooltip={activeTooltip} 
        onClose={() => setActiveTooltip(null)} 
      />
    </div>
  );
};

export default BasicInformation; 