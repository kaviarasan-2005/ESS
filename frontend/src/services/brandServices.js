// brandServices.js — All brand-specific API calls (AGC, AKAY, AVEVA, Bartec, Eaton, Emerson, Hach, Hitachi, Hyosung, Michell)
import API from './apiCore';

// --- AGC INSTRUMENTS ---
export const fetchAGCBanner = async () => {
  const response = await API.get('/agc-instruments/banner');
  return response.data;
};
export const updateAGCBanner = async (bannerData) => {
  const response = await API.put('/agc-instruments/banner', bannerData);
  return response.data;
};
export const fetchAGCOverview = async () => {
  const response = await API.get('/agc-instruments/overview');
  return response.data;
};
export const updateAGCOverview = async (overviewData) => {
  const response = await API.put('/agc-instruments/overview', overviewData);
  return response.data;
};
export const fetchAGCSolutionsSupport = async () => {
  const response = await API.get('/agc-instruments/solutions-support');
  return response.data;
};
export const updateAGCSolutionsSupport = async (data) => {
  const response = await API.put('/agc-instruments/solutions-support', data);
  return response.data;
};

// --- AKAY INDUSTRIES ---
export const fetchAKAYBanner = async () => {
  const response = await API.get('/akay-industries/banner');
  return response.data;
};
export const updateAKAYBanner = async (bannerData) => {
  const response = await API.put('/akay-industries/banner', bannerData);
  return response.data;
};
export const fetchAKAYOverview = async () => {
  const response = await API.get('/akay-industries/overview');
  return response.data;
};
export const updateAKAYOverview = async (overviewData) => {
  const response = await API.put('/akay-industries/overview', overviewData);
  return response.data;
};
export const fetchAKAYDetails = async () => {
  const response = await API.get('/akay-industries/details');
  return response.data;
};
export const updateAKAYDetails = async (detailsData) => {
  const response = await API.put('/akay-industries/details', detailsData);
  return response.data;
};
export const fetchAKAYProductsSupport = async () => {
  const response = await API.get('/akay-industries/products-support');
  return response.data;
};
export const updateAKAYProductsSupport = async (data) => {
  const response = await API.put('/akay-industries/products-support', data);
  return response.data;
};

// --- AVEVA ---
export const fetchAVEVABanner = async () => {
  const response = await API.get('/aveva/banner');
  return response.data;
};
export const updateAVEVABanner = async (bannerData) => {
  const response = await API.put('/aveva/banner', bannerData);
  return response.data;
};
export const fetchAVEVAOverview = async () => {
  const response = await API.get('/aveva/overview');
  return response.data;
};
export const updateAVEVAOverview = async (overviewData) => {
  const response = await API.put('/aveva/overview', overviewData);
  return response.data;
};
export const fetchAVEVADetails = async () => {
  const response = await API.get('/aveva/details');
  return response.data;
};
export const updateAVEVADetails = async (detailsData) => {
  const response = await API.put('/aveva/details', detailsData);
  return response.data;
};

// --- BARTEC ---
export const fetchBartecBanner = async () => {
  const response = await API.get('/bartec/banner');
  return response.data;
};
export const updateBartecBanner = async (bannerData) => {
  const response = await API.put('/bartec/banner', bannerData);
  return response.data;
};
export const fetchBartecOverview = async () => {
  const response = await API.get('/bartec/overview');
  return response.data;
};
export const updateBartecOverview = async (overviewData) => {
  const response = await API.put('/bartec/overview', overviewData);
  return response.data;
};
export const fetchBartecDetails = async () => {
  const response = await API.get('/bartec/details');
  return response.data;
};
export const updateBartecDetails = async (detailsData) => {
  const response = await API.put('/bartec/details', detailsData);
  return response.data;
};

// --- EATON MEDC ---
export const fetchEatonMedcBanner = async () => {
  const response = await API.get('/eaton-medc/banner');
  return response.data;
};
export const updateEatonMedcBanner = async (bannerData) => {
  const response = await API.put('/eaton-medc/banner', bannerData);
  return response.data;
};
export const fetchEatonMedcOverview = async () => {
  const response = await API.get('/eaton-medc/overview');
  return response.data;
};
export const updateEatonMedcOverview = async (overviewData) => {
  const response = await API.put('/eaton-medc/overview', overviewData);
  return response.data;
};
export const fetchEatonMedcDetails = async () => {
  const response = await API.get('/eaton-medc/details');
  return response.data;
};
export const updateEatonMedcDetails = async (detailsData) => {
  const response = await API.put('/eaton-medc/details', detailsData);
  return response.data;
};

