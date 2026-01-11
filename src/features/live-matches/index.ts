/**
 * LIVE MATCHES FEATURE - Public API
 *
 * Public exports for the live matches feature
 * This is the main entry point for using live matches functionality
 */

// API
export * from './api';

// Model
export { useLiveMatchesStore, useSelectedLiveMatch, useDetailedLiveMatch } from './model/store';
export type * from './model/types';

// Components
export * from './components';

// Lib utilities (if needed externally)
export * from './lib/utils';
export * from './lib/validators';
export * from './lib/transformers';
