// settingsService.js — Site settings API calls
import API from './apiCore';

export const fetchNavbarSettings = async () => {
  const response = await API.get('/settings/navbar');
  return response.data;
};

export const updateNavbarSettings = async (navbarData) => {
  const response = await API.put('/settings/navbar', navbarData);
  return response.data;
};