// --- EMERSON ---
export const fetchEmersonBanner = async (config) => {
  const response = await API.get('/emerson/banner', config);
  return response.data;
};
export const updateEmersonBanner = async (bannerData) => {
  const response = await API.put('/emerson/banner', bannerData);
  return response.data;
};
export const fetchEmersonOverview = async () => {
  const response = await API.get('/emerson/overview');
  return response.data;
};
export const updateEmersonOverview = async (overviewData) => {
  const response = await API.put('/emerson/overview', overviewData);
  return response.data;
};
export const fetchEmersonDetails = async () => {
  const response = await API.get('/emerson/details');
  return response.data;
};
export const updateEmersonDetails = async (detailsData) => {
  const response = await API.put('/emerson/details', detailsData);
  return response.data;
};

// --- HACH ---
export const fetchHachBanner = async () => {
  const response = await API.get('/hach/banner');
  return response.data;
};
export const updateHachBanner = async (bannerData) => {
  const response = await API.put('/hach/banner', bannerData);
  return response.data;
};
export const fetchHachOverview = async () => {
  const response = await API.get('/hach/overview');
  return response.data;
};
export const updateHachOverview = async (overviewData) => {
  const response = await API.put('/hach/overview', overviewData);
  return response.data;
};
export const fetchHachDetails = async () => {
  const response = await API.get('/hach/details');
  return response.data;
};
export const updateHachDetails = async (detailsData) => {
  const response = await API.put('/hach/details', detailsData);
  return response.data;
};

// --- HITACHI ---
export const fetchHitachiBanner = async () => {
  const response = await API.get('/hitachi/banner');
  return response.data;
};
export const updateHitachiBanner = async (bannerData) => {
  const response = await API.put('/hitachi/banner', bannerData);
  return response.data;
};
export const fetchHitachiOverview = async () => {
  const response = await API.get('/hitachi/overview');
  return response.data;
};
export const updateHitachiOverview = async (overviewData) => {
  const response = await API.put('/hitachi/overview', overviewData);
  return response.data;
};
export const fetchHitachiDetails = async () => {
  const response = await API.get('/hitachi/details');
  return response.data;
};
export const updateHitachiDetails = async (detailsData) => {
  const response = await API.put('/hitachi/details', detailsData);
  return response.data;
};

// --- HYOSUNG GOODSPRINGS ---
export const fetchHyosungBanner = async () => {
  const response = await API.get('/hyosung/banner');
  return response.data;
};
export const updateHyosungBanner = async (bannerData) => {
  const response = await API.put('/hyosung/banner', bannerData);
  return response.data;
};
export const fetchHyosungOverview = async () => {
  const response = await API.get('/hyosung/overview');
  return response.data;
};
export const updateHyosungOverview = async (overviewData) => {
  const response = await API.put('/hyosung/overview', overviewData);
  return response.data;
};
export const fetchHyosungDetails = async () => {
  const response = await API.get('/hyosung/details');
  return response.data;
};
export const updateHyosungDetails = async (detailsData) => {
  const response = await API.put('/hyosung/details', detailsData);
  return response.data;
};


// ==========================================
// HONEYWELL BANNER ENDPOINTS
// ==========================================
export const fetchHoneywellBanner = async () => {
  const response = await API.get('/honeywell/banner');
  return response.data;
};

export const updateHoneywellBanner = async (bannerData) => {
  const response = await API.put('/honeywell/banner', bannerData);
  return response.data;
};

export const fetchHoneywellOverview = async () => {
  const response = await API.get('/honeywell/overview');
  return response.data;
};

export const updateHoneywellOverview = async (overviewData) => {
  const response = await API.put('/honeywell/overview', overviewData);
  return response.data;
};

export const fetchHoneywellDetails = async () => {
  const response = await API.get('/honeywell/details');
  return response.data;
};

