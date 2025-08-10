import React from "react";

const SideNavigation = ({ steps, currentStep, onStepChange }) => {
  // Add protective checks for steps and currentStep
  if (!steps || steps.length === 0) {
    return null;
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const displayStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="side-navigation">
      <h3>Progress</h3>
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`progress-step ${step.id === currentStep ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
            onClick={() => onStepChange(step.id)}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
            {step.completed && <div className="step-check">✓</div>}
          </div>
        ))}
      </div>
      
      <div className="progress-bar">
        <div className="progress-info">
          <span>Step {displayStepIndex + 1} of {steps.length}</span>
        </div>
        <div className="progress-line">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${((displayStepIndex + 1) / steps.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation; 