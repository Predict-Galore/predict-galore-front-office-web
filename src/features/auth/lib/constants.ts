/**
 * Auth Constants
 * Feature-specific constants
 */

import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';

/** Cookie name used by middleware to allow protected routes */
export const AUTH_COOKIE_NAME = 'auth-token';

export const AUTH_CONSTANTS = {
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    PREDICTION: '/dashboard/predictions',
    DASHBOARD: '/dashboard',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    TERMS: '/terms',
    PRIVACY: '/privacy',
  },
  COLORS: {
    PRIMARY: '#16a34a',
    PRIMARY_DARK: '#15803d',
    PRIMARY_LIGHT: '#bbf7d0',
  },
  STYLES: {
    BUTTON_SHADOW: '0 4px 12px rgba(22, 163, 74, 0.3)',
  },
  SOCIAL_PROVIDERS: [
    { name: 'Google', icon: FaGoogle, color: '#DB4437' },
    { name: 'Facebook', icon: FaFacebook, color: '#4267B2' },
    { name: 'Twitter', icon: FaTwitter, color: '#1DA1F2' },
  ],
  DEFAULT_USER_TYPE_ID: 2,
  DEFAULT_COUNTRY_CODE: '234',
  VERIFICATION: {
    TOKEN_LENGTH: 6,
    RESEND_COOLDOWN: 60,
    SESSION_STORAGE_KEY: 'pendingVerificationEmail',
  },
  MESSAGES: {
    VERIFICATION: {
      SUCCESS: 'Email verified successfully!',
      ERROR: 'Invalid verification code. Please try again.',
      RESEND_SUCCESS: 'New verification code sent! Please check your email.',
      RESEND_ERROR: 'Failed to resend verification code.',
      NO_EMAIL: 'No email found for verification. Please restart registration.',
    },
  },
} as const;
