/**
 * LIVE MATCHES MODEL TYPES
 *
 * Domain types and entities for live matches feature
 */

export type MatchStatus = 'Prediction' | 'Live' | 'HT' | 'ET' | 'FT' | 'Locked';

export type LiveTab = 'live-matches' | 'predictions' | 'results';

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  shortName?: string;
}

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

export interface MatchEvent {
  id: string;
  type:
    | 'goal'
    | 'yellow-card'
    | 'red-card'
    | 'substitution'
    | 'penalty'
    | 'corner'
    | 'free-kick'
    | 'injury';
  minute: number;
  playerName: string;
  team: 'home' | 'away';
  description?: string;
  extraTime?: number;
}

export interface LiveMatchStats {
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  homePossession: number;
  awayPossession: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeTotalShots: number;
  awayTotalShots: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
  homeYellowCards: number;
  awayYellowCards: number;
  homeRedCards: number;
  awayRedCards: number;
  homeOffsides: number;
  awayOffsides: number;
  homeTopScorer: PlayerStats;
  awayTopScorer: PlayerStats;
}

export interface LiveMatchCommentary {
  id: string;
  minute: number;
  type: 'goal' | 'card' | 'substitution' | 'chance' | 'save' | 'miss' | 'other';
  text: string;
  team?: 'home' | 'away';
  playerName?: string;
  extraTime?: number;
}

export interface DetailedLiveMatch {
  id: string;
  matchId: string;
  currentMinute: number;
  addedTime?: number;
  half: 'first' | 'second' | 'extra' | 'finished';
  events: MatchEvent[];
  commentary: LiveMatchCommentary[];
  stats: LiveMatchStats;
  lastUpdated: string;
  nextEventEstimate?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  result: string;
  predictedScore?: string;
  status: MatchStatus;
  dateTime: string;
  stadium: string;
  competition?: string;
  confidence?: number;
  sport?: string;
  detailedLiveMatch?: DetailedLiveMatch;
}

export interface LiveSection {
  id: string;
  title: string;
  matches: Match[];
  variant: 'Prediction' | 'Live' | 'Result';
}

export interface CompetitionGroup {
  id: string;
  name: string;
  matches: Match[];
}

export interface LiveMatchesFilter {
  sport?: string;
  leagueId?: number;
  status?: MatchStatus;
}
