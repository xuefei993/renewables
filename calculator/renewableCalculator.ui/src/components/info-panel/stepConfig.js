// Step configuration for InfoPanel
import {
  getHouseDescription,
  getHouseImage,
  getAddressSearchDescription,
  getEnergyDemandDescription,
  getSolarDescription,
  getTariffsDescription,
  getResultsDescription
} from './stepDescriptions';

export const getStepConfig = (currentStep, selectedData) => {
  switch (currentStep) {
    case "basic-information":
      return {
        title: "Address Lookup",
        description: getAddressSearchDescription(),
        image: "/images/address-search.png",
        tips: [
          "Government database contains detailed property information",
          "Using default data saves time and provides accurate baseline information",
          "You can still customize information if needed",
          "Try postcodes like KY16 8DE or SW1A 1AA to see sample data"
        ]
      };
    
    case "roof-condition":
      return {
        title: "Roof Measurement & Configuration",
        description: "Accurately measure your roof area using satellite imagery and provide configuration details to determine solar panel potential.",
        image: "/images/roof-measurement.png",
        tips: [
          "Use the interactive map to trace your roof outline precisely",
          "The compass helps identify the correct roof orientation",
          "Roof angle affects the actual surface area available for panels",
          "Shading can reduce solar panel efficiency by 10-80%",
          "Measure only usable roof areas (avoid chimneys, skylights)",
          "Different roof sections can be measured separately"
        ]
      };

    case "insulation-performance":
      return {
        title: "Home Insulation & Efficiency",
        description: "Your home's insulation quality affects heating requirements and overall energy efficiency calculations.",
        image: "/images/insulation.png",
        tips: [
          "Poor insulation increases heating demand significantly",
          "Double glazing reduces heat loss by up to 50%",
          "Cavity wall insulation is often the most cost-effective upgrade",
          "Property size affects total energy consumption patterns",
          "Wall type determines insulation potential and heat loss",
          "Good insulation makes renewable heating more effective"
        ]
      };
    
    case "energy-demand":
      return {
        title: "Energy Demand",
        description: getEnergyDemandDescription(selectedData),
        image: "/images/existing-systems.png",
        tips: [
          "Household size affects overall energy consumption",
          "Electricity usage patterns help size solar panel systems",
          "Heating and hot water methods determine renewable options",
          "Daytime habits affect solar energy self-consumption",
          "Gas usage data helps calculate heat pump savings",
          "Floor area influences heating requirements"
        ]
      };
    
    case "tariffs":
      return {
        title: "Energy Tariffs",
        description: getTariffsDescription(selectedData),
        image: "/images/tariffs.png",
        tips: [
          "Smart tariffs reward flexible energy use",
          "Export rates determine solar panel payback",
          "Time-of-use tariffs suit battery storage",
          "EV tariffs offer cheaper overnight charging",
          "Compare total annual costs, not just unit rates"
        ]
      };
    
    case "results":
      return {
        title: "Your Renewable Energy Plan",
        description: getResultsDescription(selectedData),
        image: "/images/results.png",
        tips: [
          "Payback periods typically range from 8-15 years",
          "Government grants can reduce upfront costs",
          "Energy independence reduces price volatility risk",
          "Carbon savings contribute to climate goals",
          "Property value often increases with renewable systems"
        ]
      };
    
    default:
      return {
        title: "Renewable Energy Calculator",
        description: "Navigate through the steps to calculate your renewable energy potential and savings.",
        image: "/images/calculator.png",
        tips: [
          "Each step builds on the previous information",
          "You can go back to modify earlier answers",
          "All calculations are based on real-world data",
          "Results show realistic payback periods and savings"
        ]
      };
  }
}; 