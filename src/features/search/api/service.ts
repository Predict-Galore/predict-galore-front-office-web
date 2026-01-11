/**
 * SEARCH SERVICE
 *
 * Application layer - Business logic and API calls for search
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { SearchTransformer } from '../lib/transformers';
import type {
  SearchRequest,
  BackendSearchResponse,
  PopularItemsResponse,
  SearchResponse,
} from './types';
import type { PopularItem } from '../model/types';

const logger = createLogger('SearchService');

/**
 * Search Service Class
 * Handles all search-related API calls
 */
export class SearchService {
  /**
   * Search for items
   */
  static async search(request: SearchRequest): Promise<SearchResponse> {
    logger.info('Search request', { query: request.query, type: request.type });

    try {
      const params: Record<string, string | number> = {
        query: request.query,
      };

      if (request.type && request.type !== 'all') {
        params.type = request.type;
      }

      if (request.page) {
        params.page = request.page;
      }

      if (request.pageSize) {
        params.pageSize = request.pageSize;
      }

      const response = await api.get<BackendSearchResponse>(API_ENDPOINTS.SEARCH.QUERY, params);

      return SearchTransformer.transformSearchResponse(response);
    } catch (error) {
      logger.error('Search failed', { error, request });
      throw error;
    }
  }

  /**
   * Get popular/trending items
   */
  static async getPopularItems(country?: string): Promise<PopularItem[]> {
    logger.info('Get popular items request', { country });

    try {
      const params: Record<string, string> = {};
      if (country) {
        params.country = country;
      }

      const response = await api.get<PopularItemsResponse>(API_ENDPOINTS.SEARCH.POPULAR, params);

      return SearchTransformer.transformPopularItems(response);
    } catch (error) {
      logger.error('Get popular items failed', { error, country });
      throw error;
    }
  }
}
