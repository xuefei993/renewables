import React from "react";

const DemoMode = () => {
  return (
    <div className="demo-mode">
      <div className="demo-header">
        <h2>How to Use the Renewables Calculator</h2>
        <p>This calculator helps you plan and estimate costs for domestic renewable energy installations.</p>
      </div>

      <div className="demo-steps">
        <div className="demo-step">
          <div className="demo-step-number">1</div>
          <div className="demo-step-content">
            <h3>Basic Information</h3>
            <p>Start by entering your postcode, house type, build year, and number of occupants. This helps us understand your baseline energy needs and local conditions.</p>
            <ul>
              <li>Your location affects solar generation potential</li>
              <li>House type influences energy consumption patterns</li>
              <li>Build year indicates insulation levels</li>
            </ul>
          </div>
        </div>

        <div className="demo-step">
          <div className="demo-step-number">2</div>
          <div className="demo-step-content">
            <h3>House Details</h3>
            <p>Provide details about your roof and insulation to calculate solar potential and heat requirements.</p>
            <ul>
              <li>Roof orientation and angle affect solar panel efficiency</li>
              <li>Available roof area determines maximum panel capacity</li>
              <li>Insulation quality impacts heating requirements</li>
            </ul>
          </div>
        </div>

        <div className="demo-step">
          <div className="demo-step-number">3</div>
          <div className="demo-step-content">
            <h3>Energy Demand</h3>
            <p>Tell us about your current heating and energy systems to calculate potential replacements and upgrades.</p>
            <ul>
              <li>Current heating system type and age</li>
              <li>Average monthly energy bills</li>
              <li>Any existing renewable technology</li>
            </ul>
          </div>
        </div>

        <div className="demo-step">
          <div className="demo-step-number">4</div>
          <div className="demo-step-content">
            <h3>Tariffs</h3>
            <p>Configure your electricity tariff details to calculate accurate savings and payback periods.</p>
            <ul>
              <li>Current electricity rates</li>
              <li>Feed-in tariff rates for excess generation</li>
              <li>Time-of-use tariff options</li>
            </ul>
          </div>
        </div>

        <div className="demo-step">
          <div className="demo-step-number">5</div>
          <div className="demo-step-content">
            <h3>Results</h3>
            <p>View comprehensive results including costs, savings, environmental impact, and financing options.</p>
            <ul>
              <li>Installation costs and potential grants</li>
              <li>Monthly and annual savings</li>
              <li>Carbon footprint reduction</li>
              <li>Payback period calculations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="demo-tips">
        <h3>Tips for Best Results</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Accurate Information</h4>
            <p>Provide accurate measurements and details for more precise calculations.</p>
          </div>
          <div className="tip-card">
            <h4>Professional Consultation</h4>
            <p>Use results as a starting point - consult professionals for detailed assessments.</p>
          </div>
          <div className="tip-card">
            <h4>Compare Options</h4>
            <p>Try different configurations to find the optimal solution for your needs.</p>
          </div>
          <div className="tip-card">
            <h4>Consider Grants</h4>
            <p>Check for available government grants and incentives in your area.</p>
          </div>
        </div>
      </div>

      <div className="demo-disclaimer">
        <h4>Important Disclaimer</h4>
        <p>This calculator provides estimates based on typical conditions and average data. Actual results may vary significantly based on specific circumstances, local conditions, installation quality, and usage patterns. Always consult with qualified professionals for detailed assessments and quotes.</p>
      </div>
    </div>
  );
};

export default DemoMode; 