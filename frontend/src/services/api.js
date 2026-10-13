import axios from 'axios';
import { clientMockStore } from './clientMockStore';

// Validate environment configuration
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Base URL configuration
const API_BASE_URL = rawBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000, // Quick timeout to fall back gracefully if server offline
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('bhoomishield_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for auth token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Seamless Client-Side Mock Fallback on Network Outage
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend is unreachable or placeholder production domain is used (common on Netlify frontend deployment)
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (API_BASE_URL && API_BASE_URL.includes('your-deployed-backend-domain'));

    if (isNetworkError && error.config) {
      console.warn(
        `[BhoomiShield Client Simulation]: Backend unreachable at '${error.config.url}'. Engaging seamless client-side demo datastore.`
      );
      try {
        let reqData = {};
        if (error.config.data) {
          if (typeof error.config.data === 'string') {
            try {
              reqData = JSON.parse(error.config.data);
            } catch (_) {
              reqData = {};
            }
          } else if (typeof error.config.data === 'object') {
            reqData = error.config.data;
          }
        }

        const mockData = clientMockStore.handleRequest(
          error.config.method || 'get',
          error.config.url || '',
          reqData
        );
        return {
          data: mockData,
          status: 200,
          statusText: 'OK (Demo Simulation Mode)',
          headers: {},
          config: error.config,
        };
      } catch (mockErr) {
        if (mockErr.response) return Promise.reject(mockErr);
      }
    }

    let friendlyMessage = 'An unexpected error occurred. Please try again.';

    if (!error.response) {
      friendlyMessage =
        'Backend server is currently unreachable. Please check if the BhoomiShield API server is running on the configured address.';
    } else {
      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 401:
          friendlyMessage = serverMessage || 'Session expired or invalid credentials. Please log in again.';
          try {
            localStorage.removeItem('bhoomishield_token');
            localStorage.removeItem('bhoomishield_user');
            window.dispatchEvent(new Event('bhoomishield_auth_expired'));
          } catch (_) {}
          break;
        case 403:
          friendlyMessage = serverMessage || 'Access denied. You do not have permission for this action.';
          break;
        case 404:
          friendlyMessage = serverMessage || 'Requested property record was not found.';
          break;
        case 429:
          friendlyMessage = 'Too many requests. Please slow down and try again shortly.';
          break;
        case 500:
          friendlyMessage = serverMessage || 'Internal server error. The verification node reported an issue.';
          break;
        default:
          friendlyMessage = serverMessage || `Server returned error (${status}).`;
      }
    }

    error.userFriendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
