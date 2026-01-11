/**
 * SEARCH API - Public Exports
 */

// React Query keys
export const searchKeys = {
  all: ['search'] as const,
  search: (query: string, type?: string, page?: number) =>
    [...searchKeys.all, 'query', query, type, page] as const,
  popular: (country?: string) => [...searchKeys.all, 'popular', country] as const,
};

// Service
export { SearchService } from './service';

// Hooks
export { useSearchQuery, usePopularItemsQuery, useSearchMutation } from './hooks';

// Types
export type { SearchRequest, BackendSearchResponse, PopularItemsResponse } from './types';

// Re-export SearchResponse with alias to avoid conflict with model types
export type { SearchResponse as SearchApiResponse } from './types';
