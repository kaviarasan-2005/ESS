// ecoPhysicsService.js — ECO Physics brand page API calls
import API from './apiCore';

export const fetchEcoPhysicsBanner = async () => {
  const response = await API.get('/eco-physics/banner');
  return response.data;
};

export const updateEcoPhysicsBanner = async (bannerData) => {
  const response = await API.put('/eco-physics/banner', bannerData);
  return response.data;
};

export const fetchEcoPhysicsOverview = async () => {
  const response = await API.get('/eco-physics/overview');
  return response.data;
};

export const updateEcoPhysicsOverview = async (overviewData) => {
  const response = await API.put('/eco-physics/overview', overviewData);
  return response.data;
};

export const fetchEcoPhysicsPrecision = async () => {
  const response = await API.get('/eco-physics/precision');
  return response.data;
};

export const updateEcoPhysicsPrecision = async (precisionData) => {
  const response = await API.put('/eco-physics/precision', precisionData);
  return response.data;
};

export const fetchEcoPhysicsRangeSupport = async () => {
  const response = await API.get('/eco-physics/range-support');
  return response.data;
};

export const updateEcoPhysicsRangeSupport = async (data) => {
  const response = await API.put('/eco-physics/range-support', data);
  return response.data;
};
