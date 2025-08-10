import React from 'react';
import { calculateStats } from './chartUtils';

const ChartStats = ({ climateData }) => {
  if (!climateData?.solar || !climateData?.temperature) return null;

  // 计算太阳辐射统计
  const solarValues = climateData.solar.map(d => d.value).filter(v => !isNaN(v) && v > 0);
  const solarStats = calculateStats(solarValues, climateData.solar);

  // 计算温度统计
  const tempValues = climateData.temperature.map(d => d.value).filter(v => !isNaN(v));
  const tempStats = calculateStats(tempValues, climateData.temperature);

  if (!solarStats || !tempStats) return null;

  return (
    <div className="chart-stats-combined">
      <div className="stat-group">
        <h5>Solar Radiation</h5>
        <div className="stat">
          <span>Annual Average:</span>
          <strong>{solarStats.average} kWh/m²/day</strong>
        </div>
        <div className="stat">
          <span>Peak Month:</span>
          <strong>{solarStats.peakMonth}</strong>
        </div>
        <div className="stat">
          <span>Data Points:</span>
          <strong>{solarStats.dataPoints} months</strong>
        </div>
      </div>
      
      <div className="stat-group">
        <h5>Temperature</h5>
        <div className="stat">
          <span>Annual Average:</span>
          <strong>{tempStats.average}°C</strong>
        </div>
        <div className="stat">
          <span>Peak Month:</span>
          <strong>{tempStats.peakMonth}</strong>
        </div>
        <div className="stat">
          <span>Data Points:</span>
          <strong>{tempStats.dataPoints} months</strong>
        </div>
      </div>
    </div>
  );
};

export default ChartStats; 