/**
 * PREDICTIONS API HOOKS
 *
 * TanStack Query hooks for predictions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PredictionService } from './service';
import { createLogger } from '@/shared/api';
import type { GetPredictionsRequest } from './types';
import { predictionKeys } from './index';
import type { League, Prediction, PredictionPagination } from '../model/types';

const logger = createLogger('PredictionHooks');

// ==================== QUERY HOOKS ====================

/**
 * Get sports hook
 */
export function useSports() {
  return useQuery({
    queryKey: predictionKeys.sports(),
    queryFn: () => PredictionService.getSports(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Get leagues hook
 */
export function useLeagues(sportId?: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: predictionKeys.leagues(sportId),
    queryFn: () => {
      if (!sportId) {
        logger.debug('No sport ID provided for leagues');
        return Promise.resolve([]);
      }
      return PredictionService.getLeagues(sportId);
    },
    enabled: options?.enabled !== false && !!sportId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Get predictions hook
 */
export function usePredictions(filters: GetPredictionsRequest, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: predictionKeys.predictions(filters.sportId, filters.leagueId, filters.page),
    queryFn: () => PredictionService.getPredictions(filters),
    enabled: options?.enabled !== false && !!filters.sportId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// ==================== MUTATION HOOKS ====================

/**
 * Refresh sports hook
 */
export function useRefreshSports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PredictionService.getSports(),
    onSuccess: (data) => {
      queryClient.setQueryData(predictionKeys.sports(), data);
      logger.info('Sports data refreshed in cache', { count: data.length });
    },
    onError: (error) => {
      logger.error('Error refreshing sports cache', { error });
    },
  });
}

/**
 * Refresh leagues hook
 */
export function useRefreshLeagues() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sportId: number) => PredictionService.getLeagues(sportId),
    onSuccess: (data, sportId) => {
      queryClient.setQueryData(predictionKeys.leagues(sportId), data);
      logger.info('Leagues data refreshed in cache', { sportId, count: data.length });
    },
    onError: (error, sportId) => {
      logger.error('Error refreshing leagues cache', { error, sportId });
    },
  });
}

/**
 * Refresh predictions hook
 */
export function useRefreshPredictions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filters: GetPredictionsRequest) => PredictionService.refreshPredictions(filters),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        predictionKeys.predictions(variables.sportId, variables.leagueId, variables.page),
        data
      );
      logger.info('Predictions data refreshed in cache', {
        sportId: variables.sportId,
        leagueId: variables.leagueId,
        count: data.predictions.length,
      });
    },
    onError: (error, variables) => {
      logger.error('Error refreshing predictions cache', {
        error,
        sportId: variables.sportId,
        leagueId: variables.leagueId,
      });
    },
  });
}

/**
 * Refresh all data hook
 */
export function useRefreshAllData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { sportId?: number; leagueId?: number }) => {
      const { sportId, leagueId } = variables;

      logger.info('Refreshing all data', { sportId, leagueId });

      // Fetch sports first
      const sports = await PredictionService.getSports();

      // Fetch leagues if sportId is provided
      let leagues: League[] = [];
      if (sportId) {
        leagues = await PredictionService.getLeagues(sportId);
      }

      // Fetch predictions if sportId is provided
      let predictionsResult: { predictions: Prediction[]; pagination: PredictionPagination } = {
        predictions: [],
        pagination: { page: 1, pageSize: 20, total: 0, hasMore: false },
      };

      if (sportId) {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        predictionsResult = await PredictionService.getPredictions({
          sportId,
          leagueId,
          page: 1,
          pageSize: 20,
          fromUtc: now.toISOString(),
          toUtc: nextWeek.toISOString(),
          status: 'Prediction',
        });
      }

      logger.info('All data refreshed successfully', {
        sportsCount: sports.length,
        leaguesCount: leagues.length,
        predictionsCount: predictionsResult.predictions.length,
      });

      return { sports, leagues, predictions: predictionsResult };
    },
    onSuccess: (data) => {
      // Update all caches
      queryClient.setQueryData(predictionKeys.sports(), data.sports);

      if (data.leagues.length > 0) {
        const sportId = data.leagues[0]?.sportId;
        if (sportId) {
          queryClient.setQueryData(predictionKeys.leagues(sportId), data.leagues);
        }
      }

      if (data.predictions.predictions.length > 0) {
        const sportId = data.predictions.predictions[0]?.sportId;
        const leagueId = data.predictions.predictions[0]?.leagueId;
        queryClient.setQueryData(
          predictionKeys.predictions(sportId, leagueId, 1),
          data.predictions
        );
      }

      logger.info('All data refreshed in cache', {
        sportsCount: data.sports.length,
        leaguesCount: data.leagues.length,
        predictionsCount: data.predictions.predictions.length,
      });
    },
    onError: (error) => {
      logger.error('Error refreshing all data cache', { error });
    },
  });
}

/**
 * Get detailed match hook
 */
export function useDetailedMatch(matchId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: predictionKeys.detailedMatch(matchId || 0),
    queryFn: () => {
      if (!matchId) {
        logger.debug('Skipping detailed match query - no matchId provided');
        return Promise.resolve(null);
      }
      return PredictionService.getDetailedMatch(matchId);
    },
    enabled: options?.enabled !== false && !!matchId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Get match odds hook
 */
export function useMatchOdds(matchId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: predictionKeys.matchOdds(matchId || 0),
    queryFn: () => {
      if (!matchId) {
        logger.debug('Skipping match odds query - no matchId provided');
        return Promise.resolve([]);
      }
      return PredictionService.getMatchOdds(matchId);
    },
    enabled: options?.enabled !== false && !!matchId,
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Get league table hook
 */
export function useLeagueTable(leagueId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: predictionKeys.leagueTable(leagueId || 0),
    queryFn: () => {
      if (!leagueId) {
        logger.debug('Skipping league table query - no leagueId provided');
        return Promise.resolve([]);
      }
      return PredictionService.getLeagueTable(leagueId);
    },
    enabled: options?.enabled !== false && !!leagueId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}