export const updateHoneywellDetails = async (detailsData) => {
  const response = await API.put('/honeywell/details', detailsData);
  return response.data;
};

// ==========================================
// HONEYWELL GAS DETECTION BANNER ENDPOINTS
// ==========================================
export const fetchHoneywellGasDetectionBanner = async () => {
  const response = await API.get('/honeywell-gas-detection/banner');
  return response.data;
};

export const updateHoneywellGasDetectionBanner = async (bannerData) => {
  const response = await API.put('/honeywell-gas-detection/banner', bannerData);
  return response.data;
};

export const fetchHoneywellGasDetectionOverview = async () => {
  const response = await API.get('/honeywell-gas-detection/overview');
  return response.data;
};

export const updateHoneywellGasDetectionOverview = async (overviewData) => {
  const response = await API.put('/honeywell-gas-detection/overview', overviewData);
  return response.data;
};

export const fetchHoneywellGasDetectionDetails = async () => {
  const response = await API.get('/honeywell-gas-detection/details');
  return response.data;
};

export const updateHoneywellGasDetectionDetails = async (detailsData) => {
  const response = await API.put('/honeywell-gas-detection/details', detailsData);
  return response.data;
};

export const fetchHoneywellGasDetectionIndustries = async () => {
  const response = await API.get('/honeywell-gas-detection/industries');
  return response.data;
};

export const updateHoneywellGasDetectionIndustries = async (industriesData) => {
  const response = await API.put('/honeywell-gas-detection/industries', industriesData);
  return response.data;
};

// ==========================================
// METAL SAMPLES BANNER ENDPOINTS
// ==========================================
export const fetchMetalSamplesBanner = async () => {
  const response = await API.get('/metal-samples/banner');
  return response.data;
};

export const updateMetalSamplesBanner = async (bannerData) => {
  const response = await API.put('/metal-samples/banner', bannerData);
  return response.data;
};

export const fetchMetalSamplesOverview = async () => {
  const response = await API.get('/metal-samples/overview');
  return response.data;
};

export const updateMetalSamplesOverview = async (overviewData) => {
  const response = await API.put('/metal-samples/overview', overviewData);
  return response.data;
};

export const fetchMetalSamplesDetails = async () => {
  const response = await API.get('/metal-samples/details');
  return response.data;
};

export const updateMetalSamplesDetails = async (detailsData) => {
  const response = await API.put('/metal-samples/details', detailsData);
  return response.data;
};

// ==========================================
// MICHELL INSTRUMENTS BANNER ENDPOINTS
// ==========================================
export const fetchMichellInstrumentsBanner = async () => {
  const response = await API.get('/michell-instruments/banner');
  return response.data;
};

export const updateMichellInstrumentsBanner = async (bannerData) => {
  const response = await API.put('/michell-instruments/banner', bannerData);
  return response.data;
};

export const fetchMichellInstrumentsOverview = async () => {
  const response = await API.get('/michell-instruments/overview');
  return response.data;
};

export const updateMichellInstrumentsOverview = async (overviewData) => {
  const response = await API.put('/michell-instruments/overview', overviewData);
  return response.data;
};

export const fetchMichellInstrumentsDetails = async () => {
  const response = await API.get('/michell-instruments/details');
  return response.data;
};

export const updateMichellInstrumentsDetails = async (detailsData) => {
  const response = await API.put('/michell-instruments/details', detailsData);
  return response.data;
};

// ==========================================
// PANORAMA BANNER ENDPOINTS
// ==========================================
export const fetchPanoramaBanner = async () => {
  const response = await API.get('/panorama/banner');
  return response.data;
};

export const updatePanoramaBanner = async (bannerData) => {
  const response = await API.put('/panorama/banner', bannerData);
  return response.data;
};

export const fetchPanoramaOverview = async () => {
  const response = await API.get('/panorama/overview');
  return response.data;
};

export const updatePanoramaOverview = async (overviewData) => {
  const response = await API.put('/panorama/overview', overviewData);
  return response.data;
};

export const fetchPanoramaDetails = async () => {
  const response = await API.get('/panorama/details');
  return response.data;
};

export const updatePanoramaDetails = async (detailsData) => {
  const response = await API.put('/panorama/details', detailsData);
  return response.data;
};

