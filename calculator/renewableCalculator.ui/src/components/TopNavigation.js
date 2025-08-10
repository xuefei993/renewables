import React, { useState } from "react";

const TopNavigation = ({ onShowDemo, onRestart }) => {
  const [showFAQ, setShowFAQ] = useState(false);

  const handleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  return (
    <>
      <div className="top-navigation">
        <div className="nav-left">
          <h1>Renewables Calculator</h1>
        </div>
        
        <div className="nav-right">
          <button onClick={handleFAQ} className="nav-button">
            FAQ
          </button>
          <button onClick={onShowDemo} className="nav-button">
            Using Demo
          </button>
          <button onClick={onRestart} className="nav-button restart-button">
            Restart Calculator
          </button>
        </div>
      </div>

      {showFAQ && (
        <div className="faq-modal">
          <div className="faq-content">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-item">
              <h4>What is this calculator for?</h4>
              <p>This calculator helps you plan and estimate costs for domestic renewable energy installations including solar panels, batteries, and heat pumps.</p>
            </div>
            <div className="faq-item">
              <h4>How accurate are the calculations?</h4>
              <p>The calculations provide estimates based on average conditions. Actual results may vary depending on specific circumstances and local conditions.</p>
            </div>
            <div className="faq-item">
              <h4>Can I save my calculations?</h4>
              <p>Currently, calculations are not saved. You can restart the calculator at any time to try different configurations.</p>
            </div>
            <button onClick={handleFAQ} className="close-faq">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavigation; 