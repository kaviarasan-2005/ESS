// authService.js — Auth-related API calls
import API, { forceLogout } from './apiCore';

export const adminLogin = async (username, password) => {
  const response = await API.post('/auth/login', {
    username: String(username).trim(),
    password: String(password).trim(),
  });

  const token = response.data?.access_token || response.data?.token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    throw new Error('No access_token returned from server response.');
  }

  return response.data;
};

export const adminRegister = async (username, password, email) => {
  const response = await API.post('/auth/register', {
    username: String(username).trim(),
    password: String(password).trim(),
    email: String(email || '').trim(),
  });
  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const adminChangePassword = async (currentPassword, newPassword) => {
  const response = await API.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};

/**
 * Forgot Password — reset by username only, no current password required.
 * Calls POST /api/auth/reset-password (public endpoint, no auth token needed).
 */
export const adminResetPassword = async (username, newPassword) => {
  const response = await API.post('/auth/reset-password', {
    username: String(username).trim(),
    new_password: String(newPassword).trim(),
    confirm_password: String(newPassword).trim(),
  });
  return response.data;
};

/**
 * Log out the current admin — clears the token and redirects to login.
 * Use this for explicit logout button clicks.
 */
export const adminLogout = () => {
  forceLogout();
};
