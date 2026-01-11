/**
 * PREDICTIONS SERVICE
 *
 * Application layer - Business logic for predictions
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { USE_MOCK_DATA, USE_MOCK_ON_ERROR } from '@/shared/constants/data-source';
import { PredictionTransformer } from '../lib/transformers';
import { validatePredictionFilters, validateDateRange } from '../lib/validators';
import {
  getMockPredictionsResponse,
  mockBettingMarkets,
  mockDetailedPrediction,
  mockLeagueTable,
  mockLeagues,
  mockPredictions,
  mockSports,
} from '../lib/mock-data';
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

    if (USE_MOCK_DATA) {
      logger.debug('Returning mock sports (mock mode enabled)');
      return mockSports;
    }

    try {
      const response = await api.get<SportsResponse | Sport[]>(API_ENDPOINTS.PREDICTIONS.SPORTS);

      const sports = PredictionTransformer.transformSportsResponse(response);
      logger.info('Sports fetched successfully', { count: sports.length });

      return sports;
    } catch (error) {
      logger.error('Failed to fetch sports', { error });
      if (USE_MOCK_ON_ERROR) {
        logger.warn('Falling back to mock sports after error');
        return mockSports;
      }
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

    if (USE_MOCK_DATA) {
      logger.debug('Returning mock leagues (mock mode enabled)');
      return mockLeagues.filter((league) => league.sportId === sportId);
    }

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

    // Validate date range if provided
    if (filters.fromUtc && filters.toUtc) {
      const dateValidation = validateDateRange(filters.fromUtc, filters.toUtc);
      if (!dateValidation.isValid) {
        throw new Error(dateValidation.error);
      }
    }

    // Set default date range if not provided (next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const queryParams = PredictionTransformer.buildQueryParams({
      sportId: filters.sportId,
      leagueId: filters.leagueId,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
      fromUtc: filters.fromUtc || now.toISOString(),
      toUtc: filters.toUtc || nextWeek.toISOString(),
      status: filters.status || 'Prediction',
    });

    logger.info('Fetching predictions', { filters, queryParams });

    if (USE_MOCK_DATA) {
      logger.debug('Returning mock predictions (mock mode enabled)');
      return getMockPredictionsResponse(filters);
    }

    try {
      const response = await api.get<PredictionsResponse>(
        API_ENDPOINTS.PREDICTIONS.MATCHES(filters.sportId, filters.leagueId),
        queryParams
      );

      const result = PredictionTransformer.transformPredictionsResponse(response);
      logger.info('Predictions fetched successfully', {
        count: result.predictions.length,
        pagination: result.pagination,
      });

      return result;
    } catch (error) {
      logger.error('Failed to fetch predictions', { error, filters });
      if (USE_MOCK_ON_ERROR) {
        logger.warn('Falling back to mock predictions after error');
        return getMockPredictionsResponse(filters);
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
   * Get detailed match prediction
   */
  static async getDetailedMatch(matchId: number): Promise<{
    prediction: Prediction;
    detailed: DetailedPrediction;
  }> {
    if (!matchId || matchId < 0) {
      throw new Error('Invalid match ID');
    }

    logger.info('Fetching detailed match', { matchId });

    if (USE_MOCK_DATA) {
      const fallback = mockPredictions.find((p) => p.id === matchId) || mockPredictions[0];
      return {
        prediction: fallback,
        detailed: { ...mockDetailedPrediction, matchId },
      };
    }

    try {
      const response = await api.get<{
        prediction: Prediction;
        detailed: DetailedPrediction;
      }>(API_ENDPOINTS.PREDICTIONS.DETAIL(matchId));

      logger.info('Detailed match fetched successfully', { matchId });
      return response;
    } catch (error) {
      logger.error('Failed to fetch detailed match', { error, matchId });
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

    if (USE_MOCK_DATA) {
      logger.debug('Returning mock odds (mock mode enabled)');
      return mockBettingMarkets;
    }

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
   * Get league table
   */
  static async getLeagueTable(leagueId: number): Promise<LeagueTableEntry[]> {
    if (!leagueId || leagueId < 0) {
      throw new Error('Invalid league ID');
    }

    logger.info('Fetching league table', { leagueId });

    if (USE_MOCK_DATA) {
      logger.debug('Returning mock league table (mock mode enabled)');
      return mockLeagueTable;
    }

    try {
      const response = await api.get<{ data: LeagueTableEntry[] }>(
        API_ENDPOINTS.PREDICTIONS.LEAGUE_TABLE(leagueId)
      );

      logger.info('League table fetched successfully', {
        leagueId,
        count: response.data?.length || 0,
      });
      return response.data || [];
    } catch (error) {
      logger.error('Failed to fetch league table', { error, leagueId });
      throw error;
    }
  }
}
