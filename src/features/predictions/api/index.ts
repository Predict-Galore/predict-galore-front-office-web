/**
 * PREDICTIONS API - Public Exports
 *
 * Public API for predictions feature
 */

// React Query keys
export const predictionKeys = {
  all: ['predictions'] as const,
  sports: () => [...predictionKeys.all, 'sports'] as const,
  leagues: (sportId?: number) => [...predictionKeys.all, 'leagues', sportId] as const,
  predictions: (sportId?: number, leagueId?: number, page?: number) =>
    [...predictionKeys.all, 'predictions', sportId, leagueId, page] as const,
  predictionById: (id: number) => [...predictionKeys.all, 'prediction', id] as const,
  detailedMatch: (matchId: number) => [...predictionKeys.all, 'detailed-match', matchId] as const,
  matchOdds: (matchId: number) => [...predictionKeys.all, 'match-odds', matchId] as const,
  leagueTable: (leagueId: number, seasonYear?: number) =>
    [...predictionKeys.all, 'league-table', leagueId, seasonYear] as const,
};

// Service
export { PredictionService } from './service';

// Hooks
export {
  useSports,
  useLeagues,
  usePredictions,
  useRefreshSports,
  useRefreshLeagues,
  useRefreshPredictions,
  useRefreshAllData,
  usePredictionById,
  useDetailedMatch,
  useMatchOdds,
  useLeagueTable,
} from './hooks';

// Types
export type {
  GetSportsRequest,
  GetLeaguesRequest,
  GetPredictionsRequest,
  SportsResponse,
  LeaguesResponse,
  PredictionsResponse,
  BackendPredictionResponse,
} from './types';
