import React from "react";

const StorageHeating = ({ data, onDataChange, onNext, onBack }) => {
  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Storage & Heating</h2>
        <p>Select battery storage and heat pump options to maximize your renewable energy benefits.</p>
      </div>

      <div className="placeholder-content">
        <h3>This step will include:</h3>
        <ul>
          <li>Battery storage capacity options</li>
          <li>Battery technology types (lithium-ion, etc.)</li>
          <li>Heat pump selection and sizing</li>
          <li>Air source vs ground source heat pumps</li>
          <li>Hot water cylinder options</li>
          <li>Smart energy management systems</li>
        </ul>
      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Next: Tariffs
        </button>
      </div>
    </div>
  );
};

export default StorageHeating; 