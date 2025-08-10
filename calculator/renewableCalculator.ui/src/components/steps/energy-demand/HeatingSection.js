import React from 'react';

const HeatingSection = ({ 
  formData, 
  onHeatingMethodChange,
  onHeatPumpCOPChange,
  needsGasUsage
}) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="heatingMethod">What is your home's heating method?</label>
        <select
          id="heatingMethod"
          name="heatingMethod"
          value={formData.heatingMethod}
          onChange={onHeatingMethodChange}
          className="form-select"
          required
        >
          <option value="">Select heating method</option>
          <option value="gas boiler">Gas boiler</option>
          <option value="electricity heating">Electricity heating</option>
          <option value="heat pumps">Heat pumps</option>
        </select>
      </div>

      {formData.heatingMethod === "heat pumps" && (
        <div className="form-group">
          <label htmlFor="heatPumpCOP">Heat Pump COP (Coefficient of Performance)</label>
          <input
            type="number"
            id="heatPumpCOP"
            name="heatPumpCOP"
            value={formData.heatPumpCOP}
            onChange={onHeatPumpCOPChange}
            placeholder="Default: 3.0"
            min="1"
            max="10"
            step="0.1"
            className="form-input"
          />
          <small className="input-help">If you don't know, the default value of 3.0 will be used.</small>
        </div>
      )}
    </>
  );
};

export default HeatingSection; 