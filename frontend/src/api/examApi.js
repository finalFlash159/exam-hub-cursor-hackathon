/**
 * Exam API service
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';

/**
 * Get all exams with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} List of exams
 */
export const getExams = async (skip = 0, limit = 100) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: ENDPOINTS.EXAMS,
      params: { skip, limit },
    });
  } catch (error) {
    console.error('Failed to fetch exams:', error);
    throw error;
  }
};

/**
 * Get exam by ID
 * @param {number} examId - Exam ID
 * @param {boolean} includeAnswers - Whether to include correct answers (admin only)
 * @returns {Promise<Object>} Exam details
 */
export const getExam = async (examId, includeAnswers = false) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: `${ENDPOINTS.EXAMS}/${examId}`,
      params: { include_answers: includeAnswers },
    });
  } catch (error) {
    console.error(`Failed to fetch exam ${examId}:`, error);
    throw error;
  }
};

/**
 * Create a new exam
 * @param {Object} examData - Exam creation data
 * @returns {Promise<Object>} Created exam
 */
export const createExam = async (examData) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: ENDPOINTS.EXAMS,
      data: examData,
    });
  } catch (error) {
    console.error('Failed to create exam:', error);
    throw error;
  }
};

/**
 * Update an exam
 * @param {number} examId - Exam ID
 * @param {Object} examData - Exam update data
 * @returns {Promise<Object>} Updated exam
 */
export const updateExam = async (examId, examData) => {
  try {
    return await apiRequest({
      method: 'PUT',
      url: `${ENDPOINTS.EXAMS}/${examId}`,
      data: examData,
    });
  } catch (error) {
    console.error(`Failed to update exam ${examId}:`, error);
    throw error;
  }
};

/**
 * Delete an exam
 * @param {number} examId - Exam ID
 */
export const deleteExam = async (examId) => {
  try {
    await apiRequest({
      method: 'DELETE',
      url: `${ENDPOINTS.EXAMS}/${examId}`,
    });
  } catch (error) {
    console.error(`Failed to delete exam ${examId}:`, error);
    throw error;
  }
};

/**
 * Add a question to an exam
 * @param {number} examId - Exam ID
 * @param {Object} questionData - Question data
 * @returns {Promise<Object>} Created question
 */
export const addQuestion = async (examId, questionData) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: `${ENDPOINTS.EXAMS}/${examId}/questions`,
      data: questionData,
    });
  } catch (error) {
    console.error(`Failed to add question to exam ${examId}:`, error);
    throw error;
  }
};

/**
 * Update a question
 * @param {number} examId - Exam ID
 * @param {number} questionId - Question ID
 * @param {Object} questionData - Question update data
 * @returns {Promise<Object>} Updated question
 */
export const updateQuestion = async (examId, questionId, questionData) => {
  try {
    return await apiRequest({
      method: 'PUT',
      url: `${ENDPOINTS.EXAMS}/${examId}/questions/${questionId}`,
      data: questionData,
    });
  } catch (error) {
    console.error(`Failed to update question ${questionId}:`, error);
    throw error;
  }
};

/**
 * Delete a question
 * @param {number} examId - Exam ID
 * @param {number} questionId - Question ID
 */
export const deleteQuestion = async (examId, questionId) => {
  try {
    await apiRequest({
      method: 'DELETE',
      url: `${ENDPOINTS.EXAMS}/${examId}/questions/${questionId}`,
    });
  } catch (error) {
    console.error(`Failed to delete question ${questionId}:`, error);
    throw error;
  }
};

/**
 * Start an exam attempt
 * @param {number} examId - Exam ID
 * @param {Object} attemptData - Attempt data
 * @returns {Promise<Object>} Created attempt
 */
export const startAttempt = async (examId, attemptData) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: `${ENDPOINTS.EXAMS}/${examId}/attempts`,
      data: attemptData,
    });
  } catch (error) {
    console.error(`Failed to start attempt for exam ${examId}:`, error);
    throw error;
  }
};

/**
 * Submit an exam attempt
 * @param {number} attemptId - Attempt ID
 * @param {Object} submission - Submission data
 * @returns {Promise<Object>} Submitted attempt
 */
export const submitAttempt = async (attemptId, submission) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: `${ENDPOINTS.EXAMS}/attempts/${attemptId}/submit`,
      data: submission,
    });
  } catch (error) {
    console.error(`Failed to submit attempt ${attemptId}:`, error);
    throw error;
  }
};

/**
 * Get exam attempt by ID
 * @param {number} attemptId - Attempt ID
 * @returns {Promise<Object>} Attempt details
 */
export const getAttempt = async (attemptId) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: `${ENDPOINTS.EXAMS}/attempts/${attemptId}`,
    });
  } catch (error) {
    console.error(`Failed to fetch attempt ${attemptId}:`, error);
    throw error;
  }
};

/**
 * Get all attempts for an exam
 * @param {number} examId - Exam ID
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} List of attempts
 */
export const getExamAttempts = async (examId, skip = 0, limit = 100) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: `${ENDPOINTS.EXAMS}/${examId}/attempts`,
      params: { skip, limit },
    });
  } catch (error) {
    console.error(`Failed to fetch attempts for exam ${examId}:`, error);
    throw error;
  }
};

/**
 * Get attempt history for current user
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} List of attempts
 */
export const getAttemptHistory = async (skip = 0, limit = 100) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: `${ENDPOINTS.EXAMS}/attempts/history`,
      params: { skip, limit },
    });
  } catch (error) {
    console.error('Failed to fetch attempt history:', error);
    throw error;
  }
};

/**
 * Extract questions from uploaded file
 * @param {number} fileId - File ID
 * @param {string} questionType - Type of questions to extract
 * @param {number} numQuestions - Number of questions to extract
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @returns {Promise<Array>} List of extracted questions
 */
export const extractQuestionsFromFile = async (fileId, questionType = 'mcq', numQuestions = 10, difficulty = 'medium') => {
  try {
    return await apiRequest({
      method: 'POST',
      url: `${ENDPOINTS.EXAMS}/extract-questions`,
      params: {
        file_id: fileId,
        question_type: questionType,
        num_questions: numQuestions,
        difficulty: difficulty,
      },
    });
  } catch (error) {
    console.error(`Failed to extract questions from file ${fileId}:`, error);
    throw error;
  }
};

