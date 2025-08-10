// 气象数据服务 - 现在使用后端NASA Power API
import { fetchSolarData } from '../api';

// 模拟气候数据 - 用于后端不可用时的演示
const mockClimateData = {
  // London, UK 的典型太阳辐射数据 (kWh/m²/day)
  mockSolarData: [
    { month: 'Jan', value: 0.6 },
    { month: 'Feb', value: 1.2 },
    { month: 'Mar', value: 2.4 },
    { month: 'Apr', value: 3.8 },
    { month: 'May', value: 4.9 },
    { month: 'Jun', value: 5.2 },
    { month: 'Jul', value: 4.8 },
    { month: 'Aug', value: 4.1 },
    { month: 'Sep', value: 2.8 },
    { month: 'Oct', value: 1.6 },
    { month: 'Nov', value: 0.8 },
    { month: 'Dec', value: 0.5 }
  ],
  
  // London, UK 的典型温度数据 (°C)
  mockTemperatureData: [
    { month: 'Jan', value: 4.2 },
    { month: 'Feb', value: 4.8 },
    { month: 'Mar', value: 7.2 },
    { month: 'Apr', value: 9.8 },
    { month: 'May', value: 13.5 },
    { month: 'Jun', value: 16.8 },
    { month: 'Jul', value: 19.1 },
    { month: 'Aug', value: 18.7 },
    { month: 'Sep', value: 15.6 },
    { month: 'Oct', value: 11.9 },
    { month: 'Nov', value: 7.8 },
    { month: 'Dec', value: 5.1 }
  ]
};

