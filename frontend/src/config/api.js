/**
 * API Configuration
 * Centralized API setup for all backend calls
 */

// Get API base URL from environment variable or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Health
  health: `${API_BASE_URL}/api/health`,
  
  // Dashboard
  dashboard: `${API_BASE_URL}/api/dashboard`,
  
  // Exams
  exams: `${API_BASE_URL}/api/exams`,
  exam: (id) => `${API_BASE_URL}/api/exams/${id}`,
  examQuestions: (examId) => `${API_BASE_URL}/api/exams/${examId}/questions`,
  examQuestion: (examId, questionId) => `${API_BASE_URL}/api/exams/${examId}/questions/${questionId}`,
  
  // Exam Attempts
  startAttempt: (examId) => `${API_BASE_URL}/api/exams/${examId}/attempts`,
  submitAttempt: (attemptId) => `${API_BASE_URL}/api/exams/attempts/${attemptId}/submit`,
  getAttempt: (attemptId) => `${API_BASE_URL}/api/exams/attempts/${attemptId}`,
  examAttempts: (examId) => `${API_BASE_URL}/api/exams/${examId}/attempts`,
  
  // Folders
  folders: `${API_BASE_URL}/api/folders`,
  folder: (id) => `${API_BASE_URL}/api/folders/${id}`,
  
  // Upload
  upload: `${API_BASE_URL}/api/upload`,
  uploadFile: (id) => `${API_BASE_URL}/api/upload/${id}`,
  
  // Chatbot
  chatbot: `${API_BASE_URL}/api/chatbot/query`,
  chatbotContext: `${API_BASE_URL}/api/chatbot/context`,
};

/**
 * Generic fetch wrapper with error handling
 */
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Upload file with multipart/form-data
 */
export const uploadFile = async (file, folderId = null) => {
  const formData = new FormData();
  formData.append('file', file);

  const url = folderId 
    ? `${API_ENDPOINTS.upload}?folder_id=${folderId}`
    : API_ENDPOINTS.upload;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'File upload failed');
  }

  return await response.json();
};

