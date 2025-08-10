// Tariff Validation Logic

export const validateFormData = (formData) => {
  // Basic electricity rate is required
  if (!formData.electricityRate || parseFloat(formData.electricityRate) <= 0) {
    return false;
  }

  // Price projections are required
  if (!formData.electricityPriceIncrease || parseFloat(formData.electricityPriceIncrease) < 0) {
    return false;
  }
  
  if (!formData.gasPriceIncrease || parseFloat(formData.gasPriceIncrease) < 0) {
    return false;
  }

  // Validate export arrangement specific fields
  if (formData.exportArrangement === 'feed-in') {
    if (!formData.feedInExportRate || parseFloat(formData.feedInExportRate) <= 0) {
      return false;
    }
    if (!formData.feedInInstallationYear || 
        formData.feedInInstallationYear < 2010 || 
        formData.feedInInstallationYear > 2019) {
      return false;
    }
  }

  if (formData.exportArrangement === 'seg') {
    if (!formData.segExportRate || parseFloat(formData.segExportRate) <= 0) {
      return false;
    }
  }

  return true;
}; 