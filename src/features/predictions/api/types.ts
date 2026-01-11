/**
 * PREDICTIONS API TYPES
 *
 * API-specific types for predictions feature
 */

import type { Sport, League, Prediction, PredictionFilter } from '../model/types';

// ==================== API REQUEST TYPES ====================
export type GetSportsRequest = Record<string, never>;

export interface GetLeaguesRequest {
  sportId: number;
}

export interface GetPredictionsRequest extends PredictionFilter {
  sportId?: number;
  leagueId?: number;
  page?: number;
  pageSize?: number;
  fromUtc?: string;
  toUtc?: string;
  status?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface SportsResponse {
  data: Sport[];
}

export interface LeaguesResponse {
  data: League[];
}

export interface PredictionsResponse {
  predictions: Prediction[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface BackendPredictionResponse {
  data: Prediction[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}
