/**
 * API client configuration with axios
 */

import axios from 'axios';
import { API_CONFIG } from './config';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor for adding auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('Bad Request:', data.detail || data.message || 'Invalid request');
          break;
        case 401:
          console.error('Unauthorized:', data.detail || data.message || 'Authentication required');
          // Clear invalid token
          localStorage.removeItem('authToken');
          break;
        case 403:
          console.error('Forbidden:', data.detail || data.message || 'Access denied');
          break;
        case 404:
          console.error('Not Found:', data.detail || data.message || 'Resource not found');
          break;
        case 422:
          console.error('Validation Error:', data.detail || data.message || 'Invalid data');
          break;
        case 500:
          console.error('Server Error:', data.detail || data.message || 'Internal server error');
          break;
        default:
          console.error(`API Error (${status}):`, data.detail || data.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error:', 'Unable to connect to server');
    } else {
      // Other error
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to make API calls with retry logic
export const apiRequest = async (config, retries = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    if (retries > 0 && (!error.response || error.response.status >= 500)) {
      // Retry for network errors or server errors
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return apiRequest(config, retries - 1);
    }
    throw error;
  }
};

export default apiClient;
