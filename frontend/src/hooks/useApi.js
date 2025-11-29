/**
 * Custom hook for API calls with loading and error states
 */

import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';

/**
 * Hook for API calls with loading and error handling
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options for the hook
 * @returns {Object} - { data, loading, error, execute }
 */
export const useApi = (apiFunction, options = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          err.message ||
                          'An error occurred';
      setError(errorMessage);

      if (options.showErrorToast !== false) {
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, enqueueSnackbar, options.showErrorToast]);

  return { data, loading, error, execute };
};

/**
 * Hook for API calls that don't need loading states
 * @param {Function} apiFunction - The API function to call
 * @returns {Function} - Execute function with error handling
 */
export const useApiAction = (apiFunction) => {
  const { enqueueSnackbar } = useSnackbar();

  const execute = useCallback(async (...args) => {
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          err.message ||
                          'An error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw err;
    }
  }, [apiFunction, enqueueSnackbar]);

  return execute;
};

