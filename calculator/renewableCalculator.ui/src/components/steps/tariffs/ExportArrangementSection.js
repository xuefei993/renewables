import React from "react";

const ExportArrangementSection = ({ formData, handleChange }) => {
  return (
    <div className="tariff-section">
      <h3>Export Arrangements</h3>
      <p>If you have solar panels, what arrangement do you have for selling electricity back to the grid?</p>
      
      <div className="form-group">
        <label htmlFor="exportArrangement">Export Arrangement</label>
        <select
          id="exportArrangement"
          name="exportArrangement"
          value={formData.exportArrangement}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select your arrangement</option>
          <option value="none">I don't have any export arrangement</option>
          <option value="feed-in">I have a Feed-in Tariff (FiT)</option>
          <option value="seg">I have a Smart Export Guarantee (SEG)</option>
          <option value="planning">I don't have one but plan to join later</option>
        </select>
      </div>

      {/* Feed-in Tariff Fields */}
      {formData.exportArrangement === 'feed-in' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="feedInExportRate">Feed-in Tariff Export Rate (pence per kWh)</label>
            <input
              type="number"
              id="feedInExportRate"
              name="feedInExportRate"
              value={formData.feedInExportRate}
              onChange={handleChange}
              placeholder="e.g. 5.5"
              step="0.1"
              min="0"
              required
            />
            <small>The rate you're paid for electricity exported to the grid</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="feedInInstallationYear">Installation Year</label>
            <input
              type="number"
              id="feedInInstallationYear"
              name="feedInInstallationYear"
              value={formData.feedInInstallationYear}
              onChange={handleChange}
              placeholder="e.g. 2015"
              min="2010"
              max="2019"
              required
            />
            <small>Year your solar panels were installed (FiT closed in 2019)</small>
          </div>
        </div>
      )}

      {/* SEG Fields */}
      {formData.exportArrangement === 'seg' && (
        <div className="form-group">
          <label htmlFor="segExportRate">SEG Export Rate (pence per kWh)</label>
          <input
            type="number"
            id="segExportRate"
            name="segExportRate"
            value={formData.segExportRate}
            onChange={handleChange}
            placeholder="e.g. 4.1"
            step="0.1"
            min="0"
            required
          />
          <small>Current SEG rates typically range from 3-7p per kWh</small>
        </div>
      )}

      {/* Information for other arrangements */}
      {formData.exportArrangement === 'none' && (
        <div className="info-message">
          <p>You can still benefit from solar panels by reducing your electricity bills through self-consumption, even without an export arrangement.</p>
        </div>
      )}

      {formData.exportArrangement === 'planning' && (
        <div className="info-message">
          <p>You can apply for a Smart Export Guarantee (SEG) with your energy supplier once your solar panels are installed and commissioned.</p>
        </div>
      )}
    </div>
  );
};

export default ExportArrangementSection; 