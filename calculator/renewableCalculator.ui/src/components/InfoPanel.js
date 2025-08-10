import React from "react";
import { getStepConfig } from './info-panel/stepConfig';

const InfoPanel = ({ currentStep, selectedData }) => {
  const stepInfo = getStepConfig(currentStep, selectedData);

  return (
    <div className="info-panel">
      {stepInfo && (
        <div className="info-content">
          <div className="info-header">
            <h3>{stepInfo.title}</h3>
            {stepInfo.image && (
              <div className="info-image">
                <img src={stepInfo.image} alt={stepInfo.title} />
              </div>
            )}
          </div>
          
          <div className="info-body">
            <div className="info-description">
              <p>{stepInfo.description}</p>
            </div>
            
            {stepInfo.tips && stepInfo.tips.length > 0 && (
              <div className="info-tips">
                <h4>💡 Helpful Tips</h4>
                {stepInfo.tips.map((tip, index) => {
                  return tip ? (
                    <div key={index} className="tip-item">
                      <span className="tip-bullet">•</span>
                      <span className="tip-text">{tip}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel; 