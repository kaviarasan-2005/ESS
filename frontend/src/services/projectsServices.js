import API from './apiCore';

/**
 * Fetch Header Banner details for Projects & Services page
 */
export const fetchProjectsServicesHeader = async () => {
  const response = await API.get('/projects-services/header');
  return response.data;
};

/**
 * Update Header Banner details for Projects & Services page
 */
export const updateProjectsServicesHeader = async (headerData) => {
  const response = await API.put('/projects-services/header', headerData);
  return response.data;
};


export const fetchProjectsServicesOverview = async () => {
  const response = await API.get('/projects-services/overview');
  return response.data;
};

/**
 * Update Overview Section details for Projects & Services page
 */
export const updateProjectsServicesOverview = async (overviewData) => {
  const response = await API.put('/projects-services/overview', overviewData);
  return response.data;
};

export const fetchProjectsServicesGrid = async () => {
  const response = await API.get('/projects-services/grid');
  return response.data;
};

/**
 * Update Projects & Services Feature Grid Cards
 */
export const updateProjectsServicesGrid = async (gridData) => {
  const response = await API.put('/projects-services/grid', gridData);
  return response.data;
};




// Capabilities //
export const fetchCapabilitiesHeader = async () => {
  const response = await API.get('/capabilities/header');
  return response.data;
};

/**
 * Update Header Banner details for Capabilities page
 */
export const updateCapabilitiesHeader = async (headerData) => {
  const response = await API.put('/capabilities/header', headerData);
  return response.data;
};

export const fetchCapabilitiesOverview = async () => {
  const response = await API.get('/capabilities/overview');
  return response.data;
};

/**
 * Update Overview Section details for Capabilities page
 */
export const updateCapabilitiesOverview = async (overviewData) => {
  const response = await API.put('/capabilities/overview', overviewData);
  return response.data;
};

export const fetchExecutionScope = async () => {
  const response = await API.get('/capabilities/execution-scope');
  return response.data;
};

/**
 * Update Execution Scope & Standards details for Capabilities page
 */
export const updateExecutionScope = async (scopeData) => {
  const response = await API.put('/capabilities/execution-scope', scopeData);
  return response.data;
};

export const fetchWhyEss = async () => {
  const response = await API.get('/capabilities/why-ess');
  return response.data;
};

/**
 * Update Industries Served & Why ESS details
 */
export const updateWhyEss = async (whyEssData) => {
  const response = await API.put('/capabilities/why-ess', whyEssData);
  return response.data;
};



/**
 * Fetch Header Banner details for After-Sales & Warranty Services page
 */
export const fetchAfterSalesHeader = async () => {
  const response = await API.get('/after-sales/header');
  return response.data;
};

/**
 * Update Header Banner details for After-Sales & Warranty Services page
 */
export const updateAfterSalesHeader = async (headerData) => {
  const response = await API.put('/after-sales/header', headerData);
  return response.data;
};


export const fetchAfterSalesOverview = async () => {
  const response = await API.get('/after-sales/overview');
  return response.data;
};

/**
 * Update Overview Section details for After-Sales page
 */
export const updateAfterSalesOverview = async (overviewData) => {
  const response = await API.put('/after-sales/overview', overviewData);
  return response.data;
};

export const fetchAfterSalesServiceScope = async () => {
  const response = await API.get('/after-sales/service-scope');
  return response.data;
};

/**
 * Update Service Scope & Certified Engineers section for After-Sales page
 */
export const updateAfterSalesServiceScope = async (scopeData) => {
  const response = await API.put('/after-sales/service-scope', scopeData);
  return response.data;
};

export const fetchAfterSalesWhyUs = async () => {
  const response = await API.get('/after-sales/why-us');
  return response.data;
};

/**
 * Update After-Sales Industries Served & Why Choose Us details
 */
export const updateAfterSalesWhyUs = async (whyUsData) => {
  const response = await API.put('/after-sales/why-us', whyUsData);
  return response.data;
};