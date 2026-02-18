/**
 * MATCH ENTITY - Domain Model
 * 
 * Core match business entity for sports events
 */

export interface Match {
  id: string;
  externalId?: string; // Third-party API ID
  sport: Sport;
  competition: Competition;
  season?: Season;
  round?: string;
  homeTeam: Team;
  awayTeam: Team;
  venue?: Venue;
  referee?: Referee;
  status: MatchStatus;
  scheduledAt: string;
  startedAt?: string;
  finishedAt?: string;
  score: MatchScore;
  statistics?: MatchStatistics;
  events: MatchEvent[];
  odds?: MatchOdds;
  predictions?: MatchPrediction[];
  weather?: WeatherConditions;
  attendance?: number;
  coverage: MatchCoverage;
  metadata: MatchMetadata;
}

export interface Sport {
  id: string;
  name: string;
  slug: string;
  category: string;
  isPopular: boolean;
  icon?: string;
  color?: string;
  rules?: SportRules;
}

export interface Competition {
  id: string;
  name: string;
  slug: string;
  shortName?: string;
  sport: Sport;
  country?: Country;
  level: CompetitionLevel;
  type: CompetitionType;
  season?: Season;
  logo?: string;
  isPopular: boolean;
  format: CompetitionFormat;
}

export type CompetitionLevel = 'international' | 'national' | 'regional' | 'local';
export type CompetitionType = 'league' | 'cup' | 'tournament' | 'friendly';

export interface CompetitionFormat {
  type: 'round_robin' | 'knockout' | 'group_stage' | 'playoff';
  rounds?: number;
  groups?: number;
  teamsPerGroup?: number;
  promotionSpots?: number;
  relegationSpots?: number;
}

export interface Season {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string; // 3-letter code
  logo?: string;
  colors: TeamColors;
  country?: Country;
  founded?: number;
  venue?: Venue;
  manager?: Person;
  isNational: boolean;
  form?: TeamForm;
  stats?: TeamStats;
}

export interface TeamColors {
  primary: string;
  secondary: string;
  accent?: string;
}

export interface TeamForm {
  recent: ('W' | 'D' | 'L')[];
  homeRecord: Record<string, number>;
  awayRecord: Record<string, number>;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
}

export interface TeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position?: number;
  form: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: Country;
  capacity?: number;
  surface?: 'grass' | 'artificial' | 'hybrid';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2
  flag?: string;
  continent: string;
}

export interface Person {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  nationality?: Country;
  dateOfBirth?: string;
  photo?: string;
}

export interface Referee extends Person {
  experience: number;
  matchesOfficiated: number;
}

export type MatchStatus = 
  | 'scheduled' 
  | 'live' 
  | 'halftime' 
  | 'finished' 
  | 'postponed' 
  | 'cancelled' 
  | 'suspended' 
  | 'abandoned';

export interface MatchScore {
  home: number;
  away: number;
  halftime?: {
    home: number;
    away: number;
  };
  fulltime?: {
    home: number;
    away: number;
  };
  extratime?: {
    home: number;
    away: number;
  };
  penalties?: {
    home: number;
    away: number;
  };
}

export interface MatchStatistics {
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  shotsOnTarget: {
    home: number;
    away: number;
  };
  corners: {
    home: number;
    away: number;
  };
  fouls: {
    home: number;
    away: number;
  };
  yellowCards: {
    home: number;
    away: number;
  };
  redCards: {
    home: number;
    away: number;
  };
  offsides: {
    home: number;
    away: number;
  };
}

export interface MatchEvent {
  id: string;
  type: MatchEventType;
  minute: number;
  extraTime?: number;
  team: 'home' | 'away';
  player?: Person;
  assistPlayer?: Person;
  description: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

export type MatchEventType = 
  | 'goal' 
  | 'own_goal' 
  | 'penalty_goal' 
  | 'yellow_card' 
  | 'red_card' 
  | 'substitution' 
  | 'penalty_miss' 
  | 'var_decision';

export interface MatchOdds {
  bookmaker: string;
  markets: OddsMarket[];
  updatedAt: string;
}

export interface OddsMarket {
  name: string;
  type: OddsMarketType;
  outcomes: OddsOutcome[];
}

export type OddsMarketType = 
  | '1x2' 
  | 'over_under' 
  | 'both_teams_score' 
  | 'correct_score' 
  | 'handicap' 
  | 'double_chance';

export interface OddsOutcome {
  name: string;
  odds: number;
  probability?: number;
}

export interface MatchPrediction {
  id: string;
  type: PredictionType;
  outcome: string;
  confidence: number;
  odds?: number;
  reasoning?: string;
  accuracy?: number;
  createdAt: string;
}

export type PredictionType = 
  | 'match_result' 
  | 'over_under' 
  | 'both_teams_score' 
  | 'correct_score' 
  | 'first_goal_scorer';

export interface WeatherConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  conditions: string;
  visibility: number;
}

export interface MatchCoverage {
  live: boolean;
  video: boolean;
  audio: boolean;
  statistics: boolean;
  lineups: boolean;
  events: boolean;
}

export interface MatchMetadata {
  importance: number; // 1-10 scale
  rivalry?: boolean;
  derby?: boolean;
  cupFinal?: boolean;
  playoff?: boolean;
  tags: string[];
  broadcastInfo?: BroadcastInfo[];
}

export interface BroadcastInfo {
  country: string;
  broadcaster: string;
  type: 'tv' | 'radio' | 'streaming';
  language: string;
}

// Match search and filtering
export interface MatchSearchParams {
  sportId?: string;
  competitionId?: string;
  teamId?: string;
  status?: MatchStatus;
  dateFrom?: string;
  dateTo?: string;
  live?: boolean;
  hasOdds?: boolean;
  hasPredictions?: boolean;
  sortBy?: 'scheduledAt' | 'importance' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MatchSearchResponse {
  matches: Match[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: {
    sports: Sport[];
    competitions: Competition[];
    statuses: MatchStatus[];
  };
}

// Live match updates
export interface LiveMatchUpdate {
  matchId: string;
  type: 'score' | 'event' | 'status' | 'statistics';
  data: unknown;
  timestamp: string;
}

export interface SportRules {
  duration: number; // minutes
  periods: number;
  playersPerTeam: number;
  substitutions: number;
  overtime?: boolean;
  penalties?: boolean;
}
