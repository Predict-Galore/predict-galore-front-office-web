/**
 * PREDICTIONS SERVICE
 *
 * Application layer - Business logic for predictions
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { isApiError } from '@/shared/lib/errors';
import { PredictionTransformer } from '../lib/transformers';
import { validatePredictionFilters } from '../lib/validators';
import type {
  Sport,
  League,
  Prediction,
  PredictionPagination,
  DetailedPrediction,
  BettingMarket,
  LeagueTableEntry,
} from '../model/types';
import type {
  GetPredictionsRequest,
  SportsResponse,
  LeaguesResponse,
  PredictionsResponse,
} from './types';

const logger = createLogger('PredictionService');

/**
 * Predictions Service Class
 * Handles all prediction-related API calls and business logic
 */
export class PredictionService {
  /**
   * Get all sports
   */
  static async getSports(): Promise<Sport[]> {
    logger.info('Fetching sports');

    try {
      const response = await api.get<SportsResponse | Sport[]>(API_ENDPOINTS.PREDICTIONS.SPORTS);

      const sports = PredictionTransformer.transformSportsResponse(response);
      logger.info('Sports fetched successfully', { count: sports.length });

      return sports;
    } catch (error) {
      logger.error('Failed to fetch sports', { error });
      throw error;
    }
  }

  /**
   * Get leagues for a specific sport
   */
  static async getLeagues(sportId: number): Promise<League[]> {
    if (!sportId || sportId < 0) {
      throw new Error('Invalid sport ID');
    }

    logger.info('Fetching leagues', { sportId });

    try {
      const response = await api.get<LeaguesResponse | League[]>(
        API_ENDPOINTS.PREDICTIONS.LEAGUES(sportId)
      );

      const leagues = PredictionTransformer.transformLeaguesResponse(response);
      logger.info('Leagues fetched successfully', { sportId, count: leagues.length });

      return leagues;
    } catch (error) {
      logger.error('Failed to fetch leagues', { error, sportId });
      throw error;
    }
  }

