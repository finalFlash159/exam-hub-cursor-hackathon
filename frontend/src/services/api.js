/**
 * API Service Layer
 * All backend API calls go through this service
 */

import { API_ENDPOINTS, apiFetch, uploadFile as uploadFileUtil } from '../config/api';

// ============================================
// Dashboard API
// ============================================

export const dashboardAPI = {
  getStats: () => apiFetch(API_ENDPOINTS.dashboard),
};

// ============================================
// Exam API
// ============================================

export const examAPI = {
  // Get all exams
  getAll: (skip = 0, limit = 100) => 
    apiFetch(`${API_ENDPOINTS.exams}?skip=${skip}&limit=${limit}`),
  
  // Get single exam
  getById: (id, includeAnswers = false) => 
    apiFetch(`${API_ENDPOINTS.exam(id)}?include_answers=${includeAnswers}`),
  
  // Create exam
  create: (examData) => 
    apiFetch(API_ENDPOINTS.exams, {
      method: 'POST',
      body: JSON.stringify(examData),
    }),
  
  // Update exam
  update: (id, examData) => 
    apiFetch(API_ENDPOINTS.exam(id), {
      method: 'PUT',
      body: JSON.stringify(examData),
    }),
  
  // Delete exam
  delete: (id) => 
    apiFetch(API_ENDPOINTS.exam(id), {
      method: 'DELETE',
    }),
  
  // Add question to exam
  addQuestion: (examId, questionData) => 
    apiFetch(API_ENDPOINTS.examQuestions(examId), {
      method: 'POST',
      body: JSON.stringify(questionData),
    }),
  
  // Update question
  updateQuestion: (examId, questionId, questionData) => 
    apiFetch(API_ENDPOINTS.examQuestion(examId, questionId), {
      method: 'PUT',
      body: JSON.stringify(questionData),
    }),
  
  // Delete question
  deleteQuestion: (examId, questionId) => 
    apiFetch(API_ENDPOINTS.examQuestion(examId, questionId), {
      method: 'DELETE',
    }),
};

// ============================================
// Exam Attempt API
// ============================================

export const attemptAPI = {
  // Start new attempt
  start: (examId, studentData) => 
    apiFetch(API_ENDPOINTS.startAttempt(examId), {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
  
  // Submit attempt
  submit: (attemptId, answers) => 
    apiFetch(API_ENDPOINTS.submitAttempt(attemptId), {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  
  // Get attempt details
  getById: (attemptId) => 
    apiFetch(API_ENDPOINTS.getAttempt(attemptId)),
  
  // Get all attempts for an exam
  getByExam: (examId, skip = 0, limit = 100) => 
    apiFetch(`${API_ENDPOINTS.examAttempts(examId)}?skip=${skip}&limit=${limit}`),
};

// ============================================
// Folder API
// ============================================

export const folderAPI = {
  // Get all folders
  getAll: () => 
    apiFetch(API_ENDPOINTS.folders),
  
  // Get single folder
  getById: (id) => 
    apiFetch(API_ENDPOINTS.folder(id)),
  
  // Create folder
  create: (folderData) => 
    apiFetch(API_ENDPOINTS.folders, {
      method: 'POST',
      body: JSON.stringify(folderData),
    }),
  
  // Update folder
  update: (id, folderData) => 
    apiFetch(API_ENDPOINTS.folder(id), {
      method: 'PUT',
      body: JSON.stringify(folderData),
    }),
  
  // Delete folder
  delete: (id) => 
    apiFetch(API_ENDPOINTS.folder(id), {
      method: 'DELETE',
    }),
};

// ============================================
// Upload API
// ============================================

export const uploadAPI = {
  // Upload file
  upload: (file, folderId = null) => 
    uploadFileUtil(file, folderId),
  
  // Get all files
  getAll: (folderId = null) => {
    const url = folderId 
      ? `${API_ENDPOINTS.upload}?folder_id=${folderId}`
      : API_ENDPOINTS.upload;
    return apiFetch(url);
  },
  
  // Get file by ID
  getById: (id) => 
    apiFetch(API_ENDPOINTS.uploadFile(id)),
  
  // Delete file
  delete: (id) => 
    apiFetch(API_ENDPOINTS.uploadFile(id), {
      method: 'DELETE',
    }),
};

// ============================================
// Chatbot API
// ============================================

export const chatbotAPI = {
  // Send message
  query: (message, conversationHistory = []) => 
    apiFetch(API_ENDPOINTS.chatbot, {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      }),
    }),
  
  // Get context
  getContext: () => 
    apiFetch(API_ENDPOINTS.chatbotContext),
};

// ============================================
// Health Check
// ============================================

export const healthAPI = {
  check: () => apiFetch(API_ENDPOINTS.health),
};

