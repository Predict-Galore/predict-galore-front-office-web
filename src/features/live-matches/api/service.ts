/**
 * LIVE MATCHES SERVICE
 *
 * Application layer - Business logic for live matches
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { USE_MOCK_DATA, USE_MOCK_ON_ERROR } from '@/shared/constants/data-source';
import { LiveMatchesTransformer } from '../lib/transformers';
import { validateLiveMatchesFilter, validateMatchId, validateFixtureId } from '../lib/validators';
import {
  getMockDetailedLiveMatch,
  getMockLiveScores,
  mockLiveScoresResponse,
} from '../lib/mock-data';
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

    if (USE_MOCK_DATA) {
      logger.debug('Returning mock live scores (mock mode enabled)');
      return getMockLiveScores(filters);
    }

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
      if (USE_MOCK_ON_ERROR) {
        logger.warn('Falling back to mock live scores after error');
        return getMockLiveScores(filters);
      }
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

    if (USE_MOCK_DATA) {
      const match = mockLiveScoresResponse.sections
        .flatMap((s) => s.matches)
        .find((m) => m.id === String(fixtureId));
      return match || null;
    }

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

    if (USE_MOCK_DATA) {
      const matches = mockLiveScoresResponse.sections.flatMap((section) =>
        section.matches.filter((match) => match.competition?.includes('League'))
      );
      return matches;
    }

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

    if (USE_MOCK_DATA) {
      return getMockDetailedLiveMatch(matchId);
    }

    try {
      // This would need a specific endpoint for detailed match
      // For now, we'll create mock data
      // In production, this would call API_ENDPOINTS.LIVE.DETAILED_MATCH(matchId)

      const detailedMatch: DetailedLiveMatch = {
        id: `detailed-${matchId}`,
        matchId: matchId,
        currentMinute: 45,
        addedTime: 3,
        half: 'first',
        events: [],
        commentary: [],
        stats: {
          homeTeam: {
            form: ['W', 'W', 'D', 'L'],
            recentForm: ['L', 'D', 'W', 'L', 'W'],
            headToHeadWins: ['W', 'W', 'D', 'L'],
            goalsPerGame: 2.1,
            goalsConcededPerGame: 1.2,
            winPercentage: 75,
            possessionPercentage: 58,
            cleanSheets: 12,
            shotsOnTarget: 6,
            totalShots: 14,
            corners: 5,
            fouls: 12,
            offsides: 2,
            yellowCards: 2,
            redCards: 0,
          },
          awayTeam: {
            form: ['W', 'W', 'D', 'L'],
            recentForm: ['L', 'D', 'W', 'L', 'W'],
            headToHeadWins: ['W', 'W', 'D', 'L'],
            goalsPerGame: 2.1,
            goalsConcededPerGame: 1.2,
            winPercentage: 75,
            possessionPercentage: 58,
            cleanSheets: 12,
            shotsOnTarget: 6,
            totalShots: 14,
            corners: 5,
            fouls: 12,
            offsides: 2,
            yellowCards: 2,
            redCards: 0,
          },
          homePossession: 58,
          awayPossession: 42,
          homeShotsOnTarget: 6,
          awayShotsOnTarget: 3,
          homeTotalShots: 14,
          awayTotalShots: 8,
          homeCorners: 5,
          awayCorners: 2,
          homeFouls: 12,
          awayFouls: 15,
          homeYellowCards: 2,
          awayYellowCards: 3,
          homeRedCards: 0,
          awayRedCards: 0,
          homeOffsides: 2,
          awayOffsides: 1,
          homeTopScorer: {
            id: '1',
            name: 'Top Scorer',
            position: 'Forward',
            rating: 9.0,
            age: 23,
            height: '178cm',
            weight: '72kg',
            matches: 16,
            goals: 5,
            assists: 3,
            yellowCards: 3,
            teamId: 'home',
          },
          awayTopScorer: {
            id: '2',
            name: 'Top Scorer',
            position: 'Forward',
            rating: 8.2,
            age: 29,
            height: '172cm',
            weight: '69kg',
            matches: 18,
            goals: 4,
            assists: 2,
            yellowCards: 5,
            teamId: 'away',
          },
        },
        lastUpdated: new Date().toISOString(),
        nextEventEstimate: '50th minute',
      };

      logger.info('Detailed match fetched successfully', { matchId });

      return detailedMatch;
    } catch (error) {
      logger.error('Failed to fetch detailed match', { error, matchId });
      if (USE_MOCK_ON_ERROR) {
        logger.warn('Falling back to mock detailed match after error');
        return getMockDetailedLiveMatch(matchId);
      }
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
