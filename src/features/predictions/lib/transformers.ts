/**
 * PREDICTIONS TRANSFORMERS
 *
 * Business logic for data transformation
 */

import type { Sport, League, Prediction, PredictionPagination } from '../model/types';
import type { SportsResponse, LeaguesResponse } from '../api/types';

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
  static transformPredictionsResponse(response: unknown): {
    predictions: Prediction[];
    pagination: PredictionPagination;
  } {
    const typedResponse = response as Record<string, unknown>;

    // Handle PredictionsResponse format
    if ('predictions' in typedResponse) {
      return {
        predictions: typedResponse.predictions as Prediction[],
        pagination: {
          page: typedResponse.page as number,
          pageSize: typedResponse.pageSize as number,
          total: typedResponse.total as number,
          hasMore: typedResponse.hasMore as boolean,
        },
      };
    }

    // Handle new backend format with data.items
    if (
      typedResponse.data &&
      typeof typedResponse.data === 'object' &&
      'items' in typedResponse.data
    ) {
      const data = typedResponse.data as Record<string, unknown>;
      const items = (data.items || []) as Record<string, unknown>[];

      // Transform items to match Prediction interface
      const predictions = items.map((item) => {
        // If item has match field (simplified format), parse it
        if (item.match && typeof item.match === 'string') {
          const [homeTeamName, awayTeamName] = item.match
            .split(' vs ')
            .map((s: string) => s.trim());

          const datePostedUtc = String(item.datePostedUtc || item.dateTime || '');

          return {
            id: item.id,
            homeTeam: {
              id: 0,
              name: homeTeamName || 'Unknown',
              logoUrl: '',
              shortName: homeTeamName || 'Unknown',
            },
            awayTeam: {
              id: 0,
              name: awayTeamName || 'Unknown',
              logoUrl: '',
              shortName: awayTeamName || 'Unknown',
            },
            predictedScore: '0-0',
            status: item.status || 'Prediction',
            startTime: datePostedUtc,
            competition: 'N/A',
            sportId: 0,
            leagueId: 0,
            confidence: item.accuracy || 0,
            picksCount: item.picksCount,
            accuracy: item.accuracy,
            match: item.match,
            datePostedUtc,
          } as Prediction;
        }

        // Otherwise return as is (already in correct format)
        return item as unknown as Prediction;
      });

      const dataObj = typedResponse.data as Record<string, unknown>;
      return {
        predictions,
        pagination: {
          page: (dataObj.page as number) || 1,
          pageSize: (dataObj.pageSize as number) || 20,
          total: (dataObj.total as number) || 0,
          hasMore:
            ((dataObj.page as number) || 1) * ((dataObj.pageSize as number) || 20) <
            ((dataObj.total as number) || 0),
        },
      };
    }

    // Handle old BackendPredictionResponse format (flat data array)
    const responseWithData = typedResponse as {
      data?: unknown[];
      currentPage?: number;
      pageSize?: number;
      totalItems?: number;
      totalPages?: number;
    };
    if (responseWithData.data && Array.isArray(responseWithData.data)) {
      return {
        predictions: responseWithData.data as Prediction[],
        pagination: {
          page: responseWithData.currentPage || 1,
          pageSize: responseWithData.pageSize || 20,
          total: responseWithData.totalItems || 0,
          hasMore: (responseWithData.currentPage || 1) < (responseWithData.totalPages || 1),
        },
      };
    }

    // Fallback
    return {
      predictions: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        hasMore: false,
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
    status?: string;
  }): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    if (filters.sportId) params.sportId = filters.sportId;
    if (filters.leagueId) params.leagueId = filters.leagueId;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.status) params.status = filters.status;

    return params;
  }
}
