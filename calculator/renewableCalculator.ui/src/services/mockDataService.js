// 模拟数据服务 - 为所有后端API提供fallback数据
export const mockDataService = {
  
  // 模拟太阳能潜力计算结果
  getSolarPotentialResult(request) {
    return {
      solarPotential: 85.6,
      shadingFactor: 0.9,
      utilisationFactor: 0.85,
      tiltOrientationFactor: 0.95,
      solarPanelCount: Math.floor((request.roofSize || 50) / 2)
    };
  },

  // 模拟位置信息
  getLocationData() {
    return [
      {
        id: 1,
        name: "London",
        postcode: "SW1A 1AA",
        country: "England",
        region: "Greater London",
        latitude: 51.5074,
        longitude: -0.1278
      },
      {
        id: 2,
        name: "Manchester",
        postcode: "M1 1AA",
        country: "England", 
        region: "Greater Manchester",
        latitude: 53.4808,
        longitude: -2.2426
      },
      {
        id: 3,
        name: "Birmingham",
        postcode: "B1 1AA",
        country: "England",
        region: "West Midlands", 
        latitude: 52.4862,
        longitude: -1.8904
      }
    ];
  },

  // 模拟太阳能板类型数据
  getSolarPanelTypes() {
    return [
      {
        id: 1,
        name: "Monocrystalline Premium",
        efficiency: 22.0,
        ratedPowerPerPanel: 450,
        price: 380,
        costPerWatt: 0.85,
        warrantyYears: 25
      },
      {
        id: 2, 
        name: "Monocrystalline Standard",
        efficiency: 20.5,
        ratedPowerPerPanel: 410,
        price: 310,
        costPerWatt: 0.75,
        warrantyYears: 25
      },
      {
        id: 3,
        name: "Polycrystalline", 
        efficiency: 18.5,
        ratedPowerPerPanel: 370,
        price: 240,
        costPerWatt: 0.65,
        warrantyYears: 20
      }
    ];
  },

  // 模拟总安装容量计算
  getTotalInstalledCapacity(data) {
    const panelCount = data.solarPanelCount || 20;
    const panelWattage = data.panelWattage || 410;
    return {
      totalCapacity: (panelCount * panelWattage) / 1000, // kW
      panelCount: panelCount,
      panelWattage: panelWattage,
      systemEfficiency: 0.85
    };
  },

  // 模拟月度发电量
  getMonthlyElectricityGeneration(data) {
    const capacity = data.totalCapacity || 8.2;
    return {
      monthlyGeneration: [
        { month: 1, generation: capacity * 45 },
        { month: 2, generation: capacity * 65 },
        { month: 3, generation: capacity * 95 },
        { month: 4, generation: capacity * 125 },
        { month: 5, generation: capacity * 145 },
        { month: 6, generation: capacity * 155 },
        { month: 7, generation: capacity * 150 },
        { month: 8, generation: capacity * 135 },
        { month: 9, generation: capacity * 110 },
        { month: 10, generation: capacity * 80 },
        { month: 11, generation: capacity * 50 },
        { month: 12, generation: capacity * 35 }
      ],
      annualGeneration: capacity * 1200,
      systemCapacity: capacity
    };
  },

  // 模拟电力需求计算
  getElectricityDemand(data) {
    const baseUsage = data.annualUsage || 3500;
    const monthlyData = {
      1: Math.round(baseUsage * 0.09),
      2: Math.round(baseUsage * 0.08),
      3: Math.round(baseUsage * 0.08),
      4: Math.round(baseUsage * 0.07),
      5: Math.round(baseUsage * 0.07),
      6: Math.round(baseUsage * 0.07),
      7: Math.round(baseUsage * 0.08),
      8: Math.round(baseUsage * 0.08),
      9: Math.round(baseUsage * 0.08),
      10: Math.round(baseUsage * 0.09),
      11: Math.round(baseUsage * 0.10),
      12: Math.round(baseUsage * 0.11)
    };
    
    const monthlyValues = Object.values(monthlyData);
    const maxValue = Math.max(...monthlyValues);
    const minValue = Math.min(...monthlyValues);
    const peakMonth = Object.keys(monthlyData).find(key => monthlyData[key] === maxValue);
    const lowMonth = Object.keys(monthlyData).find(key => monthlyData[key] === minValue);
    
    return {
      annualElectricityDemand: baseUsage,
      monthlyElectricityDemand: monthlyData,
      peakMonthDemand: maxValue,
      peakMonth: parseInt(peakMonth),
      lowMonthDemand: minValue,
      lowMonth: parseInt(lowMonth),
      calculationMethod: 'estimated'
    };
  },

  // 模拟燃气需求计算  
  getGasDemand(data) {
    const baseUsage = data.annualUsage || 12000;
    const monthlyData = {
      1: Math.round(baseUsage * 0.15),
      2: Math.round(baseUsage * 0.13),
      3: Math.round(baseUsage * 0.11),
      4: Math.round(baseUsage * 0.08),
      5: Math.round(baseUsage * 0.05),
      6: Math.round(baseUsage * 0.03),
      7: Math.round(baseUsage * 0.03),
      8: Math.round(baseUsage * 0.03),
      9: Math.round(baseUsage * 0.05),
      10: Math.round(baseUsage * 0.08),
      11: Math.round(baseUsage * 0.12),
      12: Math.round(baseUsage * 0.14)
    };
    
    const monthlyValues = Object.values(monthlyData);
    const maxValue = Math.max(...monthlyValues);
    const minValue = Math.min(...monthlyValues);
    const peakMonth = Object.keys(monthlyData).find(key => monthlyData[key] === maxValue);
    const lowMonth = Object.keys(monthlyData).find(key => monthlyData[key] === minValue);
    
    return {
      annualGasDemand: baseUsage,
      monthlyGasDemand: monthlyData,
      peakMonthDemand: maxValue,
      peakMonth: parseInt(peakMonth),
      lowMonthDemand: minValue,
      lowMonth: parseInt(lowMonth),
      calculationMethod: 'estimated'
    };
  },

  // 模拟太阳能安装成本
  getSolarInstallationCost(data) {
    const systemSize = data.systemSize || 8.2;
    const baseCostPerKW = 1850;
    const totalCost = systemSize * baseCostPerKW;
    
    return {
      systemSize: systemSize,
      equipmentCost: totalCost * 0.6,
      installationCost: totalCost * 0.25,
      permitsCost: totalCost * 0.05,
      otherCosts: totalCost * 0.1,
      totalCost: totalCost,
      costPerKW: baseCostPerKW,
      paybackPeriod: 8.5,
      roi: 12.8
    };
  },

  // 模拟月度节约计算
  getMonthlySavings(data) {
    const monthlyGeneration = data.monthlyGeneration || 685;
    const electricityRate = data.electricityRate || 0.28;
    const exportRate = data.exportRate || 0.15;
    
    return {
      monthlySavings: [
        { month: 1, savings: monthlyGeneration * 0.4 * electricityRate + monthlyGeneration * 0.6 * exportRate },
        { month: 2, savings: monthlyGeneration * 0.5 * electricityRate + monthlyGeneration * 0.5 * exportRate },
        { month: 3, savings: monthlyGeneration * 0.6 * electricityRate + monthlyGeneration * 0.4 * exportRate },
        { month: 4, savings: monthlyGeneration * 0.7 * electricityRate + monthlyGeneration * 0.3 * exportRate },
        { month: 5, savings: monthlyGeneration * 0.8 * electricityRate + monthlyGeneration * 0.2 * exportRate },
        { month: 6, savings: monthlyGeneration * 0.8 * electricityRate + monthlyGeneration * 0.2 * exportRate },
        { month: 7, savings: monthlyGeneration * 0.75 * electricityRate + monthlyGeneration * 0.25 * exportRate },
        { month: 8, savings: monthlyGeneration * 0.7 * electricityRate + monthlyGeneration * 0.3 * exportRate },
        { month: 9, savings: monthlyGeneration * 0.65 * electricityRate + monthlyGeneration * 0.35 * exportRate },
        { month: 10, savings: monthlyGeneration * 0.55 * electricityRate + monthlyGeneration * 0.45 * exportRate },
        { month: 11, savings: monthlyGeneration * 0.45 * electricityRate + monthlyGeneration * 0.55 * exportRate },
        { month: 12, savings: monthlyGeneration * 0.35 * electricityRate + monthlyGeneration * 0.65 * exportRate }
      ],
      annualSavings: monthlyGeneration * 12 * ((0.6 * electricityRate) + (0.4 * exportRate)),
      selfConsumptionRate: 0.6,
      exportRate: 0.4
    };
  },

  // 模拟碳排放节约
  getCarbonSavings(data) {
    const annualGeneration = data.annualGeneration || 8220;
    const carbonIntensity = 0.233; // kg CO2/kWh UK grid average
    
    return {
      annualCarbonSaved: annualGeneration * carbonIntensity,
      lifetimeCarbonSaved: annualGeneration * carbonIntensity * 25,
      equivalentTrees: Math.round(annualGeneration * carbonIntensity / 21.8),
      equivalentCars: Math.round(annualGeneration * carbonIntensity / 4600),
      carbonIntensity: carbonIntensity
    };
  },

  // 模拟设备对比
  getEquipmentComparison(data) {
    const solarPanels = this.getSolarPanelTypes();
    const heatPumps = this.getHeatPumps();
    const batteries = this.getBatteries();
    
    // 根据选择的设备ID获取对应的价格和性能
    const getSolarPanelData = (panelId) => {
      const panel = solarPanels.find(p => p.id == panelId);
      if (!panel) return { cost: 12500, generation: 8200, savings: 1250, export: 350, co2: 2100 };
      
      // 计算系统规模
      const panelCount = Math.floor((data.roofArea || 60) / 2); // 假设每块板2平米
      const systemSizeKW = (panelCount * panel.ratedPowerPerPanel) / 1000;
      
      // 成本计算
      const systemCost = panel.price * panelCount;
      const installationCost = systemCost * 0.3;
      const totalCost = Math.round(systemCost + installationCost);
      
      // 发电量计算（基于效率）
      const baseGeneration = 8200;
      const generationMultiplier = panel.efficiency / 20.5; // 以Standard面板为基准
      const annualGeneration = Math.round(baseGeneration * generationMultiplier * (systemSizeKW / 8.2));
      
      // 节约和收入计算
      const electricityRate = 0.28; // £/kWh
      const exportRate = 0.15; // £/kWh
      const selfUseRatio = 0.65; // 65%自用
      const exportRatio = 0.35; // 35%出口
      
      const annualSavings = Math.round(annualGeneration * selfUseRatio * electricityRate);
      const annualExport = Math.round(annualGeneration * exportRatio * exportRate);
      
      // CO2节约计算
      const co2Intensity = 0.233; // kg CO2/kWh
      const annualCO2 = Math.round(annualGeneration * co2Intensity);
      
      // 月度数据计算
      const monthlyPattern = [0.05, 0.07, 0.10, 0.13, 0.16, 0.17, 0.16, 0.15, 0.12, 0.08, 0.05, 0.04];
      const monthlyGeneration = monthlyPattern.map(ratio => Math.round(annualGeneration * ratio));
      const monthlySavings = monthlyGeneration.map(gen => Math.round(gen * selfUseRatio * electricityRate));
      const monthlyExport = monthlyGeneration.map(gen => Math.round(gen * exportRatio * exportRate));
      const monthlyCO2Direct = monthlyGeneration.map(gen => Math.round(gen * co2Intensity * 0.7));
      const monthlyCO2Indirect = monthlyGeneration.map(gen => Math.round(gen * co2Intensity * 0.3));
      
      return {
        cost: totalCost,
        generation: annualGeneration,
        savings: annualSavings,
        export: annualExport,
        co2: annualCO2,
        monthlyData: {
          generation: monthlyGeneration,
          savings: monthlySavings,
          export: monthlyExport,
          co2Direct: monthlyCO2Direct,
          co2Indirect: monthlyCO2Indirect
        }
      };
    };
    
    const getHeatPumpData = (heatPumpId) => {
      const heatPump = heatPumps.find(h => h.id == heatPumpId);
      if (!heatPump) return { cost: 10500, savings: 850, co2: 1800 };
      
      const totalCost = heatPump.cost + heatPump.installationCost;
      
      // 基于COP计算效率和节约
      const baseSavings = 850;
      const savingsMultiplier = heatPump.cop / 3.8; // 以Standard为基准
      const annualSavings = Math.round(baseSavings * savingsMultiplier);
      
      // CO2节约（热泵替代燃气）
      const baseCO2 = 1800;
      const co2Savings = Math.round(baseCO2 * savingsMultiplier);
      
      // 月度数据（冬季高，夏季低）
      const monthlyPattern = [0.15, 0.13, 0.11, 0.08, 0.05, 0.03, 0.03, 0.03, 0.05, 0.08, 0.12, 0.14];
      const monthlySavings = monthlyPattern.map(ratio => Math.round(annualSavings * ratio));
      const monthlyCO2 = monthlyPattern.map(ratio => Math.round(co2Savings * ratio));
      
      return {
        cost: totalCost,
        savings: annualSavings,
        co2: co2Savings,
        monthlyData: {
          savings: monthlySavings,
          co2Direct: monthlyCO2,
          co2Indirect: new Array(12).fill(0)
        }
      };
    };
    
    const getBatteryData = (batteryId) => {
      const battery = batteries.find(b => b.id == batteryId);
      if (!battery) return { cost: 8500, savings: 420 };
      
      const totalCost = battery.cost + 1500; // 加安装费
      
      // 基于容量计算节约（更大容量=更多节约）
      const baseSavings = 420;
      const savingsMultiplier = battery.capacityKwh / 9.8; // 以LG Chem为基准
      const annualSavings = Math.round(baseSavings * savingsMultiplier);
      
      // 电池存储会减少出口收入
      const exportReduction = Math.round(annualSavings * 0.3);
      
      const monthlySavings = new Array(12).fill(Math.round(annualSavings / 12));
      const monthlyExportReduction = new Array(12).fill(Math.round(-exportReduction / 12));
      
      return {
        cost: totalCost,
        savings: annualSavings,
        exportReduction: -exportReduction,
        monthlyData: {
          savings: monthlySavings,
          export: monthlyExportReduction,
          co2Direct: new Array(12).fill(0),
          co2Indirect: new Array(12).fill(0)
        }
      };
    };
    
    // 模拟真实API返回的设备对比结果格式
    const solarData = data.solarPanelTypeIds?.length > 0 ? getSolarPanelData(data.solarPanelTypeIds[0]) : null;
    const heatPumpData = data.heatPumpTypeIds?.length > 0 ? getHeatPumpData(data.heatPumpTypeIds[0]) : null;
    const batteryData = data.batteryIds?.length > 0 ? getBatteryData(data.batteryIds[0]) : null;
    
    return {
      solarPanelOptions: solarData ? [{
        id: data.solarPanelTypeIds[0],
        installationCost: solarData.cost,
        annualGeneration: solarData.generation,
        annualCostSavings: solarData.savings,
        annualExportRevenue: solarData.export,
        annualTotalCO2Savings: solarData.co2,
        monthlyGeneration: solarData.monthlyData.generation,
        monthlyCostSavings: solarData.monthlyData.savings,
        monthlyExportRevenue: solarData.monthlyData.export,
        monthlyDirectCO2Savings: solarData.monthlyData.co2Direct,
        monthlyIndirectCO2Savings: solarData.monthlyData.co2Indirect
      }] : [],
      
      heatPumpOptions: heatPumpData ? [{
        id: data.heatPumpTypeIds[0],
        installationCost: heatPumpData.cost,
        annualGeneration: 0,
        annualCostSavings: heatPumpData.savings,
        annualExportRevenue: 0,
        annualTotalCO2Savings: heatPumpData.co2,
        monthlyGeneration: new Array(12).fill(0),
        monthlyCostSavings: heatPumpData.monthlyData.savings,
        monthlyExportRevenue: new Array(12).fill(0),
        monthlyDirectCO2Savings: heatPumpData.monthlyData.co2Direct,
        monthlyIndirectCO2Savings: heatPumpData.monthlyData.co2Indirect
      }] : [],
      
      batteryOptions: batteryData ? [{
        id: data.batteryIds[0],
        installationCost: batteryData.cost,
        annualGeneration: 0,
        annualCostSavings: batteryData.savings,
        annualExportRevenue: batteryData.exportReduction,
        annualTotalCO2Savings: 0,
        monthlyGeneration: new Array(12).fill(0),
        monthlyCostSavings: batteryData.monthlyData.savings,
        monthlyExportRevenue: batteryData.monthlyData.export,
        monthlyDirectCO2Savings: batteryData.monthlyData.co2Direct,
        monthlyIndirectCO2Savings: batteryData.monthlyData.co2Indirect
      }] : []
    };
  },

  // 模拟政府补贴
  getGovernmentSubsidies(data) {
    const subsidies = [];
    
    // Heat Pump subsidies
    if (data.hasHeatPump) {
      subsidies.push({
        subsidyId: "bus-2024",
        name: "Boiler Upgrade Scheme",
        shortDescription: "Get £7,500 towards the cost of replacing your fossil fuel heating system with a heat pump",
        isEligible: true,
        estimatedAmount: 7500,
        deadline: "2025-03-31",
        applicationUrl: "https://www.gov.uk/apply-boiler-upgrade-scheme"
      });
    }
    
    // Always include some general schemes
    if (!data.hasHeatPump && !data.hasSolarPanels && !data.hasBattery) {
      subsidies.push({
        subsidyId: "general-eco4-2024",
        name: "ECO4 Scheme",
        shortDescription: "Support for home energy efficiency improvements including insulation and heating upgrades",
        isEligible: false,
        ineligibilityReason: "Based on current configuration, no qualifying measures selected",
        applicationUrl: "https://www.gov.uk/energy-company-obligation"
      });
    }
    
    return {
      availableSubsidies: subsidies,
      totalPotentialSavings: subsidies.reduce((sum, s) => sum + (s.estimatedAmount || 0), 0),
      applicableSubsidies: subsidies.filter(s => s.isEligible).length
    };
  },

  // 获取完整计算结果
  getCompleteCalculationResult(data) {
    return {
      solarInstallation: this.getSolarInstallationCost(data),
      monthlyGeneration: this.getMonthlyElectricityGeneration(data),
      monthlySavings: this.getMonthlySavings(data),
      carbonSavings: this.getCarbonSavings(data),
      paybackAnalysis: {
        paybackPeriod: 8.5,
        roi: 12.8,
        netPresentValue: 8450,
        internalRateOfReturn: 0.135
      },
      systemConfiguration: {
        recommendedSystem: "8.2kW Solar + 13.5kWh Battery",
        annualGeneration: 8220,
        selfConsumption: 65,
        exportToGrid: 35
      }
    };
  },

  // 获取热泵数据
  getHeatPumps() {
    return [
      {
        id: 1,
        name: "Air Source Heat Pump - Premium",
        type: "air_source",
        capacity: 12.0,
        cop: 4.2,
        cost: 16000,
        price: 16000,
        installationCost: 3500
      },
      {
        id: 2,
        name: "Air Source Heat Pump - Standard", 
        type: "air_source",
        capacity: 10.0,
        cop: 3.8,
        cost: 12500,
        price: 12500,
        installationCost: 3000
      },
      {
        id: 3,
        name: "Air Source Heat Pump - Basic",
        type: "air_source", 
        capacity: 8.0,
        cop: 3.5,
        cost: 10000,
        price: 10000,
        installationCost: 2500
      }
    ];
  },

  // 获取电池存储系统
  getBatteries() {
    return [
      {
        id: 1,
        name: "Tesla Powerwall 2",
        capacityKwh: 13.5,
        power: 5.0,
        efficiency: 0.92,
        cost: 8500,
        price: 8500,
        warranty: 10
      },
      {
        id: 2,
        name: "LG Chem RESU",
        capacityKwh: 9.8,
        power: 5.0,
        efficiency: 0.90,
        cost: 6200,
        price: 6200,
        warranty: 10
      },
      {
        id: 3,
        name: "Sonnen Eco",
        capacityKwh: 10.0,
        power: 3.3,
        efficiency: 0.88,
        cost: 7000,
        price: 7000,
        warranty: 10
      }
    ];
  }
};