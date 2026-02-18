/**
 * SEARCH SERVICE
 *
 * Uses GET /api/v1/search?q={query}&limit={limit}
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import type {
  SearchRequest,
  BackendSearchResponse,
  SearchResponse,
} from './types';
import type { SearchResult, SearchType } from '../model/types';

const logger = createLogger('SearchService');

/**
 * Extract results array from various possible backend response shapes.
 * Handles grouped responses like { players: [], teams: [], matches: [], leagues: [] }
 */
function extractResults(response: BackendSearchResponse): SearchResult[] {
  if (!response) return [];

  // 1. response is an array directly
  if (Array.isArray(response)) return response as unknown as SearchResult[];

  // 2. response.data is an array
  if (Array.isArray(response.data)) return response.data;

  // 3. response.data is an object with grouped results (players, teams, matches, leagues)
  if (response.data && typeof response.data === 'object') {
    const d = response.data as Record<string, unknown>;
    
    // Check if it's a grouped response
    const hasGroupedData = ['players', 'teams', 'matches', 'leagues'].some(key => Array.isArray(d[key]));
    
    if (hasGroupedData) {
      const results: SearchResult[] = [];
      
      // Extract and transform players
      if (Array.isArray(d.players)) {
        results.push(...d.players.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          type: 'players' as SearchType,
          title: item.name as string,
          subtitle: (item.subTitle || item.subText) as string | undefined,
          imageUrl: item.imageUrl as string | undefined,
          metadata: item.meta as Record<string, unknown> | undefined,
        })));
      }
      
      // Extract and transform teams
      if (Array.isArray(d.teams)) {
        results.push(...d.teams.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          type: 'teams' as SearchType,
          title: item.name as string,
          subtitle: (item.subTitle || item.subText || item.league) as string | undefined,
          imageUrl: item.imageUrl as string | undefined,
          metadata: item.meta as Record<string, unknown> | undefined,
        })));
      }
      
      // Extract and transform matches
      if (Array.isArray(d.matches)) {
        results.push(...d.matches.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          type: 'matches' as SearchType,
          title: item.name as string,
          subtitle: (item.subTitle || item.subText) as string | undefined,
          imageUrl: (item.imageUrl || (item.meta as Record<string, unknown>)?.homeLogo) as string | undefined,
          metadata: item.meta as Record<string, unknown> | undefined,
        })));
      }
      
      // Extract and transform leagues
      if (Array.isArray(d.leagues)) {
        results.push(...d.leagues.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          type: 'leagues' as SearchType,
          title: item.name as string,
          subtitle: (item.subTitle || item.subText) as string | undefined,
          imageUrl: item.imageUrl as string | undefined,
          metadata: item.meta as Record<string, unknown> | undefined,
        })));
      }
      
      return results;
    }
    
    // Fallback to items or results arrays
    if (Array.isArray(d.items)) return d.items as SearchResult[];
    if (Array.isArray(d.results)) return d.results as SearchResult[];
  }

  // 4. response.results is an array
  if (Array.isArray(response.results)) return response.results;

  return [];
}

export class SearchService {
  /**
   * Search using GET /api/v1/search?q=&limit=
   */
  static async search(request: SearchRequest): Promise<SearchResponse> {
    const q = request.q?.trim();
    if (!q) {
      return { results: [], total: 0, hasMore: false };
    }

    logger.info('Search request', { q, limit: request.limit });

    const params: Record<string, string | number> = { q };
    if (request.limit) {
      params.limit = request.limit;
    }

    const response = await api.get<BackendSearchResponse>(
      API_ENDPOINTS.SEARCH.QUERY,
      params
    );

    const results = extractResults(response);
    
    // Get total from response.data.totalResults or fallback to results length
    const total = (response.data && typeof response.data === 'object' && 'totalResults' in response.data) 
      ? (response.data as Record<string, unknown>).totalResults as number
      : results.length;

    logger.info('Search results', { count: results.length, total });

    return {
      results,
      total,
      hasMore: false,
    };
  }
}
