/**
 * LIVE MATCHES SERVICE
 *
 * Application layer - Business logic for live matches
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { LiveMatchesTransformer } from '../lib/transformers';
import { validateLiveMatchesFilter, validateMatchId, validateFixtureId } from '../lib/validators';
import type { Match, DetailedLiveMatch } from '../model/types';
import type {
  GetLiveScoresRequest,
  BackendLiveScoresResponse,
  BackendFixture,
  LiveScoresResponse,
} from './types';

const logger = createLogger('LiveMatchesService');

/**
 * Live Matches Service Class
 * Handles all live matches-related API calls and business logic
 */
export class LiveMatchesService {
  /**
   * Get live scores
   */
  static async getLiveScores(filters?: GetLiveScoresRequest): Promise<LiveScoresResponse> {
    // Business logic validation
    if (filters) {
      const validation = validateLiveMatchesFilter(filters);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
    }

    logger.info('Fetching live scores', { filters });

    try {
      const backendData = await api.get<BackendLiveScoresResponse>(API_ENDPOINTS.LIVE.SCORES);

      const response = LiveMatchesTransformer.transformBackendResponse(backendData);

      // Filter by sport if specified
      if (filters?.sport) {
        response.sections = response.sections.map((section) => ({
          ...section,
          matches: section.matches.filter((match) => match.sport === filters.sport),
        }));
        response.totalMatches = response.sections.reduce(
          (acc, section) => acc + section.matches.length,
          0
        );
      }

      logger.info('Live scores fetched successfully', {
        sectionsCount: response.sections.length,
        totalMatches: response.totalMatches,
      });

      return response;
    } catch (error) {
      logger.error('Failed to fetch live scores', { error });
      throw error;
    }
  }

  /**
   * Get fixture scores by fixture id
   */
  static async getFixtureScores(fixtureId: number): Promise<Match | null> {
    const validation = validateFixtureId(fixtureId);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    logger.info('Fetching fixture scores', { fixtureId });

    try {
      const response = await api.get<
        BackendFixture | BackendLiveScoresResponse | { data: BackendFixture }
      >(API_ENDPOINTS.LIVE.FIXTURE(fixtureId));

      let fixture: BackendFixture | undefined;
      if (Array.isArray(response)) {
        fixture = response[0];
      } else if (response && typeof response === 'object' && 'data' in response) {
        const data = (response as { data?: BackendFixture }).data;
        fixture = Array.isArray(data) ? data[0] : data;
      } else if (response && 'providerFixtureId' in response) {
        fixture = response as BackendFixture;
      } else {
        fixture = (response as BackendLiveScoresResponse).data?.[0];
      }

      if (!fixture) {
        logger.error('Fixture not found', { fixtureId });
        throw new Error(`Fixture ${fixtureId} not found`);
      }

      const transformedFixture = LiveMatchesTransformer.transformFixture(fixture);
      logger.info('Fixture scores fetched successfully', { fixtureId });
      return transformedFixture;
    } catch (error) {
      logger.error('Failed to fetch fixture scores', { error, fixtureId });
      throw error;
    }
  }

  /**
   * Get live match details for a league by league id
   */
  static async getLeagueScores(leagueId: number): Promise<Match[]> {
    logger.info('Fetching league scores', { leagueId });

    try {
      const response = await api.get<BackendLiveScoresResponse | { data: BackendFixture[] }>(
        API_ENDPOINTS.LIVE.LEAGUE(leagueId)
      );

      const fixtures: BackendFixture[] = Array.isArray(response)
        ? response
        : (response as { data?: BackendFixture[] }).data ?? (response as BackendLiveScoresResponse).data ?? [];

      const matches = fixtures.map((fixture) =>
        LiveMatchesTransformer.transformFixture(fixture)
      );

      logger.info('League scores fetched successfully', { leagueId, count: matches.length });
      return matches;
    } catch (error) {
      logger.error('Failed to fetch league scores', { error, leagueId });
      throw error;
    }
  }

  /**
   * Get detailed match by fixture id.
   * Uses the live scores list (GET /api/v1/livescores) and finds the fixture by providerFixtureId.
   */
  static async getDetailedMatch(matchId: string): Promise<DetailedLiveMatch | null> {
    const validation = validateMatchId(matchId);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const fixtureId = parseInt(matchId, 10);
    if (Number.isNaN(fixtureId)) {
      throw new Error('Invalid match id');
    }

    logger.info('Fetching detailed match from live scores', { matchId, fixtureId });

    try {
      const response = await api.get<BackendLiveScoresResponse>(API_ENDPOINTS.LIVE.SCORES);

      const fixtures: BackendFixture[] = Array.isArray(response)
        ? response
        : (response as BackendLiveScoresResponse)?.data ?? [];

      const fixture = fixtures.find((f) => f.providerFixtureId === fixtureId);

      if (!fixture) {
        logger.debug('Fixture not found in live scores', { matchId });
        return null;
      }

      const detailed = LiveMatchesTransformer.fixtureToDetailedLiveMatch(fixture, matchId);
      logger.info('Detailed match fetched successfully', { matchId });
      return detailed;
    } catch (error) {
      logger.error('Failed to fetch detailed match', { error, matchId });
      throw error;
    }
  }

  /**
   * Refresh live scores
   */
  static async refreshLiveScores(filters?: GetLiveScoresRequest): Promise<LiveScoresResponse> {
    logger.info('Refreshing live scores', { filters });
    return this.getLiveScores(filters);
  }
}
