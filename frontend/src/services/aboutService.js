// src/services/aboutService.js
import API from './apiCore';

// ==========================================
// 1. HEADER BANNER APIS
// ==========================================
export const fetchAboutHeader = async () => {
  const response = await API.get('/about/header');
  return response.data;
};

export const updateAboutHeader = async (headerData) => {
  const response = await API.put('/about/header', headerData);
  return response.data;
};

// ==========================================
// 2. OUR STORY APIS
// ==========================================
export const fetchAboutStory = async () => {
  const response = await API.get('/about/story');
  return response.data;
};

export const updateAboutStory = async (storyData) => {
  const response = await API.put('/about/story', storyData);
  return response.data;
};

// ==========================================
// 3. SPECIALIZED DIVISIONS APIS
// ==========================================
export const fetchAboutSpecializedDivisions = async () => {
  const response = await API.get('/about/specialized-divisions');
  return response.data;
};

export const updateAboutSpecializedDivisions = async (divisionsData) => {
  const response = await API.put('/about/specialized-divisions', divisionsData);
  return response.data;
};

// ==========================================
// 4. COMBINED PAGE API (COMPATIBILITY)
// ==========================================
export const fetchAboutPage = async () => {
  const response = await API.get('/about');
  return response.data;
};