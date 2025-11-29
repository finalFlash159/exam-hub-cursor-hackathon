/**
 * Health API service
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    return await apiRequest({
      method: 'GET',
      url: ENDPOINTS.HEALTH,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

