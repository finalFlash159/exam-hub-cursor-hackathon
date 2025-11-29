/**
 * Application routes configuration
 * Centralized route definitions
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  
  // Main routes
  DASHBOARD: '/dashboard',

  // Exam routes
  EXAMS: '/exams',
  EXAM_DETAIL: '/exams/:id',
  EXAM_TAKE: '/exams/:id/take',
  EXAM_RESULT: '/exams/:id/result',
  EXAM_CREATE: '/exams/create',

  // User routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HISTORY: '/history',
  EXAM_HISTORY: '/history', // Alias for consistency

  // Other pages
  FAQ: '/faq',
  PRICING: '/pricing',
  SUBJECTS: '/subjects',
  NOT_FOUND: '/404',
};

/**
 * Helper to build route with params
 * @param {string} route - Route template
 * @param {object} params - Route parameters
 * @returns {string} - Built route
 */
export const buildRoute = (route, params = {}) => {
  let builtRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`:${key}`, value);
  });
  return builtRoute;
};


