import type {
  BettingMarket,
  DetailedPrediction,
  League,
  LeagueTableEntry,
  Prediction,
  Sport,
} from '../model/types';
import type { GetPredictionsRequest } from '../api/types';

const isoNow = () => new Date().toISOString();

const team = (id: number, name: string, logoSeed: number) => ({
  id,
  name,
  shortName: name.slice(0, 10),
  logoUrl: `https://media.api-sports.io/football/teams/${logoSeed}.png`,
});

export const mockSports: Sport[] = [
  { id: 1, name: 'Soccer', icon: 'soccer', isActive: true },
  { id: 2, name: 'Basketball', icon: 'basketball', isActive: true },
  { id: 3, name: 'Tennis', icon: 'tennis', isActive: true },
  { id: 0, name: 'All Sports', icon: 'all', isActive: true },
];

export const mockLeagues: League[] = [
  { id: 101, name: 'Premier League', sportId: 1, country: 'England' },
  { id: 102, name: 'La Liga', sportId: 1, country: 'Spain' },
  { id: 201, name: 'NBA', sportId: 2, country: 'USA' },
];

export const mockPredictions: Prediction[] = [
  {
    id: 1001,
    competition: 'Premier League',
    sportId: 1,
    leagueId: 101,
    confidence: 82,
    status: 'FT',
    startTime: isoNow(),
    stadium: 'Old Trafford',
    homeTeam: team(42, 'Arsenal', 42),
    awayTeam: team(49, 'Chelsea', 49),
    predictedScore: '2-0',
  },
  {
    id: 1002,
    competition: 'Premier League',
    sportId: 1,
    leagueId: 101,
    confidence: 73,
    status: 'HT',
    startTime: isoNow(),
    stadium: 'Wembley Stadium',
    homeTeam: team(66, 'Aston Villa', 66),
    awayTeam: team(35, 'Bournemouth', 35),
    predictedScore: '2-1',
  },
  {
    id: 1003,
    competition: 'Premier League',
    sportId: 1,
    leagueId: 101,
    confidence: 65,
    status: 'Prediction',
    startTime: isoNow(),
    stadium: 'Anfield',
    homeTeam: team(33, 'Liverpool', 33),
    awayTeam: team(50, 'Man City', 50),
    predictedScore: '1-1',
  },
  {
    id: 2001,
    competition: 'La Liga',
    sportId: 1,
    leagueId: 102,
    confidence: 80,
    status: 'FT',
    startTime: isoNow(),
    stadium: 'Santiago Bernabéu',
    homeTeam: team(541, 'Real Madrid', 541),
    awayTeam: team(529, 'Barcelona', 529),
    predictedScore: '2-0',
  },
  {
    id: 2002,
    competition: 'La Liga',
    sportId: 1,
    leagueId: 102,
    confidence: 70,
    status: 'HT',
    startTime: isoNow(),
    stadium: 'Metropolitano',
    homeTeam: team(530, 'Atletico', 530),
    awayTeam: team(536, 'Sevilla', 536),
    predictedScore: '1-0',
  },
  {
    id: 3001,
    competition: 'NBA',
    sportId: 2,
    leagueId: 201,
    confidence: 68,
    status: 'Prediction',
    startTime: isoNow(),
    stadium: 'TD Garden',
    homeTeam: team(10, 'Celtics', 10),
    awayTeam: team(20, 'Lakers', 20),
    predictedScore: '112-107',
  },
];

