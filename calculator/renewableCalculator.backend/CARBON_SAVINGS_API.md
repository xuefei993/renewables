# Carbon Savings API Documentation

## Overview
This API calculates monthly carbon emissions savings for renewable energy systems based on the UK 2025 emission factors. The calculation implements **Scope 1 (Direct)** and **Scope 2 (Indirect)** emissions according to the GHG Protocol standards.

## Formulas
Based on the specification document:

### 1. Direct Emissions Savings (Scope 1)
**Formula**: `CSdirect,save = Egas × 0.183`
- **Egas**: Monthly gas consumption replaced by heat pump (kWh)
- **0.183**: UK 2025 gas emission factor (kgCO₂/kWh)

### 2. Indirect Emissions Before Upgrade (Scope 2)
**Formula**: `CSbefore = Etotal × 0.148`
- **Etotal**: Total electricity demand before upgrade (kWh)
- **0.148**: UK 2025 electricity grid emission factor (kgCO₂/kWh)

### 3. Indirect Emissions After Upgrade (Scope 2)
**Formula**: `CSindirect,after = (Etotal - Esolar,cm - Eheat_pump + Dhot_water + Dheating,m) × 0.148`

Where:
- **Esolar,cm**: Solar self-consumed energy (reduces grid demand)
- **Eheat_pump**: Electricity saved by heat pump efficiency
- **Dhot_water**: Hot water heat pump electricity usage (increases grid demand)
- **Dheating,m**: Heating heat pump electricity usage (increases grid demand)

## API Endpoints

### 1. Calculate Monthly Carbon Savings (POST)
**Endpoint**: `POST /api/carbon/savings/monthly`

**Request Body**:
```json
{
  "hasSolarPanels": true,
  "hasHeatPump": true,
  "hasBattery": false,
  "month": 6,
  "totalElectricityDemandKwh": 400.0,
  "gasConsumptionKwh": 200.0,
  "solarSelfConsumedKwh": 150.0,
  "heatPumpElectricitySavedKwh": 50.0,
  "hotWaterHeatPumpUsageKwh": 30.0,
  "heatingHeatPumpUsageKwh": 40.0,
  "gasEmissionFactor": 0.183,
  "electricityEmissionFactor": 0.148
}
```

**Response**:
```json
{
  "totalCarbonSavingsKgCO2": 42.58,
  "directEmissionsSavingsKgCO2": 36.6,
  "gasConsumptionReplacedKwh": 200.0,
  "indirectEmissionsBeforeKgCO2": 59.2,
  "totalElectricityBeforeKwh": 400.0,
  "indirectEmissionsAfterKgCO2": 53.22,
  "totalElectricityAfterKwh": 359.6,
  "indirectEmissionsSavingsKgCO2": 5.98,
  "solarSelfConsumedKwh": 150.0,
  "heatPumpElectricitySavedKwh": 50.0,
  "hotWaterHeatPumpUsageKwh": 30.0,
  "heatingHeatPumpUsageKwh": 40.0,
  "hasSolarPanels": true,
  "hasHeatPump": true,
  "hasBattery": false,
  "month": 6,
  "gasEmissionFactor": 0.183,
  "electricityEmissionFactor": 0.148,
  "carbonReductionPercentage": 44.3
}
```

### 2. Quick Carbon Savings (GET)
**Endpoint**: `GET /api/carbon/savings/monthly/quick`

**Parameters**:
- `hasSolar` (boolean, default: false)
- `hasHeatPump` (boolean, default: false)
- `hasBattery` (boolean, default: false)
- `month` (integer, 1-12)
- `electricityDemand` (double, default: 300)
- `gasConsumption` (double, default: 0)
- `solarSelfConsumed` (double, default: 0)
- `heatPumpElectricitySaved` (double, default: 0)
- `hotWaterHeatPumpUsage` (double, default: 0)
- `heatingHeatPumpUsage` (double, default: 0)

**Example**: 
```
GET /api/carbon/savings/monthly/quick?hasSolar=true&hasHeatPump=true&month=6&electricityDemand=400&gasConsumption=200&solarSelfConsumed=150
```

### 3. Get Emission Factors
**Endpoint**: `GET /api/carbon/emission-factors`

