// 图表工具函数

/**
 * 创建平滑曲线路径的辅助函数
 * @param {Array} points - 包含 {x, y} 坐标的点数组
 * @returns {string} SVG 路径字符串
 */
export const createSmoothPath = (points) => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    if (i === 1) {
      // 第一个曲线段
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = curr.x - (next ? (next.x - prev.x) / 6 : (curr.x - prev.x) / 3);
      const cp2y = curr.y - (next ? (next.y - prev.y) / 6 : 0);
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    } else if (i === points.length - 1) {
      // 最后一个曲线段
      const prevPrev = points[i - 2];
      const cp1x = prev.x + (curr.x - prevPrev.x) / 6;
      const cp1y = prev.y + (curr.y - prevPrev.y) / 6;
      const cp2x = curr.x - (curr.x - prev.x) / 3;
      const cp2y = curr.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    } else {
      // 中间的曲线段
      const cp1x = prev.x + (curr.x - points[i - 2].x) / 6;
      const cp1y = prev.y + (curr.y - points[i - 2].y) / 6;
      const cp2x = curr.x - (next.x - prev.x) / 6;
      const cp2y = curr.y - (next.y - prev.y) / 6;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
  }
  
  return path;
};

/**
 * 计算数据的范围和比例
 * @param {Array} data - 数据数组
 * @param {Function} valueExtractor - 值提取函数
 * @returns {Object} 包含 min, max, range, values 的对象
 */
export const calculateDataRange = (data, valueExtractor = d => d.value) => {
  const values = data.map(valueExtractor).filter(v => !isNaN(v) && v !== null && v !== undefined);
  
  if (values.length === 0) {
    return { min: 0, max: 1, range: 1, values: [] };
  }
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // 避免除零
  
  return { min, max, range, values };
};

/**
 * 生成图表数据点坐标
 * @param {Array} data - 原始数据
 * @param {Object} params - 参数对象
 * @returns {Array} 包含坐标和数据的点数组
 */
export const generateChartPoints = (data, { chartWidth, chartHeight, padding, dataMin, dataRange }) => {
  return data.map((item, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const y = chartHeight - padding - ((item.value - dataMin) / dataRange) * (chartHeight - 2 * padding);
    return { x, y, value: item.value, month: item.month };
  });
};

/**
 * 验证图表数据完整性
 * @param {Object} climateData - 气候数据对象
 * @returns {Object} 验证结果
 */
export const validateChartData = (climateData) => {
  if (!climateData?.solar || !climateData?.temperature) {
    return { 
      isValid: false, 
      error: 'Missing climate data',
      errorComponent: null
    };
  }

  const solarLength = climateData.solar.length;
  const tempLength = climateData.temperature.length;

  if (solarLength === 0 || tempLength === 0) {
    return {
      isValid: false,
      error: 'Insufficient data to display chart',
      errorComponent: (
        <div className="chart-error">
          <p>Insufficient data to display chart</p>
          <small>Solar: {solarLength} points, Temperature: {tempLength} points</small>
        </div>
      )
    };
  }

  // 验证太阳辐射数据
  const solarValues = climateData.solar.map(d => d.value).filter(v => !isNaN(v) && v > 0);
  if (solarValues.length === 0) {
    return {
      isValid: false,
      error: 'No valid solar radiation data',
      errorComponent: (
        <div className="chart-error">
          <p>No valid solar radiation data available</p>
          <small>Raw data points: {solarLength}</small>
        </div>
      )
    };
  }

  // 验证温度数据
  const tempValues = climateData.temperature.map(d => d.value).filter(v => !isNaN(v));
  if (tempValues.length === 0) {
    return {
      isValid: false,
      error: 'No valid temperature data',
      errorComponent: (
        <div className="chart-error">
          <p>No valid temperature data available</p>
          <small>Raw data points: {tempLength}</small>
        </div>
      )
    };
  }

  return { isValid: true, error: null, errorComponent: null };
};

/**
 * 图表配置常量
 */
export const CHART_CONFIG = {
  width: 700,
  height: 400,
  padding: 80,
  colors: {
    solar: '#f1c40f', // 更亮的黄色，从 '#f39c12' 改为 '#f1c40f'
    temperature: '#3498db', // 从 '#e74c3c' 改为蓝色
    grid: '#e8e8e8',
    verticalGrid: '#f0f0f0'
  },
  gradients: {
    solar: 'solarGradient',
    temperature: 'tempGradient'
  }
};

/**
 * 计算统计数据
 * @param {Array} values - 数值数组
 * @param {Array} data - 原始数据数组
 * @returns {Object} 统计信息
 */
export const calculateStats = (values, data) => {
  if (values.length === 0) return null;
  
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const maxValue = Math.max(...values);
  const maxIndex = values.indexOf(maxValue);
  const peakMonth = data[maxIndex]?.month || 'Unknown';
  
  return {
    average: average.toFixed(1),
    peakMonth,
    dataPoints: values.length
  };
}; 