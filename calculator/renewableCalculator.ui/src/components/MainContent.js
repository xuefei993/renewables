import React from "react";
import BasicInformation from "./steps/BasicInformation";
import RoofCondition from "./steps/RoofCondition";
import InsulationPerformance from "./steps/InsulationPerformance";
import EnergyDemand from "./steps/EnergyDemand";
import Tariffs from "./steps/Tariffs";
import Results from "./steps/Results";
import DemoMode from "./DemoMode";

const MainContent = ({ 
  currentStep, 
  selectedData, 
  onDataChange, 
  onStepChange, 
  calculationResult, 
  setCalculationResult,
  showDemo 
}) => {
  
  if (showDemo) {
    return <DemoMode />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case "basic-information":
        return (
          <BasicInformation 
            data={selectedData}
            onDataChange={onDataChange}
            onNext={(nextStep) => onStepChange(nextStep || "roof-condition")}
          />
        );
      case "roof-condition":
        // Get user location from previous step data for Google Maps
        const userLocation = selectedData.latitude && selectedData.longitude ? {
          lat: parseFloat(selectedData.latitude),
          lng: parseFloat(selectedData.longitude)
        } : null;
        
        return (
          <RoofCondition 
            data={selectedData}
            onDataChange={onDataChange}
            onNext={() => onStepChange("insulation-performance")}
            onBack={() => onStepChange("basic-information")}
            userLocation={userLocation}
          />
        );
      case "insulation-performance":
        return (
          <InsulationPerformance 
            data={selectedData}
            onDataChange={onDataChange}
            onNext={() => onStepChange("energy-demand")}
            onBack={() => onStepChange("roof-condition")}
          />
        );
      case "energy-demand":
        return (
          <EnergyDemand 
            data={selectedData}
            onDataChange={onDataChange}
            onNext={() => onStepChange("tariffs")}
            onBack={() => onStepChange("insulation-performance")}
          />
        );
      case "tariffs":
        return (
          <Tariffs 
            data={selectedData}
            onDataChange={onDataChange}
            onNext={() => onStepChange("results")}
            onBack={() => onStepChange("energy-demand")}
          />
        );
      case "results":
        return (
          <Results 
            data={selectedData}
            onDataChange={onDataChange}
            calculationResult={calculationResult}
            setCalculationResult={setCalculationResult}
            onBack={() => onStepChange("tariffs")}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="main-content">
      {renderStep()}
    </div>
  );
};

export default MainContent; 