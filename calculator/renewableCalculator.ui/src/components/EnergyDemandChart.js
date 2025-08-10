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
  Legend
} from 'chart.js';

import { calculateElectricityDemand, calculateGasDemand } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EnergyDemandChart = ({ userData }) => {
  const [electricityChartData, setElectricityChartData] = useState(null);
  const [gasChartData, setGasChartData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    const fetchEnergyDemandData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare electricity demand request based on available user data
        const electricityRequest = prepareElectricityRequest(userData);
        
        // Prepare gas demand request
        const gasRequest = prepareGasRequest(userData);

        console.log('Electricity request:', electricityRequest); // Debug log
        console.log('Gas request:', gasRequest); // Debug log

        // Fetch both electricity and gas demand data
        const [electricityResponse, gasResponse] = await Promise.all([
          calculateElectricityDemand(electricityRequest),
          calculateGasDemand(gasRequest)
        ]);

        const electricityData = electricityResponse.data;
        const gasData = gasResponse.data;

        console.log('Electricity response:', electricityData); // Debug log
        console.log('Gas response:', gasData); // Debug log

        // Extract monthly data
        const electricityMonthly = [];
        const gasMonthly = [];

        for (let month = 1; month <= 12; month++) {
          electricityMonthly.push(electricityData.monthlyElectricityDemand[month] || 0);
          gasMonthly.push(gasData.monthlyGasDemand[month] || 0);
        }

        // Prepare separate chart data for electricity
        const electricityChartConfig = {
          labels: months,
          datasets: [
            {
              label: 'Electricity Demand (kWh)',
              data: electricityMonthly,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true,
            }
          ]
        };

        // Prepare separate chart data for gas
        const gasChartConfig = {
          labels: months,
          datasets: [
            {
              label: 'Gas Demand (kWh)',
              data: gasMonthly,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.1,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true,
            }
          ]
        };

        setElectricityChartData(electricityChartConfig);
        setGasChartData(gasChartConfig);

        // Set summary data
        setSummaryData({
          electricity: {
            annual: electricityData.annualElectricityDemand,
            peak: electricityData.peakMonthDemand,
            peakMonth: months[electricityData.peakMonth - 1],
            low: electricityData.lowMonthDemand,
            lowMonth: months[electricityData.lowMonth - 1],
            method: electricityData.calculationMethod
          },
          gas: {
            annual: gasData.annualGasDemand,
            peak: gasData.peakMonthDemand,
            peakMonth: months[gasData.peakMonth - 1],
            low: gasData.lowMonthDemand,
            lowMonth: months[gasData.lowMonth - 1],
            method: gasData.calculationMethod
          }
        });

      } catch (error) {
        console.error('Error fetching energy demand data:', error);
        setError('Failed to load energy demand data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchEnergyDemandData();
    }
  }, [userData]);

  // Function to prepare electricity request based on user data priority
  const prepareElectricityRequest = (userData) => {
    // Check if user provided monthly electricity usage
    const hasMonthlyElectricityData = checkMonthlyElectricityData(userData);
    if (hasMonthlyElectricityData) {
      console.log('Using user monthly electricity data');
      return {
        monthlyElectricityUsage: convertMonthlyElectricityData(userData.monthlyElectricityUsage)
      };
    }

    // Check if user provided annual electricity usage
    const hasAnnualElectricityData = userData.annualElectricityUsage && 
                                    parseFloat(userData.annualElectricityUsage) > 0;
    if (hasAnnualElectricityData) {
      console.log('Using user annual electricity data');
      return {
        annualElectricityUsage: parseFloat(userData.annualElectricityUsage),
        hasHeatPump: userData.heatingType === 'heat-pump' || userData.heatingType === 'heat pumps'
      };
    }

    // Fall back to estimation
    console.log('Using electricity estimation');
    return {
      needsEstimation: true,
      occupants: userData.occupants || 3,
      hotWaterType: userData.hotWaterType || 'gas-boiler',
      heatingType: userData.heatingType || 'gas',
      houseArea: userData.houseArea || 100,
      buildYear: userData.buildYear || '1981-2002',
      wallType: userData.wallType || 'modern',
      windowType: userData.windowType || 'double',
      houseType: userData.houseType || 'semi-detached',
      epcRating: userData.epcRating || 'D',
      roofInsulation: userData.roofInsulation || 'no',
      floorInsulation: userData.floorInsulation || 'no',
      latitude: userData.latitude,
      longitude: userData.longitude
    };
  };

  // Function to prepare gas request based on user data priority
  const prepareGasRequest = (userData) => {
    // Check if user provided monthly gas usage
    const hasMonthlyGasData = checkMonthlyGasData(userData);
    if (hasMonthlyGasData) {
      console.log('Using user monthly gas data');
      return {
        monthlyGasUsage: convertMonthlyGasData(userData.monthlyGasUsage)
      };
    }

    // Check if user provided annual gas usage
    const hasAnnualGasData = userData.annualGasUsage && 
                            parseFloat(userData.annualGasUsage) > 0;
    if (hasAnnualGasData) {
      console.log('Using user annual gas data');
      return {
        annualGasUsage: parseFloat(userData.annualGasUsage)
      };
    }

    // Fall back to estimation
    console.log('Using gas estimation');
    return {
      needsEstimation: true,
      occupants: userData.occupants || 3,
      hotWaterType: userData.hotWaterType || 'gas-boiler',
      heatingType: userData.heatingType || 'gas',
      houseArea: userData.houseArea || 100,
      buildYear: userData.buildYear || '1981-2002',
      wallType: userData.wallType || 'modern',
      windowType: userData.windowType || 'double',
      houseType: userData.houseType || 'semi-detached',
      epcRating: userData.epcRating || 'D',
      roofInsulation: userData.roofInsulation || 'no',
      floorInsulation: userData.floorInsulation || 'no',
      latitude: userData.latitude,
      longitude: userData.longitude,
      boilerEfficiency: userData.boilerEfficiency || 92
    };
  };

  // Helper function to check if monthly electricity data is available and valid
  const checkMonthlyElectricityData = (userData) => {
    if (!userData.monthlyElectricityUsage) return false;
    
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                       'july', 'august', 'september', 'october', 'november', 'december'];
    
    // Check if all months have valid data
    return monthNames.every(month => {
      const value = userData.monthlyElectricityUsage[month];
      return value && parseFloat(value) >= 0;
    });
  };

  // Helper function to check if monthly gas data is available and valid
  const checkMonthlyGasData = (userData) => {
    if (!userData.monthlyGasUsage) return false;
    
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                       'july', 'august', 'september', 'october', 'november', 'december'];
    
    // Check if all months have valid data
    return monthNames.every(month => {
      const value = userData.monthlyGasUsage[month];
      return value && parseFloat(value) >= 0;
    });
  };

  // Helper function to convert frontend monthly data format to backend format
  const convertMonthlyElectricityData = (monthlyData) => {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                       'july', 'august', 'september', 'october', 'november', 'december'];
    
    const converted = {};
    monthNames.forEach((monthName, index) => {
      converted[index + 1] = parseFloat(monthlyData[monthName]) || 0;
    });
    
    return converted;
  };

  // Helper function to convert frontend monthly gas data format to backend format
  const convertMonthlyGasData = (monthlyData) => {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                       'july', 'august', 'september', 'october', 'november', 'december'];
    
    const converted = {};
    monthNames.forEach((monthName, index) => {
      converted[index + 1] = parseFloat(monthlyData[monthName]) || 0;
    });
    
    return converted;
  };

  // Chart options for electricity
  const electricityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Monthly Electricity Demand',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(0)} kWh`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Electricity Demand (kWh)',
          font: {
            weight: 'bold'
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // Chart options for gas
  const gasChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Monthly Gas Demand',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(0)} kWh`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Gas Demand (kWh)',
          font: {
            weight: 'bold'
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="energy-demand-section">
        <h3>Energy Demand</h3>
        <div className="loading-state">
          <p>Loading energy demand data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="energy-demand-section">
        <h3>Energy Demand</h3>
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="energy-demand-section">
      <h3>Energy Demand</h3>
      
      {/* Summary Statistics */}
      {summaryData && (
        <div className="energy-summary">
          <div className="energy-summary-grid">
            <div className="energy-type-summary electricity-summary">
              <h4>Electricity</h4>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Annual Demand</span>
                  <span className="stat-value">{summaryData.electricity.annual.toFixed(0)} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Peak Month</span>
                  <span className="stat-value">{summaryData.electricity.peakMonth}: {summaryData.electricity.peak.toFixed(0)} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Month</span>
                  <span className="stat-value">{summaryData.electricity.lowMonth}: {summaryData.electricity.low.toFixed(0)} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Method</span>
                  <span className="stat-value method-badge">{getMethodLabel(summaryData.electricity.method)}</span>
                </div>
              </div>
            </div>
            
            <div className="energy-type-summary gas-summary">
              <h4>Gas</h4>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Annual Demand</span>
                  <span className="stat-value">{summaryData.gas.annual.toFixed(0)} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Peak Month</span>
                  <span className="stat-value">{summaryData.gas.peakMonth}: {summaryData.gas.peak.toFixed(0)} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Month</span>
                  <span className="stat-value">{summaryData.gas.lowMonth}: {summaryData.gas.low.toFixed(0)} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Method</span>
                  <span className="stat-value method-badge">{getMethodLabel(summaryData.gas.method)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Separate Charts */}
      <div className="charts-container">
        {/* Electricity Chart */}
        <div className="chart-container electricity-chart">
          <div className="chart-wrapper">
            {electricityChartData && (
              <Line data={electricityChartData} options={electricityChartOptions} />
            )}
          </div>
        </div>

        {/* Gas Chart */}
        <div className="chart-container gas-chart">
          <div className="chart-wrapper">
            {gasChartData && (
              <Line data={gasChartData} options={gasChartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Method Information */}
      {summaryData && (
        <div className="calculation-info">
          <p className="calculation-method">
            {getCalculationDescription(summaryData.electricity.method, summaryData.gas.method)}
          </p>
        </div>
      )}
    </div>
  );

  // Helper function to get method label
  function getMethodLabel(method) {
    switch (method) {
      case 'user_monthly':
        return 'User Monthly Data';
      case 'user_annual_distributed':
        return 'User Annual Data';
      case 'estimated':
        return 'System Estimation';
      default:
        return method || 'Unknown';
    }
  }

  // Helper function to get calculation description
  function getCalculationDescription(electricityMethod, gasMethod) {
    const descriptions = [];
    
    if (electricityMethod === 'user_monthly') {
      descriptions.push('Electricity: based on your monthly usage data');
    } else if (electricityMethod === 'user_annual_distributed') {
      descriptions.push('Electricity: based on your annual usage distributed by seasonal patterns');
    } else {
      descriptions.push('Electricity: estimated based on house characteristics and occupancy');
    }

    if (gasMethod === 'user_monthly') {
      descriptions.push('Gas: based on your monthly usage data');
    } else if (gasMethod === 'user_annual_distributed') {
      descriptions.push('Gas: based on your annual usage distributed by seasonal patterns');
    } else {
      descriptions.push('Gas: estimated based on heating and hot water requirements');
    }

    return descriptions.join('. ');
  }
};

export default EnergyDemandChart; 