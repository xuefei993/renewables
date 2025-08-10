# Monthly Savings API Documentation

## Overview
This API calculates monthly savings for renewable energy systems based on the formula from the specification document. The calculation follows the principle that **if equipment is not installed, its savings contribution is 0**.

## Formula
**主公式**: `Stm = Ssolar,m + Sheat pump,m + Sbattery,m + Ssupport,m`

其中：
- `Stm`: 总月度节省费用
- `Ssolar,m`: 太阳能板月度节省费用
- `Sheat pump,m`: 热泵月度节省费用  
- `Sbattery,m`: 蓄电池月度节省费用
- `Ssupport,m`: 支持设备月度节省费用

### Self-Consumption Rate (SCR) 计算
基于用户在家时间模式：
- **s=1** (在家大部分时间): SCR=**50%**
- **s=0.5** (在家一半时间): SCR=**40%**
- **s=0** (大部分时间不在家): SCR=**30%**

## API Endpoints

### 1. Calculate Monthly Savings (POST)
**Endpoint**: `POST /api/savings/monthly`

**Request Body**:
```json
{
  "hasSolarPanels": true,
  "hasHeatPump": true,
  "hasBattery": false,
  "hasSupportEquipment": false,
  "month": 6,
  "homeOccupancyFactor": 1.0,
  "solarGenerationKwh": 400.0,
  "monthlyElectricityUsageKwh": 300.0,
  "electricityRate": 30.0,
  "exportRate": 5.0,
  "gasConsumptionKwh": 200.0,
  "gasRate": 8.0,
  "heatPumpCop": 4.0,
  "batteryCapacityKwh": 10.0,
  "peakElectricityRate": 40.0,
  "offPeakElectricityRate": 15.0,
  "supportEquipmentSavings": 500.0
}
```

**Response**:
```json
{
  "totalMonthlySavings": 8250.0,
  "solarSavings": 5750.0,
  "heatPumpSavings": 1000.0,
  "batterySavings": 0.0,
  "supportEquipmentSavings": 0.0,
  "selfConsumptionRate": 50.0,
  "solarSelfConsumedKwh": 150.0,
  "solarExportedKwh": 250.0,
  "solarSelfConsumptionSavings": 4500.0,
  "solarExportSavings": 1250.0,
  "gasReplacedKwh": 200.0,
  "heatPumpElectricityUsedKwh": 50.0,
  "netHeatPumpSavings": 1000.0,
  "batteryStoredEnergyKwh": 0.0,
  "peakShiftingSavings": 0.0,
  "hasSolarPanels": true,
  "hasHeatPump": true,
  "hasBattery": false,
  "hasSupportEquipment": false,
  "month": 6,
  "homeOccupancyFactor": 1.0
}
```

### 2. Quick Monthly Savings (GET)
**Endpoint**: `GET /api/savings/monthly/quick`

**Parameters**:
- `hasSolar` (boolean, default: false)
- `hasHeatPump` (boolean, default: false)
- `hasBattery` (boolean, default: false)
- `hasSupport` (boolean, default: false)
- `month` (integer, 1-12)
- `homeOccupancy` (double, 0-1, default: 0.5)
- `solarGeneration` (double, default: 0)
- `electricityUsage` (double, default: 300)
- `electricityRate` (double, default: 30)

**Example**: 
```
GET /api/savings/monthly/quick?hasSolar=true&month=6&homeOccupancy=1.0&solarGeneration=400&electricityUsage=300&electricityRate=30
```

## Calculation Examples

### Example 1: 仅太阳能板 (s=1, SCR=50%)
**输入**:
- 太阳能发电: 400 kWh/月
- 电力消费: 300 kWh/月
- 电价: 30 便士/kWh
- 出口电价: 5 便士/kWh
- 在家时间: 全天 (s=1)

**计算过程**:
1. SCR = 50% (因为 s=1)
2. 自消费电量 = min(400, 300 × 0.5) = 150 kWh
3. 出口电量 = 400 - 150 = 250 kWh
4. 自消费节省 = 150 × 30 = 4,500 便士
5. 出口收入 = 250 × 5 = 1,250 便士
6. **总节省 = 4,500 + 1,250 = 5,750 便士**

