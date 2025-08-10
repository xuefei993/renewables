import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EquipmentComparison = ({ selectedEquipment, userData, onBack }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [availableEquipment, setAvailableEquipment] = useState({});
  const [selectedModels, setSelectedModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState({ visible: false, data: null, title: '' });

  useEffect(() => {
    if (selectedEquipment) {
      loadAvailableEquipment();
    }
  }, [selectedEquipment]);

  const loadAvailableEquipment = async () => {
    try {
      const promises = [];
      
      if (selectedEquipment.solarPanels) {
        promises.push(
          fetch('http://localhost:8080/api/equipment/solar-panels/available')
            .then(res => res.json())
            .then(data => ({ type: 'solar', data }))
        );
      }
      
      if (selectedEquipment.heatPump) {
        promises.push(
          fetch('http://localhost:8080/api/equipment/heat-pumps/available')
            .then(res => res.json())
            .then(data => ({ type: 'heatPump', data }))
        );
      }
      
      if (selectedEquipment.batteryStorage) {
        promises.push(
          fetch('http://localhost:8080/api/equipment/batteries/available')
            .then(res => res.json())
            .then(data => ({ type: 'battery', data }))
        );
      }

      const results = await Promise.all(promises);
      
      const available = {};
      results.forEach(result => {
        available[result.type] = result.data;
      });
      
      setAvailableEquipment(available);
      
      // Set default selections (first 2-3 items for each type)
      const defaultSelections = {};
      Object.keys(available).forEach(type => {
        defaultSelections[type] = available[type].slice(0, 3).map(item => item.id);
      });
      setSelectedModels(defaultSelections);
      
    } catch (error) {
      console.error('Error loading available equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareEquipment = async () => {
    if (Object.keys(selectedModels).length === 0) return;

    setLoading(true);
    try {
      const comparisonRequest = {
        hasSolarPanels: selectedEquipment.solarPanels,
        hasHeatPump: selectedEquipment.heatPump,
        hasBattery: selectedEquipment.batteryStorage,
        solarPanelTypeIds: selectedModels.solar || [],
        heatPumpTypeIds: selectedModels.heatPump || [],
        batteryIds: selectedModels.battery || [],
        houseArea: userData.houseArea || 100,
        occupants: userData.occupants || 3,
        roofArea: userData.roofArea || 30,
        latitude: userData.latitude || 51.5,
        longitude: userData.longitude || -0.1,
        annualElectricityUsageKwh: userData.annualElectricityUsage || 3000,
        annualGasUsageKwh: userData.annualGasUsage || 15000,
        monthlyElectricityUsageKwh: userData.monthlyElectricityUsage || 250,
        homeOccupancyFactor: userData.homeOccupancyFactor || 0.5,
        electricityRate: userData.electricityRate || 30,
        gasRate: userData.gasRate || 6,
        exportRate: userData.exportRate || 5,
        peakElectricityRate: userData.peakElectricityRate || 40,
        offPeakElectricityRate: userData.offPeakElectricityRate || 15,
      };

      const response = await fetch('http://localhost:8080/api/equipment/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comparisonRequest)
      });

      if (response.ok) {
        const result = await response.json();
        setComparisonData(result);
      } else {
        console.error('Failed to compare equipment');
      }
    } catch (error) {
      console.error('Error comparing equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelection = (equipmentType, modelId, isSelected) => {
    setSelectedModels(prev => {
      const updated = { ...prev };
      if (!updated[equipmentType]) {
        updated[equipmentType] = [];
      }
      
      if (isSelected) {
        if (!updated[equipmentType].includes(modelId)) {
          updated[equipmentType].push(modelId);
        }
      } else {
        updated[equipmentType] = updated[equipmentType].filter(id => id !== modelId);
      }
      
      return updated;
    });
  };

  const showMonthlyChart = (option, dataType, title) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let monthlyData = [];
    switch (dataType) {
      case 'generation':
        monthlyData = option.monthlyGeneration || [];
        break;
      case 'costSavings':
        monthlyData = option.monthlyCostSavings || [];
        break;
      case 'exportRevenue':
        monthlyData = option.monthlyExportRevenue || [];
        break;
      case 'co2Direct':
        monthlyData = option.monthlyDirectCO2Savings || [];
        break;
      case 'co2Indirect':
        monthlyData = option.monthlyIndirectCO2Savings || [];
        break;
      default:
        monthlyData = [];
    }

    const chartData = {
      labels: months,
      datasets: [{
        label: title,
        data: monthlyData,
        borderColor: getChartColor(dataType),
        backgroundColor: getChartColor(dataType) + '20',
        tension: 0.4,
        fill: true
      }]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: `${option.equipmentName} - ${title}` }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };

    setShowChart({
      visible: true,
      data: chartData,
      options: chartOptions,
      title: `${option.equipmentName} - ${title}`
    });
  };

  const getChartColor = (dataType) => {
    const colors = {
      generation: '#3498db',
      costSavings: '#27ae60',
      exportRevenue: '#f39c12',
      co2Direct: '#e74c3c',
      co2Indirect: '#9b59b6'
    };
    return colors[dataType] || '#34495e';
  };

  const formatCurrency = (value) => {
    return value ? `£${value.toFixed(0)}` : '£0';
  };

  const formatNumber = (value, unit = '') => {
    return value ? `${value.toFixed(1)}${unit}` : `0${unit}`;
  };

  const getSuitabilityBadge = (score) => {
    if (score >= 80) return { text: 'Excellent', class: 'excellent' };
    if (score >= 70) return { text: 'Good', class: 'good' };
    if (score >= 60) return { text: 'Fair', class: 'fair' };
    return { text: 'Poor', class: 'poor' };
  };

  if (loading) {
    return (
      <div className="equipment-comparison-loading">
        <h3>Loading Equipment Comparison...</h3>
        <p>Analyzing available equipment options for your property.</p>
      </div>
    );
  }

  return (
    <div className="equipment-comparison">
      <div className="comparison-header">
        <h3>Equipment Comparison & Selection</h3>
        <p>Select specific equipment models to compare their performance, costs, and environmental impact.</p>
      </div>

      {/* Equipment Selection */}
      <div className="equipment-selection-section">
        <h4>Select Equipment Models to Compare</h4>
        
        {Object.keys(availableEquipment).map(equipmentType => (
          <div key={equipmentType} className="equipment-type-selection">
            <h5>{getEquipmentTypeName(equipmentType)}</h5>
            <div className="model-selection-grid">
              {availableEquipment[equipmentType].map(model => (
                <div key={model.id} className="model-selection-item">
                  <label className="model-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedModels[equipmentType]?.includes(model.id) || false}
                      onChange={(e) => handleModelSelection(equipmentType, model.id, e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <div className="model-info">
                      <span className="model-name">{model.name}</span>
                      <span className="model-manufacturer">{model.manufacturer || 'Various'}</span>
                      <span className="model-specs">{getModelSpecs(model, equipmentType)}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          className="btn btn-primary compare-button"
          onClick={handleCompareEquipment}
          disabled={Object.keys(selectedModels).length === 0}
        >
          Compare Selected Equipment
        </button>
      </div>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="comparison-results">
          <h4>Equipment Comparison Results</h4>
          
          {/* Solar Panels Comparison */}
          {comparisonData.solarPanelOptions && comparisonData.solarPanelOptions.length > 0 && (
            <div className="equipment-comparison-table">
              <h5>Solar Panels</h5>
              <div className="comparison-table-container">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Specifications</th>
                      <th>Installation Cost</th>
                      <th className="clickable-header" title="Click to view monthly chart">
                        Annual Generation
                      </th>
                      <th className="clickable-header" title="Click to view monthly chart">
                        Annual Savings
                      </th>
                      <th className="clickable-header" title="Click to view monthly chart">
                        Export Revenue
                      </th>
                      <th className="clickable-header" title="Click to view monthly chart">
                        CO₂ Savings
                      </th>
                      <th>Payback Period</th>
                      <th>Suitability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.solarPanelOptions.map(option => (
                      <tr key={option.equipmentId}>
                        <td>
                          <div className="equipment-name">
                            <strong>{option.equipmentName}</strong>
                            <small>{option.manufacturer}</small>
                          </div>
                        </td>
                        <td>
                          <div className="specifications">
                            {Object.entries(option.specifications).map(([key, value]) => (
                              <div key={key}>{key}: {value}</div>
                            ))}
                            <div>Qty: {option.recommendedQuantity}</div>
                          </div>
                        </td>
                        <td>{formatCurrency(option.installationCost)}</td>
                        <td 
                          className="clickable-cell"
                          onClick={() => showMonthlyChart(option, 'generation', 'Monthly Generation (kWh)')}
                        >
                          {formatNumber(option.annualGeneration, ' kWh')}
                        </td>
                        <td 
                          className="clickable-cell"
                          onClick={() => showMonthlyChart(option, 'costSavings', 'Monthly Cost Savings (£)')}
                        >
                          {formatCurrency(option.annualCostSavings)}
                        </td>
                        <td 
                          className="clickable-cell"
                          onClick={() => showMonthlyChart(option, 'exportRevenue', 'Monthly Export Revenue (£)')}
                        >
                          {formatCurrency(option.annualExportRevenue)}
                        </td>
                        <td 
                          className="clickable-cell"
                          onClick={() => showMonthlyChart(option, 'co2Indirect', 'Monthly CO₂ Savings (kg)')}
                        >
                          {formatNumber(option.annualTotalCO2Savings, ' kg')}
                        </td>
                        <td>{formatNumber(option.paybackPeriodYears, ' years')}</td>
                        <td>
                          <span className={`suitability-badge ${getSuitabilityBadge(option.suitabilityScore).class}`}>
                            {getSuitabilityBadge(option.suitabilityScore).text}
                          </span>
                          <small>{option.suitabilityReason}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Heat Pumps Comparison */}
          {comparisonData.heatPumpOptions && comparisonData.heatPumpOptions.length > 0 && (
            <div className="equipment-comparison-table">
              <h5>Heat Pumps</h5>
              <div className="comparison-table-container">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Specifications</th>
                      <th>Installation Cost</th>
                      <th className="clickable-header">Annual Savings</th>
                      <th className="clickable-header">CO₂ Savings</th>
                      <th>Payback Period</th>
                      <th>Suitability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.heatPumpOptions.map(option => (
                      <tr key={option.equipmentId}>
                        <td>
                          <div className="equipment-name">
                            <strong>{option.equipmentName}</strong>
                            <small>{option.manufacturer}</small>
                          </div>
                        </td>
                        <td>
                          <div className="specifications">
                            {Object.entries(option.specifications).map(([key, value]) => (
                              <div key={key}>{key}: {value}</div>
                            ))}
                          </div>
                        </td>
                        <td>{formatCurrency(option.installationCost)}</td>
                        <td 
                          className="clickable-cell"
                          onClick={() => showMonthlyChart(option, 'costSavings', 'Monthly Cost Savings (£)')}
                        >
                          {formatCurrency(option.annualCostSavings)}
                        </td>
                        <td 
                          className="clickable-cell"
                          onClick={() => showMonthlyChart(option, 'co2Direct', 'Monthly CO₂ Savings (kg)')}
                        >
                          {formatNumber(option.annualTotalCO2Savings, ' kg')}
                        </td>
                        <td>{formatNumber(option.paybackPeriodYears, ' years')}</td>
                        <td>
                          <span className={`suitability-badge ${getSuitabilityBadge(option.suitabilityScore).class}`}>
                            {getSuitabilityBadge(option.suitabilityScore).text}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Battery Comparison */}
          {comparisonData.batteryOptions && comparisonData.batteryOptions.length > 0 && (
            <div className="equipment-comparison-table">
              <h5>Battery Storage</h5>
              <div className="comparison-table-container">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Specifications</th>
                      <th>Installation Cost</th>
                      <th className="clickable-header">Annual Savings</th>
                      <th>Payback Period</th>
                      <th>Suitability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.batteryOptions.map(option => (
                      <tr key={option.equipmentId}>
                        <td>
                          <div className="equipment-name">
                            <strong>{option.equipmentName}</strong>
                            <small>{option.manufacturer}</small>
                          </div>
                        </td>
                        <td>
                          <div className="specifications">
                            {Object.entries(option.specifications).map(([key, value]) => (
                              <div key={key}>{key}: {value}</div>
                            ))}
                          </div>
                        </td>
                        <td>{formatCurrency(option.installationCost)}</td>
                        <td 
                          className="clickable-cell"
                          onClick={() => showMonthlyChart(option, 'costSavings', 'Monthly Cost Savings (£)')}
                        >
                          {formatCurrency(option.annualCostSavings)}
                        </td>
                        <td>{formatNumber(option.paybackPeriodYears, ' years')}</td>
                        <td>
                          <span className={`suitability-badge ${getSuitabilityBadge(option.suitabilityScore).class}`}>
                            {getSuitabilityBadge(option.suitabilityScore).text}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Monthly Chart Modal */}
      {showChart.visible && (
        <div className="chart-modal-overlay" onClick={() => setShowChart({ visible: false, data: null, title: '' })}>
          <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chart-modal-header">
              <h4>{showChart.title}</h4>
              <button 
                className="chart-close-button"
                onClick={() => setShowChart({ visible: false, data: null, title: '' })}
              >
                ×
              </button>
            </div>
            <div className="chart-container">
              <Line data={showChart.data} options={showChart.options} />
            </div>
          </div>
        </div>
      )}

      <div className="comparison-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Configuration
        </button>
      </div>
    </div>
  );
};

// Helper functions
const getEquipmentTypeName = (type) => {
  const names = {
    solar: 'Solar Panels',
    heatPump: 'Heat Pumps',
    battery: 'Battery Storage'
  };
  return names[type] || type;
};

const getModelSpecs = (model, type) => {
  switch (type) {
    case 'solar':
      return `${model.ratedPowerPerPanel}W, ${model.efficiency}% efficiency`;
    case 'heatPump':
      return `COP: ${model.cop}`;
    case 'battery':
      return `${model.capacityKwh}kWh capacity`;
    default:
      return '';
  }
};

export default EquipmentComparison; 