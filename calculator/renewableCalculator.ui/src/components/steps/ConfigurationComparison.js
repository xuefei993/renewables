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
import { getAllSolarPanelTypes, getHeatPumps, getBatteries, getEquipmentComparison } from '../../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ConfigurationComparison = ({ selectedEquipment, userData, onBack, appliedSubsidies, totalSubsidyAmount }) => {
  const [availableEquipment, setAvailableEquipment] = useState({});
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState({ visible: false, data: null, title: '' });

  // Helper function to calculate net installation cost after subsidies
  const calculateNetInstallationCost = (grossCost) => {
    const subsidyAmount = totalSubsidyAmount || 0;
    return Math.max(0, grossCost - subsidyAmount);
  };

  // Helper function to format installation cost display with subsidy information
  const formatInstallationCostWithSubsidy = (grossCost) => {
    const subsidyAmount = totalSubsidyAmount || 0;
    const netCost = calculateNetInstallationCost(grossCost);
    
    if (subsidyAmount > 0) {
      return (
        <div className="cost-breakdown">
          <div className="gross-cost">{formatCurrency(grossCost)}</div>
          <div className="subsidy-deduction">- {formatCurrency(subsidyAmount)} (subsidy)</div>
          <div className="net-cost"><strong>{formatCurrency(netCost)}</strong></div>
        </div>
      );
    }
    
    return formatCurrency(grossCost);
  };

  useEffect(() => {
    loadAvailableEquipment();
  }, [selectedEquipment]);

  const loadAvailableEquipment = async () => {
    try {
      const promises = [];
      
      if (selectedEquipment.solarPanels) {
        promises.push(
          getAllSolarPanelTypes().then(res => ({ type: 'solar', data: res.data }))
        );
      }
      
      if (selectedEquipment.heatPump) {
        promises.push(
          getHeatPumps().then(res => ({ type: 'heatPump', data: res.data }))
        );
      }
      
      if (selectedEquipment.batteryStorage) {
        promises.push(
          getBatteries().then(res => ({ type: 'battery', data: res.data }))
        );
      }

      const results = await Promise.all(promises);
      
      const available = {};
      results.forEach(result => {
        available[result.type] = result.data;
      });
      
      setAvailableEquipment(available);
      
      // Generate 3 recommended configurations
      const recommendedConfigurations = await generateRecommendedConfigurations(available);
      setConfigurations(recommendedConfigurations);
      
    } catch (error) {
      console.error('Error loading available equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendedConfigurations = async (available) => {
    const configs = [];
    
    // Configuration 1: Most Cost-Effective (cheapest installation cost)
    configs.push({
      id: 1,
      name: "Most Cost-Effective",
      selections: getCostEffectiveSelections(available),
      calculations: {
        installationCost: 0,
        annualGeneration: 0,
        annualSavings: 0,
        annualExportRevenue: 0,
        annualCO2Savings: 0,
        paybackPeriod: 0,
        monthlyData: {
          generation: new Array(12).fill(0),
          savings: new Array(12).fill(0),
          exportRevenue: new Array(12).fill(0),
          co2Savings: new Array(12).fill(0)
        }
      },
      loading: false
    });

    // Configuration 2: Most Eco-Friendly (maximum CO2 savings)
    configs.push({
      id: 2,
      name: "Most Eco-Friendly",
      selections: getEcoFriendlySelections(available),
      calculations: {
        installationCost: 0,
        annualGeneration: 0,
        annualSavings: 0,
        annualExportRevenue: 0,
        annualCO2Savings: 0,
        paybackPeriod: 0,
        monthlyData: {
          generation: new Array(12).fill(0),
          savings: new Array(12).fill(0),
          exportRevenue: new Array(12).fill(0),
          co2Savings: new Array(12).fill(0)
        }
      },
      loading: false
    });

    // Configuration 3: Balanced Option (best overall value)
    configs.push({
      id: 3,
      name: "Balanced Option",
      selections: getBalancedSelections(available),
      calculations: {
        installationCost: 0,
        annualGeneration: 0,
        annualSavings: 0,
        annualExportRevenue: 0,
        annualCO2Savings: 0,
        paybackPeriod: 0,
        monthlyData: {
          generation: new Array(12).fill(0),
          savings: new Array(12).fill(0),
          exportRevenue: new Array(12).fill(0),
          co2Savings: new Array(12).fill(0)
        }
      },
      loading: false
    });

    // Calculate performance for each configuration
    for (let config of configs) {
      if (hasValidSelections(config.selections)) {
        await calculateConfigurationPerformance(config);
      }
    }

    return configs;
  };

  const getCostEffectiveSelections = (available) => {
    const selections = {
      solar: selectedEquipment.solarPanels ? null : null,
      heatPump: selectedEquipment.heatPump ? null : null,
      battery: selectedEquipment.batteryStorage ? null : null,
    };

    // Select cheapest options (assuming lower price or basic models)
    if (selectedEquipment.solarPanels && available.solar && available.solar.length > 0) {
      // Find the most cost-effective solar panel (lowest price if available, otherwise first option)
      const cheapestSolar = available.solar.reduce((min, panel) => 
        (panel.price && min.price && panel.price < min.price) ? panel : min
      );
      selections.solar = cheapestSolar.id;
    }

    if (selectedEquipment.heatPump && available.heatPump && available.heatPump.length > 0) {
      // Select most cost-effective heat pump (lowest cost)
      const cheapestHeatPump = available.heatPump.reduce((min, pump) => 
        (pump.cost && min.cost && pump.cost < min.cost) ? pump : min
      );
      selections.heatPump = cheapestHeatPump.id;
    }

    if (selectedEquipment.batteryStorage && available.battery && available.battery.length > 0) {
      // Select most cost-effective battery (lowest cost)
      const cheapestBattery = available.battery.reduce((min, battery) => 
        (battery.cost && min.cost && battery.cost < min.cost) ? battery : min
      );
      selections.battery = cheapestBattery.id;
    }

    return selections;
  };

  const getEcoFriendlySelections = (available) => {
    const selections = {
      solar: selectedEquipment.solarPanels ? null : null,
      heatPump: selectedEquipment.heatPump ? null : null,
      battery: selectedEquipment.batteryStorage ? null : null,
    };

    // Select highest efficiency/performance options
    if (selectedEquipment.solarPanels && available.solar && available.solar.length > 0) {
      // Find highest efficiency or power solar panel
      const bestSolar = available.solar.reduce((best, panel) => 
        (panel.efficiency && best.efficiency && panel.efficiency > best.efficiency) ? panel : 
        (panel.ratedPowerPerPanel && best.ratedPowerPerPanel && panel.ratedPowerPerPanel > best.ratedPowerPerPanel) ? panel : best
      );
      selections.solar = bestSolar.id;
    }

    if (selectedEquipment.heatPump && available.heatPump && available.heatPump.length > 0) {
      // Select highest COP heat pump
      const bestHeatPump = available.heatPump.reduce((best, pump) => 
        (pump.cop && best.cop && pump.cop > best.cop) ? pump : best
      );
      selections.heatPump = bestHeatPump.id;
    }

    if (selectedEquipment.batteryStorage && available.battery && available.battery.length > 0) {
      // Select largest capacity battery
      const bestBattery = available.battery.reduce((best, battery) => 
        (battery.capacityKwh && best.capacityKwh && battery.capacityKwh > best.capacityKwh) ? battery : best
      );
      selections.battery = bestBattery.id;
    }

    return selections;
  };

  const getBalancedSelections = (available) => {
    const selections = {
      solar: selectedEquipment.solarPanels ? null : null,
      heatPump: selectedEquipment.heatPump ? null : null,
      battery: selectedEquipment.batteryStorage ? null : null,
    };

    // Select middle-range options (good balance of cost and performance)
    if (selectedEquipment.solarPanels && available.solar && available.solar.length > 0) {
      const sortedSolar = [...available.solar].sort((a, b) => 
        (a.price || 0) - (b.price || 0)
      );
      const middleIndex = Math.floor(sortedSolar.length / 2);
      selections.solar = sortedSolar[middleIndex].id;
    }

    if (selectedEquipment.heatPump && available.heatPump && available.heatPump.length > 0) {
      const sortedHeatPumps = [...available.heatPump].sort((a, b) => 
        (a.cost || 0) - (b.cost || 0)
      );
      const middleIndex = Math.floor(sortedHeatPumps.length / 2);
      selections.heatPump = sortedHeatPumps[middleIndex].id;
    }

    if (selectedEquipment.batteryStorage && available.battery && available.battery.length > 0) {
      const sortedBatteries = [...available.battery].sort((a, b) => 
        (a.cost || 0) - (b.cost || 0)
      );
      const middleIndex = Math.floor(sortedBatteries.length / 2);
      selections.battery = sortedBatteries[middleIndex].id;
    }

    return selections;
  };

  const hasValidSelections = (selections) => {
    return Object.values(selections).some(selection => selection !== null && selection !== '');
  };

  const calculateConfigurationPerformance = async (config) => {
    try {
      const calculationRequest = {
        hasSolarPanels: Boolean(selectedEquipment.solarPanels),
        hasHeatPump: Boolean(selectedEquipment.heatPump),
        hasBattery: Boolean(selectedEquipment.batteryStorage),
        solarPanelTypeIds: config.selections.solar ? [Number(config.selections.solar)] : [],
        heatPumpTypeIds: config.selections.heatPump ? [Number(config.selections.heatPump)] : [],
        batteryIds: config.selections.battery ? [Number(config.selections.battery)] : [],
        houseArea: Number(userData.houseArea) || 120,
        occupants: Number(userData.occupants) || 3,
        roofArea: Number(userData.roofArea) || 60,  // Increased from 30 to 60 sq meters
        latitude: Number(userData.latitude) || 51.5,
        longitude: Number(userData.longitude) || -0.1,
        annualElectricityUsageKwh: Number(userData.annualElectricityUsage) || 3500,
        annualGasUsageKwh: Number(userData.annualGasUsage) || 18000,
        monthlyElectricityUsageKwh: Number(userData.monthlyElectricityUsage) || 290,
        homeOccupancyFactor: Number(userData.homeOccupancyFactor) || 0.6,
        electricityRate: Number(userData.electricityRate) || 25,  // Pence per kWh
        gasRate: Number(userData.gasRate) || 8,     // Pence per kWh
        exportRate: Number(userData.exportRate) || 15,  // Pence per kWh
        peakElectricityRate: Number(userData.peakElectricityRate) || 35,
        offPeakElectricityRate: Number(userData.offPeakElectricityRate) || 12,
        solarInstallationComplexity: Number(userData.solarInstallationComplexity) || 1.2,
        heatPumpInstallationComplexity: Number(userData.heatPumpInstallationComplexity) || 1.5,
        batteryInstallationComplexity: Number(userData.batteryInstallationComplexity) || 1.1,
      };

      console.log('Sending calculation request:', calculationRequest); // Debug log

      const response = await getEquipmentComparison(calculationRequest);
      const result = response.data;
      console.log('Received calculation result:', result); // Debug log
      config.calculations = processCalculationResult(result);
    } catch (error) {
      console.error('Error calculating configuration performance:', error);
    }
  };

  const createEmptyConfiguration = (configNumber) => ({
    id: configNumber,
    name: `Configuration ${configNumber}`,
    selections: {
      solar: selectedEquipment.solarPanels ? '' : null,
      heatPump: selectedEquipment.heatPump ? '' : null,
      battery: selectedEquipment.batteryStorage ? '' : null,
    },
    calculations: {
      installationCost: 0,
      annualGeneration: 0,
      annualSavings: 0,
      annualExportRevenue: 0,
      annualCO2Savings: 0,
      paybackPeriod: 0,
      monthlyData: {
        generation: new Array(12).fill(0),
        savings: new Array(12).fill(0),
        exportRevenue: new Array(12).fill(0),
        co2Savings: new Array(12).fill(0)
      }
    },
    loading: false
  });

  const handleEquipmentChange = async (configId, equipmentType, equipmentId) => {
    // Update the selection
    setConfigurations(prev => prev.map(config => {
      if (config.id === configId) {
        return {
          ...config,
          selections: {
            ...config.selections,
            [equipmentType]: equipmentId
          },
          loading: true
        };
      }
      return config;
    }));

    // Recalculate for this configuration
    await recalculateConfiguration(configId, equipmentType, equipmentId);
  };

  const recalculateConfiguration = async (configId, changedEquipmentType, changedEquipmentId) => {
    try {
      const config = configurations.find(c => c.id === configId);
      if (!config) return;

      // Update the changed selection
      const updatedSelections = {
        ...config.selections,
        [changedEquipmentType]: changedEquipmentId
      };

      // Build request for calculation
      const calculationRequest = {
        hasSolarPanels: Boolean(selectedEquipment.solarPanels),
        hasHeatPump: Boolean(selectedEquipment.heatPump),
        hasBattery: Boolean(selectedEquipment.batteryStorage),
        solarPanelTypeIds: updatedSelections.solar ? [Number(updatedSelections.solar)] : [],
        heatPumpTypeIds: updatedSelections.heatPump ? [Number(updatedSelections.heatPump)] : [],
        batteryIds: updatedSelections.battery ? [Number(updatedSelections.battery)] : [],
        houseArea: Number(userData.houseArea) || 120,
        occupants: Number(userData.occupants) || 3,
        roofArea: Number(userData.roofArea) || 60,  // Increased from 30 to 60 sq meters
        latitude: Number(userData.latitude) || 51.5,
        longitude: Number(userData.longitude) || -0.1,
        annualElectricityUsageKwh: Number(userData.annualElectricityUsage) || 3500,
        annualGasUsageKwh: Number(userData.annualGasUsage) || 18000,
        monthlyElectricityUsageKwh: Number(userData.monthlyElectricityUsage) || 290,
        homeOccupancyFactor: Number(userData.homeOccupancyFactor) || 0.6,
        electricityRate: Number(userData.electricityRate) || 25,  // Pence per kWh
        gasRate: Number(userData.gasRate) || 8,     // Pence per kWh
        exportRate: Number(userData.exportRate) || 15,  // Pence per kWh
        peakElectricityRate: Number(userData.peakElectricityRate) || 35,
        offPeakElectricityRate: Number(userData.offPeakElectricityRate) || 12,
        solarInstallationComplexity: Number(userData.solarInstallationComplexity) || 1.2,
        heatPumpInstallationComplexity: Number(userData.heatPumpInstallationComplexity) || 1.5,
        batteryInstallationComplexity: Number(userData.batteryInstallationComplexity) || 1.1,
      };

      const response = await getEquipmentComparison(calculationRequest);
      const result = response.data;
      const calculations = processCalculationResult(result);
      
      setConfigurations(prev => prev.map(config => {
        if (config.id === configId) {
          return {
            ...config,
            selections: updatedSelections,
            calculations,
            loading: false
          };
        }
        return config;
      }));
    } catch (error) {
      console.error('Error recalculating configuration:', error);
      setConfigurations(prev => prev.map(config => {
        if (config.id === configId) {
          return { ...config, loading: false };
        }
        return config;
      }));
    }
  };

  const processCalculationResult = (result) => {
    let totalCost = 0;
    let totalGeneration = 0;
    let totalSavings = 0;
    let totalExportRevenue = 0;
    let totalCO2Savings = 0;
    const monthlyGeneration = new Array(12).fill(0);
    const monthlySavings = new Array(12).fill(0);
    const monthlyExportRevenue = new Array(12).fill(0);
    const monthlyCO2Savings = new Array(12).fill(0);

    // Aggregate data from all equipment types
    [...(result.solarPanelOptions || []), ...(result.heatPumpOptions || []), ...(result.batteryOptions || [])].forEach(option => {
      totalCost += option.installationCost || 0;
      totalGeneration += option.annualGeneration || 0;
      totalSavings += option.annualCostSavings || 0;
      totalExportRevenue += option.annualExportRevenue || 0;
      totalCO2Savings += option.annualTotalCO2Savings || 0;

      // Aggregate monthly data
      if (option.monthlyGeneration) {
        option.monthlyGeneration.forEach((value, index) => {
          monthlyGeneration[index] += value || 0;
        });
      }
      if (option.monthlyCostSavings) {
        option.monthlyCostSavings.forEach((value, index) => {
          monthlySavings[index] += value || 0;
        });
      }
      if (option.monthlyExportRevenue) {
        option.monthlyExportRevenue.forEach((value, index) => {
          monthlyExportRevenue[index] += value || 0;
        });
      }
      if (option.monthlyDirectCO2Savings && option.monthlyIndirectCO2Savings) {
        option.monthlyDirectCO2Savings.forEach((direct, index) => {
          const indirect = option.monthlyIndirectCO2Savings[index] || 0;
          monthlyCO2Savings[index] += (direct || 0) + indirect;
        });
      }
    });

    const paybackPeriod = (totalSavings + totalExportRevenue) > 0 ? 
      totalCost / (totalSavings + totalExportRevenue) : 999;

    return {
      installationCost: totalCost,
      annualGeneration: totalGeneration,
      annualSavings: totalSavings,
      annualExportRevenue: totalExportRevenue,
      annualCO2Savings: totalCO2Savings,
      paybackPeriod: paybackPeriod,
      monthlyData: {
        generation: monthlyGeneration,
        savings: monthlySavings,
        exportRevenue: monthlyExportRevenue,
        co2Savings: monthlyCO2Savings
      }
    };
  };

  const addConfiguration = () => {
    const newId = Math.max(...configurations.map(c => c.id)) + 1;
    setConfigurations(prev => [...prev, createEmptyConfiguration(newId)]);
  };

  const removeConfiguration = (configId) => {
    if (configurations.length > 1) {
      setConfigurations(prev => prev.filter(c => c.id !== configId));
    }
  };

  const showMonthlyChart = (config, dataType, title) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let monthlyData = [];
    switch (dataType) {
      case 'generation':
        monthlyData = config.calculations.monthlyData.generation;
        break;
      case 'savings':
        monthlyData = config.calculations.monthlyData.savings;
        break;
      case 'exportRevenue':
        monthlyData = config.calculations.monthlyData.exportRevenue;
        break;
      case 'co2Savings':
        monthlyData = config.calculations.monthlyData.co2Savings;
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
        title: { display: true, text: `${config.name} - ${title}` }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };

    setShowChart({
      visible: true,
      data: chartData,
      options: chartOptions,
      title: `${config.name} - ${title}`
    });
  };

  const getChartColor = (dataType) => {
    const colors = {
      generation: '#3498db',
      savings: '#27ae60',
      exportRevenue: '#f39c12',
      co2Savings: '#e74c3c'
    };
    return colors[dataType] || '#34495e';
  };

  const formatCurrency = (value) => {
    return value ? `£${Math.round(value).toLocaleString()}` : '£0';
  };

  const formatNumber = (value, unit = '') => {
    return value ? `${Math.round(value).toLocaleString()}${unit}` : `0${unit}`;
  };

  const getEquipmentName = (equipmentType, equipmentId) => {
    if (!equipmentId || !availableEquipment[equipmentType]) return '';
    const equipment = availableEquipment[equipmentType].find(e => e.id == equipmentId);
    return equipment ? equipment.name : '';
  };

  if (loading) {
    return (
      <div className="configuration-comparison-loading">
        <h3>Loading Equipment Options...</h3>
        <p>Generating recommended configurations for you.</p>
      </div>
    );
  }

  return (
    <div className="configuration-comparison">
      <div className="configuration-table-container">
        <table className="configuration-table">
          <thead>
            <tr>
              <th>Configuration Name</th>
              {selectedEquipment.solarPanels && <th>Solar Panels</th>}
              {selectedEquipment.heatPump && <th>Heat Pump</th>}
              {selectedEquipment.batteryStorage && <th>Battery Storage</th>}
              <th>
                {totalSubsidyAmount > 0 ? 'Net Installation Cost' : 'Installation Cost'}
                {totalSubsidyAmount > 0 && (
                  <div className="cost-header-note">
                    (after £{totalSubsidyAmount.toFixed(0)} subsidy)
                  </div>
                )}
              </th>
              <th 
                className="clickable-header" 
                onClick={() => showMonthlyChart('generation', 'Monthly Generation (kWh)', 'monthlyGeneration')}
                title="Click to view monthly breakdown"
              >
                Annual Generation
              </th>
              <th 
                className="clickable-header"
                onClick={() => showMonthlyChart('savings', 'Monthly Savings (£)', 'monthlySavings')}
                title="Click to view monthly breakdown"
              >
                Annual Savings
              </th>
              <th 
                className="clickable-header"
                onClick={() => showMonthlyChart('exportRevenue', 'Monthly Export Revenue (£)', 'monthlyExportRevenue')}
                title="Click to view monthly breakdown"
              >
                Annual Export Revenue
              </th>
              <th 
                className="clickable-header"
                onClick={() => showMonthlyChart('co2Savings', 'Monthly CO₂ Savings (kg)', 'monthlyCo2Savings')}
                title="Click to view monthly breakdown"
              >
                Annual CO₂ Savings
              </th>
              <th>Payback Period</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {configurations.map(config => (
              <tr key={config.id} className={config.loading ? 'loading-row' : ''}>
                <td>
                  <input 
                    type="text" 
                    value={config.name}
                    onChange={(e) => {
                      setConfigurations(prev => prev.map(c => 
                        c.id === config.id ? { ...c, name: e.target.value } : c
                      ));
                    }}
                    className="config-name-input"
                  />
                </td>
                
                {selectedEquipment.solarPanels && (
                  <td>
                    <select 
                      value={config.selections.solar || ''}
                      onChange={(e) => handleEquipmentChange(config.id, 'solar', e.target.value)}
                      className="equipment-select"
                    >
                      <option value="">Please select...</option>
                      {availableEquipment.solar?.map(panel => (
                        <option key={panel.id} value={panel.id}>
                          {panel.name} ({panel.ratedPowerPerPanel}W)
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                
                {selectedEquipment.heatPump && (
                  <td>
                    <select 
                      value={config.selections.heatPump || ''}
                      onChange={(e) => handleEquipmentChange(config.id, 'heatPump', e.target.value)}
                      className="equipment-select"
                    >
                      <option value="">Please select...</option>
                      {availableEquipment.heatPump?.map(heatPump => (
                        <option key={heatPump.id} value={heatPump.id}>
                          {heatPump.name} (COP: {heatPump.cop})
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                
                {selectedEquipment.batteryStorage && (
                  <td>
                    <select 
                      value={config.selections.battery || ''}
                      onChange={(e) => handleEquipmentChange(config.id, 'battery', e.target.value)}
                      className="equipment-select"
                    >
                      <option value="">Please select...</option>
                      {availableEquipment.battery?.map(battery => (
                        <option key={battery.id} value={battery.id}>
                          {battery.name} ({battery.capacityKwh}kWh)
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                
                <td>{config.loading ? 'Calculating...' : formatInstallationCostWithSubsidy(config.calculations.installationCost)}</td>
                
                <td 
                  className="clickable-cell"
                  onClick={() => !config.loading && showMonthlyChart(config, 'generation', 'Monthly Generation (kWh)')}
                >
                  {config.loading ? 'Calculating...' : formatNumber(config.calculations.annualGeneration, ' kWh')}
                </td>
                
                <td 
                  className="clickable-cell"
                  onClick={() => !config.loading && showMonthlyChart(config, 'savings', 'Monthly Savings (£)')}
                >
                  {config.loading ? 'Calculating...' : formatCurrency(config.calculations.annualSavings)}
                </td>
                
                <td 
                  className="clickable-cell"
                  onClick={() => !config.loading && showMonthlyChart(config, 'exportRevenue', 'Monthly Export Revenue (£)')}
                >
                  {config.loading ? 'Calculating...' : formatCurrency(config.calculations.annualExportRevenue)}
                </td>
                
                <td 
                  className="clickable-cell"
                  onClick={() => !config.loading && showMonthlyChart(config, 'co2Savings', 'Monthly CO₂ Savings (kg)')}
                >
                  {config.loading ? 'Calculating...' : formatNumber(config.calculations.annualCO2Savings, ' kg')}
                </td>
                
                <td>{config.loading ? 'Calculating...' : formatNumber(config.calculations.paybackPeriod, ' years')}</td>
                
                <td>
                  <button 
                    className="btn-remove" 
                    onClick={() => removeConfiguration(config.id)}
                    disabled={configurations.length <= 1}
                    title="Remove configuration"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-actions">
        <button className="btn btn-secondary" onClick={addConfiguration}>
          + Add Custom Configuration
        </button>
        <span className="table-hint">
           The first 3 are our recommendations. Modify them or add your own configurations.
        </span>
      </div>

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
          Back to Equipment Selection
        </button>
      </div>
    </div>
  );
};

export default ConfigurationComparison; 