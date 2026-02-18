/**
 * AUTH FEATURE - Public API
 *
 * Public exports for the authentication feature
 * This is the main entry point for using auth functionality
 */

// API
export * from './api';

// Model
export { useAuthStore, useUser, useIsAuthenticated } from './model/store';
export type * from './model/types';

// Validations
export * from './validations/schemas';

// Lib utilities (if needed externally)
export * from './lib/utils';
export * from './lib/validators';
export * from './lib/transformers';
export * from './lib/constants';
// Re-export PasswordStrength from model/types (not from lib/utils to avoid duplicate)
export type { PasswordStrength } from './model/types';

// Components
export * from './components';