**Response**:
```json
{
  "gasEmissionFactor": 0.183,
  "electricityEmissionFactor": 0.148,
  "gasSource": "UK 2025 gas emission factor",
  "electricitySource": "UK 2025 electricity grid emission factor",
  "scope1Description": "Direct emissions from gas combustion",
  "scope2Description": "Indirect emissions from electricity consumption"
}
```

## Calculation Examples

### Example 1: 仅太阳能板安装
**输入**:
- 总电力需求: 300 kWh/月
- 太阳能自消费: 150 kWh/月
- 无热泵和蓄电池

**计算过程**:
1. **直接排放节省**: 0 kgCO₂ (无热泵)
2. **升级前间接排放**: 300 × 0.148 = 44.4 kgCO₂
3. **升级后间接排放**: (300 - 150) × 0.148 = 22.2 kgCO₂
4. **间接排放节省**: 44.4 - 22.2 = 22.2 kgCO₂
5. **总碳排放节省**: 0 + 22.2 = **22.2 kgCO₂**

### Example 2: 仅热泵安装
**输入**:
- 总电力需求: 400 kWh/月
- 替代天然气: 200 kWh/月
- 热泵额外用电: 80 kWh/月 (热水30 + 供暖50)

**计算过程**:
1. **直接排放节省**: 200 × 0.183 = 36.6 kgCO₂
2. **升级前间接排放**: 400 × 0.148 = 59.2 kgCO₂
3. **升级后间接排放**: (400 + 80) × 0.148 = 71.04 kgCO₂
4. **间接排放变化**: 59.2 - 71.04 = -11.84 kgCO₂ (增加)
5. **总碳排放节省**: 36.6 + (-11.84) = **24.76 kgCO₂**

### Example 3: 太阳能板 + 热泵组合
**输入**:
- 总电力需求: 400 kWh/月
- 替代天然气: 150 kWh/月
- 太阳能自消费: 100 kWh/月
- 热泵节电: 50 kWh/月
- 热泵额外用电: 65 kWh/月 (热水25 + 供暖40)

**计算过程**:
1. **直接排放节省**: 150 × 0.183 = 27.45 kgCO₂
2. **升级前间接排放**: 400 × 0.148 = 59.2 kgCO₂
3. **升级后间接排放**: (400 - 100 - 50 + 65) × 0.148 = 46.62 kgCO₂
4. **间接排放节省**: 59.2 - 46.62 = 12.58 kgCO₂
5. **总碳排放节省**: 27.45 + 12.58 = **40.03 kgCO₂**

## Equipment Logic

### 🔴 **重要**: 未安装设备的碳排放影响为0
```javascript
if (!hasSolarPanels) {
  solarSelfConsumedKwh = 0;
}
if (!hasHeatPump) {
  directEmissionsSavings = 0;
  heatPumpElectricitySaved = 0;
  hotWaterHeatPumpUsage = 0;
  heatingHeatPumpUsage = 0;
}
```

## Frontend Integration Example

### JavaScript Usage
```javascript
const calculateCarbonSavings = async (equipmentConfig, energyData) => {
  try {
    const response = await fetch('http://localhost:8080/api/carbon/savings/monthly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hasSolarPanels: equipmentConfig.solar,
        hasHeatPump: equipmentConfig.heatPump,
        hasBattery: equipmentConfig.battery,
        month: new Date().getMonth() + 1,
        totalElectricityDemandKwh: energyData.electricityDemand,
        gasConsumptionKwh: equipmentConfig.heatPump ? energyData.gasConsumption : 0,
        solarSelfConsumedKwh: equipmentConfig.solar ? energyData.solarSelfConsumed : 0,
        heatPumpElectricitySavedKwh: equipmentConfig.heatPump ? energyData.heatPumpSaved : 0,
        hotWaterHeatPumpUsageKwh: equipmentConfig.heatPump ? energyData.hotWaterUsage : 0,
        heatingHeatPumpUsageKwh: equipmentConfig.heatPump ? energyData.heatingUsage : 0
      })
    });
    
    const result = await response.json();
    
    console.log(`总碳排放节省: ${result.totalCarbonSavingsKgCO2.toFixed(2)} kgCO₂`);
    console.log(`直接排放节省: ${result.directEmissionsSavingsKgCO2.toFixed(2)} kgCO₂`);
    console.log(`间接排放节省: ${result.indirectEmissionsSavingsKgCO2.toFixed(2)} kgCO₂`);
    console.log(`碳减排百分比: ${result.carbonReductionPercentage.toFixed(1)}%`);
    
    return result;
  } catch (error) {
    console.error('计算碳排放节省失败:', error);
  }
};

// 使用示例
const userEquipment = {
  solar: true,
  heatPump: true,
  battery: false
};

const userEnergyData = {
  electricityDemand: 400,
  gasConsumption: 200,
  solarSelfConsumed: 150,
  heatPumpSaved: 50,
  hotWaterUsage: 30,
  heatingUsage: 40
};

calculateCarbonSavings(userEquipment, userEnergyData);
```

