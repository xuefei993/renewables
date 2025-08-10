import React from "react";

const SolarConfiguration = ({ data, onDataChange, onNext, onBack }) => {
  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Solar Configuration</h2>
        <p>Choose your preferred solar panel system and installation details.</p>
      </div>

      <div className="placeholder-content">
        <h3>This step will include:</h3>
        <ul>
          <li>Solar panel type and brand selection</li>
          <li>Panel efficiency and wattage options</li>
          <li>Number of panels to install</li>
          <li>Installation complexity assessment</li>
          <li>Inverter type selection</li>
          <li>Mounting system options</li>
        </ul>
      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Next: Storage & Heating
        </button>
      </div>
    </div>
  );
};

export default SolarConfiguration; 