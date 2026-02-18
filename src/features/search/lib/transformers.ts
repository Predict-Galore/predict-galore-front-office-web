/**
 * SEARCH TRANSFORMERS
 *
 * Business logic for data transformation
 */

import type { BackendSearchResponse, PopularItemsResponse, SearchResponse } from '../api/types';
import type { PopularItem, SearchResult } from '../model/types';

export class SearchTransformer {
  /**
   * Transform API search response to domain model
   */
  static transformSearchResponse(response: BackendSearchResponse): SearchResponse {
    // Handle different response formats
    let results: SearchResult[] = [];
    
    if (response.data) {
      if (Array.isArray(response.data)) {
        results = response.data;
      } else if (typeof response.data === 'object') {
        results = (response.data.items || response.data.results || []) as SearchResult[];
      }
    } else if (response.results) {
      results = response.results;
    }
    
    return {
      results,
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