### React Component Integration
```jsx
import React, { useState, useEffect } from 'react';

const CarbonSavingsDisplay = ({ selectedEquipment, energyData }) => {
  const [carbonSavings, setCarbonSavings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calculateSavings = async () => {
      setLoading(true);
      try {
        const result = await calculateCarbonSavings(selectedEquipment, energyData);
        setCarbonSavings(result);
      } catch (error) {
        console.error('Carbon savings calculation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedEquipment && energyData) {
      calculateSavings();
    }
  }, [selectedEquipment, energyData]);

  if (loading) return <div>Calculating carbon savings...</div>;
  if (!carbonSavings) return <div>No data available</div>;

  return (
    <div className="carbon-savings-card">
      <h3>Monthly Carbon Savings</h3>
      
      <div className="savings-summary">
        <div className="total-savings">
          <span className="value">{carbonSavings.totalCarbonSavingsKgCO2.toFixed(1)}</span>
          <span className="unit">kgCO₂ saved</span>
          <span className="percentage">({carbonSavings.carbonReductionPercentage.toFixed(1)}% reduction)</span>
        </div>
      </div>
      
      <div className="savings-breakdown">
        <div className="breakdown-item">
          <span className="label">Direct Emissions (Scope 1):</span>
          <span className="value">{carbonSavings.directEmissionsSavingsKgCO2.toFixed(1)} kgCO₂</span>
        </div>
        <div className="breakdown-item">
          <span className="label">Indirect Emissions (Scope 2):</span>
          <span className="value">{carbonSavings.indirectEmissionsSavingsKgCO2.toFixed(1)} kgCO₂</span>
        </div>
      </div>
      
      <div className="emissions-comparison">
        <div className="before-after">
          <span>Before: {carbonSavings.indirectEmissionsBeforeKgCO2.toFixed(1)} kgCO₂</span>
          <span>After: {carbonSavings.indirectEmissionsAfterKgCO2.toFixed(1)} kgCO₂</span>
        </div>
      </div>
    </div>
  );
};

export default CarbonSavingsDisplay;
```

## Error Handling

### 400 Bad Request
- 月份不在 1-12 范围内
- 必需参数缺失或无效

### 500 Internal Server Error
- 服务器计算错误
- 意外异常

## UK Emission Factors (2025)

| Energy Source | Emission Factor | Unit | Scope |
|---------------|-----------------|------|-------|
| Natural Gas | 0.183 | kgCO₂/kWh | Scope 1 (Direct) |
| Electricity Grid | 0.148 | kgCO₂/kWh | Scope 2 (Indirect) |

**来源**: 
- UK Government conversion factors for company reporting
- GHG Protocol standards for Scope 1 and Scope 2 emissions

## Integration with System Configuration

此API与前端的System Configuration组件和其他计算模块完美集成：

1. **设备选择同步**: 只有选中的设备才会计算碳排放影响
2. **实时计算**: 配合Monthly Savings API提供完整的经济和环境分析
3. **详细分解**: 区分直接和间接排放，帮助用户理解环境影响
4. **百分比显示**: 清晰展示碳减排效果

## Testing

运行测试验证实现：
```bash
mvn test -Dtest=CarbonSavingsServiceTest
```

所有测试应通过，验证：
- 未安装设备的碳排放影响为0
- 公式计算正确性
- 边界条件处理
- 百分比计算准确性 