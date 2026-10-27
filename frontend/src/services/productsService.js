// productsService.js — Products page API calls
import API from './apiCore';

export const fetchProductsPage = async () => {
  const response = await API.get('/products');
  return response.data;
};

export const updateProductsPage = async (productsPayload) => {
  const response = await API.put('/products', productsPayload);
  return response.data;
};

export const updateProductsSection = async (sectionName, data) => {
  const response = await API.patch(`/products/section/${sectionName}`, data);
  return response.data;
};

export const updateProductsHeader = async (headerPayload) => {
  const response = await API.patch('/products/section/header', headerPayload);
  return response.data;
};



// --- MICHELL INSTRUMENTS ---
export const fetchMichellBanner = async () => {
  const response = await API.get('/michell/banner');
  return response.data;
};
export const updateMichellBanner = async (bannerData) => {
  const response = await API.put('/michell/banner', bannerData);
  return response.data;
};
export const fetchMichellOverview = async () => {
  const response = await API.get('/michell/overview');
  return response.data;
};

export const updateMichellOverview = async (overviewData) => {
  const response = await API.put('/michell/overview', overviewData);
  return response.data;
};

export const fetchMichellDetails = async () => {
  const response = await API.get('/michell/details');
  return response.data;
};

export const updateMichellDetails = async (detailsData) => {
  const response = await API.put('/michell/details', detailsData);
  return response.data;
};

export const fetchMichellCapabilities = async () => {
  const response = await API.get('/michell/capabilities');
  return response.data;
};

export const updateMichellCapabilities = async (capabilitiesData) => {
  const response = await API.put('/michell/capabilities', capabilitiesData);
  return response.data;
};
export const fetchMichellCTA = async () => {
  const response = await API.get('/michell/cta');
  return response.data;
};

export const updateMichellCTA = async (ctaData) => {
  const response = await API.put('/michell/cta', ctaData);
  return response.data;
};

// ==========================================
// FLAME & GAS DETECTORS BANNER ENDPOINTS
// ==========================================
export const fetchFlameGasBanner = async () => {
  const response = await API.get('/flame-gas/banner');
  return response.data;
};

export const updateFlameGasBanner = async (bannerData) => {
  const response = await API.put('/flame-gas/banner', bannerData);
  return response.data;
};
export const fetchFlameGasOverview = async () => {
  const response = await API.get('/flame-gas/overview');
  return response.data;
};

export const updateFlameGasOverview = async (overviewData) => {
  const response = await API.put('/flame-gas/overview', overviewData);
  return response.data;
};

export const fetchFlameGasApplications = async () => {
  const response = await API.get('/flame-gas/applications');
  return response.data;
};

export const updateFlameGasApplications = async (applicationsData) => {
  const response = await API.put('/flame-gas/applications', applicationsData);
  return response.data;
};
export const fetchFlameGasCapabilities = async () => {
  const response = await API.get('/flame-gas/capabilities');
  return response.data;
};

export const updateFlameGasCapabilities = async (capabilitiesData) => {
  const response = await API.put('/flame-gas/capabilities', capabilitiesData);
  return response.data;
};


// ==========================================
// VESDA BANNER ENDPOINTS
// ==========================================
export const fetchVESDABanner = async () => {
  const response = await API.get('/vesda/banner');
  return response.data;
};

export const updateVESDABanner = async (bannerData) => {
  const response = await API.put('/vesda/banner', bannerData);
  return response.data;
};
export const fetchVESDAOverview = async () => {
  const response = await API.get('/vesda/overview');
  return response.data;
};

export const updateVESDAOverview = async (overviewData) => {
  const response = await API.put('/vesda/overview', overviewData);
  return response.data;
};
export const fetchVESDAApplications = async () => {
  const response = await API.get('/vesda/applications');
  return response.data;
};

export const updateVESDAApplications = async (applicationsData) => {
  const response = await API.put('/vesda/applications', applicationsData);
  return response.data;
};
export const fetchVESDACapabilities = async () => {
  const response = await API.get('/vesda/capabilities');
  return response.data;
};

