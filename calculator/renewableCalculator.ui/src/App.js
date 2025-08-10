import React, { useState } from "react";
import TopNavigation from "./components/TopNavigation";
import SideNavigation from "./components/SideNavigation";
import MainContent from "./components/MainContent";
import "./App.css";

function App() {
  const [currentStep, setCurrentStep] = useState("basic-information");
  const [selectedData, setSelectedData] = useState({});
  const [showDemo, setShowDemo] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  const steps = [
    { id: "basic-information", title: "Basic Information", completed: false },
    { id: "roof-condition", title: "Roof Condition", completed: false },
    { id: "insulation-performance", title: "Insulation Performance", completed: false },
    { id: "energy-demand", title: "Energy Demand", completed: false },
    { id: "tariffs", title: "Tariffs", completed: false },
    { id: "results", title: "Results", completed: false }
  ];

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleDataChange = (data) => {
    setSelectedData(prev => ({ ...prev, ...data }));
  };

  const handleRestart = () => {
    setCurrentStep("basic-information");
    setSelectedData({});
    setCalculationResult(null);
  };

  return (
    <div className="app-container">
      <TopNavigation 
        onShowDemo={() => setShowDemo(!showDemo)}
        onRestart={handleRestart}
      />
      
      <div className="main-layout">
        <SideNavigation 
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />
        
        <MainContent 
          currentStep={currentStep}
          selectedData={selectedData}
          onDataChange={handleDataChange}
          onStepChange={handleStepChange}
          calculationResult={calculationResult}
          setCalculationResult={setCalculationResult}
          showDemo={showDemo}
        />
      </div>
    </div>
  );
}

export default App;
