import React, { useState } from 'react';
import { calculateSolarPotential } from '../../../api';
import { getNextRoofNumber } from './roofLabelUtils';
import RoofConfigForm from './RoofConfigForm';
import SolarPotentialCalculation from './SolarPotentialCalculation';
import AddedRoofsList from './AddedRoofsList';
import RoofHelpModals from './RoofHelpModals';

const RoofConfigurationForm = ({ 
  roofConfig, 
  onConfigChange, 
  projectedArea, 
  actualRoofArea, 
  visible = true, 
  addedRoofs = [], 
  onRoofsUpdate, 
  onClearMeasurement,
  onAddAnotherRoof
}) => {
  const [showAngleTooltip, setShowAngleTooltip] = useState(false);
  const [showShadingTooltip, setShowShadingTooltip] = useState(false);
  const [showUtilisationTooltip, setShowUtilisationTooltip] = useState(false);
  const [solarPotentialResult, setSolarPotentialResult] = useState(null);
  const [showPotentialResults, setShowPotentialResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  if (!visible) return null;

  // Determine which area to display
  const displayArea = actualRoofArea || projectedArea;
  const currentRoofNumber = getNextRoofNumber(addedRoofs);

  // Check if all required fields are filled for solar potential calculation
  const isReadyForCalculation = () => {
    return displayArea > 0 &&
           roofConfig.roofOrientation &&
           roofConfig.roofAngle !== '' &&
           roofConfig.roofShading &&
           roofConfig.roofUtilisation;
  };

  const handleSolarPotentialCalculation = async () => {
    if (!isReadyForCalculation()) return;

    setIsCalculating(true);
    try {
      const request = {
        roofSize: displayArea,
        shadingLevel: roofConfig.roofShading,
        utilisationLevel: roofConfig.roofUtilisation,
        tiltAngle: parseInt(roofConfig.roofAngle),
        orientation: roofConfig.roofOrientation
      };

      const response = await calculateSolarPotential(request);
      
      // Transform backend response to match frontend format
      const result = {
        solarPotential: parseFloat(response.data.solarPotential),
        solarPanelCount: response.data.solarPanelCount,
        factors: {
          shading: parseFloat(response.data.shadingFactor),
          utilisation: parseFloat(response.data.utilisationFactor),
          tiltOrientation: parseFloat(response.data.tiltOrientationFactor)
        }
      };

      setSolarPotentialResult(result);
      setShowPotentialResults(true);
    } catch (error) {
      console.error('Error calculating solar potential:', error);
      // Fallback to a default result or show error message
      alert('Failed to calculate solar potential. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAddRoof = () => {
    if (!solarPotentialResult) return;

    const newRoof = {
      id: currentRoofNumber,
      area: displayArea,
      orientation: roofConfig.roofOrientation,
      angle: roofConfig.roofAngle,
      shading: roofConfig.roofShading,
      utilisation: roofConfig.roofUtilisation,
      solarPotential: solarPotentialResult.solarPotential,
      solarPanelCount: solarPotentialResult.solarPanelCount,
      config: { ...roofConfig },
      selected: true // Default to selected for installation
    };

    const updatedRoofs = [...addedRoofs, newRoof];
    onRoofsUpdate(updatedRoofs);
    
    // Reset states but keep current measurement visible
    setShowPotentialResults(false);
    setSolarPotentialResult(null);
    
    // Clear current configuration but keep the measurement
    onConfigChange('roofOrientation', '');
    onConfigChange('roofAngle', '');
    onConfigChange('roofShading', '');
    onConfigChange('roofUtilisation', '');
  };

  const handleRemoveRoof = (roofId) => {
    const updatedRoofs = addedRoofs.filter(roof => roof.id !== roofId);
    onRoofsUpdate(updatedRoofs);
  };

  // Tooltip handlers
  const toggleAngleTooltip = () => setShowAngleTooltip(!showAngleTooltip);
  const toggleShadingTooltip = () => setShowShadingTooltip(!showShadingTooltip);
  const toggleUtilisationTooltip = () => setShowUtilisationTooltip(!showUtilisationTooltip);

  return (
    <div className="roof-configuration">
      {/* Current Roof Configuration - Only show when measuring a new roof */}
      {projectedArea > 0 && (
        <>
          <h4>Roof {currentRoofNumber} Details</h4>
          
          {/* Roof Size Display */}
          <div className="roof-size-display">
            <span className="roof-size-label">Roof Size:</span>
            <strong className="roof-size-value">{displayArea.toFixed(2)} m²</strong>
          </div>
          
          <RoofConfigForm
            roofConfig={roofConfig}
            onConfigChange={onConfigChange}
            onShowAngleTooltip={toggleAngleTooltip}
            onShowShadingTooltip={toggleShadingTooltip}
            onShowUtilisationTooltip={toggleUtilisationTooltip}
          />

          <SolarPotentialCalculation
            isReadyForCalculation={isReadyForCalculation()}
            onCalculate={handleSolarPotentialCalculation}
            showResults={showPotentialResults}
            result={solarPotentialResult}
            currentRoofNumber={currentRoofNumber}
            onAddRoof={handleAddRoof}
            isCalculating={isCalculating}
          />
        </>
      )}

      {/* Added Roofs Display */}
      <AddedRoofsList 
        addedRoofs={addedRoofs} 
        onRemoveRoof={handleRemoveRoof}
        showTotal={false}
      />

      {/* Help Modals */}
      <RoofHelpModals
        showAngleTooltip={showAngleTooltip}
        showShadingTooltip={showShadingTooltip}
        showUtilisationTooltip={showUtilisationTooltip}
        onToggleAngleTooltip={toggleAngleTooltip}
        onToggleShadingTooltip={toggleShadingTooltip}
        onToggleUtilisationTooltip={toggleUtilisationTooltip}
      />
    </div>
  );
};

export default RoofConfigurationForm; 