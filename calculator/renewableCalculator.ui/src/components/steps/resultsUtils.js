// Utility functions for Results component

// Function to get solar potential rating based on percentage
export const getSolarPotentialRating = (percentage) => {
  if (percentage > 95) {
    return { rating: 'Excellent', className: 'excellent', recommended: true };
  } else if (percentage >= 90) {
    return { rating: 'Very Good', className: 'very-good', recommended: true };
  } else if (percentage >= 80) {
    return { rating: 'Good', className: 'good', recommended: true };
  } else if (percentage >= 60) {
    return { rating: 'Medium', className: 'medium', recommended: true };
  } else {
    return { rating: 'Poor', className: 'poor', recommended: false };
  }
};

export const getOrientationLabel = (orientation) => {
  const orientationLabels = {
    'N': 'North',
    'NE': 'Northeast', 
    'E': 'East',
    'SE': 'Southeast',
    'S': 'South',
    'SW': 'Southwest',
    'W': 'West',
    'NW': 'Northwest'
  };
  return orientationLabels[orientation] || orientation;
};

export const getShadingLabel = (shading) => {
  const shadingLabels = {
    'no-shading': 'No Shading',
    'light-shading': 'Light Shading',
    'moderate-shading': 'Moderate Shading', 
    'heavy-shading': 'Heavy Shading'
  };
  return shadingLabels[shading] || shading;
};

export const getUtilisationLabel = (utilisation) => {
  const utilisationLabels = {
    'minimal-obstacles': 'Minimal Obstacles',
    'some-obstacles': 'Some Obstacles',
    'many-obstacles': 'Many Obstacles'
  };
  return utilisationLabels[utilisation] || utilisation;
};

// Function to convert frontend heating method to backend heating type
export const convertHeatingMethod = (heatingMethod) => {
  switch (heatingMethod) {
    case "gas boiler":
      return "gas";
    case "electricity heating":
      return "electric";
    case "heat pumps":
      return "heat-pump";
    default:
      return "gas"; // default fallback
  }
};

// Function to convert frontend hot water method to backend hot water type
export const convertHotWaterMethod = (hotWaterMethod) => {
  switch (hotWaterMethod) {
    case "gas boiler":
      return "gas-boiler";
    case "electricity":
      return "electricity";
    case "heat pumps":
      return "heat-pump";
    default:
      return "gas-boiler"; // default fallback
  }
};

// Function to prepare user data for Energy Demand component
export const prepareUserData = (data) => {
  return {
    // Basic household information
    occupants: data.householdSize || data.occupants || 3,
    hotWaterType: convertHotWaterMethod(data.hotWaterMethod),
    heatingType: convertHeatingMethod(data.heatingMethod),
    houseArea: data.floorArea || data.houseArea || 100,
    buildYear: data.buildingYear || data.buildYear || '1981-2002',
    wallType: data.wallType || 'modern',
    windowType: data.windowType || 'double',
    houseType: data.propertyType || data.houseType || 'semi-detached',
    epcRating: data.epcRating || 'D',
    roofInsulation: data.roofInsulation || 'no',
    floorInsulation: data.floorInsulation || 'no',
    latitude: data.latitude || data.coordinates?.latitude || null,
    longitude: data.longitude || data.coordinates?.longitude || null,
    
    // User electricity usage data
    knowsMonthlyUsage: data.knowsMonthlyUsage,
    monthlyElectricityUsage: data.monthlyElectricityUsage,
    knowsAnnualUsage: data.knowsAnnualUsage,
    annualElectricityUsage: data.annualElectricityUsage,
    
    // User gas usage data
    knowsMonthlyGasUsage: data.knowsMonthlyGasUsage,
    monthlyGasUsage: data.monthlyGasUsage,
    knowsAnnualGasUsage: data.knowsAnnualGasUsage,
    annualGasUsage: data.annualGasUsage,
    
    // Equipment efficiency data
    heatPumpCOP: data.heatPumpCOP,
    hotWaterHeatPumpCOP: data.hotWaterHeatPumpCOP,
    boilerEfficiency: data.boilerEfficiency,
    
    // Other energy-related data
    daytimeHomeHabits: data.daytimeHomeHabits
  };
};

// Function to calculate solar potential totals
export const calculateSolarTotals = (selectedRoofs) => {
  const totalSelectedArea = selectedRoofs.reduce((sum, roof) => sum + (roof.area || 0), 0);
  const totalSolarPanels = selectedRoofs.reduce((sum, roof) => sum + (roof.solarPanelCount || 0), 0);
  const averageSolarPotential = selectedRoofs.length > 0 
    ? selectedRoofs.reduce((sum, roof) => sum + (roof.solarPotential || 0), 0) / selectedRoofs.length
    : 0;

  return {
    totalSelectedArea,
    totalSolarPanels,
    averageSolarPotential
  };
}; 