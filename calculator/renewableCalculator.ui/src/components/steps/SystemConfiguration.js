import React, { useState } from "react";
import ConfigurationComparison from "./ConfigurationComparison";
import "../../styles/configuration-comparison.css";

const SystemConfiguration = ({ userData, onConfigurationUpdate, appliedSubsidies, totalSubsidyAmount }) => {
  const [selectedEquipment, setSelectedEquipment] = useState({
    solarPanels: false,
    batteryStorage: false,
    heatPump: false
  });
  const [configurationConfirmed, setConfigurationConfirmed] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleEquipmentChange = (equipment) => {
    const newEquipment = {
      ...selectedEquipment,
      [equipment]: !selectedEquipment[equipment]
    };
    setSelectedEquipment(newEquipment);
    
    // Notify parent component about equipment selection changes
    if (onConfigurationUpdate) {
      onConfigurationUpdate({
        selectedEquipment: newEquipment
      });
    }
  };

  const handleConfirmConfiguration = () => {
    const hasSelectedEquipment = Object.values(selectedEquipment).some(selected => selected);
    if (hasSelectedEquipment) {
      setConfigurationConfirmed(true);
      setShowComparison(true);
      
      // Notify parent component about confirmed configuration and comparison state
      if (onConfigurationUpdate) {
        onConfigurationUpdate({
          selectedEquipment: selectedEquipment,
          configurationConfirmed: true,
          showComparison: true
        });
      }
    }
  };

  const handleBackToConfiguration = () => {
    setShowComparison(false);
    setConfigurationConfirmed(false);
    
    // Notify parent component that we're back to equipment selection
    if (onConfigurationUpdate) {
      onConfigurationUpdate({
        selectedEquipment: selectedEquipment,
        configurationConfirmed: false,
        showComparison: false
      });
    }
  };

  const hasSelectedEquipment = Object.values(selectedEquipment).some(selected => selected);

  // If showing comparison, render the comparison component
  if (showComparison) {
    return (
      <ConfigurationComparison 
        selectedEquipment={selectedEquipment}
        userData={userData}
        onBack={handleBackToConfiguration}
        appliedSubsidies={appliedSubsidies}
        totalSubsidyAmount={totalSubsidyAmount}
      />
    );
  }

  return (
    <div className="system-configuration-tab">
      <div className="results-section">
        <div className="configuration-card">
          <h3>Equipment Selection</h3>
          <p className="configuration-intro">
            Which equipment would you like to install?
          </p>
          
          {/* Equipment Type Selection */}
          <div className="equipment-selection">
            <div className="equipment-grid">
              <div className="equipment-option">
                <label className="equipment-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedEquipment.solarPanels}
                    onChange={() => handleEquipmentChange('solarPanels')}
                  />
                  <div className="equipment-info">
                    <h4>Solar Panels</h4>
                  </div>
                </label>
              </div>

              <div className="equipment-option">
                <label className="equipment-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedEquipment.batteryStorage}
                    onChange={() => handleEquipmentChange('batteryStorage')}
                  />
                  <div className="equipment-info">
                    <h4>Battery Storage</h4>
                  </div>
                </label>
              </div>

              <div className="equipment-option">
                <label className="equipment-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedEquipment.heatPump}
                    onChange={() => handleEquipmentChange('heatPump')}
                  />
                  <div className="equipment-info">
                    <h4>Heat Pump</h4>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="configuration-actions">
              {hasSelectedEquipment ? (
                <button 
                  className="btn btn-primary configuration-btn"
                  onClick={handleConfirmConfiguration}
                >
                  Start Comparison
                </button>
              ) : (
                <p className="selection-hint">
                  Please select at least one equipment type to continue.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration; 