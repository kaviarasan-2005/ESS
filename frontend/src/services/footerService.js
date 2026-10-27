// footerService.js — Dedicated Footer API calls (/api/footer collection)
import API from './apiCore';

/**
 * Public: fetch footer data from the dedicated footer_page collection.
 */
export const fetchFooter = async () => {
  const response = await API.get('/footer');
  return response.data;
};

/**
 * Admin: replace the entire footer document.
 */
export const updateFooter = async (payload) => {
  const response = await API.put('/footer', payload);
  return response.data;
};
