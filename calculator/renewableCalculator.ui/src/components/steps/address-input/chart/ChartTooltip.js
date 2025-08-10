import React from 'react';

const ChartTooltip = ({ tooltip }) => {
  if (!tooltip.show) return null;

  return (
    <div
      className="chart-tooltip"
      style={{
        position: 'fixed', // 改为fixed定位
        left: tooltip.x + 15, // 鼠标右侧15px偏移
        top: tooltip.y - 15,  // 鼠标上方15px偏移
        transform: 'translateY(-100%)', // 确保tooltip在鼠标上方
        pointerEvents: 'none',
        zIndex: 1000 // 确保在最上层显示
      }}
    >
      <div className="tooltip-content">
        <div className="tooltip-title">{tooltip.content.month}</div>
        <div className="tooltip-item solar">
          <span className="tooltip-color" style={{ backgroundColor: '#f1c40f' }}></span>
          Solar: {tooltip.content.solar} kWh/m²/day
        </div>
        <div className="tooltip-item temp">
          <span className="tooltip-color" style={{ backgroundColor: '#3498db' }}></span>
          Temperature: {tooltip.content.temperature}°C
        </div>
      </div>
    </div>
  );
};

export default ChartTooltip; 