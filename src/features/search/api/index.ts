/**
 * SEARCH API - Public Exports
 */

// React Query keys
export const searchKeys = {
  all: ['search'] as const,
  search: (query: string, limit?: number) => [...searchKeys.all, 'query', query, limit] as const,
};

// Service
export { SearchService } from './service';

// Hooks
export { useSearchQuery } from './hooks';

// Types
export type { SearchRequest, BackendSearchResponse, SearchResponse } from './types';
