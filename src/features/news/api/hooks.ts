/**
 * NEWS API HOOKS
 *
 * TanStack Query hooks for news
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { NewsService } from './service';
import { NewsTransformer } from '../lib/transformers';
import type { GetNewsRequest, NewsListResponse } from './types';
import { newsKeys } from './index';

const logger = createLogger('NewsHooks');

// ==================== QUERY HOOKS ====================

/**
 * Get news hook
 */
export function useNews(filters: GetNewsRequest = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: newsKeys.list(filters),
    queryFn: () => NewsService.getNews(filters),
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Get news item hook
 */
export function useNewsItem(id: number | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: newsKeys.detail(id || 0),
    queryFn: () => {
      if (!id) {
        throw new Error('News ID is required');
      }
      return NewsService.getNewsItem(id);
    },
    enabled: options?.enabled !== false && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Get featured news hook
 */
export function useFeaturedNews(limit: number = 5) {
  const filters: GetNewsRequest = {
    page: 1,
    pageSize: limit * 2, // Fetch more to ensure we get enough featured items
  };

  const { data, ...query } = useNews(filters);

  return {
    ...query,
    featuredNews: data?.items?.filter((item) => item.isFeatured).slice(0, limit) || [],
    allNews: data,
  };
}

/**
 * Get breaking news hook
 */
export function useBreakingNews(limit: number = 3) {
  return useQuery({
    queryKey: newsKeys.breaking(),
    queryFn: () => NewsService.getBreakingNews(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes (breaking news changes frequently)
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Get news by category hook
 */
export function useCategoryNews(category: string, page: number = 1, pageSize: number = 10) {
  const filters: GetNewsRequest = { category, page, pageSize };
  return useNews(filters);
}

/**
 * Search news hook
 */
export function useSearchNews(searchTerm: string, page: number = 1, pageSize: number = 10) {
  const filters: GetNewsRequest = { search: searchTerm, page, pageSize };
  return useNews(filters, { enabled: !!searchTerm && searchTerm.trim().length >= 2 });
}

/**
 * Get related news hook
 */
export function useRelatedNews(currentNewsId: number, category?: string, limit: number = 4) {
  const filters: GetNewsRequest = {
    category,
    page: 1,
    pageSize: limit + 1, // Get one extra to filter out current
  };

  const { data, ...query } = useNews(filters);

  const relatedNews =
    data?.items?.filter((item) => item.id !== currentNewsId).slice(0, limit) || [];

  return {
    ...query,
    relatedNews,
  };
}

/**
 * Get news pagination hook
 */
export function useNewsPagination(filters: GetNewsRequest) {
  const { data } = useNews(filters);

  return {
    currentPage: data?.pagination.page || 1,
    pageSize: data?.pagination.pageSize || 10,
    totalPages: data?.pagination.totalPages || 0,
    totalItems: data?.pagination.total || 0,
    hasNextPage: (data?.pagination.page || 1) < (data?.pagination.totalPages || 0),
    hasPrevPage: (data?.pagination.page || 1) > 1,
  };
}

// ==================== MUTATION HOOKS ====================

/**
 * Refresh news hook
 */
export function useRefreshNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filters?: GetNewsRequest) => NewsService.refreshNews(filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
      logger.info('News cache refreshed');
    },
    onError: (error) => {
      logger.error('Failed to refresh news', { error });
    },
  });
}

/**
 * Prefetch news hook
 */
export function usePrefetchNews() {
  const queryClient = useQueryClient();

  const prefetch = (filters: GetNewsRequest) => {
    const queryParams = NewsTransformer.buildQueryParams(filters);

    queryClient.prefetchQuery({
      queryKey: newsKeys.list(filters),
      queryFn: async () => {
        const response = await api.get<NewsListResponse>(API_ENDPOINTS.NEWS.LIST, queryParams);
        if (!response.success || !response.data) {
          throw new Error('Failed to prefetch news');
        }
        return NewsTransformer.transformNewsListResponse(response);
      },
    });
  };

  return prefetch;
}
