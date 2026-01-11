/**
 * NEWS FEATURE - Public API
 *
 * Public exports for the news feature
 * This is the main entry point for using news functionality
 */

// API
export * from './api';

// Model
export { useNewsStore } from './model/store';
export type * from './model/types';

// Components
export * from './components';

// Lib utilities (if needed externally)
export * from './lib/utils';
export * from './lib/validators';
export * from './lib/transformers';
