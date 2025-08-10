// 地理定位服务
export const locationService = {
  // 获取用户当前位置
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({ success: false, error: 'Geolocation not supported' });
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分钟缓存
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            success: true,
            data: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          });
        },
        (error) => {
          let errorMessage = 'Location access denied';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          reject({ success: false, error: errorMessage });
        },
        options
      );
    });
  },

  // 将坐标转换为邮编（反向地理编码）
  async coordinatesToPostcode(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          return {
            success: true,
            data: {
              postcode: data.result[0].postcode,
              distance: data.result[0].distance
            }
          };
        }
      }
      return { success: false, error: 'No postcode found for coordinates' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}; 