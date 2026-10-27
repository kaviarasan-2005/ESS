import API from "./apiCore";


export const fetchSystemsHeader = async () => {
  const response = await API.get('/systems/header');
  return response.data;
};

/**
 * Update Header Banner for Systems & Solutions page
 */
export const updateSystemsHeader = async (headerData) => {
  const response = await API.put('/systems/header', headerData);
  return response.data;
};

/**
 * Fetch Systems & Solutions Overview Section
 */
export const fetchSystemsOverview = async () => {
  const response = await API.get('/systems/overview');
  return response.data;
};

/**
 * Update Systems & Solutions Overview Section
 */
export const updateSystemsOverview = async (overviewData) => {
  const response = await API.put('/systems/overview', overviewData);
  return response.data;
};

export const fetchSystemsSolutionsGrid = async () => {
  const response = await API.get('/systems/solutions-grid');
  return response.data;
};

export const updateSystemsSolutionsGrid = async (gridData) => {
  const response = await API.put('/systems/solutions-grid', gridData);
  return response.data;
};




// ==========================================
// ANALYZER SYSTEMS BANNER ENDPOINTS
// ==========================================
export const fetchAnalyzerSystemsBanner = async () => {
  const response = await API.get('/analyzer-systems/banner');
  return response.data;
};

export const updateAnalyzerSystemsBanner = async (bannerData) => {
  const response = await API.put('/analyzer-systems/banner', bannerData);
  return response.data;
};

export const fetchAnalyzerSystemsOverview = async () => {
  const response = await API.get('/analyzer-systems/overview');
  return response.data;
};

export const updateAnalyzerSystemsOverview = async (overviewData) => {
  const response = await API.put('/analyzer-systems/overview', overviewData);
  return response.data;
};

export const fetchAnalyzerSystemsApplications = async () => {
  const response = await API.get('/analyzer-systems/applications');
  return response.data;
};

export const updateAnalyzerSystemsApplications = async (applicationsData) => {
  const response = await API.put('/analyzer-systems/applications', applicationsData);
  return response.data;
};

export const fetchAnalyzerSystemsCapabilities = async () => {
  const response = await API.get('/analyzer-systems/capabilities');
  return response.data;
};

