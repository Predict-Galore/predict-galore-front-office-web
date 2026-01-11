/**
 * SEARCH API TYPES
 *
 * API-specific types for search feature
 */

import type { SearchType, SearchResult, PopularItem } from '../model/types';

export interface SearchRequest {
  query: string;
  type?: SearchType;
  page?: number;
  pageSize?: number;
}

export interface BackendSearchResponse {
  data: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PopularItemsResponse {
  data: PopularItem[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}
