# 🚀 System Configuration Comparison - Quick Start Guide

## Feature Overview

**New Feature Live!** After users select the equipment types they want to install, they'll see a dynamic comparison table where the first few columns are equipment brand dropdown menus. Users can freely mix and match different configurations, and the data columns on the right will update in real-time showing:

- Installation Cost
- Annual Generation
- Annual Cost Savings  
- Export Revenue
- CO₂ Emission Savings
- Investment Payback Period

Click on any data cell to view detailed monthly trend charts!

## 🎯 Quick Start Steps

### 1. Start the System
```bash
# Start backend (port 8080)
cd renewableCalculator.backend
mvn spring-boot:run

# Start frontend (port 3000) 
cd renewableCalculator.ui
npm start
```

### 2. Complete Basic Steps
Follow the normal flow to complete the previous steps:
- Address Input
- Basic House Information
- Energy Demand
- Insulation Performance
- Roof Conditions
- Solar Configuration
- Storage & Heating
- Tariff Settings

### 3. Enter Results Page
- Go to the "Results" page
- Click the **"System Configuration"** tab
- See the brand new configuration comparison interface

### 4. Select Equipment Types
Choose the equipment types you want to compare:
- ☑️ **Solar Panels**
- ☑️ **Battery Storage** 
- ☑️ **Heat Pump**

### 5. Start Configuration Setup
Click the **"Start Configuration Comparison"** button to enter the comparison table

## 📊 Interface Preview

You'll see a comparison table like this:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              System Configuration Comparison                                │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Config Name   │ Solar Panels ▼        │ Heat Pump ▼          │ Install Cost │ Generation📊│ Savings📊│ CO₂📊   │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Configuration 1│ [Please select...]    │ [Please select...]   │ £0          │ 0 kWh       │ £0       │ 0 kg    │
│ Configuration 2│ [Please select...]    │ [Please select...]   │ £0          │ 0 kWh       │ £0       │ 0 kg    │ 
│ Configuration 3│ [Please select...]    │ [Please select...]   │ £0          │ 0 kWh       │ £0       │ 0 kg    │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                  + Add New Configuration                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 🎮 Practical Operation Example

### Step 1: Configure First Option
In **Configuration 1** row:
1. Solar Panels dropdown: Select `JA Solar JAM72S30 545W (545W)`
2. Heat Pump dropdown: Select `Mitsubishi Ecodan 8kW ASHP (COP: 4.2)`
3. **Data updates immediately**:
   ```
   Installation Cost: £15,500
   Generation: 4,250 kWh  
   Savings: £1,275
   CO₂ Savings: 2,850 kg
   Payback: 8.2 years
   ```

### Step 2: Configure Second Option
In **Configuration 2** row:
1. Solar Panels: Select `LG NeON R 380W (380W)`
2. Heat Pump: Select `Daikin Altherma 10kW (COP: 4.0)`
3. **Data updates for comparison**:
   ```
   Installation Cost: £16,200
   Generation: 3,800 kWh
   Savings: £1,140  
   CO₂ Savings: 2,650 kg
   Payback: 9.1 years
   ```

### Step 3: View Monthly Charts
Click any data cell (e.g., "Generation") to see monthly trend chart:
- 📈 **January**: 180 kWh
- 📈 **June**: 510 kWh (peak)
- 📈 **December**: 165 kWh

### Step 4: Add More Configurations
Click **"+ Add New Configuration"** to create more comparison options

## 🛠️ Available Equipment Options

### Solar Panel Options (Examples)
```
- JA Solar JAM72S30 545W (545W)
- LG NeON R 380W (380W)  
- Canadian Solar HiKu 400W (400W)
- Trina Solar Vertex 405W (405W)
```

### Heat Pump Options (Examples)
```
- Mitsubishi Ecodan 8kW ASHP (COP: 4.2)
- Daikin Altherma 10kW (COP: 4.0)
- Samsung EHS 12kW (COP: 4.1)
- Panasonic Aquarea 9kW (COP: 4.3)
```

### Battery Storage Options (Examples)
```
- Tesla Powerwall 2 (13.5kWh)
- LG Chem RESU 10H (9.8kWh)
- BYD Battery-Box Premium (13.8kWh)
- Sonnen eco 10 (10kWh)
```

## 💡 Usage Tips

### Real-time Calculation Features
- ✅ **Instant Feedback**: Data updates immediately after equipment selection
- ✅ **Loading Indicator**: Shows "Calculating..." during computation
- ✅ **Error Handling**: Maintains existing data if calculation fails

### Interactive Features
- 🖱️ **Click Data**: View monthly trend charts
- ✏️ **Edit Config Name**: Double-click configuration name to modify
- ➕ **Add Configurations**: Unlimited configuration additions
- ❌ **Remove Configurations**: Click "×" to delete unwanted configurations

### Data Understanding
- **Installation Cost**: Equipment cost + installation fees
- **Annual Generation**: Annual power generation prediction based on UK climate
- **Annual Savings**: Total electricity + heating cost savings
- **Export Revenue**: Income from selling excess electricity to the grid
- **CO₂ Savings**: Direct + indirect carbon emission reductions
- **Payback Period**: Simple investment recovery period calculation

## 🔍 Troubleshooting

### Common Issues

**Q: Data doesn't update after selecting equipment?**
A: Check network connection, ensure backend service is running on localhost:8080

**Q: Dropdown menus show empty?**
A: Confirm database connection is normal, check backend logs

**Q: Monthly charts don't display?**
A: Ensure equipment is selected and calculation is complete, click cells with data

**Q: Calculation keeps showing "Calculating..."?**
A: Check if backend API `/api/equipment/compare` is responding normally

### Debug Commands
```bash
# Check backend API status
curl http://localhost:8080/api/equipment/solar-panels/available

# Check frontend compilation
npm run build

# View browser Developer Tools Network tab for API requests
```

## 🎉 Experience Highlights

### User-Friendly Features
- 🎨 **Modern UI**: Clean, intuitive table design
- 📱 **Responsive**: Supports desktop and mobile devices
- ⚡ **Real-time**: See results immediately when selections change
- 📊 **Visualization**: Rich monthly charts display

### Technical Highlights
- 🔄 **Real-time Calculation**: Precise calculations based on actual equipment data
- 🔗 **API Integration**: Seamless integration with existing calculation services
- 💾 **State Management**: Intelligent local state management
- 🎛️ **Component-based**: Modular React component architecture

## 🚀 Start Experiencing

Launch the system now and experience this revolutionary equipment configuration comparison feature!

```bash
# One-click startup (if everything is configured)
mvn spring-boot:run &  # backend
npm start              # frontend
```

Visit http://localhost:3000, complete the basic steps, then go to "System Configuration" to start your renewable energy configuration journey!

---

**Note**: This feature is implemented exactly according to your requirements - users select equipment types and see a table where the first few columns are brand selection dropdowns, users can freely mix and match configurations, and the data on the right changes in real-time. You can also click to view monthly charts! 🌟 