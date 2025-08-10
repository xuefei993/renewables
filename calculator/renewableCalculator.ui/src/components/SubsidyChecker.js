import React, { useState } from 'react';
import { getGovernmentSubsidies } from '../api';
import './SubsidyChecker.css';

const SubsidyChecker = ({ userData, systemConfiguration, onSubsidyApplied }) => {
  const [subsidies, setSubsidies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSubsidies, setShowSubsidies] = useState(false);
  const [appliedSubsidies, setAppliedSubsidies] = useState([]);
  const [totalSubsidyAmount, setTotalSubsidyAmount] = useState(0);
  const [conditionsChecked, setConditionsChecked] = useState({}); // Track which conditions are checked for each subsidy

  // Define eligibility conditions for each subsidy
  const getEligibilityConditions = (subsidyName) => {
    switch (subsidyName) {
      case 'Boiler Upgrade Scheme':
        return [
          'My property is located in England or Wales',
          'I am replacing an existing heating system (not new build)',
          'I will use an MCS certified installer'
        ];
      default:
        return [];
    }
  };

  // Check if all conditions are met for a subsidy
  const areAllConditionsMet = (subsidyId) => {
    const subsidy = subsidies.find(s => s.subsidyId === subsidyId);
    if (!subsidy) return false;
    
    const conditions = getEligibilityConditions(subsidy.name);
    const checkedConditions = conditionsChecked[subsidyId] || {};
    
    return conditions.every((_, index) => checkedConditions[index] === true);
  };

  // Handle condition checkbox change
  const handleConditionChange = (subsidyId, conditionIndex, checked) => {
    setConditionsChecked(prev => ({
      ...prev,
      [subsidyId]: {
        ...prev[subsidyId],
        [conditionIndex]: checked
      }
    }));
  };

  const checkSubsidies = async () => {
    setLoading(true);
    try {
      const request = {
        hasSolarPanels: systemConfiguration.selectedEquipment?.solarPanels || false,
        hasHeatPump: systemConfiguration.selectedEquipment?.heatPump || false,
        hasBattery: systemConfiguration.selectedEquipment?.batteryStorage || false,
        houseType: userData.propertyType || userData.houseType,
        epcRating: userData.epcRating || 'D',
        regionCode: 'UK',
        postcode: userData.postcode,
        solarCapacityKw: systemConfiguration.totalSystemCapacity || 5.0,
        heatPumpCapacityKw: 8.0, // Estimated average
        batteryCapacityKwh: 10.0, // Estimated average
        totalInstallationCost: systemConfiguration.totalInstallationCost || 25000,
        solarInstallationCost: systemConfiguration.solarInstallationCost || 15000,
        heatPumpInstallationCost: systemConfiguration.heatPumpInstallationCost || 8000,
        batteryInstallationCost: systemConfiguration.batteryInstallationCost || 8000
      };

      console.log('Sending subsidy check request:', request);

      const response = await getGovernmentSubsidies(request);
      const result = response.data;
      console.log('Subsidy check result:', result);
      setSubsidies(result.availableSubsidies || []);
      setShowSubsidies(true);
    } catch (error) {
      console.error('Error checking subsidies:', error);
      setSubsidies([]);
      setShowSubsidies(true);
    } finally {
      setLoading(false);
    }
  };

  const applySubsidy = (subsidy) => {
    const newApplied = [...appliedSubsidies, subsidy];
    const newTotal = newApplied.reduce((sum, s) => sum + (s.estimatedAmount || 0), 0);
    
    setAppliedSubsidies(newApplied);
    setTotalSubsidyAmount(newTotal);
    
    // Notify parent component about the subsidy application
    if (onSubsidyApplied) {
      onSubsidyApplied(newApplied, newTotal);
    }
  };

  const removeSubsidy = (subsidyId) => {
    const newApplied = appliedSubsidies.filter(s => s.subsidyId !== subsidyId);
    const newTotal = newApplied.reduce((sum, s) => sum + (s.estimatedAmount || 0), 0);
    
    setAppliedSubsidies(newApplied);
    setTotalSubsidyAmount(newTotal);
    
    // Notify parent component about the subsidy removal
    if (onSubsidyApplied) {
      onSubsidyApplied(newApplied, newTotal);
    }
  };

  const isSubsidyApplied = (subsidyId) => {
    return appliedSubsidies.some(s => s.subsidyId === subsidyId);
  };

  return (
    <div className="subsidy-checker">
      <div className="subsidy-checker-header">
        <h3>Government Subsidies & Grants</h3>
        <p>Check for available government support schemes that could reduce your installation costs</p>
        
        {appliedSubsidies.length > 0 && (
          <div className="applied-subsidies-summary">
            <span className="subsidy-badge">
              {appliedSubsidies.length} subsidy{appliedSubsidies.length !== 1 ? 'ies' : ''} applied
            </span>
            <span className="total-subsidy-amount">
              Total savings: £{totalSubsidyAmount.toFixed(0)}
            </span>
          </div>
        )}
      </div>

      <div className="subsidy-actions">
        <button 
          className="check-subsidies-btn"
          onClick={checkSubsidies}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Checking Available Subsidies...
            </>
          ) : (
            <>
              Check Available Subsidies
            </>
          )}
        </button>
      </div>

      {showSubsidies && (
        <div className="subsidies-results">
          {subsidies.length === 0 ? (
            <div className="no-subsidies-message">
              <h4>No Current Subsidies Available</h4>
              <p>There are currently no government subsidies available for your configuration. 
                 Check back periodically as new schemes may become available.</p>
            </div>
          ) : (
            <div className="subsidies-list">
              <h4>Available Subsidies ({subsidies.length})</h4>
              {subsidies.map(subsidy => (
                <div 
                  key={subsidy.subsidyId} 
                  className={`subsidy-card ${subsidy.isEligible ? 'eligible' : 'not-eligible'} ${isSubsidyApplied(subsidy.subsidyId) ? 'applied' : ''}`}
                >
                  <div className="subsidy-header">
                    <div className="subsidy-title">
                      <h5>{subsidy.name}</h5>
                      <span className={`eligibility-badge ${subsidy.isEligible ? 'eligible' : 'not-eligible'}`}>
                        {subsidy.isEligible ? '✓ Eligible' : '✗ Not Eligible'}
                      </span>
                    </div>
                    {subsidy.isEligible && subsidy.estimatedAmount && (
                      <div className="subsidy-amount">
                        £{subsidy.estimatedAmount.toFixed(0)}
                      </div>
                    )}
                  </div>

                  <div className="subsidy-content">
                    <p className="subsidy-description">{subsidy.shortDescription}</p>
                    
                    {subsidy.isEligible ? (
                      <div className="subsidy-details">
                        <div className="eligibility-conditions">
                          <strong>Please confirm you meet these requirements:</strong>
                          {getEligibilityConditions(subsidy.name).map((condition, index) => (
                            <label key={index} className="condition-checkbox">
                              <input
                                type="checkbox"
                                checked={conditionsChecked[subsidy.subsidyId]?.[index] || false}
                                onChange={(e) => handleConditionChange(subsidy.subsidyId, index, e.target.checked)}
                              />
                              <span className="condition-text">{condition}</span>
                            </label>
                          ))}
                        </div>
                        {subsidy.deadline && (
                          <p className="deadline">
                            <strong>Application Deadline:</strong> {new Date(subsidy.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="ineligibility-reason">
                        <p><strong>Why not eligible:</strong> {subsidy.ineligibilityReason}</p>
                      </div>
                    )}

                    <div className="subsidy-actions">
                      {subsidy.applicationUrl && (
                        <a 
                          href={subsidy.applicationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="learn-more-btn"
                        >
                          Learn More & Apply
                        </a>
                      )}
                      
                      {subsidy.isEligible && !isSubsidyApplied(subsidy.subsidyId) && (
                        <button 
                          className="apply-subsidy-btn"
                          onClick={() => applySubsidy(subsidy)}
                          disabled={!areAllConditionsMet(subsidy.subsidyId)}
                        >
                          Apply to Calculations
                        </button>
                      )}
                      
                      {isSubsidyApplied(subsidy.subsidyId) && (
                        <button 
                          className="remove-subsidy-btn"
                          onClick={() => removeSubsidy(subsidy.subsidyId)}
                        >
                          ✕ Remove from Calculations
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubsidyChecker; 