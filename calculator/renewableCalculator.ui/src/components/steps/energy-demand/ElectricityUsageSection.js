import React from 'react';

const ElectricityUsageSection = ({ 
  formData, 
  onKnowsMonthlyUsageChange, 
  onKnowsAnnualUsageChange, 
  onMonthlyElectricityChange,
  onAnnualElectricityChange 
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

  return (
    <>
      <div className="form-group">
        <label htmlFor="knowsMonthlyUsage">Do you know your last year's monthly electricity usage?</label>
        <select
          id="knowsMonthlyUsage"
          name="knowsMonthlyUsage"
          value={formData.knowsMonthlyUsage}
          onChange={onKnowsMonthlyUsageChange}
          className="form-select"
          required
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {formData.knowsMonthlyUsage === "yes" && (
        <div className="form-group">
          <div className="monthly-usage-container">
            <h3 className="monthly-usage-title">Monthly electricity usage (kWh)</h3>
            <p className="monthly-usage-description">Please enter your electricity usage for each month:</p>
            <div className="monthly-usage-grid">
              {months.map(month => (
                <div key={month.key} className="monthly-input-group">
                  <label htmlFor={month.key} className="month-label">{month.label}</label>
                  <input
                    type="number"
                    id={month.key}
                    name={month.key}
                    value={formData.monthlyElectricityUsage[month.key]}
                    onChange={(e) => onMonthlyElectricityChange(month.key, e.target.value)}
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

      {formData.knowsMonthlyUsage === "no" && (
        <>
          <div className="form-group">
            <label htmlFor="knowsAnnualUsage">Do you know your last year's annual electricity usage?</label>
            <select
              id="knowsAnnualUsage"
              name="knowsAnnualUsage"
              value={formData.knowsAnnualUsage}
              onChange={onKnowsAnnualUsageChange}
              className="form-select"
              required
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {formData.knowsAnnualUsage === "yes" && (
            <div className="form-group">
              <label htmlFor="annualElectricityUsage">Annual electricity usage (kWh)</label>
              <input
                type="number"
                id="annualElectricityUsage"
                name="annualElectricityUsage"
                value={formData.annualElectricityUsage}
                onChange={onAnnualElectricityChange}
                placeholder="Enter annual usage in kWh"
                min="0"
                step="1"
                className="form-input"
                required
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ElectricityUsageSection; 