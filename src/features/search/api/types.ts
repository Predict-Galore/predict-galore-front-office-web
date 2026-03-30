/**
 * SEARCH API TYPES
 *
 * API-specific types for search feature
 */

import type { SearchType, SearchResult, PopularItem } from '../model/types';

// ==================== API REQUEST TYPES ====================
export interface SearchRequest {
  q: string;
  limit?: number;
}

// Legacy request shape used by some callers
export interface LegacySearchRequest {
  query: string;
  type?: SearchType;
  page?: number;
  pageSize?: number;
}

// ==================== API RESPONSE TYPES ====================

/**
 * Backend response from GET /api/v1/search?q=&limit=
 * The backend may return various shapes; we handle them flexibly.
 */
export interface BackendSearchResponse {
  success?: boolean;
  message?: string;
  errors?: string | null;
  data?:
    | SearchResult[]
    | {
        items?: SearchResult[];
        results?: SearchResult[];
        total?: number;
        page?: number;
        pageSize?: number;
        hasMore?: boolean;
      };
  // flat array fallback
  results?: SearchResult[];
  total?: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

export interface PopularItemsResponse {
  data: PopularItem[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}