export const updateVESDACapabilities = async (capabilitiesData) => {
  const response = await API.put('/vesda/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// PROCESS ANALYZERS BANNER ENDPOINTS
// ==========================================
export const fetchProcessAnalyzersBanner = async () => {
  const response = await API.get('/process-analyzers/banner');
  return response.data;
};

export const updateProcessAnalyzersBanner = async (bannerData) => {
  const response = await API.put('/process-analyzers/banner', bannerData);
  return response.data;
};
export const fetchProcessAnalyzersOverview = async () => {
  const response = await API.get('/process-analyzers/overview');
  return response.data;
};

export const updateProcessAnalyzersOverview = async (overviewData) => {
  const response = await API.put('/process-analyzers/overview', overviewData);
  return response.data;
};
export const fetchProcessAnalyzersApplications = async () => {
  const response = await API.get('/process-analyzers/applications');
  return response.data;
};

export const updateProcessAnalyzersApplications = async (applicationsData) => {
  const response = await API.put('/process-analyzers/applications', applicationsData);
  return response.data;
};
export const fetchProcessAnalyzersCapabilities = async () => {
  const response = await API.get('/process-analyzers/capabilities');
  return response.data;
};

export const updateProcessAnalyzersCapabilities = async (capabilitiesData) => {
  const response = await API.put('/process-analyzers/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// PROCESS INSTRUMENTATION BANNER ENDPOINTS
// ==========================================
export const fetchProcessInstrumentationBanner = async () => {
  const response = await API.get('/process-instrumentation/banner');
  return response.data;
};

export const updateProcessInstrumentationBanner = async (bannerData) => {
  const response = await API.put('/process-instrumentation/banner', bannerData);
  return response.data;
};

export const fetchProcessInstrumentationOverview = async () => {
  const response = await API.get('/process-instrumentation/overview');
  return response.data;
};

export const updateProcessInstrumentationOverview = async (overviewData) => {
  const response = await API.put('/process-instrumentation/overview', overviewData);
  return response.data;
};
export const fetchProcessInstrumentationCapabilities = async () => {
  const response = await API.get('/process-instrumentation/capabilities');
  return response.data;
};

export const updateProcessInstrumentationCapabilities = async (capabilitiesData) => {
  const response = await API.put('/process-instrumentation/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// UPSTREAM INSTRUMENTATION BANNER ENDPOINTS
// ==========================================
export const fetchUpstreamInstrumentationBanner = async () => {
  const response = await API.get('/upstream-instrumentation/banner');
  return response.data;
};

export const updateUpstreamInstrumentationBanner = async (bannerData) => {
  const response = await API.put('/upstream-instrumentation/banner', bannerData);
  return response.data;
};
export const fetchUpstreamInstrumentationOverview = async () => {
  const response = await API.get('/upstream-instrumentation/overview');
  return response.data;
};

export const updateUpstreamInstrumentationOverview = async (overviewData) => {
  const response = await API.put('/upstream-instrumentation/overview', overviewData);
  return response.data;
};
export const fetchUpstreamInstrumentationApplications = async () => {
  const response = await API.get('/upstream-instrumentation/applications');
  return response.data;
};

export const updateUpstreamInstrumentationApplications = async (applicationsData) => {
  const response = await API.put('/upstream-instrumentation/applications', applicationsData);
  return response.data;
};

export const fetchUpstreamInstrumentationCapabilities = async () => {
  const response = await API.get('/upstream-instrumentation/capabilities');
  return response.data;
};

export const updateUpstreamInstrumentationCapabilities = async (capabilitiesData) => {
  const response = await API.put('/upstream-instrumentation/capabilities', capabilitiesData);
  return response.data;
};


// ==========================================
// BEACONS & SOUNDERS BANNER ENDPOINTS
// ==========================================
export const fetchBeaconsSoundersBanner = async () => {
  const response = await API.get('/beacons-sounders/banner');
  return response.data;
};

export const updateBeaconsSoundersBanner = async (bannerData) => {
  const response = await API.put('/beacons-sounders/banner', bannerData);
  return response.data;
};

export const fetchBeaconsSoundersOverview = async () => {
  const response = await API.get('/beacons-sounders/overview');
  return response.data;
};

export const updateBeaconsSoundersOverview = async (overviewData) => {
  const response = await API.put('/beacons-sounders/overview', overviewData);
  return response.data;
};

export const fetchBeaconsSoundersApplications = async () => {
  const response = await API.get('/beacons-sounders/applications');
  return response.data;
};

export const updateBeaconsSoundersApplications = async (applicationsData) => {
  const response = await API.put('/beacons-sounders/applications', applicationsData);
  return response.data;
};


export const fetchBeaconsSoundersCapabilities = async () => {
  const response = await API.get('/beacons-sounders/capabilities');
  return response.data;
};

export const updateBeaconsSoundersCapabilities = async (capabilitiesData) => {
  const response = await API.put('/beacons-sounders/capabilities', capabilitiesData);
  return response.data;
};