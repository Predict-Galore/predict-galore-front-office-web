import type { LiveScoresResponse } from '../api/types';
import type { DetailedLiveMatch, LiveSection, Match, TeamStats } from '../model/types';

const now = new Date();

const makeTeam = (id: string, name: string, logoSeed: number) => ({
  id,
  name,
  shortName: name.slice(0, 10),
  logoUrl: `https://media.api-sports.io/football/teams/${logoSeed}.png`,
});

const baseStats: TeamStats = {
  form: ['W', 'D', 'W', 'L'],
  recentForm: ['W', 'D', 'W', 'L', 'W'],
  headToHeadWins: ['W', 'D', 'L', 'W'],
  goalsPerGame: 1.8,
  goalsConcededPerGame: 1.1,
  winPercentage: 62,
  possessionPercentage: 55,
  cleanSheets: 8,
  shotsOnTarget: 6,
  totalShots: 14,
  corners: 5,
  fouls: 12,
  offsides: 2,
  yellowCards: 2,
  redCards: 0,
};

const makeMatch = (
  id: string,
  homeName: string,
  awayName: string,
  competition: string,
  sport: string,
  status: Match['status'],
  kickoffMinutesFromNow: number,
  result?: string,
  predictedScore?: string
): Match => {
  const kickoff = new Date(now.getTime() + kickoffMinutesFromNow * 60 * 1000);
  return {
    id,
    homeTeam: makeTeam(`${id}-home`, homeName, Number(id) + 1),
    awayTeam: makeTeam(`${id}-away`, awayName, Number(id) + 2),
    result: result ?? (status === 'FT' ? '2 - 0' : status === 'HT' ? '1 - 0' : ''),
    predictedScore: predictedScore ?? (status === 'Prediction' ? '2-0' : undefined),
    status,
    dateTime: kickoff.toISOString(),
    stadium: `${competition} Stadium`,
    competition,
    confidence: 72,
    sport,
  };
};

export const mockLiveSections: LiveSection[] = [
  {
    id: 'sec-1',
    title: 'Premier League',
    variant: 'Live',
    matches: [
      makeMatch('5001', 'Arsenal', 'Chelsea', 'Premier League', 'soccer', 'FT', -60, '3-1'),
      makeMatch('5002', 'Aston Villa', 'Bournemouth', 'Premier League', 'soccer', 'HT', -30, '2-0'),
      makeMatch(
        '5003',
        'Manchester United',
        'Manchester City',
        'Premier League',
        'soccer',
        'ET',
        -10,
        '2-0'
      ),
      makeMatch(
        '5004',
        'Brentford',
        'Fulham',
        'Premier League',
        'soccer',
        'Prediction',
        120,
        '',
        'Vs'
      ),
      makeMatch(
        '5005',
        'Liverpool',
        'Nottingham Forest',
        'Premier League',
        'soccer',
        'Prediction',
        240,
        '',
        'Vs'
      ),
      makeMatch(
        '5006',
        'Newcastle United',
        'Tottenham Hotspur',
        'Premier League',
        'soccer',
        'Prediction',
        360,
        '',
        'Vs'
      ),
    ],
  },
  {
    id: 'sec-2',
    title: 'La Liga',
    variant: 'Live',
    matches: [
      makeMatch('6001', 'Arsenal', 'Chelsea', 'La Liga', 'soccer', 'FT', -60, '2-0'),
      makeMatch('6002', 'Aston Villa', 'Bournemouth', 'La Liga', 'soccer', 'HT', -30, '2-0'),
      makeMatch(
        '6003',
        'Manchester United',
        'Manchester City',
        'La Liga',
        'soccer',
        'ET',
        -10,
        '2-0'
      ),
      makeMatch('6004', 'Brentford', 'Fulham', 'La Liga', 'soccer', 'Prediction', 120, '', 'Vs'),
      makeMatch(
        '6005',
        'Liverpool',
        'Nottingham Forest',
        'La Liga',
        'soccer',
        'Prediction',
        240,
        '',
        'Vs'
      ),
      makeMatch(
        '6006',
        'Newcastle United',
        'Tottenham Hotspur',
        'La Liga',
        'soccer',
        'Prediction',
        360,
        '',
        'Vs'
      ),
    ],
  },
];

export const mockLiveScoresResponse: LiveScoresResponse = {
  sections: mockLiveSections,
  liveViewers: 1284,
  lastUpdated: new Date(),
  totalMatches: mockLiveSections.reduce((acc, section) => acc + section.matches.length, 0),
};

export const getMockLiveScores = (filters?: { sport?: string }): LiveScoresResponse => {
  if (!filters?.sport || filters.sport === 'all') {
    return mockLiveScoresResponse;
  }

  const filteredSections: LiveSection[] = mockLiveSections
    .map((section) => ({
      ...section,
      matches: section.matches.filter((m) => m.sport === filters.sport),
    }))
    .filter((section) => section.matches.length > 0);

  return {
    ...mockLiveScoresResponse,
    sections: filteredSections,
    totalMatches: filteredSections.reduce((acc, section) => acc + section.matches.length, 0),
  };
};

export const getMockDetailedLiveMatch = (matchId: string): DetailedLiveMatch => ({
  id: `detailed-${matchId}`,
  matchId,
  currentMinute: 54,
  addedTime: 2,
  half: 'second',
  events: [],
  commentary: [{ id: 'c1', minute: 50, type: 'chance', text: 'Big chance missed', team: 'home' }],
  stats: {
    homeTeam: baseStats,
    awayTeam: { ...baseStats, possessionPercentage: 45, goalsPerGame: 1.4 },
    homePossession: 55,
    awayPossession: 45,
    homeShotsOnTarget: 7,
    awayShotsOnTarget: 3,
    homeTotalShots: 16,
    awayTotalShots: 9,
    homeCorners: 6,
    awayCorners: 3,
    homeFouls: 10,
    awayFouls: 14,
    homeYellowCards: 2,
    awayYellowCards: 3,
    homeRedCards: 0,
    awayRedCards: 0,
    homeOffsides: 2,
    awayOffsides: 1,
    homeTopScorer: {
      id: 'ts-home',
      name: 'Home Scorer',
      position: 'Forward',
      rating: 8.9,
      age: 24,
      height: '178cm',
      weight: '72kg',
      matches: 18,
      goals: 11,
      assists: 5,
      yellowCards: 2,
      teamId: 'home',
    },
    awayTopScorer: {
      id: 'ts-away',
      name: 'Away Star',
      position: 'Forward',
      rating: 8.1,
      age: 27,
      height: '181cm',
      weight: '75kg',
      matches: 17,
      goals: 9,
      assists: 4,
      yellowCards: 1,
      teamId: 'away',
    },
  },
  lastUpdated: new Date().toISOString(),
  nextEventEstimate: '60th minute',
});
