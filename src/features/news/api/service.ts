/**
 * NEWS SERVICE
 *
 * Application layer - Business logic for news
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { NewsTransformer } from '../lib/transformers';
import { validateNewsFilters, validateNewsId } from '../lib/validators';
import type { NewsItem, NewsPagination } from '../model/types';
import type { GetNewsRequest, NewsListResponse, NewsDetailResponse } from './types';

const logger = createLogger('NewsService');

/**
 * News Service Class
 * Handles all news-related API calls and business logic
 */
export class NewsService {
  /**
   * Get news list with filters
   */
  static async getNews(filters: GetNewsRequest = {}): Promise<{
    items: NewsItem[];
    pagination: NewsPagination;
  }> {
    // Business logic validation
    const validation = validateNewsFilters(filters);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const queryParams = NewsTransformer.buildQueryParams(filters);

    logger.info('Fetching news', { filters, queryParams });

    try {
      const response = await api.get<NewsListResponse>(API_ENDPOINTS.NEWS.LIST, queryParams);

      logger.debug('News API response received', {
        success: response.success,
        hasData: !!response.data,
        hasItems: Array.isArray(response.data) ? response.data.length > 0 : !!(response.data && 'items' in response.data && response.data.items),
        itemsCount: Array.isArray(response.data) ? response.data.length : (response.data && 'items' in response.data ? response.data.items?.length : 0),
        message: response.message
      });

      if (!response.success || !response.data) {
        logger.error('Invalid news response', { response });
        throw new Error(response.message || 'Failed to fetch news');
      }

      const result = NewsTransformer.transformNewsListResponse(response);

      logger.info('News fetched successfully', {
        count: result.items.length,
        pagination: result.pagination,
      });

      return result;
    } catch (error) {
      logger.error('Failed to fetch news', { error, filters });
      throw error;
    }
  }

  /**
   * Get news item by ID
   */
  static async getNewsItem(id: number): Promise<NewsItem> {
    // Business logic validation
    const validation = validateNewsId(id);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    logger.info('Fetching news item', { id });

    try {
      const response = await api.get<NewsDetailResponse>(API_ENDPOINTS.NEWS.DETAIL(id));

      if (!response.success || !response.data) {
        logger.error('News item not found', { id });
        throw new Error(response.message || `News ${id} not found`);
      }

      const newsItem = NewsTransformer.transformNewsResponse(response.data);

      logger.info('News item fetched successfully', { id });

      return newsItem;
    } catch (error) {
      logger.error('Failed to fetch news item', { error, id });
      throw error;
    }
  }

  /**
   * Get breaking news
   */
  static async getBreakingNews(limit: number = 3): Promise<NewsItem[]> {
    logger.info('Fetching breaking news', { limit });

    try {
      const response = await api.get<NewsListResponse>(API_ENDPOINTS.NEWS.BREAKING);

      if (!response.success || !response.data) {
        return [];
      }

      const result = NewsTransformer.transformNewsListResponse(response);
      return result.items.filter((item) => item.isBreaking).slice(0, limit);
    } catch (error) {
      logger.error('Failed to fetch breaking news', { error });
      return [];
    }
  }

  /**
   * Get news by category
   */
  static async getNewsByCategory(
    category: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    items: NewsItem[];
    pagination: NewsPagination;
  }> {
    return this.getNews({ category, page, pageSize });
  }

  /**
   * Search news
   */
  static async searchNews(
    searchTerm: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    items: NewsItem[];
    pagination: NewsPagination;
  }> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters');
    }

    return this.getNews({ search: searchTerm.trim(), page, pageSize });
  }

  /**
   * Refresh news
   */
  static async refreshNews(filters: GetNewsRequest = {}): Promise<{
    items: NewsItem[];
    pagination: NewsPagination;
  }> {
    logger.info('Refreshing news', { filters });
    return this.getNews({ ...filters, page: 1 });
  }
}
