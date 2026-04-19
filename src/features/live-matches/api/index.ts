/**
 * LIVE MATCHES API - Public Exports
 *
 * Public API for live matches feature
 */

// React Query keys
export const liveMatchesKeys = {
  all: ['live-matches'] as const,
  scores: (sport?: string) => [...liveMatchesKeys.all, 'scores', sport] as const,
  dashboard: () => [...liveMatchesKeys.all, 'dashboard'] as const,
  bySport: (sport: string) => [...liveMatchesKeys.all, 'sport', sport] as const,
  detailedMatch: (matchId: string) => [...liveMatchesKeys.all, 'match', matchId] as const,
  fixtureScores: (fixtureId: number) => [...liveMatchesKeys.all, 'fixture', fixtureId] as const,
  leagueScores: (leagueId: number) => [...liveMatchesKeys.all, 'league', leagueId] as const,
};

// Service
export { LiveMatchesService } from './service';

// Hooks
export {
  useLiveScoresQuery,
  useFixtureScoresQuery,
  useLeagueScoresQuery,
  useDetailedLiveMatchQuery,
  useRefreshLiveScores,
} from './hooks';

// Types
export type {
  GetLiveScoresRequest,
  GetFixtureScoresRequest,
  GetLeagueScoresRequest,
  GetDetailedMatchRequest,
  BackendFixture,
  BackendLiveScoresResponse,
  BackendMatchDetailResponse,
  LiveScoresResponse,
} from './types';
