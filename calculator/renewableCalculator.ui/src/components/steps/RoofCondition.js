import React, { useState, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import GoogleMapsPolygonDrawer from './roof-condition/GoogleMapsPolygonDrawer';
import RoofConfigurationForm from './roof-condition/RoofConfigurationForm';
import RoofSelectionList from './roof-condition/RoofSelectionList';
import { calculateActualRoofArea } from './roof-condition/roofAreaUtils';

const RoofCondition = ({ data, onDataChange, onNext, onBack, userLocation }) => {
  const [projectedRoofArea, setProjectedRoofArea] = useState(data.projectedRoofArea || 0);
  const [roofConfig, setRoofConfig] = useState({
    roofOrientation: data.roofOrientation || '',
    roofAngle: data.roofAngle || '',
    roofShading: data.roofShading || '',
    roofUtilisation: data.roofUtilisation || ''
  });
  const [addedRoofs, setAddedRoofs] = useState(data.addedRoofs || []);
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(data.isSelectionMode || false);
  
  // Ref to control Google Maps polygon clearing
  const googleMapsRef = useRef(null);

  // Calculate actual roof area based on angle
  const actualRoofArea = calculateActualRoofArea(projectedRoofArea, roofConfig.roofAngle);

  // Handle area changes from map
  const handleAreaChange = (area) => {
    setProjectedRoofArea(area);
    const actualArea = calculateActualRoofArea(area, roofConfig.roofAngle);
    
    // Validate that actualArea is a number before calling toFixed
    if (typeof actualArea === 'number' && !isNaN(actualArea)) {
      onDataChange({ 
        projectedRoofArea: area,
        roofArea: actualArea
      });
    } else {
      onDataChange({ 
        projectedRoofArea: area,
        roofArea: area
      });
    }
  };

  const render = (status) => {
    return <div>Loading...</div>;
  };

  // Handle configuration changes
  const handleConfigChange = (field, value) => {
    const newConfig = { ...roofConfig, [field]: value };
    setRoofConfig(newConfig);
    
    if (field === 'roofAngle') {
      const actualArea = calculateActualRoofArea(projectedRoofArea, value);
      // Validate that actualArea is a number before calling toFixed
      if (typeof actualArea === 'number' && !isNaN(actualArea)) {
        onDataChange({ 
          ...newConfig,
          roofArea: actualArea
        });
      } else {
        onDataChange({ 
          ...newConfig,
          roofArea: projectedRoofArea
        });
      }
    } else {
      onDataChange({ [field]: value });
    }
  };

  const handleRoofsUpdate = (newAddedRoofs) => {
    setAddedRoofs(newAddedRoofs);
    onDataChange({ addedRoofs: newAddedRoofs, isSelectionMode });
  };

  const handleClearCurrentMeasurement = () => {
    setProjectedRoofArea(0);
    setRoofConfig({
      roofOrientation: '',
      roofAngle: '',
      roofShading: '',
      roofUtilisation: ''
    });
    onDataChange({
      roofArea: 0,
      projectedRoofArea: 0,
      roofOrientation: '',
      roofAngle: '',
      roofShading: '',
      roofUtilisation: ''
    });
  };

  // New function to handle "Add Another Roof" functionality
  const handleAddAnotherRoof = () => {
    // Clear the polygon from the map
    if (googleMapsRef.current) {
      googleMapsRef.current.clearPolygon();
    }
    
    // Clear current measurement and config
    handleClearCurrentMeasurement();
  };

  // Handle "Add more roofs" button click
  const handleAddMoreRoofs = () => {
    handleAddAnotherRoof();
  };

  // Handle "Finish Measurement" button click
  const handleFinishMeasurement = () => {
    setIsSelectionMode(true);
    onDataChange({ isSelectionMode: true, addedRoofs });
  };

  // Validation function
  const isFormValid = () => {
    if (isSelectionMode) {
      // In selection mode, at least one roof must be selected
      return addedRoofs.some(roof => roof.selected);
    } else {
      // In measurement mode, at least one roof must be added
      return addedRoofs.length > 0;
    }
  };

  const apiKey = "AIzaSyCpAABUQR_MiKb4yDovC3-1jM0LdIs59Hc";

  return (
    <div className="step-container roof-condition-step">
      <div className="step-header">
        <div className="header-content">
          <div className="title-section">
            <h2>Roof Condition</h2>
            <p className="step-description">
              {isSelectionMode 
                ? "Select which roofs you want to install solar panels on."
                : "Use Google Maps to measure your roof area and assess its solar potential."
              }
            </p>
          </div>
          {!isSelectionMode && (
            <button 
              type="button" 
              className="btn btn-guide"
              onClick={() => setShowMeasurementGuide(true)}
            >
              Measurement Guide
            </button>
          )}
        </div>
      </div>

      {/* Measurement Guide Modal */}
      {showMeasurementGuide && (
        <div className="modal-overlay" onClick={() => setShowMeasurementGuide(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Instructions for Accurate Roof Measurement</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowMeasurementGuide(false)}
                aria-label="Close guide"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ol className="measurement-instructions-list">
                <li>Search your postcode or find your property on the satellite map</li>
                <li>Use the compass on the right to help identify directions</li>
                <li>Zoom in as much as possible for precise measurements</li>
                <li>Click on the corners of your roof to draw the outline</li>
                <li>Close the shape by clicking on the first point</li>
                <li>Select your roof orientation using the dropdown below</li>
                <li>Adjust roof angle and shading details</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {isSelectionMode ? (
        // Selection Mode: Show roof selection interface
        <RoofSelectionList 
          addedRoofs={addedRoofs}
          onRoofsUpdate={handleRoofsUpdate}
        />
      ) : (
        // Measurement Mode: Show measurement interface
        <div className="roof-measurement-container">
          <div className="form-group">
            <Wrapper apiKey={apiKey} render={render} libraries={['drawing', 'geometry']}>
              <GoogleMapsPolygonDrawer
                ref={googleMapsRef}
                onAreaChange={handleAreaChange}
                userLocation={userLocation}
                apiKey={apiKey}
              />
            </Wrapper>
          </div>

          <RoofConfigurationForm
            roofConfig={roofConfig}
            onConfigChange={handleConfigChange}
            projectedArea={projectedRoofArea}
            actualRoofArea={actualRoofArea}
            visible={projectedRoofArea > 0 || addedRoofs.length > 0}
            addedRoofs={addedRoofs}
            onRoofsUpdate={handleRoofsUpdate}
            onClearMeasurement={handleClearCurrentMeasurement}
            onAddAnotherRoof={handleAddAnotherRoof}
          />
        </div>
      )}

      <div className="button-group">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={isSelectionMode ? () => setIsSelectionMode(false) : onBack}
        >
          {isSelectionMode ? 'Back to Measurement' : 'Back'}
        </button>
        
        {!isSelectionMode && addedRoofs.length > 0 && (
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={handleAddMoreRoofs}
          >
            Add More Roofs
          </button>
        )}
        
        <button 
          type="button" 
          className={`btn btn-primary ${!isFormValid() ? 'disabled' : ''}`}
          onClick={isSelectionMode ? onNext : handleFinishMeasurement}
          disabled={!isFormValid()}
        >
          {isSelectionMode ? 'Next: Insulation Performance' : 'Finish Measurement'}
        </button>
      </div>
    </div>
  );
};

export default RoofCondition; 