/**
 * LIVE MATCHES SERVICE
 *
 * Application layer - Business logic for live matches
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { LiveMatchesTransformer } from '../lib/transformers';
import { validateLiveMatchesFilter, validateMatchId, validateFixtureId } from '../lib/validators';
import type { Match, DetailedLiveMatch } from '../model/types';
import type { GetLiveScoresRequest, BackendLiveScoresResponse, LiveScoresResponse } from './types';

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
   * Get fixture scores
   */
  static async getFixtureScores(fixtureId: number): Promise<Match | null> {
    // Business logic validation
    const validation = validateFixtureId(fixtureId);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    logger.info('Fetching fixture scores', { fixtureId });

    try {
      const backendData = await api.get<BackendLiveScoresResponse>(API_ENDPOINTS.LIVE.SCORES);

      const fixture = backendData.data.find((f) => f.providerFixtureId === fixtureId);

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
   * Get league scores
   */
  static async getLeagueScores(leagueId: number): Promise<Match[]> {
    logger.info('Fetching league scores', { leagueId });

    try {
      const backendData = await api.get<BackendLiveScoresResponse>(API_ENDPOINTS.LIVE.SCORES);

      // Note: This is a simplified implementation
      // In a real scenario, you'd filter by leagueId from the backend
      const matches = backendData.data.map((fixture) =>
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
   * Get detailed match
   */
  static async getDetailedMatch(matchId: string): Promise<DetailedLiveMatch | null> {
    // Business logic validation
    const validation = validateMatchId(matchId);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    logger.info('Fetching detailed match', { matchId });

    try {
      // TODO: Implement proper backend endpoint for detailed match
      // For now, this will throw an error until the backend endpoint is available
      throw new Error('Detailed match endpoint not yet implemented');

      logger.info('Detailed match fetched successfully', { matchId });

      return null;
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
