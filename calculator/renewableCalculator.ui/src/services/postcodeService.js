// 邮编服务 - 使用postcodes.io API
export const postcodeService = {
  // 验证并获取邮编信息
  async validatePostcode(postcode) {
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: {
            postcode: data.result.postcode,
            latitude: data.result.latitude,
            longitude: data.result.longitude,
            country: data.result.country,
            region: data.result.region,
            admin_district: data.result.admin_district,
            admin_county: data.result.admin_county
          }
        };
      } else {
        return { success: false, error: 'Invalid postcode' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // 批量验证邮编
  async validateMultiplePostcodes(postcodes) {
    try {
      const response = await fetch('https://api.postcodes.io/postcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcodes })
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data.result };
      }
      return { success: false, error: 'Validation failed' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}; 