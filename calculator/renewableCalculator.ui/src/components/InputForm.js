import React, { useEffect, useState } from "react";
import { getComponents, calculate } from "../api";
import ResultDisplay from "./ResultDisplay";

const InputForm = () => {
  const [formData, setFormData] = useState({
    solarPanelId: "",
    numPanels: 1,
    batteryId: "",
    heatPumpId: "",
    houseProfileId: "",
    tariffId: "",
  });

  const [components, setComponents] = useState({
    solarPanels: [],
    batteries: [],
    heatPumps: [],
    houseProfiles: [],
    tariffs: [],
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [solar, battery, pump, house, tariff] = await Promise.all([
          getComponents("solar-panels"),
          getComponents("batteries"),
          getComponents("heat-pumps"),
          getComponents("house-profile"),
          getComponents("tariffs"),
        ]);
        setComponents({
          solarPanels: solar.data,
          batteries: battery.data,
          heatPumps: pump.data,
          houseProfiles: house.data,
          tariffs: tariff.data,
        });
      } catch (error) {
        console.error("Failed to load components:", error);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numPanels" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await calculate(formData);
      setResult(res.data);
    } catch (err) {
      alert("Calculation failed. Please check your inputs.");
      console.error(err);
    }
  };

const renderSelect = (name, options, label) => (
  <div style={{ marginBottom: "1rem" }}>
    <label>{label}: </label>
    <select name={name} value={formData[name]} onChange={handleChange} required>
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {name === "houseProfileId"
            ? `Insulation ${o.insulationQuality} - ${o.heatingSystem}`
            : o.name}
        </option>
      ))}
    </select>
  </div>
);

  return (
    <div>
      <h2>Renewable Energy Configuration</h2>
      <form onSubmit={handleSubmit}>
        {renderSelect("solarPanelId", components.solarPanels, "Solar Panel")}
        <div style={{ marginBottom: "1rem" }}>
          <label>Number of Panels: </label>
          <input
            type="number"
            name="numPanels"
            value={formData.numPanels}
            onChange={handleChange}
            min={1}
            required
          />
        </div>
        {renderSelect("batteryId", components.batteries, "Battery")}
        {renderSelect("heatPumpId", components.heatPumps, "Heat Pump")}
        {renderSelect("houseProfileId", components.houseProfiles, "House Profile")}
        {renderSelect("tariffId", components.tariffs, "Tariff")}
        <button type="submit">Calculate</button>
      </form>

      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default InputForm;