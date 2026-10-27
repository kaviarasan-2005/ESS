// contactService.js — Contact page API calls
import API from './apiCore';

export const fetchContactPage = async () => {
  const response = await API.get('/contact');
  return response.data;
};

export const updateContactPage = async (payload) => {
  const response = await API.put('/contact', payload);
  return response.data;
};

export const updateContactSection = async (sectionName, data) => {
  const response = await API.patch(`/contact/section/${sectionName}`, data);
  return response.data;
};

export const submitContactForm = async (formData) => {
  const response = await API.post('/contact/submit', formData);
  return response.data;
};

export const fetchContactSubmissions = async () => {
  const response = await API.get('/contact/submissions');
  return response.data;
};

export const deleteContactSubmission = async (submissionId) => {
  const response = await API.delete(`/contact/submissions/${submissionId}`);
  return response.data;
};
