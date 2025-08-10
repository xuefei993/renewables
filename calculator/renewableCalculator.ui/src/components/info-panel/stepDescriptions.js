// Step description generators for InfoPanel

export const getHouseDescription = (selectedData) => {
  const houseType = selectedData.houseType;
  const hasShading = selectedData.hasShading;
  const bedrooms = selectedData.bedrooms;
  const mainWallType = selectedData.mainWallType;
  
  let baseDescription = "";
  
  switch (houseType) {
    case "detached":
      baseDescription = "Detached houses typically have more roof space for solar panels and better access for installations.";
      break;
    case "semi-detached":
      baseDescription = "Semi-detached houses offer good potential for renewable energy with reasonable roof space.";
      break;
    case "terraced":
      baseDescription = "Terraced houses can still benefit from renewable energy, though roof space may be more limited.";
      break;
    case "flat":
      baseDescription = "Flats may have shared systems or limited individual installation options.";
      break;
    default:
      baseDescription = "Different house types have varying potential for renewable energy installations.";
  }
  
  // Add shading information
  if (hasShading === "none") {
    baseDescription += " With no roof shading, you have excellent potential for solar energy generation.";
  } else if (hasShading === "partial") {
    baseDescription += " Partial shading will reduce solar efficiency but can often be optimized with proper panel placement.";
  } else if (hasShading === "significant") {
    baseDescription += " Significant shading may limit solar potential, but micro-inverters or power optimizers can help.";
  }
  
  // Add bedroom information for energy consumption context
  if (bedrooms) {
    const bedroomNum = bedrooms === "6+" ? "6 or more" : bedrooms;
    baseDescription += ` With ${bedroomNum} bedroom${bedrooms === "1" ? "" : "s"}, your energy consumption patterns will be factored into the renewable energy calculations.`;
  }
  
  // Add wall type information
  if (mainWallType === "solid-brick" || mainWallType === "solid-stone") {
    baseDescription += " Solid walls typically have lower insulation levels, offering significant potential for energy efficiency improvements through external or internal wall insulation.";
  } else if (mainWallType === "cavity-insulated") {
    baseDescription += " Your cavity-insulated walls provide good thermal performance, helping to reduce heating costs.";
  } else if (mainWallType === "cavity-uninsulated") {
    baseDescription += " Uninsulated cavity walls present an excellent opportunity for cost-effective insulation improvements.";
  }
  
  return baseDescription;
};

export const getHouseImage = (selectedData) => {
  const houseType = selectedData.houseType;
  
  switch (houseType) {
    case "detached":
      return "/images/house-detached.png";
    case "semi-detached":
      return "/images/house-semi.png";
    case "terraced":
      return "/images/house-terraced.png";
    case "flat":
      return "/images/house-flat.png";
    default:
      return "/images/house-default.png";
  }
};

export const getAddressSearchDescription = () => {
  return "Enter your postcode or address to automatically retrieve property information from government databases. This includes basic details like property type, age, and energy rating, which form the foundation for accurate renewable energy calculations.";
};

export const getEnergyDemandDescription = (selectedData) => {
  const heatingSystem = selectedData.heatingSystem;
  const hasRenewable = selectedData.hasRenewable;
  const energyBill = selectedData.monthlyEnergyBill;
  
  let description = "Understanding your current heating and energy systems helps us calculate potential savings from renewable energy upgrades. ";
  
  if (heatingSystem === "gas-boiler") {
    description += "Your gas boiler system can be supplemented or eventually replaced with heat pump technology for significant carbon reduction. ";
  } else if (heatingSystem === "electric-heater") {
    description += "Electric heating systems often benefit greatly from solar panel installations to reduce electricity costs. ";
  } else if (heatingSystem === "oil-boiler") {
    description += "Oil heating systems are excellent candidates for heat pump replacements, offering both cost savings and environmental benefits. ";
  } else if (heatingSystem === "heat-pump") {
    description += "Your existing heat pump system shows you're already embracing efficient technology - we can optimize it further with solar panels. ";
  }
  
  if (hasRenewable === "yes") {
    description += "Building on your existing renewable energy systems, we can identify opportunities for expansion or optimization. ";
  } else if (hasRenewable === "no") {
    description += "Starting fresh with renewable energy gives us complete flexibility to design the optimal system for your property. ";
  }
  
  if (energyBill) {
    const billAmount = parseInt(energyBill);
    if (billAmount > 200) {
      description += "Your higher energy bills indicate excellent potential for substantial savings through renewable energy upgrades.";
    } else if (billAmount > 100) {
      description += "Your moderate energy bills suggest good potential for renewable energy savings and system payback.";
    } else {
      description += "Even with lower energy bills, renewable energy can provide long-term savings and increase your property value.";
    }
  }
  
  return description;
};

