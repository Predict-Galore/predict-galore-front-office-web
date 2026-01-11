/**
 * SHARED CONSTANTS
 *
 * Common constants used across the application
 */

export const ROUTES = {
  // Public routes
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Protected routes (require authentication)
  PROTECTED: {
    DASHBOARD: '/dashboard',
    ANALYTICS: '/analytics',
    USERS: '/users',
    SETTINGS: '/settings',
    PROFILE: '/profile',
  },

  // API routes
  API: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    DASHBOARD: '/api/dashboard',
  },
} as const;

// Helper functions for dynamic routes
export const getDynamicRoute = {
  userProfile: (userId: string) => `/users/${userId}`,
  resetPassword: (token: string) => `/reset-password?token=${token}`,
  verifyEmail: (token: string) => `/verify-email?token=${token}`,
} as const;
