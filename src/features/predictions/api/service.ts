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
   */
  static async getPredictionById(id: number): Promise<{
    prediction: Prediction;
    detailed?: DetailedPrediction;
    picks?: unknown;
  }> {
    if (!id || id < 0) {
      throw new Error('Invalid prediction ID');
    }

    logger.info('Fetching prediction by id', { id });

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<any>(API_ENDPOINTS.PREDICTIONS.BY_ID(id));
      
      logger.info('Raw API response for prediction by id:', { 
        id, 
        responseKeys: response ? Object.keys(response) : [],
        hasData: !!response?.data,
        dataKeys: response?.data ? Object.keys(response.data) : []
      });

      // Backend returns: { success, message, errors, data: { id, title, analysis, picks, ... } }
      // Extract the actual data from the nested structure
      let data;
      if (response.success !== undefined) {
        // Response is wrapped in {success, message, errors, data}
        data = response.data;
      } else if (response.data && response.data.success !== undefined) {
        // Response is nested deeper
        data = response.data.data;
      } else {
        // Response is direct data
        data = response.data || response;
      }
      
      if (!data) {
        throw new Error('No prediction data found in response');
      }
      
      logger.info('Extracted prediction data:', { 
        id, 
        dataKeys: Object.keys(data),
        hasTitle: !!data.title,
        hasPicks: !!data.picks,
        picksCount: data.picks?.length || 0
      });
      
      // Extract team names from title (format: "Prediction for Team A vs Team B")
      let homeTeamName = 'Home Team';
      let awayTeamName = 'Away Team';
      
      if (data.title) {
        const titleMatch = data.title.match(/Prediction for (.+) vs (.+)/i);
        if (titleMatch) {
          homeTeamName = titleMatch[1].trim();
          awayTeamName = titleMatch[2].trim();
        }
      }
      
      // Build prediction object from backend data - ensure all required fields have values
      const prediction: Prediction = {
        id: data.id || 0,
        homeTeam: {
          id: 0,
          name: homeTeamName,
          logoUrl: '',
          shortName: homeTeamName,
        },
        awayTeam: {
          id: 0,
          name: awayTeamName,
          logoUrl: '',
          shortName: awayTeamName,
        },
        predictedScore: '0-0',
        status: data.isActive ? 'Prediction' : 'FT',
        startTime: data.scheduledTime || '',
        competition: 'N/A',
        sportId: 0,
        leagueId: 0,
        confidence: data.accuracy || 0,
        picksCount: data.picks?.length || 0,
        accuracy: data.accuracy || 0,
      };

      // Build detailed prediction - only include data that exists in backend response
      const detailed: DetailedPrediction = {
        predictedOutcome: data.picks?.[0]?.selectionLabel,
        reasoning: data.analysis || data.expertAnalysis,
        confidenceLevel: data.accuracy,
        expertAnalysis: data.expertAnalysis || data.analysis,
        totalVotes: 0,
        // Only include team stats if the flag is true
        ...(data.includeTeamForm && {
          homeTeamStats: {
            recentForm: [],
            headToHeadWins: [],
            goalsPerGame: 0,
            goalsConcededPerGame: 0,
            winPercentage: 0,
            possessionPercentage: 0,
            cleanSheets: 0,
          },
          awayTeamStats: {
            recentForm: [],
            headToHeadWins: [],
            goalsPerGame: 0,
            goalsConcededPerGame: 0,
            winPercentage: 0,
            possessionPercentage: 0,
            cleanSheets: 0,
          },
        }),
        // Only include top scorers if the flag is true
        ...(data.includeTopScorers && {
          homeTopScorer: undefined,
          awayTopScorer: undefined,
        }),
      };

      logger.info('Prediction by id transformed successfully', { 
        id, 
        hasPrediction: !!prediction,
        hasDetailed: !!detailed,
        hasPicks: !!data.picks,
        predictionId: prediction.id,
        detailedKeys: Object.keys(detailed)
      });
      
      return {
        prediction,
        detailed,
        picks: data.picks,
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
   */
  static async getLeagueTable(
    leagueId: number,
    seasonYear?: number
  ): Promise<LeagueTableEntry[]> {
    if (!leagueId || leagueId < 0) {
      throw new Error('Invalid league ID');
    }

    logger.info('Fetching league table', { leagueId, seasonYear });

    try {
      const queryParams =
        seasonYear != null ? { seasonYear } : undefined;
      const response = await api.get<{ data: LeagueTableEntry[] } | LeagueTableEntry[]>(
        API_ENDPOINTS.LEAGUES.TABLE(leagueId),
        queryParams
      );

      const entries = Array.isArray(response) ? response : response?.data ?? [];
      logger.info('League table fetched successfully', {
        leagueId,
        count: entries.length,
      });
      return entries;
    } catch (error) {
      logger.error('Failed to fetch league table', { error, leagueId });
      throw error;
    }
  }
}