export const updateAnalyzerSystemsCapabilities = async (capabilitiesData) => {
  const response = await API.put('/analyzer-systems/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// SAMPLING SYSTEMS BANNER ENDPOINTS
// ==========================================
export const fetchSamplingSystemsBanner = async () => {
  const response = await API.get('/sampling-systems/banner');
  return response.data;
};

export const updateSamplingSystemsBanner = async (bannerData) => {
  const response = await API.put('/sampling-systems/banner', bannerData);
  return response.data;
};

export const fetchSamplingSystemsOverview = async () => {
  const response = await API.get('/sampling-systems/overview');
  return response.data;
};

export const updateSamplingSystemsOverview = async (overviewData) => {
  const response = await API.put('/sampling-systems/overview', overviewData);
  return response.data;
};
export const fetchSamplingSystemsApplications = async () => {
  const response = await API.get('/sampling-systems/applications');
  return response.data;
};

export const updateSamplingSystemsApplications = async (applicationsData) => {
  const response = await API.put('/sampling-systems/applications', applicationsData);
  return response.data;
};
export const fetchSamplingSystemsCapabilities = async () => {
  const response = await API.get('/sampling-systems/capabilities');
  return response.data;
};

export const updateSamplingSystemsCapabilities = async (capabilitiesData) => {
  const response = await API.put('/sampling-systems/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// INDUSTRIAL AUTOMATION BANNER ENDPOINTS
// ==========================================
export const fetchIndustrialAutomationBanner = async () => {
  const response = await API.get('/industrial-automation/banner');
  return response.data;
};

export const updateIndustrialAutomationBanner = async (bannerData) => {
  const response = await API.put('/industrial-automation/banner', bannerData);
  return response.data;
};

export const fetchIndustrialAutomationOverview = async () => {
  const response = await API.get('/industrial-automation/overview');
  return response.data;
};

export const updateIndustrialAutomationOverview = async (overviewData) => {
  const response = await API.put('/industrial-automation/overview', overviewData);
  return response.data;
};

export const fetchIndustrialAutomationApplications = async () => {
  const response = await API.get('/industrial-automation/applications');
  return response.data;
};

export const updateIndustrialAutomationApplications = async (applicationsData) => {
  const response = await API.put('/industrial-automation/applications', applicationsData);
  return response.data;
};
export const fetchIndustrialAutomationCapabilities = async () => {
  const response = await API.get('/industrial-automation/capabilities');
  return response.data;
};

export const updateIndustrialAutomationCapabilities = async (capabilitiesData) => {
  const response = await API.put('/industrial-automation/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// FIRE & GAS CONTROL SYSTEMS BANNER ENDPOINTS
// ==========================================
export const fetchFireGasBanner = async () => {
  const response = await API.get('/fire-gas/banner');
  return response.data;
};

export const updateFireGasBanner = async (bannerData) => {
  const response = await API.put('/fire-gas/banner', bannerData);
  return response.data;
};

export const fetchFireGasOverview = async () => {
  const response = await API.get('/fire-gas/overview');
  return response.data;
};

export const updateFireGasOverview = async (overviewData) => {
  const response = await API.put('/fire-gas/overview', overviewData);
  return response.data;
};
export const fetchFireGasApplications = async () => {
  const response = await API.get('/fire-gas/applications');
  return response.data;
};

export const updateFireGasApplications = async (applicationsData) => {
  const response = await API.put('/fire-gas/applications', applicationsData);
  return response.data;
};

export const fetchFireGasCapabilities = async () => {
  const response = await API.get('/fire-gas/capabilities');
  return response.data;
};

export const updateFireGasCapabilities = async (capabilitiesData) => {
  const response = await API.put('/fire-gas/capabilities', capabilitiesData);
  return response.data;
};


// ==========================================
// MASS NOTIFICATION SYSTEMS BANNER ENDPOINTS
// ==========================================
export const fetchMassNotificationBanner = async () => {
  const response = await API.get('/mass-notification/banner');
  return response.data;
};

export const updateMassNotificationBanner = async (bannerData) => {
  const response = await API.put('/mass-notification/banner', bannerData);
  return response.data;
};

export const fetchMassNotificationOverview = async () => {
  const response = await API.get('/mass-notification/overview');
  return response.data;
};

export const updateMassNotificationOverview = async (overviewData) => {
  const response = await API.put('/mass-notification/overview', overviewData);
  return response.data;
};
export const fetchMassNotificationApplications = async () => {
  const response = await API.get('/mass-notification/applications');
  return response.data;
};

export const updateMassNotificationApplications = async (applicationsData) => {
  const response = await API.put('/mass-notification/applications', applicationsData);
  return response.data;
};

export const fetchMassNotificationCapabilities = async () => {
  const response = await API.get('/mass-notification/capabilities');
  return response.data;
};

export const updateMassNotificationCapabilities = async (capabilitiesData) => {
  const response = await API.put('/mass-notification/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// POWER BACKUP SYSTEMS BANNER ENDPOINTS
// ==========================================
export const fetchPowerBackupBanner = async () => {
  const response = await API.get('/power-backup/banner');
  return response.data;
};

export const updatePowerBackupBanner = async (bannerData) => {
  const response = await API.put('/power-backup/banner', bannerData);
  return response.data;
};

export const fetchPowerBackupOverview = async () => {
  const response = await API.get('/power-backup/overview');
  return response.data;
};

export const updatePowerBackupOverview = async (overviewData) => {
  const response = await API.put('/power-backup/overview', overviewData);
  return response.data;
};

export const fetchPowerBackupApplications = async () => {
  const response = await API.get('/power-backup/applications');
  return response.data;
};

export const updatePowerBackupApplications = async (applicationsData) => {
  const response = await API.put('/power-backup/applications', applicationsData);
  return response.data;
};

export const fetchPowerBackupCapabilities = async () => {
  const response = await API.get('/power-backup/capabilities');
  return response.data;
};

export const updatePowerBackupCapabilities = async (capabilitiesData) => {
  const response = await API.put('/power-backup/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// EMISSION MONITORING SYSTEMS BANNER ENDPOINTS
// ==========================================
export const fetchEmissionMonitoringBanner = async () => {
  const response = await API.get('/emission-monitoring/banner');
  return response.data;
};

export const updateEmissionMonitoringBanner = async (bannerData) => {
  const response = await API.put('/emission-monitoring/banner', bannerData);
  return response.data;
};

export const fetchEmissionMonitoringOverview = async () => {
  const response = await API.get('/emission-monitoring/overview');
  return response.data;
};

export const updateEmissionMonitoringOverview = async (overviewData) => {
  const response = await API.put('/emission-monitoring/overview', overviewData);
  return response.data;
};

export const fetchEmissionMonitoringApplications = async () => {
  const response = await API.get('/emission-monitoring/applications');
  return response.data;
};

export const updateEmissionMonitoringApplications = async (applicationsData) => {
  const response = await API.put('/emission-monitoring/applications', applicationsData);
  return response.data;
};

export const fetchEmissionMonitoringCapabilities = async () => {
  const response = await API.get('/emission-monitoring/capabilities');
  return response.data;
};

export const updateEmissionMonitoringCapabilities = async (capabilitiesData) => {
  const response = await API.put('/emission-monitoring/capabilities', capabilitiesData);
  return response.data;
};