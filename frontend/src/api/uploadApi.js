/**
 * Upload API service
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';

/**
 * Upload a file
 * @param {File} file - File to upload
 * @param {number} folderId - Optional folder ID
 * @returns {Promise<Object>} Upload response
 */
export const uploadFile = async (file, folderId = null) => {
  try {
    console.log('UploadFile called with:', file.name, file.size, file.type);

    const formData = new FormData();
    formData.append('file', file);

    console.log('FormData created, file appended');

    const config = {
      method: 'POST',
      url: ENDPOINTS.UPLOAD,
      data: formData,
      // Don't set Content-Type for FormData - let browser set it automatically
    };

    // Add folder_id as query parameter if provided
    if (folderId !== null) {
      config.params = { folder_id: folderId };
    }

    console.log('Making API request to:', ENDPOINTS.UPLOAD);

    return await apiRequest(config);
  } catch (error) {
    console.error('Failed to upload file:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get files by folder
 * @param {number} folderId - Optional folder ID (null for root)
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} List of files
 */
export const getFiles = async (folderId = null, skip = 0, limit = 100) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: ENDPOINTS.UPLOAD,
      params: {
        folder_id: folderId,
        skip,
        limit,
      },
    });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    throw error;
  }
};

/**
 * Get file by ID
 * @param {number} fileId - File ID
 * @returns {Promise<Object>} File details
 */
export const getFile = async (fileId) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: `${ENDPOINTS.UPLOAD}/${fileId}`,
    });
  } catch (error) {
    console.error(`Failed to fetch file ${fileId}:`, error);
    throw error;
  }
};

/**
 * Delete a file
 * @param {number} fileId - File ID
 */
export const deleteFile = async (fileId) => {
  try {
    await apiRequest({
      method: 'DELETE',
      url: `${ENDPOINTS.UPLOAD}/${fileId}`,
    });
  } catch (error) {
    console.error(`Failed to delete file ${fileId}:`, error);
    throw error;
  }
};