export const mockLeagueTable: LeagueTableEntry[] = [
  {
    position: 1,
    team: team(541, 'Real Madrid', 541),
    played: 18,
    wins: 14,
    draws: 3,
    losses: 1,
    goalsFor: 35,
    goalsAgainst: 10,
    goalDifference: 25,
    points: 45,
    qualification: 'champions-league',
  },
  {
    position: 2,
    team: team(529, 'Barcelona', 529),
    played: 18,
    wins: 13,
    draws: 3,
    losses: 2,
    goalsFor: 31,
    goalsAgainst: 12,
    goalDifference: 19,
    points: 42,
    qualification: 'champions-league',
  },
  {
    position: 3,
    team: team(530, 'Atletico', 530),
    played: 18,
    wins: 12,
    draws: 4,
    losses: 2,
    goalsFor: 28,
    goalsAgainst: 11,
    goalDifference: 17,
    points: 40,
    qualification: 'champions-league',
  },
  {
    position: 4,
    team: team(536, 'Sevilla', 536),
    played: 18,
    wins: 10,
    draws: 5,
    losses: 3,
    goalsFor: 24,
    goalsAgainst: 14,
    goalDifference: 10,
    points: 35,
    qualification: 'europa-league',
  },
];

export const mockBettingMarkets: BettingMarket[] = [
  {
    id: '1',
    type: '1x2',
    name: 'Match Winner',
    odds: { home: 1.9, draw: 3.4, away: 3.8 },
  },
  {
    id: '2',
    type: 'both-teams-score',
    name: 'Both Teams To Score',
    odds: { yes: 1.75, no: 2.0 },
  },
];

export const mockDetailedPrediction: DetailedPrediction = {
  id: 'dp-1001',
  matchId: 1001,
  predictedOutcome: 'Home Win',
  reasoning: 'Home team dominates midfield, strong recent form, and better xG in last five games.',
  confidenceLevel: 82,
  totalVotes: 1340,
  voteOptions: [
    { id: 'vote-home', score: 'Home', votes: 820 },
    { id: 'vote-draw', score: 'Draw', votes: 260 },
    { id: 'vote-away', score: 'Away', votes: 260 },
  ],
  homeTeamStats: {
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
  awayTeamStats: {
    form: ['W', 'D', 'D', 'L'],
    recentForm: ['W', 'D', 'W', 'L', 'L'],
    headToHeadWins: ['L', 'D', 'W', 'L'],
    goalsPerGame: 1.4,
    goalsConcededPerGame: 1.3,
    winPercentage: 52,
    possessionPercentage: 51,
    cleanSheets: 7,
    shotsOnTarget: 4,
    totalShots: 10,
    corners: 4,
    fouls: 10,
    offsides: 1,
    yellowCards: 3,
    redCards: 0,
  },
  homeTopScorer: {
    id: 'home-1',
    name: 'Top Scorer',
    position: 'Forward',
    rating: 9.0,
    age: 23,
    height: '178cm',
    weight: '72kg',
    matches: 16,
    goals: 12,
    assists: 5,
    yellowCards: 3,
    teamId: 'home',
  },
  awayTopScorer: {
    id: 'away-1',
    name: 'Away Striker',
    position: 'Forward',
    rating: 8.2,
    age: 29,
    height: '182cm',
    weight: '76kg',
    matches: 18,
    goals: 10,
    assists: 4,
    yellowCards: 2,
    teamId: 'away',
  },
  expertAnalysis:
    'Expect a cagey first half with the home team pressing high. Away side vulnerable on set pieces.',
};

export const getFallbackDetailedMatch = (matchId: number) => {
  const prediction = mockPredictions.find((p) => p.id === matchId) || mockPredictions[0];
  return {
    prediction,
    detailed: { ...mockDetailedPrediction, matchId },
  };
};

export const mockDetailedMatchById = (matchId: number) => getFallbackDetailedMatch(matchId);

export const getMockPredictionsResponse = (
  filters: GetPredictionsRequest
): {
  predictions: Prediction[];
  pagination: { page: number; pageSize: number; total: number; hasMore: boolean };
} => {
  const filtered = mockPredictions.filter((p) => {
    if (filters.sportId && p.sportId !== filters.sportId) return false;
    if (filters.leagueId && p.leagueId !== filters.leagueId) return false;
    return true;
  });

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);

  return {
    predictions: slice,
    pagination: {
      page,
      pageSize,
      total: filtered.length,
      hasMore: start + slice.length < filtered.length,
    },
  };
};
