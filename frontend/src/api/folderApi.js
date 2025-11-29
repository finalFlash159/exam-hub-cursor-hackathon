/**
 * Folder API service
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';

/**
 * Get all folders with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} List of folders
 */
export const getFolders = async (skip = 0, limit = 100) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: ENDPOINTS.FOLDERS,
      params: { skip, limit },
    });
  } catch (error) {
    console.error('Failed to fetch folders:', error);
    throw error;
  }
};

/**
 * Get folder by ID
 * @param {number} folderId - Folder ID
 * @returns {Promise<Object>} Folder details
 */
export const getFolder = async (folderId) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: `${ENDPOINTS.FOLDERS}/${folderId}`,
    });
  } catch (error) {
    console.error(`Failed to fetch folder ${folderId}:`, error);
    throw error;
  }
};

/**
 * Create a new folder
 * @param {Object} folderData - Folder creation data
 * @returns {Promise<Object>} Created folder
 */
export const createFolder = async (folderData) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: ENDPOINTS.FOLDERS,
      data: folderData,
    });
  } catch (error) {
    console.error('Failed to create folder:', error);
    throw error;
  }
};

/**
 * Update a folder
 * @param {number} folderId - Folder ID
 * @param {Object} folderData - Folder update data
 * @returns {Promise<Object>} Updated folder
 */
export const updateFolder = async (folderId, folderData) => {
  try {
    return await apiRequest({
      method: 'PUT',
      url: `${ENDPOINTS.FOLDERS}/${folderId}`,
      data: folderData,
    });
  } catch (error) {
    console.error(`Failed to update folder ${folderId}:`, error);
    throw error;
  }
};

/**
 * Delete a folder
 * @param {number} folderId - Folder ID
 */
export const deleteFolder = async (folderId) => {
  try {
    await apiRequest({
      method: 'DELETE',
      url: `${ENDPOINTS.FOLDERS}/${folderId}`,
    });
  } catch (error) {
    console.error(`Failed to delete folder ${folderId}:`, error);
    throw error;
  }
};
