/**
 * SEARCH API HOOKS
 *
 * TanStack Query hooks for search
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchService } from './service';
import { createLogger } from '@/shared/api';
import type { SearchRequest } from './types';
import { searchKeys } from './index';

const logger = createLogger('SearchHooks');

/**
 * Search query hook
 */
export function useSearchQuery(request: SearchRequest, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: searchKeys.search(request.query, request.type, request.page),
    queryFn: () => SearchService.search(request),
    enabled: options?.enabled !== false && !!request.query && request.query.trim().length >= 2,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

/**
 * Get popular items hook
 */
export function usePopularItemsQuery(country?: string) {
  return useQuery({
    queryKey: searchKeys.popular(country),
    queryFn: () => SearchService.getPopularItems(country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Search mutation hook (for manual triggering)
 */
export function useSearchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SearchRequest) => SearchService.search(request),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        searchKeys.search(variables.query, variables.type, variables.page),
        data
      );
      logger.info('Search mutation successful', {
        query: variables.query,
        resultsCount: data.results.length,
      });
    },
    onError: (error) => {
      logger.error('Search mutation failed', { error });
    },
  });
}
