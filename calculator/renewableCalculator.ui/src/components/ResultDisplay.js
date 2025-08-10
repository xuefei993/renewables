import React from "react";

const ResultDisplay = ({ result }) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Calculation Result:</h3>
      <p><strong>Annual Energy Generation:</strong> {result.annualGeneration} kWh</p>
      <p><strong>Installation Cost:</strong> £{result.installationCost}</p>
      <p><strong>Monthly Savings:</strong> £{result.monthlySavings}</p>
      <p><strong>CO₂ Reduction:</strong> {result.carbonReduction} kg</p>
    </div>
  );
};

export default ResultDisplay;