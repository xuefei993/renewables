import React, { useState, useEffect } from 'react';
import { weatherService } from '../../../services/weatherService';
import ChartRenderer from './chart/ChartRenderer';

const ClimateChart = ({ latitude, longitude, location }) => {
  const [climateData, setClimateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });
  const [debugInfo, setDebugInfo] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [sourceMessage, setSourceMessage] = useState('');

  useEffect(() => {
    if (latitude && longitude) {
      fetchClimateData();
    }
  }, [latitude, longitude]);

  const fetchClimateData = async () => {
    setIsLoading(true);
    setError('');
    setClimateData(null);
    setDebugInfo('');
    setDataSource('');
    setSourceMessage('');

    try {
      console.log('Fetching climate data...');
      setDebugInfo(`Requesting data for: ${latitude}, ${longitude}`);
      
      const result = await weatherService.getCompleteClimateData(latitude, longitude, location);
      
      if (result.success) {
        setClimateData(result.data);
        setDataSource(result.source);
        setSourceMessage(result.message);
        setDebugInfo(`Successfully loaded data: ${result.data.solar.length} solar points, ${result.data.temperature.length} temperature points`);
        console.log('Climate data loaded successfully:', result.data);
      } else {
        setError(result.error || 'Failed to fetch climate data');
        setDebugInfo(`API Error: ${result.error}`);
        console.error('Climate data fetch failed:', result.error);
      }
    } catch (err) {
      const errorMsg = 'Failed to fetch climate data: ' + err.message;
      setError(errorMsg);
      setDebugInfo(`Exception: ${err.message}`);
      console.error('Climate data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showTooltip = (e, month, solarValue, tempValue) => {
    setTooltip({
      show: true,
      x: e.clientX, // 使用鼠标的全局X位置
      y: e.clientY, // 使用鼠标的全局Y位置
      content: {
        month,
        solar: solarValue.toFixed(1),
        temperature: tempValue.toFixed(1)
      }
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, x: 0, y: 0, content: '' });
  };

  // 占位符状态
  if (!latitude || !longitude) {
    return (
      <div className="climate-chart-placeholder">
        <p>Select a location to view climate data</p>
      </div>
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="climate-chart-loading">
        <div className="loading-spinner">Loading</div>
        <p>Fetching climate data from NASA POWER and Open-Meteo...</p>
        <small>This may take a few seconds</small>
        {debugInfo && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            {debugInfo}
          </div>
        )}
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="climate-chart-error">
        <p>Warning: {error}</p>
        <button onClick={fetchClimateData} className="btn btn-secondary">
          Try Again
        </button>
        <div style={{ marginTop: '1rem' }}>
          <small>
            <strong>Troubleshooting:</strong><br/>
            • Check your internet connection<br/>
            • The APIs may be temporarily unavailable<br/>
            • Some locations may not have complete data coverage<br/>
            • Location: {latitude}, {longitude}
          </small>
          {debugInfo && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>
              Debug: {debugInfo}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 计算数据年份范围用于显示
  const currentYear = new Date().getFullYear();
  const endYear = currentYear - 1;
  const startYear = endYear - 4; // 5年数据

  return (
    <div className="climate-chart-container">
      <div className="chart-header">
        <h3>5-Year Average Climate Data for {location}</h3>
        <p>
          Historical data ({startYear}-{endYear}) from{' '}
          <a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer">
            NASA POWER
          </a>{' '}
          and{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
            Open-Meteo
          </a>{' '}
          APIs
        </p>
      </div>
      
      <div className="chart-content">
        <ChartRenderer
          climateData={climateData}
          tooltip={tooltip}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />
      </div>
    </div>
  );
};

export default ClimateChart; 