import React from "react";

const GasTariffSection = ({ formData, handleChange }) => {
  return (
    <div className="tariff-section">
      <h3>Gas Tariff</h3>
      
      <div className="form-group">
        <label htmlFor="hasGasSupply">Do you have a gas supply?</label>
        <select
          id="hasGasSupply"
          name="hasGasSupply"
          value={formData.hasGasSupply}
          onChange={handleChange}
          className="form-select"
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>

      {formData.hasGasSupply && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gasRate">Gas Rate (pence per kWh)</label>
            <input
              type="number"
              id="gasRate"
              name="gasRate"
              value={formData.gasRate}
              onChange={handleChange}
              placeholder="e.g. 6.5"
              step="0.1"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gasStandingCharge">Gas Standing Charge (pence per day)</label>
            <input
              type="number"
              id="gasStandingCharge"
              name="gasStandingCharge"
              value={formData.gasStandingCharge}
              onChange={handleChange}
              placeholder="e.g. 27.0"
              step="0.1"
              min="0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GasTariffSection; 