export const getSolarDescription = (selectedData) => {
  const roofSize = selectedData.roofSize;
  const roofOrientation = selectedData.roofOrientation;
  const shading = selectedData.shading;
  
  let description = "Solar panels are often the cornerstone of residential renewable energy systems. ";
  
  if (roofSize && parseInt(roofSize) > 40) {
    description += "Your generous roof space allows for a substantial solar installation with excellent energy generation potential. ";
  } else if (roofSize && parseInt(roofSize) > 20) {
    description += "Your moderate roof space provides good opportunities for meaningful solar energy generation. ";
  } else if (roofSize) {
    description += "Even with limited roof space, modern high-efficiency panels can provide worthwhile energy generation. ";
  }
  
  if (roofOrientation === "south") {
    description += "South-facing roofs are ideal for solar panels, maximizing energy generation throughout the day. ";
  } else if (roofOrientation === "south-east" || roofOrientation === "south-west") {
    description += "Your roof orientation is excellent for solar panels with very good energy generation potential. ";
  } else if (roofOrientation === "east" || roofOrientation === "west") {
    description += "East or west-facing panels can still provide good energy generation, particularly for morning or evening consumption. ";
  }
  
  return description;
};

export const getTariffsDescription = (selectedData) => {
  const currentTariff = selectedData.currentTariff;
  const smartMeter = selectedData.smartMeter;
  const evCharging = selectedData.evCharging;
  
  let description = "Your energy tariff significantly affects renewable energy savings. Smart tariffs can maximize the benefits of solar panels and battery storage. ";
  
  if (currentTariff === "standard") {
    description += "Standard tariffs offer basic savings from solar generation. Economy 7 or time-of-use tariffs could increase your savings potential. ";
  } else if (currentTariff === "economy-7") {
    description += "Economy 7 tariffs work well with battery storage, allowing you to store cheap overnight electricity or solar energy for peak-rate periods. ";
  } else if (currentTariff === "time-of-use") {
    description += "Time-of-use tariffs are excellent for renewable energy systems, maximizing value from solar generation and battery storage timing. ";
  }
  
  if (smartMeter === "yes") {
    description += "Your smart meter enables time-of-use tariffs and smart export payments for excess solar generation. ";
  } else if (smartMeter === "no") {
    description += "Installing a smart meter would unlock time-of-use tariffs and better export payments for your solar generation. ";
  }
  
  if (evCharging === "yes") {
    description += "EV charging pairs excellently with solar panels, allowing you to fuel your car with free solar electricity. ";
  } else if (evCharging === "planning") {
    description += "Planning for EV charging makes solar panels even more valuable, providing clean fuel for future electric vehicles. ";
  }
  
  return description;
};

export const getResultsDescription = (selectedData) => {
  let description = "Based on your property details and preferences, we've calculated personalized renewable energy recommendations. ";
  
  description += "These results show potential energy generation, cost savings, payback periods, and environmental benefits. ";
  
  description += "The recommendations are tailored to your specific situation, considering factors like roof space, orientation, current energy systems, and budget preferences. ";
  
  description += "Each option includes detailed financial projections, installation requirements, and long-term benefits to help you make informed decisions about your renewable energy journey.";
  
  return description;
}; 