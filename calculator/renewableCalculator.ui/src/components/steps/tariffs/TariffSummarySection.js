import React from "react";
import { requiresEconomy7Rates, requiresEconomy10Rates } from './tariffConstants';

const TariffSummarySection = ({ formData, isFormValid }) => {
  if (!isFormValid()) {
    return null;
  }

  return (
    <div className="tariff-summary">
      <h3>Current Tariff Summary</h3>
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">Electricity Rate:</span>
          <span className="summary-value">{formData.electricityRate}p/kWh</span>
        </div>
        
        {formData.electricityStandingCharge && (
          <div className="summary-item">
            <span className="summary-label">Electricity Standing Charge:</span>
            <span className="summary-value">{formData.electricityStandingCharge}p/day</span>
          </div>
        )}
        
        {requiresEconomy7Rates(formData.electricityTariffType) && formData.economy7NightRate && (
          <div className="summary-item">
            <span className="summary-label">Economy 7 Night Rate:</span>
            <span className="summary-value">{formData.economy7NightRate}p/kWh</span>
          </div>
        )}
        
        {requiresEconomy10Rates(formData.electricityTariffType) && formData.economy10NightRate && (
          <div className="summary-item">
            <span className="summary-label">Economy 10 Night Rate:</span>
            <span className="summary-value">{formData.economy10NightRate}p/kWh</span>
          </div>
        )}
        
        {formData.hasGasSupply && formData.gasRate && (
          <div className="summary-item">
            <span className="summary-label">Gas Rate:</span>
            <span className="summary-value">{formData.gasRate}p/kWh</span>
          </div>
        )}
        
        {formData.exportArrangement === 'feed-in' && formData.feedInExportRate && (
          <div className="summary-item">
            <span className="summary-label">Export Rate (FiT):</span>
            <span className="summary-value">{formData.feedInExportRate}p/kWh (Installed {formData.feedInInstallationYear})</span>
          </div>
        )}
        
        {formData.exportArrangement === 'seg' && formData.segExportRate && (
          <div className="summary-item">
            <span className="summary-label">Export Rate (SEG):</span>
            <span className="summary-value">{formData.segExportRate}p/kWh</span>
          </div>
        )}
        
        {formData.exportArrangement === 'none' && (
          <div className="summary-item">
            <span className="summary-label">Export Arrangement:</span>
            <span className="summary-value">No export arrangement</span>
          </div>
        )}
        
        {formData.exportArrangement === 'planning' && (
          <div className="summary-item">
            <span className="summary-label">Export Arrangement:</span>
            <span className="summary-value">Planning to join SEG</span>
          </div>
        )}
        
        <div className="summary-item">
          <span className="summary-label">Electricity Price Increase:</span>
          <span className="summary-value">{formData.electricityPriceIncrease}% annually</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Gas Price Increase:</span>
          <span className="summary-value">{formData.gasPriceIncrease}% annually</span>
        </div>
      </div>
    </div>
  );
};

export default TariffSummarySection; 