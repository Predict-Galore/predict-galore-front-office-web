/**
 * SEARCH TRANSFORMERS
 *
 * Business logic for data transformation
 */

import type { BackendSearchResponse, PopularItemsResponse, SearchResponse } from '../api/types';
import type { PopularItem } from '../model/types';

export class SearchTransformer {
  /**
   * Transform API search response to domain model
   */
  static transformSearchResponse(response: BackendSearchResponse): SearchResponse {
    return {
      results: response.data || [],
      total: response.total || 0,
      hasMore: response.hasMore || false,
    };
  }

  /**
   * Transform popular items response
   */
  static transformPopularItems(response: PopularItemsResponse): PopularItem[] {
    return response.data || [];
  }
}