### Example 2: 热泵计算
**输入**:
- 替代天然气: 200 kWh/月
- 天然气价格: 8 便士/kWh
- 电价: 30 便士/kWh
- 热泵COP: 4.0

**计算过程**:
1. 节省的天然气费用 = 200 × 8 = 1,600 便士
2. 热泵耗电 = 200 ÷ 4.0 = 50 kWh
3. 热泵电费 = 50 × 30 = 1,500 便士
4. **净节省 = 1,600 - 1,500 = 100 便士**

### Example 3: 蓄电池峰谷差价
**输入**:
- 电池容量: 10 kWh
- 峰期电价: 40 便士/kWh
- 谷期电价: 15 便士/kWh

**计算过程**:
1. 月度储能 = 10 × 30 × 0.9 = 270 kWh (90%效率)
2. 峰谷差价节省 = (40 - 15) × 270 = 6,750 便士

## Equipment Selection Logic

### 🔴 **重要**: 未安装设备的节省费用为 0
```javascript
if (!hasSolarPanels) {
  solarSavings = 0;
}
if (!hasHeatPump) {
  heatPumpSavings = 0;
}
if (!hasBattery) {
  batterySavings = 0;
}
if (!hasSupportEquipment) {
  supportEquipmentSavings = 0;
}
```

## Frontend Integration Example

### JavaScript Usage
```javascript
const calculateMonthlySavings = async (equipmentConfig) => {
  try {
    const response = await fetch('http://localhost:8080/api/savings/monthly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hasSolarPanels: equipmentConfig.solar,
        hasHeatPump: equipmentConfig.heatPump,
        hasBattery: equipmentConfig.battery,
        hasSupportEquipment: false,
        month: new Date().getMonth() + 1,
        homeOccupancyFactor: 0.5, // User-configurable
        solarGenerationKwh: equipmentConfig.solar ? 350 : 0,
        monthlyElectricityUsageKwh: 300,
        electricityRate: 30,
        exportRate: 5,
        gasConsumptionKwh: equipmentConfig.heatPump ? 200 : 0,
        gasRate: 7,
        heatPumpCop: 3.5,
        batteryCapacityKwh: equipmentConfig.battery ? 10 : 0,
        peakElectricityRate: 40,
        offPeakElectricityRate: 15
      })
    });
    
    const result = await response.json();
    console.log(`总月度节省: £${(result.totalMonthlySavings / 100).toFixed(2)}`);
    console.log(`太阳能节省: £${(result.solarSavings / 100).toFixed(2)}`);
    console.log(`热泵节省: £${(result.heatPumpSavings / 100).toFixed(2)}`);
    console.log(`蓄电池节省: £${(result.batterySavings / 100).toFixed(2)}`);
    
    return result;
  } catch (error) {
    console.error('计算月度节省失败:', error);
  }
};

// 使用示例
const userSelection = {
  solar: true,
  heatPump: false,  // 未选择热泵，其节省费用将为0
  battery: true
};

calculateMonthlySavings(userSelection);
```

## Error Handling

### 400 Bad Request
- 月份不在 1-12 范围内
- 必需参数缺失
- 参数值无效

### 500 Internal Server Error
- 服务器计算错误
- 意外异常

## Integration with System Configuration

此API与前端的System Configuration组件完美集成：

1. **设备选择同步**: 用户在UI中选择的设备直接影响计算结果
2. **实时计算**: 当用户改变设备配置时，可实时更新节省预测
3. **详细分解**: 提供每个设备的具体贡献，帮助用户理解投资价值

## Testing

运行测试验证实现：
```bash
mvn test -Dtest=MonthlySavingsServiceTest
```

所有测试应通过，验证：
- 未安装设备的节省费用为0
- SCR计算正确 (30%, 40%, 50%)
- 各设备节省计算准确
- 总节省 = 各设备节省之和 