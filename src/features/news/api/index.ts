/**
 * NEWS API - Public Exports
 *
 * Public API for news feature
 */

// React Query keys
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: {
    category?: string;
    page?: number;
    pageSize?: number;
    isFeatured?: boolean;
    isBreaking?: boolean;
    search?: string;
  }) => [...newsKeys.lists(), filters] as const,
  detail: (id: number) => [...newsKeys.all, 'detail', id] as const,
  featured: () => [...newsKeys.all, 'featured'] as const,
  breaking: () => [...newsKeys.all, 'breaking'] as const,
  category: (category: string) => [...newsKeys.all, 'category', category] as const,
};

// Service
export { NewsService } from './service';

// Hooks
export {
  useNews,
  useNewsItem,
  useFeaturedNews,
  useBreakingNews,
  useCategoryNews,
  useSearchNews,
  useRelatedNews,
  useNewsPagination,
  useRefreshNews,
  usePrefetchNews,
} from './hooks';

// Types
export type { GetNewsRequest, NewsResponse, NewsListResponse, NewsDetailResponse } from './types';
