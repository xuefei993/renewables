// Tariff Constants and Helper Functions

export const majorSuppliers = [
  'British Gas', 'E.ON', 'EDF Energy', 'Npower', 'ScottishPower', 'SSE',
  'Bulb', 'Octopus Energy', 'Avro Energy', 'Together Energy', 'Green Supplier Limited',
  'Pure Planet', 'Shell Energy', 'So Energy', 'Utility Warehouse', 'Other'
];

export const getCurrentElectricityInfo = (electricityRate) => {
  if (!electricityRate) return "Please enter your current electricity rate";
  
  const rate = parseFloat(electricityRate);
  if (rate < 15) return "This rate seems low - please check it's in pence per kWh";
  if (rate > 50) return "This rate seems high - renewable energy could provide significant savings";
  if (rate >= 15 && rate <= 25) return "Standard rate - renewable energy will provide good savings";
  if (rate > 25 && rate <= 35) return "Above average rate - excellent potential for renewable energy savings";
  return "High rate - renewable energy systems will be very beneficial";
};

// Check if tariff type requires additional rate inputs
export const requiresTimeOfUseRates = (electricityTariffType) => {
  return electricityTariffType === 'time-of-use';
};

export const requiresEconomy7Rates = (electricityTariffType) => {
  return electricityTariffType === 'economy7';
};

export const requiresEconomy10Rates = (electricityTariffType) => {
  return electricityTariffType === 'economy10';
};

export const calculateTotalUsagePercentage = (formData) => {
  const peak = parseFloat(formData.peakUsagePercentage) || 0;
  const offPeak = parseFloat(formData.offPeakUsagePercentage) || 0;
  const standard = parseFloat(formData.standardUsagePercentage) || 0;
  return peak + offPeak + standard;
}; 