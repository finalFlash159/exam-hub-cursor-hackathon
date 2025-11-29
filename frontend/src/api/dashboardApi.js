/**
 * Dashboard API service
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';

/**
 * Get dashboard statistics and recent data
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    return await apiRequest({
      method: 'GET',
      url: ENDPOINTS.DASHBOARD,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
};
