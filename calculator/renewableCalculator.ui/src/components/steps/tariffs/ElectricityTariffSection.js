import React from "react";
import { 
  getCurrentElectricityInfo, 
  requiresTimeOfUseRates, 
  requiresEconomy7Rates, 
  requiresEconomy10Rates,
  calculateTotalUsagePercentage 
} from './tariffConstants';

const ElectricityTariffSection = ({ formData, handleChange }) => {
  return (
    <div className="tariff-section">
      <h3>Electricity Tariff</h3>
      
      <div className="form-group">
        <label htmlFor="electricityTariffType">Tariff Type</label>
        <select
          id="electricityTariffType"
          name="electricityTariffType"
          value={formData.electricityTariffType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="standard">Standard Variable Rate</option>
          <option value="fixed">Fixed Rate</option>
          <option value="economy7">Economy 7</option>
          <option value="economy10">Economy 10</option>
          <option value="time-of-use">Time of Use</option>
        </select>
      </div>

      {/* Basic Rate Input - Not shown for Time of Use tariffs */}
      {!requiresTimeOfUseRates(formData.electricityTariffType) && (
        <div className="form-group">
          <label htmlFor="electricityRate">Electricity Rate (pence per kWh)</label>
          <input
            type="number"
            id="electricityRate"
            name="electricityRate"
            value={formData.electricityRate}
            onChange={handleChange}
            placeholder="e.g. 25.0"
            step="0.1"
            min="0"
            required
          />
          <small className="rate-info">{getCurrentElectricityInfo(formData.electricityRate)}</small>
        </div>
      )}

      {/* Standard/Fixed Tariff Off-Peak Usage */}
      {(formData.electricityTariffType === 'standard' || formData.electricityTariffType === 'fixed') && (
        <div className="off-peak-usage-section">
          <div className="form-group">
            <label htmlFor="standardOffPeakUsage">Off-peak electricity usage (%)</label>
            <input
              type="number"
              id="standardOffPeakUsage"
              name="standardOffPeakUsage"
              value={formData.standardOffPeakUsage}
              onChange={handleChange}
              placeholder="e.g. 30"
              min="0"
              max="100"
              step="1"
            />
            <small>Percentage of your electricity used during off-peak hours (typically overnight)</small>
          </div>
        </div>
      )}

      {/* Standing Charge for Time of Use tariffs */}
      {requiresTimeOfUseRates(formData.electricityTariffType) && (
        <div className="form-group">
          <label htmlFor="electricityStandingCharge">Standing Charge (pence per day)</label>
          <input
            type="number"
            id="electricityStandingCharge"
            name="electricityStandingCharge"
            value={formData.electricityStandingCharge}
            onChange={handleChange}
            placeholder="e.g. 45.0"
            step="0.1"
            min="0"
          />
        </div>
      )}

      {/* Economy 7 Rates */}
      {requiresEconomy7Rates(formData.electricityTariffType) && (
        <div className="form-group">
          <label htmlFor="economy7NightRate">Economy 7 Night Rate (pence per kWh)</label>
          <input
            type="number"
            id="economy7NightRate"
            name="economy7NightRate"
            value={formData.economy7NightRate}
            onChange={handleChange}
            placeholder="e.g. 15.0"
            step="0.1"
            min="0"
          />
          {/* Economy 7 Off-Peak Usage */}
          <div className="off-peak-usage-section">
            <div className="form-group">
              <label htmlFor="economy7OffPeakUsage">Economy 7 off-peak electricity usage (%)</label>
              <input
                type="number"
                id="economy7OffPeakUsage"
                name="economy7OffPeakUsage"
                value={formData.economy7OffPeakUsage}
                onChange={handleChange}
                placeholder="e.g. 40"
                min="0"
                max="100"
                step="1"
              />
              <small>Percentage of your electricity used during Economy 7 night hours (typically 10pm-8am or 11pm-7am)</small>
            </div>
          </div>
        </div>
      )}

      {/* Economy 10 Rates */}
      {requiresEconomy10Rates(formData.electricityTariffType) && (
        <div className="form-group">
          <label htmlFor="economy10NightRate">Economy 10 Night Rate (pence per kWh)</label>
          <input
            type="number"
            id="economy10NightRate"
            name="economy10NightRate"
            value={formData.economy10NightRate}
            onChange={handleChange}
            placeholder="e.g. 12.0"
            step="0.1"
            min="0"
          />
          {/* Economy 10 Off-Peak Usage */}
          <div className="off-peak-usage-section">
            <div className="form-group">
              <label htmlFor="economy10OffPeakUsage">Economy 10 off-peak electricity usage (%)</label>
              <input
                type="number"
                id="economy10OffPeakUsage"
                name="economy10OffPeakUsage"
                value={formData.economy10OffPeakUsage}
                onChange={handleChange}
                placeholder="e.g. 50"
                min="0"
                max="100"
                step="1"
              />
              <small>Percentage of your electricity used during Economy 10 off-peak hours (typically overnight and afternoon periods)</small>
            </div>
          </div>
        </div>
      )}

      {/* Time of Use Rates */}
      {requiresTimeOfUseRates(formData.electricityTariffType) && (
        <div className="time-of-use-section">
          <h4>Time of Use Rates</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="peakRate">Peak Rate (pence per kWh)</label>
              <input
                type="number"
                id="peakRate"
                name="peakRate"
                value={formData.peakRate}
                onChange={handleChange}
                placeholder="e.g. 35.0"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="offPeakRate">Off-Peak Rate (pence per kWh)</label>
              <input
                type="number"
                id="offPeakRate"
                name="offPeakRate"
                value={formData.offPeakRate}
                onChange={handleChange}
                placeholder="e.g. 15.0"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nightRate">Night Rate (pence per kWh)</label>
              <input
                type="number"
                id="nightRate"
                name="nightRate"
                value={formData.nightRate}
                onChange={handleChange}
                placeholder="e.g. 10.0"
                step="0.1"
                min="0"
                required
              />
            </div>
          </div>

          {/* Time of Use Electricity Usage Distribution */}
          <div className="usage-distribution-section">
            <h4>Electricity Usage Distribution</h4>
            <p className="section-description">
              How is your electricity usage distributed across different time periods? (Total must equal 100%)
            </p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="peakUsagePercentage">Peak Usage (%)</label>
                <input
                  type="number"
                  id="peakUsagePercentage"
                  name="peakUsagePercentage"
                  value={formData.peakUsagePercentage}
                  onChange={handleChange}
                  placeholder="e.g. 40"
                  min="0"
                  max="100"
                  step="1"
                />
                <small>Typically 4pm-7pm weekdays</small>
              </div>
              <div className="form-group">
                <label htmlFor="offPeakUsagePercentage">Off-Peak Usage (%)</label>
                <input
                  type="number"
                  id="offPeakUsagePercentage"
                  name="offPeakUsagePercentage"
                  value={formData.offPeakUsagePercentage}
                  onChange={handleChange}
                  placeholder="e.g. 35"
                  min="0"
                  max="100"
                  step="1"
                />
                <small>Typically 10am-4pm and 8pm-11pm</small>
              </div>
              <div className="form-group">
                <label htmlFor="standardUsagePercentage">Night Usage (%)</label>
                <input
                  type="number"
                  id="standardUsagePercentage"
                  name="standardUsagePercentage"
                  value={formData.standardUsagePercentage}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  min="0"
                  max="100"
                  step="1"
                />
                <small>Typically 11pm-10am</small>
              </div>
            </div>
            {/* Usage validation message */}
            {(formData.peakUsagePercentage || formData.offPeakUsagePercentage || formData.standardUsagePercentage) && (
              <div className="usage-validation">
                {(() => {
                  const total = calculateTotalUsagePercentage(formData);
                  if (total === 100) {
                    return <div className="validation-success">✓ Usage percentages total 100%</div>;
                  } else {
                    return <div className="validation-warning">⚠ Total: {total}% (should be 100%)</div>;
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricityTariffSection; 