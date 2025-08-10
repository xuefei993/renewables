import React from 'react';
import { createSmoothPath, CHART_CONFIG } from './chartUtils';

const ChartSVG = ({ 
  solarPoints, 
  tempPoints, 
  months, 
  solarMin, 
  solarRange, 
  tempMin, 
  tempRange,
  showTooltip,
  hideTooltip 
}) => {
  const { width: chartWidth, height: chartHeight, padding, colors } = CHART_CONFIG;
  
  // 创建平滑曲线路径
  const solarPath = createSmoothPath(solarPoints);
  const tempPath = createSmoothPath(tempPoints);

  return (
    <svg width={chartWidth} height={chartHeight} className="climate-chart">
      {/* 定义渐变 */}
      <defs>
        <linearGradient id="solarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors.solar, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: colors.solar, stopOpacity: 0.1 }} />
        </linearGradient>
        <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors.temperature, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: colors.temperature, stopOpacity: 0.1 }} />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {/* 水平网格线 */}
      {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
        <line
          key={ratio}
          x1={padding}
          y1={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
          x2={chartWidth - padding}
          y2={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
          stroke={colors.grid}
          strokeWidth="1"
          strokeDasharray="3,3"
        />
      ))}
      
      {/* 垂直网格线 */}
      {months.map((item, index) => {
        const x = padding + (index * (chartWidth - 2 * padding)) / (months.length - 1);
        return (
          <line
            key={`vgrid-${index}`}
            x1={x}
            y1={padding}
            x2={x}
            y2={chartHeight - padding}
            stroke={colors.verticalGrid}
            strokeWidth="1"
            strokeDasharray="2,4"
          />
        );
      })}
      
      {/* 太阳辐射平滑曲线 */}
      <path
        d={solarPath}
        fill="none"
        stroke={colors.solar}
        strokeWidth="4"
        filter="url(#shadow)"
      />
      
      {/* 温度平滑曲线 */}
      <path
        d={tempPath}
        fill="none"
        stroke={colors.temperature}
        strokeWidth="4"
        filter="url(#shadow)"
      />
      
      {/* 太阳辐射数据点 */}
      {solarPoints.map((point, index) => (
        <circle
          key={`solar-${index}`}
          cx={point.x}
          cy={point.y}
          r="6"
          fill={colors.solar}
          stroke="white"
          strokeWidth="1.5" // 从3减小到2
          className="data-point solar-point"
          onMouseEnter={(e) => showTooltip(e, point.month, point.value, tempPoints[index].value)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        />
      ))}
      
      {/* 温度数据点 */}
      {tempPoints.map((point, index) => (
        <circle
          key={`temp-${index}`}
          cx={point.x}
          cy={point.y}
          r="6"
          fill={colors.temperature}
          stroke="white"
          strokeWidth="1.5" // 从3减小到2
          className="data-point temp-point"
          onMouseEnter={(e) => showTooltip(e, point.month, solarPoints[index].value, point.value)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        />
      ))}
      
      {/* X轴标签 */}
      {months.map((item, index) => {
        const x = padding + (index * (chartWidth - 2 * padding)) / (months.length - 1);
        return (
          <text
            key={index}
            x={x}
            y={chartHeight - 25}
            textAnchor="middle"
            fontSize="13"
            fill="#666"
            fontWeight="500"
          >
            {item.month}
          </text>
        );
      })}
      
      {/* 左Y轴标签（太阳辐射） */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
        const value = solarMin + ratio * solarRange;
        const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
        return (
          <text
            key={`solar-y-${index}`}
            x={padding - 20}
            y={y + 4}
            textAnchor="end"
            fontSize="12"
            fill={colors.solar}
            fontWeight="600"
          >
            {value.toFixed(1)}
          </text>
        );
      })}
      
      {/* 右Y轴标签（温度） */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
        const value = tempMin + ratio * tempRange;
        const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
        return (
          <text
            key={`temp-y-${index}`}
            x={chartWidth - padding + 20}
            y={y + 4}
            textAnchor="start"
            fontSize="12"
            fill={colors.temperature}
            fontWeight="600"
          >
            {value.toFixed(1)}°C
          </text>
        );
      })}
      
      {/* Y轴标题 */}
      <text
        x={25}
        y={chartHeight / 2}
        textAnchor="middle"
        fontSize="14"
        fill={colors.solar}
        fontWeight="700"
        transform={`rotate(-90 25 ${chartHeight / 2})`}
      >
        Solar Radiation (kWh/m²/day)
      </text>
      
      <text
        x={chartWidth - 15} // 从 chartWidth - 25 改为 chartWidth - 15，增加距离
        y={chartHeight / 2}
        textAnchor="middle"
        fontSize="14"
        fill={colors.temperature}
        fontWeight="700"
        transform={`rotate(90 ${chartWidth - 15} ${chartHeight / 2})`}
      >
        Temperature (°C)
      </text>
    </svg>
  );
};

export default ChartSVG; 