  /**
   * Get predictions with filters
   */
  static async getPredictions(filters: GetPredictionsRequest): Promise<{
    predictions: Prediction[];
    pagination: PredictionPagination;
  }> {
    // Business logic validation
    const validation = validatePredictionFilters(filters);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const queryParams = PredictionTransformer.buildQueryParams({
      sportId: filters.sportId,
      leagueId: filters.leagueId,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
      status: filters.status ?? 'active', // always fetch only active predictions
    });

    logger.info('Fetching predictions', { filters, queryParams });

    try {
      const response = await api.get<PredictionsResponse>(
        API_ENDPOINTS.PREDICTIONS.LIST,
        queryParams
      );

      const result = PredictionTransformer.transformPredictionsResponse(response);
      logger.info('Predictions fetched successfully', {
        count: result.predictions.length,
        pagination: result.pagination,
      });

      return result;
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 403) {
          logger.debug('Predictions access forbidden (403)', { filters });
        } else if (error.status && error.status >= 500) {
          logger.debug('Predictions server error (5xx)', { status: error.status, filters });
        } else {
          logger.error('Failed to fetch predictions', { error, filters });
        }
      } else {
        logger.error('Failed to fetch predictions', { error, filters });
      }
      throw error;
    }
  }

  /**
   * Refresh predictions data
   */
  static async refreshPredictions(filters: GetPredictionsRequest): Promise<{
    predictions: Prediction[];
    pagination: PredictionPagination;
  }> {
    logger.info('Refreshing predictions', { filters });
    return this.getPredictions({ ...filters, page: 1 });
  }

  /**
   * Get prediction by id (includes picks)
   * Returns the raw backend data object alongside the transformed prediction.
   */
  static async getPredictionById(id: number): Promise<{
    prediction: Prediction;
    detailed?: DetailedPrediction;
    picks?: unknown;
    raw: Record<string, unknown>;
  }> {
    if (!id || id < 0) {
      throw new Error('Invalid prediction ID');
    }

    logger.info('Fetching prediction by id', { id });

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<any>(API_ENDPOINTS.PREDICTIONS.BY_ID(id));

      // Backend always returns: { success, message, errors, data: { ... } }
      // The api client returns the full JSON as-is, so we unwrap .data here.
      const data: Record<string, unknown> =
        response?.success !== undefined
          ? (response.data as Record<string, unknown>)
          : (response as Record<string, unknown>);

      if (!data) {
        throw new Error('No prediction data found in response');
      }

      logger.info('Prediction data keys:', { keys: Object.keys(data) });

      // Extract team names from matchLabel (e.g. "Burnley vs Brighton")
      // or fall back to parsing title
      let homeTeamName = 'Home Team';
      let awayTeamName = 'Away Team';

      const matchLabel = data.matchLabel as string | undefined;
      const title = data.title as string | undefined;

      if (matchLabel && matchLabel.includes(' vs ')) {
        const parts = matchLabel.split(' vs ');
        homeTeamName = parts[0].trim();
        awayTeamName = parts[1].trim();
      } else if (title) {
        const m = title.match(/Prediction for (.+) vs (.+)/i);
        if (m) {
          homeTeamName = m[1].trim();
          awayTeamName = m[2].trim();
        }
      }

      const prediction: Prediction = {
        id: (data.id as number) || 0,
        homeTeam: { id: 0, name: homeTeamName, logoUrl: '', shortName: homeTeamName },
        awayTeam: { id: 0, name: awayTeamName, logoUrl: '', shortName: awayTeamName },
        predictedScore: '0-0',
        status: ((data.status as string) || ((data.isActive as boolean) ? 'Prediction' : 'FT')) as Prediction['status'],
        startTime: (data.kickoffUtc as string) || (data.scheduledTime as string) || '',
        competition: (data.league as string) || 'N/A',
        sportId: 0,
        leagueId: (data.leagueId as number) || 0,
        confidence: (data.accuracy as number) || 0,
        picksCount: (data.picks as unknown[])?.length || 0,
        accuracy: (data.accuracy as number) || 0,
      };

      return {
        prediction,
        picks: data.picks,
        raw: data,
      };
    } catch (error) {
      logger.error('Failed to fetch prediction by id', { error, id });
      throw error;
    }
  }

  /**
   * Get prediction for a selected match (detailed match prediction)
   */
  static async getDetailedMatch(matchId: number): Promise<{
    prediction: Prediction;
    detailed: DetailedPrediction;
  }> {
    if (!matchId || matchId < 0) {
      throw new Error('Invalid match ID');
    }

    logger.info('Fetching prediction for match', { matchId });

    try {
      const response = await api.get<{
        prediction: Prediction;
        detailed: DetailedPrediction;
      }>(API_ENDPOINTS.PREDICTIONS.MATCH(matchId));

      logger.info('Prediction for match fetched successfully', { matchId });
      return response;
    } catch (error) {
      logger.error('Failed to fetch prediction for match', { error, matchId });
      throw error;
    }
  }

  /**
   * Get betting odds for a match
   */
  static async getMatchOdds(matchId: number): Promise<BettingMarket[]> {
    if (!matchId || matchId < 0) {
      throw new Error('Invalid match ID');
    }

    logger.info('Fetching match odds', { matchId });

    try {
      const response = await api.get<{ data: BettingMarket[] }>(
        API_ENDPOINTS.PREDICTIONS.ODDS(matchId)
      );

      logger.info('Match odds fetched successfully', {
        matchId,
        count: response.data?.length || 0,
      });
      return response.data || [];
    } catch (error) {
      logger.error('Failed to fetch match odds', { error, matchId });
      throw error;
    }
  }

  /**
   * Get league table (optional seasonYear query param)
   * Returns empty array if the league has no standings (404) — not an error.
   */
  static async getLeagueTable(leagueId: number, seasonYear?: number): Promise<LeagueTableEntry[]> {
    if (!leagueId || leagueId < 0) {
      throw new Error('Invalid league ID');
    }

    logger.info('Fetching league table', { leagueId, seasonYear });

    try {
      const queryParams = seasonYear != null ? { seasonYear } : undefined;
      const response = await api.get<{ data: LeagueTableEntry[] } | LeagueTableEntry[]>(
        API_ENDPOINTS.LEAGUES.TABLE(leagueId),
        queryParams
      );

      const entries = Array.isArray(response) ? response : (response?.data ?? []);
      logger.info('League table fetched successfully', { leagueId, count: entries.length });
      return entries;
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        // 404 is expected — league simply has no standings data yet
        logger.debug('League table not found (404)', { leagueId });
        return [];
      }
      logger.warn('Failed to fetch league table', { leagueId, status: isApiError(error) ? error.status : 'unknown' });
      throw error;
    }
  }
}
