/**
 * API configuration constants
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API endpoints
export const ENDPOINTS = {
  HEALTH: '/api/health',
  DASHBOARD: '/api/dashboard',
  EXAMS: '/api/exams',
  FOLDERS: '/api/folders',
  UPLOAD: '/api/upload',
};

