/**
 * LIVE MATCHES API TYPES
 *
 * API-specific types for live matches feature
 */

import type { LiveSection } from '../model/types';

// ==================== API REQUEST TYPES ====================
export interface GetLiveScoresRequest {
  sport?: string;
  leagueId?: number;
}

export interface GetFixtureScoresRequest {
  fixtureId: number;
}

export interface GetLeagueScoresRequest {
  leagueId: number;
}

export interface GetDetailedMatchRequest {
  matchId: string;
}

// ==================== API RESPONSE TYPES ====================
export interface BackendFixture {
  providerFixtureId: number;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  homeScore: number;
  awayScore: number;
  status: '1H' | '2H' | 'HT' | 'ET' | 'FT' | 'POSTPONED' | 'CANCELLED';
  elapsed: number;
  kickoffUtc: string;
  events: {
    goals: Array<{
      team: string;
      player: string;
      minute: number;
    }>;
    homeYellowCards: number;
    awayYellowCards: number;
    homeRedCards: number;
    awayRedCards: number;
  };
}

export interface BackendLiveScoresResponse {
  success: boolean;
  message: string;
  errors: string | null;
  data: BackendFixture[];
}

export interface LiveScoresResponse {
  sections: LiveSection[];
  liveViewers: number;
  lastUpdated: Date;
  totalMatches: number;
}
