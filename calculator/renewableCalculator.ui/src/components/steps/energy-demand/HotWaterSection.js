import React from 'react';

const HotWaterSection = ({ 
  formData, 
  onHotWaterMethodChange,
  onHotWaterHeatPumpCOPChange,
  needsGasUsage,
  onKnowsMonthlyGasUsageChange,
  onKnowsAnnualGasUsageChange,
  onMonthlyGasChange,
  onAnnualGasUsageChange
}) => {
  const months = [
    { key: "january", label: "January" },
    { key: "february", label: "February" },
    { key: "march", label: "March" },
    { key: "april", label: "April" },
    { key: "may", label: "May" },
    { key: "june", label: "June" },
    { key: "july", label: "July" },
    { key: "august", label: "August" },
    { key: "september", label: "September" },
    { key: "october", label: "October" },
    { key: "november", label: "November" },
    { key: "december", label: "December" }
  ];

  // Get gas usage description based on what systems need gas
  const getGasUsageDescription = () => {
    const heatingNeedsGas = formData.heatingMethod === "gas boiler";
    const hotWaterNeedsGas = formData.hotWaterMethod === "gas boiler";
    
    if (heatingNeedsGas && hotWaterNeedsGas) {
      return "Please enter your total gas usage for both heating and hot water:";
    } else if (heatingNeedsGas) {
      return "Please enter your gas usage for heating:";
    } else if (hotWaterNeedsGas) {
      return "Please enter your gas usage for hot water:";
    }
    return "Please enter your gas usage:";
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="hotWaterMethod">What is your main hot water method?</label>
        <select
          id="hotWaterMethod"
          name="hotWaterMethod"
          value={formData.hotWaterMethod}
          onChange={onHotWaterMethodChange}
          className="form-select"
          required
        >
          <option value="">Select hot water method</option>
          <option value="gas boiler">Gas boiler</option>
          <option value="electricity">Electricity</option>
          <option value="heat pumps">Heat pumps</option>
        </select>
      </div>

      {formData.hotWaterMethod === "heat pumps" && (
        <div className="form-group">
          <label htmlFor="hotWaterHeatPumpCOP">Hot Water Heat Pump COP (Coefficient of Performance)</label>
          <input
            type="number"
            id="hotWaterHeatPumpCOP"
            name="hotWaterHeatPumpCOP"
            value={formData.hotWaterHeatPumpCOP}
            onChange={onHotWaterHeatPumpCOPChange}
            placeholder="Default: 3.0"
            min="1"
            max="10"
            step="0.1"
            className="form-input"
          />
          <small className="input-help">If you don't know, the default value of 3.0 will be used.</small>
        </div>
      )}

      {needsGasUsage && (
        <>
          <div className="form-group">
            <label htmlFor="knowsMonthlyGasUsage">Do you know your last year's monthly gas usage?</label>
            <select
              id="knowsMonthlyGasUsage"
              name="knowsMonthlyGasUsage"
              value={formData.knowsMonthlyGasUsage}
              onChange={onKnowsMonthlyGasUsageChange}
              className="form-select"
              required
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {formData.knowsMonthlyGasUsage === "yes" && (
            <div className="form-group">
              <div className="monthly-usage-container">
                <h3 className="monthly-usage-title">Monthly gas usage (kWh)</h3>
                <p className="monthly-usage-description">{getGasUsageDescription()}</p>
                <div className="monthly-usage-grid">
                  {months.map(month => (
                    <div key={month.key} className="monthly-input-group">
                      <label htmlFor={`gas-${month.key}`} className="month-label">{month.label}</label>
                      <input
                        type="number"
                        id={`gas-${month.key}`}
                        name={`gas-${month.key}`}
                        value={formData.monthlyGasUsage[month.key]}
                        onChange={(e) => onMonthlyGasChange(month.key, e.target.value)}
                        placeholder="kWh"
                        min="0"
                        step="0.1"
                        className="form-input month-input"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formData.knowsMonthlyGasUsage === "no" && (
            <>
              <div className="form-group">
                <label htmlFor="knowsAnnualGasUsage">Do you know your last year's annual gas usage?</label>
                <select
                  id="knowsAnnualGasUsage"
                  name="knowsAnnualGasUsage"
                  value={formData.knowsAnnualGasUsage}
                  onChange={onKnowsAnnualGasUsageChange}
                  className="form-select"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.knowsAnnualGasUsage === "yes" && (
                <div className="form-group">
                  <label htmlFor="annualGasUsage">Annual gas usage (kWh)</label>
                  <input
                    type="number"
                    id="annualGasUsage"
                    name="annualGasUsage"
                    value={formData.annualGasUsage}
                    onChange={onAnnualGasUsageChange}
                    placeholder={`Enter annual gas usage in kWh`}
                    min="0"
                    step="1"
                    className="form-input"
                    required
                  />
                  <small className="input-help">{getGasUsageDescription()}</small>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default HotWaterSection; 