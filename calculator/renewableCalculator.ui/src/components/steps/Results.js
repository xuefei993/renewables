import React, { useEffect, useState } from "react";
import EnergyDemandChart from "../EnergyDemandChart";
import SolarPotentialSummary from "./SolarPotentialSummary";
import SystemConfiguration from "./SystemConfiguration";
import SubsidyChecker from "../SubsidyChecker";
import { prepareUserData } from "./resultsUtils";
import "../../styles/energy-demand.css";
import "../../styles/results.css";

const Results = ({ data, calculationResult, setCalculationResult, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'configuration'
  const [systemConfiguration, setSystemConfiguration] = useState({});
  const [appliedSubsidies, setAppliedSubsidies] = useState([]);
  const [totalSubsidyAmount, setTotalSubsidyAmount] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Tab switching handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle subsidy application/removal
  const handleSubsidyApplied = (subsidies, totalAmount) => {
    setAppliedSubsidies(subsidies);
    setTotalSubsidyAmount(totalAmount);
    
    // Here you could update the configuration comparison table
    // to reflect the subsidy amounts being deducted from installation costs
    console.log('Applied subsidies updated:', subsidies);
    console.log('Total subsidy amount:', totalAmount);
  };

  // Listen for system configuration updates from SystemConfiguration component
  const handleSystemConfigurationUpdate = (config) => {
    setSystemConfiguration(config);
    
    // Update showComparison state if provided
    if (config.showComparison !== undefined) {
      setShowComparison(config.showComparison);
    }
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="results-loading">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="results-error">
        <p>No data available for results.</p>
      </div>
    );
  }

  const selectedRoofs = data.selectedRoofs || data.addedRoofs?.filter(roof => roof.selected) || [];
  const userData = prepareUserData(data);

  console.log('Results data:', data); // Debug log
  console.log('Selected roofs:', selectedRoofs); // Debug log
  console.log('User data for energy demand:', userData); // Debug log

  return (
    <div className="results-container">
      <h2>Renewable Energy System Results</h2>

      {/* Tab Navigation */}
      <div className="results-tabs">
        <button
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => handleTabChange('summary')}
        >
          Property Summary
        </button>
        <button
          className={`tab-button ${activeTab === 'configuration' ? 'active' : ''}`}
          onClick={() => handleTabChange('configuration')}
        >
          System Configuration
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">

        {/* Property Summary Tab */}
        {activeTab === 'summary' && (
          <div className="property-summary-tab">
            <SolarPotentialSummary selectedRoofs={selectedRoofs} />
            {/* Energy Demand Section */}
            <div className="results-section energy-demand-section">
              <EnergyDemandChart userData={userData} />
            </div>
          </div>
        )}

        {/* System Configuration Tab */}
        {activeTab === 'configuration' && (
          <div className="system-configuration-tab">
            <SystemConfiguration 
              userData={userData} 
              onConfigurationUpdate={handleSystemConfigurationUpdate}
              appliedSubsidies={appliedSubsidies}
              totalSubsidyAmount={totalSubsidyAmount}
            />
            
            {/* Subsidy Checker */}
            {showComparison && (
              <SubsidyChecker 
                userData={userData}
                systemConfiguration={systemConfiguration}
                onSubsidyApplied={handleSubsidyApplied}
              />
            )}
          </div>
        )}

      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back to Tariffs
        </button>
      </div>
    </div>
  );
};

export default Results; 