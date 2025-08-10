import React, { useState } from "react";
import {
  ElectricityTariffSection,
  GasTariffSection,
  ExportArrangementSection,
  PriceProjectionsSection,
  TariffSummarySection,
  validateFormData
} from "./tariffs/index";

const Tariffs = ({ data, onDataChange, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    electricityTariffType: data.electricityTariffType || 'standard',
    electricityRate: data.electricityRate || '',
    electricityStandingCharge: data.electricityStandingCharge || '',
    gasTariffType: data.gasTariffType || 'standard',
    gasRate: data.gasRate || '',
    gasStandingCharge: data.gasStandingCharge || '',
    feedInTariffRate: data.feedInTariffRate || '',
    smartExportGuarantee: data.smartExportGuarantee || '',
    timeOfUseEnabled: data.timeOfUseEnabled || false,
    peakRate: data.peakRate || '',
    offPeakRate: data.offPeakRate || '',
    nightRate: data.nightRate || '',
    economy7NightRate: data.economy7NightRate || '',
    economy10NightRate: data.economy10NightRate || '',
    
    // Time of Use electricity usage distribution
    peakUsagePercentage: data.peakUsagePercentage || '',
    offPeakUsagePercentage: data.offPeakUsagePercentage || '',
    standardUsagePercentage: data.standardUsagePercentage || '',
    
    // Off-peak usage for other tariff types
    standardOffPeakUsage: data.standardOffPeakUsage || '',
    economy7OffPeakUsage: data.economy7OffPeakUsage || '',
    economy10OffPeakUsage: data.economy10OffPeakUsage || '',

    // Export arrangement fields
    exportArrangement: data.exportArrangement || '',
    feedInExportRate: data.feedInExportRate || '',
    feedInInstallationYear: data.feedInInstallationYear || '',
    segExportRate: data.segExportRate || '',

    // Separate price projections for electricity and gas
    electricityPriceIncrease: data.electricityPriceIncrease || '',
    gasPriceIncrease: data.gasPriceIncrease || '',

    hasGasSupply: data.hasGasSupply !== false, // Default to true
    ...data
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    onDataChange({ [name]: newValue });
  };

  const handleNext = () => {
    // Validation will be handled by isFormValid
    if (isFormValid()) {
      onNext();
    }
  };

  const isFormValid = () => {
    return validateFormData(formData);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Energy Tariffs</h2>
        <p>Configure your electricity and gas tariff details to calculate accurate savings and payback periods for your renewable energy system.</p>
      </div>

      <ElectricityTariffSection 
        formData={formData} 
        handleChange={handleChange} 
      />

      <GasTariffSection 
        formData={formData} 
        handleChange={handleChange} 
      />

      <ExportArrangementSection 
        formData={formData} 
        handleChange={handleChange} 
      />

      <PriceProjectionsSection 
        formData={formData} 
        handleChange={handleChange} 
      />

      <TariffSummarySection 
        formData={formData} 
        isFormValid={isFormValid} 
      />

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button 
          type="button" 
          className={`btn btn-primary ${!isFormValid() ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!isFormValid()}
        >
          Calculate Results
        </button>
      </div>
    </div>
  );
};

export default Tariffs; 