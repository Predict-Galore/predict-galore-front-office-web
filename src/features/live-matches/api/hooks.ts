/**
 * LIVE MATCHES API HOOKS
 *
 * TanStack Query hooks for live matches
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LiveMatchesService } from './service';
import { createLogger } from '@/shared/api';
import type { GetLiveScoresRequest } from './types';
import { liveMatchesKeys } from './index';

const logger = createLogger('LiveMatchesHooks');

// ==================== QUERY HOOKS ====================

/**
 * Get live scores hook
 */
export function useLiveScoresQuery(filters?: GetLiveScoresRequest) {
  return useQuery({
    queryKey: liveMatchesKeys.scores(filters?.sport),
    queryFn: () => LiveMatchesService.getLiveScores(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 2,
  });
}

/**
 * Get fixture scores hook
 */
export function useFixtureScoresQuery(fixtureId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: liveMatchesKeys.fixtureScores(fixtureId || 0),
    queryFn: () => {
      if (!fixtureId) {
        logger.debug('Skipping fixture query - no fixtureId provided');
        return Promise.resolve(null);
      }
      return LiveMatchesService.getFixtureScores(fixtureId);
    },
    enabled: options?.enabled !== false && !!fixtureId,
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
}

/**
 * Get league scores hook
 */
export function useLeagueScoresQuery(leagueId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: liveMatchesKeys.leagueScores(leagueId || 0),
    queryFn: () => {
      if (!leagueId) {
        logger.debug('Skipping league query - no leagueId provided');
        return Promise.resolve([]);
      }
      return LiveMatchesService.getLeagueScores(leagueId);
    },
    enabled: options?.enabled !== false && !!leagueId,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Get detailed match hook
 */
export function useDetailedLiveMatchQuery(matchId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: liveMatchesKeys.detailedMatch(matchId || ''),
    queryFn: () => {
      if (!matchId) {
        logger.debug('Skipping detailed match query - no matchId provided');
        return Promise.resolve(null);
      }
      return LiveMatchesService.getDetailedMatch(matchId);
    },
    enabled: options?.enabled !== false && !!matchId,
    staleTime: 15 * 1000,
    gcTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for live data
    retry: 2,
  });
}

// ==================== MUTATION HOOKS ====================

/**
 * Refresh live scores hook
 */
export function useRefreshLiveScores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filters?: GetLiveScoresRequest) => LiveMatchesService.refreshLiveScores(filters),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(liveMatchesKeys.scores(variables?.sport), data);
      queryClient.setQueryData(liveMatchesKeys.dashboard(), data);
      queryClient.invalidateQueries({ queryKey: liveMatchesKeys.all });
      logger.info('Live scores refreshed in cache', {
        sectionsCount: data.sections.length,
        totalMatches: data.totalMatches,
      });
    },
    onError: (error) => {
      logger.error('Error refreshing live scores cache', { error });
    },
  });
}
