/**
 * SEARCH API HOOKS
 *
 * TanStack Query hooks for search
 */

import { useQuery } from '@tanstack/react-query';
import { SearchService } from './service';
import { searchKeys } from './index';

/**
 * Search query hook — calls GET /api/v1/search?q=&limit=
 */
export function useSearchQuery(q: string, options?: { enabled?: boolean; limit?: number }) {
  const trimmed = q.trim();
  const limit = options?.limit ?? 5;

  return useQuery({
    queryKey: searchKeys.search(trimmed, limit),
    queryFn: () => SearchService.search({ q: trimmed, limit }),
    enabled: options?.enabled !== false && trimmed.length >= 1,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
  });
}