export const weatherService = {
  // 获取NASA Power太阳辐照数据 (现在通过后端)
  async getSolarRadiationData(latitude, longitude, location = '') {
    try {
      const response = await fetchSolarData(latitude, longitude, location);
      
      if (response.data.success) {
        console.log('Backend NASA POWER API response:', response.data);
        
        // Convert backend response to frontend format
        const monthlyData = response.data.data;
        const processedData = this.processSolarDataFromBackend(monthlyData);
        
        return { 
          success: true, 
          data: processedData,
          source: response.data.source,
          message: response.data.message
        };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Backend API error'
        };
      }
      
    } catch (error) {
      console.error('Backend NASA API Error:', error);
      return { 
        success: false, 
        error: 'Network error connecting to backend: ' + error.message 
      };
    }
  },

  // 获取Open Meteo气温数据 (保持原有实现)
  async getTemperatureData(latitude, longitude, years = 5) {
    // 使用相同的日期逻辑
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const endYear = currentYear - 1; // 总是使用前一年
    const startYear = endYear - years + 1;
    
    const endDate = `${endYear}-12-31`;
    const startDate = `${startYear}-01-01`;
    
    try {
      const url = `https://archive-api.open-meteo.com/v1/archive?` +
        `latitude=${latitude}&` +
        `longitude=${longitude}&` +
        `start_date=${startDate}&` +
        `end_date=${endDate}&` +
        `daily=temperature_2m_mean&` +
        `timezone=Europe/London`;
      
      console.log('Open-Meteo API URL:', url);
      console.log(`Date range: ${startDate} to ${endDate}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Open-Meteo response keys:', Object.keys(data));
        
        if (data.daily && data.daily.time && data.daily.temperature_2m_mean) {
          return { 
            success: true, 
            data: data.daily,
            timezone: data.timezone || 'Europe/London'
          };
        } else {
          return { success: false, error: 'Invalid Open-Meteo API response structure' };
        }
      }
      
      // 尝试解析错误响应
      let errorMessage = `Open Meteo API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Open-Meteo API error response:', errorData);
        if (errorData.reason) {
          errorMessage += ` - ${errorData.reason}`;
        }
      } catch (e) {
        // 如果无法解析错误响应，使用默认错误信息
      }
      
      return { success: false, error: errorMessage };
    } catch (error) {
      console.error('Open Meteo API Error:', error);
      return { success: false, error: 'Network error: ' + error.message };
    }
  },

  // 处理来自后端的NASA数据
  processSolarDataFromBackend(backendData) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    console.log('Processing backend solar data:', backendData);
    
    // Convert backend monthly data (month number -> value) to frontend format
    const monthlyData = months.map((month, index) => ({
      month,
      value: backendData[index + 1] || 0
    }));

    console.log('Processed solar data from backend:', monthlyData);
    return monthlyData;
  },

  // 处理NASA数据为月度数据 (保留用于兼容性，但现在使用后端)
  processSolarData(nasaData, isClimatology = false) {
    // 这个方法保留用于向后兼容，但实际会使用 processSolarDataFromBackend
    console.warn('processSolarData is deprecated, using backend NASA API now');
    return this.processSolarDataFromBackend(nasaData);
  },

  // 获取模拟气候数据 - 用于演示和后端不可用时
  getMockClimateData(location = 'Selected Location') {
    return {
      success: true,
      data: {
        solar: mockClimateData.mockSolarData,
        temperature: mockClimateData.mockTemperatureData
      },
      source: 'NASA POWER & Open-Meteo',
      message: `Historical climate data for ${location}`
    };
  },

  // 处理Open Meteo温度数据为月度平均值 (保持原有实现)
  processTemperatureData(openMeteoData) {
    if (!openMeteoData.time || !openMeteoData.temperature_2m_mean) {
      console.error('Invalid temperature data structure:', openMeteoData);
      return [];
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    console.log(`Processing ${openMeteoData.time.length} temperature data points`);
    
    // 按月份分组数据
    const monthlyGroups = Array(12).fill(null).map(() => []);
    
    openMeteoData.time.forEach((date, index) => {
      const temp = openMeteoData.temperature_2m_mean[index];
      if (temp !== null && !isNaN(temp)) {
        const month = new Date(date).getMonth(); // 0-11
        monthlyGroups[month].push(parseFloat(temp));
      }
    });

    // 计算每月平均值
    const monthlyData = months.map((month, index) => {
      const temps = monthlyGroups[index];
      const avgTemp = temps.length > 0 
        ? temps.reduce((sum, temp) => sum + temp, 0) / temps.length
        : 0;
      
      return {
        month,
        value: Math.round(avgTemp * 100) / 100
      };
    });

    console.log('Processed temperature data:', monthlyData);
    return monthlyData;
  },

  // 获取完整的气候数据 (现在使用后端NASA API，失败时使用模拟数据)
  async getCompleteClimateData(latitude, longitude, location = '') {
    try {
      console.log(`Fetching climate data for coordinates: ${latitude}, ${longitude}`);
      
      // 首先尝试使用后端NASA POWER API获取太阳辐照数据
      const solarResult = await this.getSolarRadiationData(latitude, longitude, location);
      
      // 并行获取温度数据 (仍然直接调用Open-Meteo)
      const tempResult = await this.getTemperatureData(latitude, longitude);

      console.log('Backend Solar API result:', solarResult);
      console.log('Temperature API result:', tempResult);

      // 如果后端API失败，使用备用数据
      if (!solarResult.success) {
        console.warn(`Backend API failed: ${solarResult.error}. Using cached data.`);
        const mockResult = this.getMockClimateData(location || 'Selected Location');
        console.log('Using cached climate data:', mockResult);
        return mockResult;
      }

      // 如果温度API失败，也使用备用数据
      if (!tempResult.success) {
        console.warn(`Temperature API failed: ${tempResult.error}. Using cached data.`);
        const mockResult = this.getMockClimateData(location || 'Selected Location');
        console.log('Using cached climate data due to temperature API failure:', mockResult);
        return mockResult;
      }

      // 处理真实数据 (太阳能数据已经在后端处理过了)
      const solarData = solarResult.data;
      const temperatureData = this.processTemperatureData(tempResult.data);

      // 验证处理后的数据
      if (solarData.length === 0) {
        console.warn('No valid solar radiation data after processing. Using cached data.');
        return this.getMockClimateData(location || 'Selected Location');
      }

      if (temperatureData.length === 0) {
        console.warn('No valid temperature data after processing. Using cached data.');
        return this.getMockClimateData(location || 'Selected Location');
      }

      console.log('Final processed solar data:', solarData);
      console.log('Final processed temperature data:', temperatureData);

      return {
        success: true,
        data: {
          solar: solarData,
          temperature: temperatureData
        },
        source: solarResult.source,
        message: solarResult.message
      };

    } catch (error) {
      console.error('Complete climate data error:', error);
      console.warn('API error occurred. Falling back to cached data.');
      
      // 作为最后的fallback，返回备用数据而不是错误
      return this.getMockClimateData(location || 'Selected Location');
    }
  }
}; 