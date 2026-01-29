/**
 * Application route constants
 * Centralized route definitions to avoid hardcoded strings throughout the app
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  SETUP: '/setup',

  // Auth routes
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    PROFILE: '/auth/profile',
    SUBSCRIPTION: '/subscription',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Protected routes
  DASHBOARD: '/dashboard',
} as const;

// Type helper for route values
export type Route =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | (typeof ROUTES.AUTH)[keyof typeof ROUTES.AUTH];
