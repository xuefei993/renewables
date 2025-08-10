import React, { useState } from "react";
import ElectricityUsageSection from "./energy-demand/ElectricityUsageSection";
import HeatingSection from "./energy-demand/HeatingSection";
import HotWaterSection from "./energy-demand/HotWaterSection";

const EnergyDemand = ({ data, onDataChange, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    householdSize: data.householdSize || "",
    knowsMonthlyUsage: data.knowsMonthlyUsage || "",
    monthlyElectricityUsage: data.monthlyElectricityUsage || {
      january: "", february: "", march: "", april: "", may: "", june: "",
      july: "", august: "", september: "", october: "", november: "", december: ""
    },
    knowsAnnualUsage: data.knowsAnnualUsage || "",
    annualElectricityUsage: data.annualElectricityUsage || "",
    floorArea: data.floorArea || "",
    heatingMethod: data.heatingMethod || "",
    hotWaterMethod: data.hotWaterMethod || "",
    daytimeHomeHabits: data.daytimeHomeHabits || "",
    knowsMonthlyGasUsage: data.knowsMonthlyGasUsage || "",
    monthlyGasUsage: data.monthlyGasUsage || {
      january: "", february: "", march: "", april: "", may: "", june: "",
      july: "", august: "", september: "", october: "", november: "", december: ""
    },
    knowsAnnualGasUsage: data.knowsAnnualGasUsage || "",
    annualGasUsage: data.annualGasUsage || "",
    heatPumpCOP: data.heatPumpCOP || "3.0",
    hotWaterHeatPumpCOP: data.hotWaterHeatPumpCOP || "3.0",
    boilerEfficiency: data.boilerEfficiency || "",
    ...data
  });

  // Help modal state
  const [activeHelpModal, setActiveHelpModal] = useState(null);

  // Helper function to check if gas is needed for either heating or hot water
  const needsGasUsage = () => {
    return formData.heatingMethod === "gas boiler" || formData.hotWaterMethod === "gas boiler";
  };

  // Helper function to check if any boiler is being used
  const usesBoiler = () => {
    return formData.heatingMethod === "gas boiler" || formData.hotWaterMethod === "gas boiler";
  };

  const updateFormData = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    onDataChange(updates);
  };

  // Basic form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Help modal handlers
  const openHelpModal = (modalType) => {
    setActiveHelpModal(modalType);
  };

  const closeHelpModal = () => {
    setActiveHelpModal(null);
  };

  // Electricity usage handlers
  const handleKnowsMonthlyUsageChange = (e) => {
    const value = e.target.value;
    let updates = { knowsMonthlyUsage: value };
    
    if (value === "yes") {
      updates.knowsAnnualUsage = "";
      updates.annualElectricityUsage = "";
    } else if (value === "no") {
      updates.monthlyElectricityUsage = {
        january: "", february: "", march: "", april: "", may: "", june: "",
        july: "", august: "", september: "", october: "", november: "", december: ""
      };
    }
    updateFormData(updates);
  };

  const handleKnowsAnnualUsageChange = (e) => {
    const value = e.target.value;
    let updates = { knowsAnnualUsage: value };
    
    if (value === "yes") {
      updates.monthlyElectricityUsage = {
        january: "", february: "", march: "", april: "", may: "", june: "",
        july: "", august: "", september: "", october: "", november: "", december: ""
      };
    }
    updateFormData(updates);
  };

  const handleMonthlyElectricityChange = (month, value) => {
    const updatedMonthlyUsage = {
      ...formData.monthlyElectricityUsage,
      [month]: value
    };
    updateFormData({ monthlyElectricityUsage: updatedMonthlyUsage });
  };

  const handleAnnualElectricityChange = (e) => {
    updateFormData({ annualElectricityUsage: e.target.value });
  };

  // Heating method handlers
  const handleHeatingMethodChange = (e) => {
    const value = e.target.value;
    let updates = { heatingMethod: value };
    
    // If neither heating nor hot water will need gas after this change, clear gas data
    if (value !== "gas boiler" && formData.hotWaterMethod !== "gas boiler") {
      updates = {
        ...updates,
        knowsMonthlyGasUsage: "",
        monthlyGasUsage: {
          january: "", february: "", march: "", april: "", may: "", june: "",
          july: "", august: "", september: "", october: "", november: "", december: ""
        },
        knowsAnnualGasUsage: "",
        annualGasUsage: ""
      };
    }
    
    if (value !== "heat pumps") {
      updates.heatPumpCOP = "3.0";
    }
    updateFormData(updates);
  };

  // Hot water method handlers
  const handleHotWaterMethodChange = (e) => {
    const value = e.target.value;
    let updates = { hotWaterMethod: value };
    
    // If neither heating nor hot water will need gas after this change, clear gas data
    if (value !== "gas boiler" && formData.heatingMethod !== "gas boiler") {
      updates = {
        ...updates,
        knowsMonthlyGasUsage: "",
        monthlyGasUsage: {
          january: "", february: "", march: "", april: "", may: "", june: "",
          july: "", august: "", september: "", october: "", november: "", december: ""
        },
        knowsAnnualGasUsage: "",
        annualGasUsage: ""
      };
    }
    
    if (value !== "heat pumps") {
      updates.hotWaterHeatPumpCOP = "3.0";
    }
    updateFormData(updates);
  };

  const handleKnowsMonthlyGasUsageChange = (e) => {
    const value = e.target.value;
    let updates = { knowsMonthlyGasUsage: value };
    
    if (value === "yes") {
      updates.knowsAnnualGasUsage = "";
      updates.annualGasUsage = "";
    } else if (value === "no") {
      updates.monthlyGasUsage = {
        january: "", february: "", march: "", april: "", may: "", june: "",
        july: "", august: "", september: "", october: "", november: "", december: ""
      };
    }
    updateFormData(updates);
  };

  const handleKnowsAnnualGasUsageChange = (e) => {
    const value = e.target.value;
    let updates = { knowsAnnualGasUsage: value };
    
    if (value === "yes") {
      updates.monthlyGasUsage = {
        january: "", february: "", march: "", april: "", may: "", june: "",
        july: "", august: "", september: "", october: "", november: "", december: ""
      };
    }
    updateFormData(updates);
  };

  const handleMonthlyGasChange = (month, value) => {
    const updatedMonthlyGasUsage = {
      ...formData.monthlyGasUsage,
      [month]: value
    };
    updateFormData({ monthlyGasUsage: updatedMonthlyGasUsage });
  };

  const handleAnnualGasUsageChange = (e) => {
    updateFormData({ annualGasUsage: e.target.value });
  };

  const handleHeatPumpCOPChange = (e) => {
    updateFormData({ heatPumpCOP: e.target.value });
  };

  const handleHotWaterHeatPumpCOPChange = (e) => {
    updateFormData({ hotWaterHeatPumpCOP: e.target.value });
  };

  const handleNext = () => {
    onNext();
  };

  const isFormValid = () => {
    if (!formData.householdSize || !formData.knowsMonthlyUsage || !formData.floorArea || !formData.heatingMethod || !formData.hotWaterMethod || !formData.daytimeHomeHabits) {
      return false;
    }
    
    // Validate electricity usage
    if (formData.knowsMonthlyUsage === "yes") {
      const months = ["january", "february", "march", "april", "may", "june", 
                     "july", "august", "september", "october", "november", "december"];
      const electricityValid = months.every(month => formData.monthlyElectricityUsage[month] && 
                                   formData.monthlyElectricityUsage[month].trim() !== "");
      if (!electricityValid) return false;
    } else if (formData.knowsMonthlyUsage === "no") {
      if (!formData.knowsAnnualUsage) {
        return false;
      }
      if (formData.knowsAnnualUsage === "yes" && !formData.annualElectricityUsage) {
        return false;
      }
    }
    
    // Validate gas usage if needed for either heating or hot water
    if (needsGasUsage()) {
      if (!formData.knowsMonthlyGasUsage) {
        return false;
      }
      if (formData.knowsMonthlyGasUsage === "yes") {
        const months = ["january", "february", "march", "april", "may", "june", 
                       "july", "august", "september", "october", "november", "december"];
        const gasValid = months.every(month => formData.monthlyGasUsage[month] && 
                                     formData.monthlyGasUsage[month].trim() !== "");
        if (!gasValid) return false;
      } else if (formData.knowsMonthlyGasUsage === "no") {
        if (!formData.knowsAnnualGasUsage) {
          return false;
        }
        if (formData.knowsAnnualGasUsage === "yes" && !formData.annualGasUsage) {
          return false;
        }
      }
    }

    // Validate boiler efficiency if using any boiler
    if (usesBoiler()) {
      if (!formData.boilerEfficiency) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Energy Demand</h2>
        <p>Tell us about your household's energy usage patterns to calculate accurate renewable energy recommendations.</p>
      </div>

      <div className="form-group">
        <label htmlFor="householdSize">How many people live in your household regularly?</label>
        <input
          type="number"
          id="householdSize"
          name="householdSize"
          value={formData.householdSize}
          onChange={handleChange}
          placeholder="Enter number of people"
          min="1"
          max="20"
          className="form-input"
          required
        />
      </div>

      <ElectricityUsageSection
        formData={formData}
        onKnowsMonthlyUsageChange={handleKnowsMonthlyUsageChange}
        onKnowsAnnualUsageChange={handleKnowsAnnualUsageChange}
        onMonthlyElectricityChange={handleMonthlyElectricityChange}
        onAnnualElectricityChange={handleAnnualElectricityChange}
      />

      <div className="form-group">
        <label htmlFor="floorArea">What is your approximate floor area? (m²)</label>
        <input
          type="number"
          id="floorArea"
          name="floorArea"
          value={formData.floorArea}
          onChange={handleChange}
          placeholder="Enter floor area in square metres"
          min="1"
          step="0.1"
          className="form-input"
          required
        />
      </div>

      <HeatingSection
        formData={formData}
        onHeatingMethodChange={handleHeatingMethodChange}
        onHeatPumpCOPChange={handleHeatPumpCOPChange}
        needsGasUsage={needsGasUsage()}
      />

      <HotWaterSection
        formData={formData}
        onHotWaterMethodChange={handleHotWaterMethodChange}
        onHotWaterHeatPumpCOPChange={handleHotWaterHeatPumpCOPChange}
        needsGasUsage={needsGasUsage()}
        onKnowsMonthlyGasUsageChange={handleKnowsMonthlyGasUsageChange}
        onKnowsAnnualGasUsageChange={handleKnowsAnnualGasUsageChange}
        onMonthlyGasChange={handleMonthlyGasChange}
        onAnnualGasUsageChange={handleAnnualGasUsageChange}
      />

      {/* Boiler Efficiency Section */}
      {usesBoiler() && (
        <div className="form-group">
          <div className="form-label-with-help">
            <label htmlFor="boilerEfficiency">What is your boiler's efficiency? (%)</label>
            <button 
              type="button"
              className="field-help-btn"
              onClick={() => openHelpModal('boilerEfficiency')}
              aria-label="Boiler Efficiency Help"
            >
              ?
            </button>
          </div>
          <input
            type="number"
            id="boilerEfficiency"
            name="boilerEfficiency"
            value={formData.boilerEfficiency}
            onChange={handleChange}
            placeholder="If you don't know, enter 92"
            min="50"
            max="98"
            step="1"
            className="form-input"
            required
          />
          <small className="input-help">Enter the efficiency percentage (typically 60-95%). If unsure, use 92% as a standard estimate.</small>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="daytimeHomeHabits">What are your typical daytime home habits?</label>
        <select
          id="daytimeHomeHabits"
          name="daytimeHomeHabits"
          value={formData.daytimeHomeHabits}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Select your daytime habits</option>
          <option value="mostly-home">Mostly at home</option>
          <option value="half-day-home">At home half the day</option>
          <option value="mostly-away">Mostly away from home</option>
        </select>
      </div>

      {/* Help Modal */}
      {activeHelpModal === 'boilerEfficiency' && (
        <div className="help-modal-overlay" onClick={closeHelpModal}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h4>Boiler Efficiency Guide</h4>
              <button 
                type="button"
                className="close-btn"
                onClick={closeHelpModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="help-modal-content">
              <p>Boiler efficiency indicates how much of the fuel is converted into useful heat. Here's how to estimate efficiency based on your boiler's age:</p>
              
              <div className="efficiency-guide">
                <div className="efficiency-item">
                  <h5>New Boilers (0-5 years)</h5>
                  <p><strong>Efficiency: 92-95%</strong><br />
                  Since April 2018, all new boilers sold in the UK must be A-rated, meaning they are at least 92% efficient.</p>
                </div>
                
                <div className="efficiency-item">
                  <h5>Modern Boilers (6-15 years)</h5>
                  <p><strong>Efficiency: 80-85%</strong><br />
                  Boilers around 15 years old might be in the 80-85% efficiency range.</p>
                </div>
                
                <div className="efficiency-item">
                  <h5>Older Boilers (16-25 years)</h5>
                  <p><strong>Efficiency: 75-80%</strong><br />
                  Boilers aged around 20 years may be around 75% efficient.</p>
                </div>
                
                <div className="efficiency-item">
                  <h5>Very Old Boilers (25+ years)</h5>
                  <p><strong>Efficiency: 60-70%</strong><br />
                  Boilers older than 25 years can be as low as 60-70% efficient and should be considered for replacement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="button-group">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
        <button 
          type="button" 
          className={`btn btn-primary ${!isFormValid() ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!isFormValid()}
        >
          Next: Tariffs
        </button>
      </div>
    </div>
  );
};

export default EnergyDemand; 