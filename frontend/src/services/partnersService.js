// partnersService.js — Partners page API calls
import API from './apiCore';

export const fetchPartnersPage = async () => {
  const response = await API.get('/partners');
  return response.data;
};

export const updatePartnersSection = async (sectionName, data) => {
  const response = await API.patch(`/partners/section/${sectionName}`, data);
  return response.data;
};

export const fetchProcessInstrumentationApplications = async () => {
  const response = await API.get('/process-instrumentation/applications');
  return response.data;
};

export const updateProcessInstrumentationApplications = async (applicationsData) => {
  const response = await API.put('/process-instrumentation/applications', applicationsData);
  return response.data;
};