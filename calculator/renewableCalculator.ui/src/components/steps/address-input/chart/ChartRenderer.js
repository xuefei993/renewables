import React from 'react';
import { 
  validateChartData, 
  calculateDataRange, 
  generateChartPoints,
  CHART_CONFIG 
} from './chartUtils';
import ChartSVG from './ChartSVG';
import ChartTooltip from './ChartTooltip';
import ChartStats from './ChartStats';

const ChartRenderer = ({ climateData, tooltip, showTooltip, hideTooltip }) => {
  // 验证数据
  const validation = validateChartData(climateData);
  if (!validation.isValid) {
    return validation.errorComponent;
  }

  const { width: chartWidth, height: chartHeight, padding } = CHART_CONFIG;
  const months = climateData.solar;

  // 计算太阳辐射的范围和比例
  const solarRange = calculateDataRange(months);
  const tempRange = calculateDataRange(climateData.temperature);

  // 生成图表数据点
  const solarPoints = generateChartPoints(months, {
    chartWidth,
    chartHeight,
    padding,
    dataMin: solarRange.min,
    dataRange: solarRange.range
  });

  const tempPoints = generateChartPoints(climateData.temperature, {
    chartWidth,
    chartHeight,
    padding,
    dataMin: tempRange.min,
    dataRange: tempRange.range
  });

  return (
    <div className="combined-chart-container">
      {/* 图例 */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f1c40f' }}></div>
          <span>Solar Radiation (kWh/m²/day)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3498db' }}></div>
          <span>Temperature (°C)</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <ChartSVG
          solarPoints={solarPoints}
          tempPoints={tempPoints}
          months={months}
          solarMin={solarRange.min}
          solarRange={solarRange.range}
          tempMin={tempRange.min}
          tempRange={tempRange.range}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />
      </div>
      
      <ChartTooltip tooltip={tooltip} />
      
      <ChartStats climateData={climateData} />
    </div>
  );
};

export default ChartRenderer; 