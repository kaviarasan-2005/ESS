// uploadService.js — File upload API calls
import API from './apiCore';

export const uploadImageFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await API.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
