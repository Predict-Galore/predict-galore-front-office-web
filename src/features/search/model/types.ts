/**
 * SEARCH MODEL TYPES
 *
 * Domain types and entities for search feature
 */

export type SearchType = 'all' | 'teams' | 'leagues' | 'players' | 'matches';

export interface SearchResult {
  id: string | number;
  type: SearchType;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface TeamSearchResult extends SearchResult {
  type: 'teams';
  league?: string;
  sport?: string;
}

export interface LeagueSearchResult extends SearchResult {
  type: 'leagues';
  sport?: string;
  country?: string;
}

export interface PlayerSearchResult extends SearchResult {
  type: 'players';
  team?: string;
  position?: string;
  sport?: string;
}

export interface MatchSearchResult extends SearchResult {
  type: 'matches';
  homeTeam: string;
  awayTeam: string;
  date?: string;
  status?: string;
}

export interface SearchResults {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}

export interface PopularItem {
  id: string | number;
  name: string;
  type: SearchType;
  imageUrl?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface SearchState {
  searchType: SearchType;
}
