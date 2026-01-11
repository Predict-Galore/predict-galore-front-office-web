/**
 * PREDICTIONS TRANSFORMERS
 *
 * Business logic for data transformation
 */

import type { Sport, League, Prediction, PredictionPagination } from '../model/types';
import type {
  SportsResponse,
  LeaguesResponse,
  PredictionsResponse,
  BackendPredictionResponse,
} from '../api/types';

export class PredictionTransformer {
  /**
   * Transform sports response
   */
  static transformSportsResponse(response: SportsResponse | Sport[]): Sport[] {
    // Handle both array and object response formats
    if (Array.isArray(response)) {
      return response;
    }
    return response.data || [];
  }

  /**
   * Transform leagues response
   */
  static transformLeaguesResponse(response: LeaguesResponse | League[]): League[] {
    // Handle both array and object response formats
    if (Array.isArray(response)) {
      return response;
    }
    return response.data || [];
  }

  /**
   * Transform predictions response
   */
  static transformPredictionsResponse(response: PredictionsResponse | BackendPredictionResponse): {
    predictions: Prediction[];
    pagination: PredictionPagination;
  } {
    // Handle PredictionsResponse format
    if ('predictions' in response) {
      return {
        predictions: response.predictions,
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          hasMore: response.hasMore,
        },
      };
    }

    // Handle BackendPredictionResponse format
    return {
      predictions: response.data || [],
      pagination: {
        page: response.currentPage || 1,
        pageSize: response.pageSize || 20,
        total: response.totalItems || 0,
        hasMore: (response.currentPage || 1) < (response.totalPages || 1),
      },
    };
  }

  /**
   * Transform single prediction
   */
  static transformPrediction(item: Partial<Prediction> & Record<string, unknown>): Prediction {
    const fallbackTeam = { id: 0, name: 'Unknown', logoUrl: '', shortName: '' };
    const homeTeam = (item.homeTeam as Prediction['homeTeam']) ?? fallbackTeam;
    const awayTeam = (item.awayTeam as Prediction['awayTeam']) ?? fallbackTeam;

    return {
      id: Number(item.id ?? 0),
      homeTeam,
      awayTeam,
      predictedScore: String(
        item.predictedScore ?? (item as Record<string, unknown>).predicted_score ?? '0-0'
      ),
      actualScore:
        item.actualScore !== undefined
          ? String(item.actualScore)
          : ((item as Record<string, unknown>).actual_score as string | undefined),
      status: (item.status as Prediction['status']) ?? 'Prediction',
      startTime: String(
        item.startTime ??
          (item as Record<string, unknown>).start_time ??
          (item as Record<string, unknown>).dateTime ??
          (item as Record<string, unknown>).date_time ??
          ''
      ),
      stadium: item.stadium ? String(item.stadium) : undefined,
      competition: String(item.competition ?? (item as Record<string, unknown>).league ?? 'N/A'),
      round: item.round ? String(item.round) : undefined,
      sportId: Number(
        (item as Record<string, unknown>).sportId ?? (item as Record<string, unknown>).sport_id ?? 0
      ),
      leagueId: Number(
        (item as Record<string, unknown>).leagueId ??
          (item as Record<string, unknown>).league_id ??
          0
      ),
      confidence: Number(item.confidence ?? 0),
      odds: item.odds,
    };
  }

  /**
   * Build prediction query parameters
   */
  static buildQueryParams(filters: {
    sportId?: number;
    leagueId?: number;
    page?: number;
    pageSize?: number;
    fromUtc?: string;
    toUtc?: string;
    status?: string;
  }): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    if (filters.sportId) params.sportId = filters.sportId;
    if (filters.leagueId) params.leagueId = filters.leagueId;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.fromUtc) params.fromUtc = filters.fromUtc;
    if (filters.toUtc) params.toUtc = filters.toUtc;
    if (filters.status) params.status = filters.status;

    return params;
  }
}
