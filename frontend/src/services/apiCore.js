import axios from 'axios';

// Normalize Base URL (strips trailing slashes and redundant /api occurrences)
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

// Create Axios Instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Decode a JWT payload without verifying the signature.
 * Returns null if the token is missing or malformed.
 */
export function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/**
 * Returns true if the stored admin token is missing or its `exp` claim
 * is in the past (with a 30-second clock-skew buffer).
 */
export function isAdminTokenExpired() {
  const token = localStorage.getItem('admin_token');
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  // exp is in seconds, Date.now() is in ms
  return payload.exp * 1000 < Date.now() + 30_000;
}

/** Clear the stored admin token and redirect to the login page. */
export function forceLogout(reason = '') {
  localStorage.removeItem('admin_token');
  const url = `/admin/login${reason ? `?session=${encodeURIComponent(reason)}` : ''}`;
  window.location.replace(url);
}

// Request Interceptor: Attach JWT Bearer Token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: On 401 clear token and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const detail = error.response.data?.detail || '';
      const isExpiry = detail.toLowerCase().includes('expired');
      // Don't redirect on the login endpoint itself (avoids redirect loop)
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        forceLogout(isExpiry ? 'expired' : 'unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
