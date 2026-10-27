// homeService.js — Home page API calls
import API from './apiCore';

// ==========================================
// 1. FULL HOME PAGE APIS
// ==========================================
export const fetchHomePage = async () => {
  const response = await API.get('/home');
  return response.data;
};

export const updateFullHomePage = async (fullPayload) => {
  const response = await API.put('/home', fullPayload);
  return response.data;
};

// ==========================================
// 2. HERO SECTION APIS
// ==========================================
export const fetchHomeHero = async () => {
  const response = await API.get('/home/hero');
  return response.data;
};

export const updateHomeHero = async (heroData) => {
  const response = await API.put('/home/hero', heroData);
  return response.data;
};

// ==========================================
// 3. ABOUT SECTION APIS
// ==========================================
export const fetchHomeAbout = async () => {
  const response = await API.get('/home/about');
  return response.data;
};

export const updateHomeAbout = async (aboutData) => {
  const response = await API.put('/home/about', aboutData);
  return response.data;
};

// ==========================================
// 4. MISSION & VISION SECTION APIS
// ==========================================
export const fetchHomeMissionVision = async () => {
  const response = await API.get('/home/mission-vision');
  return response.data;
};

export const updateHomeMissionVision = async (missionVisionData) => {
  const response = await API.put('/home/mission-vision', missionVisionData);
  return response.data;
};

// ==========================================
// 5. PRODUCTS SECTION APIS
// ==========================================
export const fetchHomeProducts = async () => {
  const response = await API.get('/home/products');
  return response.data;
};

export const updateHomeProducts = async (productsData) => {
  const response = await API.put('/home/products', productsData);
  return response.data;
};

// ==========================================
// 6. SOLUTIONS SECTION APIS
// ==========================================
export const fetchHomeSolutions = async () => {
  const response = await API.get('/home/solutions');
  return response.data;
};

export const updateHomeSolutions = async (solutionsData) => {
  const response = await API.put('/home/solutions', solutionsData);
  return response.data;
};

// ==========================================
// 7. PARTNERS SECTION APIS
// ==========================================
export const fetchHomePartners = async () => {
  const response = await API.get('/home/partners');
  return response.data;
};

export const updateHomePartners = async (partnersData) => {
  const response = await API.put('/home/partners', partnersData);
  return response.data;
};

// ==========================================
// 8. CAPABILITIES SECTION APIS
// ==========================================
export const fetchHomeCapabilities = async () => {
  const response = await API.get('/home/capabilities');
  return response.data;
};

export const updateHomeCapabilities = async (capabilitiesData) => {
  const response = await API.put('/home/capabilities', capabilitiesData);
  return response.data;
};

// ==========================================
// 9. FOOTER SECTION APIS
// ==========================================
export const fetchHomeFooter = async () => {
  const response = await API.get('/home/footer');
  return response.data;
};

export const updateHomeFooter = async (footerData) => {
  const response = await API.put('/home/footer', footerData);
  return response.data;
};

// ==========================================
// 10. BACKWARD-COMPATIBLE SECTION UPDATE
// ==========================================
export const updateHomeSection = async (sectionName, data) => {
  const sectionMap = {
    hero: '/home/hero',
    about: '/home/about',
    mission_vision: '/home/mission-vision',
    'mission-vision': '/home/mission-vision',
    products: '/home/products',
    solutions: '/home/solutions',
    solution: '/home/solutions',
    partners: '/home/partners',
    capabilities: '/home/capabilities',
    footer: '/home/footer'
  };

  const endpoint = sectionMap[sectionName] || `/home/section/${sectionName}`;
  const response = await API.put(endpoint, data);
  return response.data;
};
