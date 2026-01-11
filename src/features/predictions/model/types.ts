/**
 * PREDICTIONS MODEL TYPES
 *
 * Domain types and entities for predictions feature
 */

export type MatchStatus = 'Prediction' | 'Live' | 'HT' | 'ET' | 'FT' | 'Locked';

export type MatchVariant = 'Prediction' | 'Live' | 'Result';

export interface Sport {
  id: number;
  name: string;
  icon?: string;
  isActive?: boolean;
}

export interface League {
  id: number;
  name: string;
  sportId: number;
  icon?: string;
  country?: string;
}

export interface Team {
  id: number;
  name: string;
  logoUrl: string;
  shortName?: string;
  country?: string;
}

export interface Prediction {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  predictedScore: string;
  actualScore?: string;
  status: MatchStatus;
  startTime: string;
  stadium?: string;
  competition: string;
  round?: string;
  sportId: number;
  leagueId: number;
  confidence: number;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface PredictionFilter {
  sportId?: number;
  leagueId?: number;
  page?: number;
  pageSize?: number;
  fromUtc?: string;
  toUtc?: string;
  status?: string;
}

export interface PredictionPagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// Match type (used in components, similar to Prediction but with different field names)
export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  result: string;
  status: MatchStatus;
  dateTime: string;
  stadium?: string;
  competition: string;
  confidence?: number;
  sportId?: number;
  leagueId?: number;
}

// MatchCardProps is defined in components/MatchCard.tsx to avoid duplicate exports

// Team Stats for detailed predictions
export interface TeamStats {
  form: string[];
  recentForm: string[];
  headToHeadWins: string[];
  goalsPerGame: number;
  goalsConcededPerGame: number;
  winPercentage: number;
  possessionPercentage: number;
  cleanSheets: number;
  shotsOnTarget: number;
  totalShots: number;
  corners: number;
  fouls: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
}

// Player Stats
export interface PlayerStats {
  id: string;
  name: string;
  position: string;
  rating: number;
  age: number;
  height: string;
  weight: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  teamId: string;
}

// Vote Option
export interface VoteOption {
  id: string;
  score: string;
  votes: number;
}

// Detailed Prediction
export interface DetailedPrediction {
  id: string;
  matchId: number;
  predictedOutcome: string;
  reasoning: string;
  confidenceLevel: number;
  totalVotes: number;
  voteOptions: VoteOption[];
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  homeTopScorer: PlayerStats;
  awayTopScorer: PlayerStats;
  expertAnalysis: string;
}

// Betting Market Types
export type BettingMarketType =
  | '1x2'
  | 'double-chance'
  | 'draw-no-bet'
  | 'handicap'
  | 'first-goal'
  | 'both-teams-score'
  | 'goals'
  | 'scorers';

export interface BettingOdds {
  home?: number;
  draw?: number;
  away?: number;
  homeOrDraw?: number;
  homeOrAway?: number;
  drawOrAway?: number;
  yes?: number;
  no?: number;
  over?: number;
  under?: number;
  none?: number;
}

export interface BettingMarket {
  id: string;
  type: BettingMarketType;
  name: string;
  odds: BettingOdds;
  description?: string;
}

export interface GoalScorerPrediction {
  id: string;
  playerId: string;
  playerName: string;
  playerImage?: string;
  position: string;
  teamId: string;
  teamName: string;
  predictionType: 'first-goal' | 'last-goal' | 'anytime-goal';
  tip: string;
  reason: string;
  confidence: number;
}

export interface LeagueTableEntry {
  position: number;
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  qualification?: 'champions-league' | 'europa-league' | 'relegation';
}