// ==========================================
// PROMINENT METERING BANNER ENDPOINTS
// ==========================================
export const fetchProminentMeteringBanner = async () => {
  const response = await API.get('/prominent-metering/banner');
  return response.data;
};

export const updateProminentMeteringBanner = async (bannerData) => {
  const response = await API.put('/prominent-metering/banner', bannerData);
  return response.data;
};
export const fetchProminentMeteringOverview = async () => {
  const response = await API.get('/prominent-metering/overview');
  return response.data;
};

export const updateProminentMeteringOverview = async (overviewData) => {
  const response = await API.put('/prominent-metering/overview', overviewData);
  return response.data;
};

export const fetchProminentMeteringDetails = async () => {
  const response = await API.get('/prominent-metering/details');
  return response.data;
};

export const updateProminentMeteringDetails = async (detailsData) => {
  const response = await API.put('/prominent-metering/details', detailsData);
  return response.data;
};

// ==========================================
// RA SILVER BANNER ENDPOINTS
// ==========================================
export const fetchRASilverBanner = async () => {
  const response = await API.get('/ra-silver/banner');
  return response.data;
};

export const updateRASilverBanner = async (bannerData) => {
  const response = await API.put('/ra-silver/banner', bannerData);
  return response.data;
};

export const fetchRASilverOverview = async () => {
  const response = await API.get('/ra-silver/overview');
  return response.data;
};

export const updateRASilverOverview = async (overviewData) => {
  const response = await API.put('/ra-silver/overview', overviewData);
  return response.data;
};

export const fetchRASilverDetails = async () => {
  const response = await API.get('/ra-silver/details');
  return response.data;
};

export const updateRASilverDetails = async (detailsData) => {
  const response = await API.put('/ra-silver/details', detailsData);
  return response.data;
};

// ==========================================
// TESTO BANNER ENDPOINTS
// ==========================================
export const fetchTestoBanner = async () => {
  const response = await API.get('/testo/banner');
  return response.data;
};

export const updateTestoBanner = async (bannerData) => {
  const response = await API.put('/testo/banner', bannerData);
  return response.data;
};
export const fetchTestoOverview = async () => {
  const response = await API.get('/testo/overview');
  return response.data;
};

export const updateTestoOverview = async (overviewData) => {
  const response = await API.put('/testo/overview', overviewData);
  return response.data;
};
export const fetchTestoDetails = async () => {
  const response = await API.get('/testo/details');
  return response.data;
};

export const updateTestoDetails = async (detailsData) => {
  const response = await API.put('/testo/details', detailsData);
  return response.data;
};

// ==========================================
// TSI BANNER ENDPOINTS
// ==========================================
export const fetchTSIBanner = async () => {
  const response = await API.get('/tsi/banner');
  return response.data;
};

export const updateTSIBanner = async (bannerData) => {
  const response = await API.put('/tsi/banner', bannerData);
  return response.data;
};
export const fetchTSIOverview = async () => {
  const response = await API.get('/tsi/overview');
  return response.data;
};

export const updateTSIOverview = async (overviewData) => {
  const response = await API.put('/tsi/overview', overviewData);
  return response.data;
};
export const fetchTSIDetails = async () => {
  const response = await API.get('/tsi/details');
  return response.data;
};

export const updateTSIDetails = async (detailsData) => {
  const response = await API.put('/tsi/details', detailsData);
  return response.data;
};

// ==========================================
// VOGELSANG BANNER ENDPOINTS
// ==========================================
export const fetchVogelsangBanner = async () => {
  const response = await API.get('/vogelsang/banner');
  return response.data;
};

export const updateVogelsangBanner = async (bannerData) => {
  const response = await API.put('/vogelsang/banner', bannerData);
  return response.data;
};
export const fetchVogelsangOverview = async () => {
  const response = await API.get('/vogelsang/overview');
  return response.data;
};

export const updateVogelsangOverview = async (overviewData) => {
  const response = await API.put('/vogelsang/overview', overviewData);
  return response.data;
};
export const fetchVogelsangDetails = async () => {
  const response = await API.get('/vogelsang/details');
  return response.data;
};

export const updateVogelsangDetails = async (detailsData) => {
  const response = await API.put('/vogelsang/details', detailsData);
  return response.data;
};