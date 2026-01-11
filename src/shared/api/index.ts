/**
 * SHARED API - Public Exports
 *
 * Public API for shared infrastructure layer
 */

// Client - Export as both apiClient and api (api is the preferred name per template)
export { default as apiClient } from './client';
export { default as api } from './client';
export type { ApiClientConfig } from './client';

// Config
export { API_CONFIG, API_ENDPOINTS } from './config';

// Logger
export { createLogger, logger } from './logger';

// Query Client
export { queryClient } from './query-client';
