import React from "react";

const PriceProjectionsSection = ({ formData, handleChange }) => {
  return (
    <div className="tariff-section">
      <h3>Price Projections</h3>
      <p>Enter your expected annual price increases for electricity and gas. These affect long-term savings calculations.</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="electricityPriceIncrease">Expected Annual Electricity Price Increase (%)</label>
          <input
            type="number"
            id="electricityPriceIncrease"
            name="electricityPriceIncrease"
            value={formData.electricityPriceIncrease}
            onChange={handleChange}
            placeholder="e.g. 3.5"
            step="0.1"
            min="0"
            max="20"
            required
          />
          <small>
            Recent UK average: 3.6% (2024). During the energy crisis (2022-2023), rates reached 10%+, 
            but current forecasts suggest 3-4% annually for the coming years.
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="gasPriceIncrease">Expected Annual Gas Price Increase (%)</label>
          <input
            type="number"
            id="gasPriceIncrease"
            name="gasPriceIncrease"
            value={formData.gasPriceIncrease}
            onChange={handleChange}
            placeholder="e.g. 4.0"
            step="0.1"
            min="0"
            max="20"
            required
          />
          <small>
            Gas prices are more volatile than electricity. Recent trends show 3-5% annual increases, 
            though this can vary significantly based on global energy markets and seasonal demand.
          </small>
        </div>
      </div>
    </div>
  );
};

export default PriceProjectionsSection; 