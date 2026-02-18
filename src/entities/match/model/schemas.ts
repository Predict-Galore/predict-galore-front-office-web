/**
 * MATCH ENTITY - Validation Schemas
 * 
 * Zod validation schemas for Match entity and related types
 */

import { z } from 'zod';

// Enum schemas
export const matchStatusSchema = z.enum([
  'scheduled', 
  'live', 
  'halftime', 
  'finished', 
  'postponed', 
  'cancelled', 
  'suspended', 
  'abandoned'
]);

export const competitionLevelSchema = z.enum(['international', 'national', 'regional', 'local']);
export const competitionTypeSchema = z.enum(['league', 'cup', 'tournament', 'friendly']);
export const competitionFormatTypeSchema = z.enum(['round_robin', 'knockout', 'group_stage', 'playoff']);
export const surfaceTypeSchema = z.enum(['grass', 'artificial', 'hybrid']);
export const matchEventTypeSchema = z.enum([
  'goal', 
  'own_goal', 
  'penalty_goal', 
  'yellow_card', 
  'red_card', 
  'substitution', 
  'penalty_miss', 
  'var_decision'
]);
export const oddsMarketTypeSchema = z.enum([
  '1x2', 
  'over_under', 
  'both_teams_score', 
  'correct_score', 
  'handicap', 
  'double_chance'
]);
export const predictionTypeSchema = z.enum([
  'match_result', 
  'over_under', 
  'both_teams_score', 
  'correct_score', 
  'first_goal_scorer'
]);
export const broadcastTypeSchema = z.enum(['tv', 'radio', 'streaming']);

// Country schema
export const countrySchema = z.object({
  id: z.string().uuid('Invalid country ID'),
  name: z.string().min(1, 'Country name required'),
  code: z.string().length(2, 'Country code must be 2 characters'),
  flag: z.string().url('Invalid flag URL').optional(),
  continent: z.string().min(1, 'Continent required'),
});
// Person schema
export const personSchema = z.object({
  id: z.string().uuid('Invalid person ID'),
  name: z.string().min(1, 'Name required'),
  firstName: z.string().min(1, 'First name required').optional(),
  lastName: z.string().min(1, 'Last name required').optional(),
  nationality: countrySchema.optional(),
  dateOfBirth: z.string().datetime('Invalid date of birth').optional(),
  photo: z.string().url('Invalid photo URL').optional(),
});

// Referee schema
export const refereeSchema = personSchema.extend({
  experience: z.number().int().min(0, 'Experience must be non-negative'),
  matchesOfficiated: z.number().int().min(0, 'Matches officiated must be non-negative'),
});

// Venue schema
export const venueSchema = z.object({
  id: z.string().uuid('Invalid venue ID'),
  name: z.string().min(1, 'Venue name required'),
  city: z.string().min(1, 'City required'),
  country: countrySchema,
  capacity: z.number().int().min(0, 'Capacity must be non-negative').optional(),
  surface: surfaceTypeSchema.optional(),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90, 'Invalid latitude'),
    longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  }).optional(),
});

// Team colors schema
export const teamColorsSchema = z.object({
  primary: z.string().min(1, 'Primary color required'),
  secondary: z.string().min(1, 'Secondary color required'),
  accent: z.string().optional(),
});

// Team form schema
export const teamFormSchema = z.object({
  recent: z.array(z.enum(['W', 'D', 'L'])),
  homeRecord: z.record(z.string(), z.number()),
  awayRecord: z.record(z.string(), z.number()),
  goalsFor: z.number().int().min(0, 'Goals for must be non-negative'),
  goalsAgainst: z.number().int().min(0, 'Goals against must be non-negative'),
  cleanSheets: z.number().int().min(0, 'Clean sheets must be non-negative'),
});

// Team stats schema
export const teamStatsSchema = z.object({
  played: z.number().int().min(0, 'Played must be non-negative'),
  wins: z.number().int().min(0, 'Wins must be non-negative'),
  draws: z.number().int().min(0, 'Draws must be non-negative'),
  losses: z.number().int().min(0, 'Losses must be non-negative'),
  goalsFor: z.number().int().min(0, 'Goals for must be non-negative'),
  goalsAgainst: z.number().int().min(0, 'Goals against must be non-negative'),
  goalDifference: z.number().int(),
  points: z.number().int().min(0, 'Points must be non-negative'),
  position: z.number().int().min(1, 'Position must be positive').optional(),
  form: z.string(),
});

// Team schema
export const teamSchema = z.object({
  id: z.string().uuid('Invalid team ID'),
  name: z.string().min(1, 'Team name required'),
  shortName: z.string().min(1, 'Short name required'),
  code: z.string().length(3, 'Team code must be 3 characters'),
  logo: z.string().url('Invalid logo URL').optional(),
  colors: teamColorsSchema,
  country: countrySchema.optional(),
  founded: z.number().int().min(1800, 'Invalid founding year').max(new Date().getFullYear()).optional(),
  venue: venueSchema.optional(),
  manager: personSchema.optional(),
  isNational: z.boolean(),
  form: teamFormSchema.optional(),
  stats: teamStatsSchema.optional(),
});

// Sport rules schema
export const sportRulesSchema = z.object({
  duration: z.number().int().min(1, 'Duration must be positive'),
  periods: z.number().int().min(1, 'Periods must be positive'),
  playersPerTeam: z.number().int().min(1, 'Players per team must be positive'),
  substitutions: z.number().int().min(0, 'Substitutions must be non-negative'),
  overtime: z.boolean().optional(),
  penalties: z.boolean().optional(),
});

// Sport schema
export const sportSchema = z.object({
  id: z.string().uuid('Invalid sport ID'),
  name: z.string().min(1, 'Sport name required'),
  slug: z.string().min(1, 'Sport slug required'),
  category: z.string().min(1, 'Sport category required'),
  isPopular: z.boolean(),
  icon: z.string().optional(),
  color: z.string().optional(),
  rules: sportRulesSchema.optional(),
});

// Season schema
export const seasonSchema = z.object({
  id: z.string().uuid('Invalid season ID'),
  name: z.string().min(1, 'Season name required'),
  year: z.number().int().min(1900, 'Invalid year').max(2100, 'Invalid year'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  isCurrent: z.boolean(),
});

// Competition format schema
export const competitionFormatSchema = z.object({
  type: competitionFormatTypeSchema,
  rounds: z.number().int().min(1, 'Rounds must be positive').optional(),
  groups: z.number().int().min(1, 'Groups must be positive').optional(),
  teamsPerGroup: z.number().int().min(1, 'Teams per group must be positive').optional(),
  promotionSpots: z.number().int().min(0, 'Promotion spots must be non-negative').optional(),
  relegationSpots: z.number().int().min(0, 'Relegation spots must be non-negative').optional(),
});

// Competition schema
export const competitionSchema = z.object({
  id: z.string().uuid('Invalid competition ID'),
  name: z.string().min(1, 'Competition name required'),
  slug: z.string().min(1, 'Competition slug required'),
  shortName: z.string().optional(),
  sport: sportSchema,
  country: countrySchema.optional(),
  level: competitionLevelSchema,
  type: competitionTypeSchema,
  season: seasonSchema.optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  isPopular: z.boolean(),
  format: competitionFormatSchema,
});
// Match score schema
export const matchScoreSchema = z.object({
  home: z.number().int().min(0, 'Home score must be non-negative'),
  away: z.number().int().min(0, 'Away score must be non-negative'),
  halftime: z.object({
    home: z.number().int().min(0, 'Halftime home score must be non-negative'),
    away: z.number().int().min(0, 'Halftime away score must be non-negative'),
  }).optional(),
  fulltime: z.object({
    home: z.number().int().min(0, 'Fulltime home score must be non-negative'),
    away: z.number().int().min(0, 'Fulltime away score must be non-negative'),
  }).optional(),
  extratime: z.object({
    home: z.number().int().min(0, 'Extratime home score must be non-negative'),
    away: z.number().int().min(0, 'Extratime away score must be non-negative'),
  }).optional(),
  penalties: z.object({
    home: z.number().int().min(0, 'Penalties home score must be non-negative'),
    away: z.number().int().min(0, 'Penalties away score must be non-negative'),
  }).optional(),
});

// Match statistics schema
export const matchStatisticsSchema = z.object({
  possession: z.object({
    home: z.number().min(0).max(100, 'Possession must be between 0 and 100'),
    away: z.number().min(0).max(100, 'Possession must be between 0 and 100'),
  }),
  shots: z.object({
    home: z.number().int().min(0, 'Shots must be non-negative'),
    away: z.number().int().min(0, 'Shots must be non-negative'),
  }),
  shotsOnTarget: z.object({
    home: z.number().int().min(0, 'Shots on target must be non-negative'),
    away: z.number().int().min(0, 'Shots on target must be non-negative'),
  }),
  corners: z.object({
    home: z.number().int().min(0, 'Corners must be non-negative'),
    away: z.number().int().min(0, 'Corners must be non-negative'),
  }),
  fouls: z.object({
    home: z.number().int().min(0, 'Fouls must be non-negative'),
    away: z.number().int().min(0, 'Fouls must be non-negative'),
  }),
  yellowCards: z.object({
    home: z.number().int().min(0, 'Yellow cards must be non-negative'),
    away: z.number().int().min(0, 'Yellow cards must be non-negative'),
  }),
  redCards: z.object({
    home: z.number().int().min(0, 'Red cards must be non-negative'),
    away: z.number().int().min(0, 'Red cards must be non-negative'),
  }),
  offsides: z.object({
    home: z.number().int().min(0, 'Offsides must be non-negative'),
    away: z.number().int().min(0, 'Offsides must be non-negative'),
  }),
});

// Match event schema
export const matchEventSchema = z.object({
  id: z.string().uuid('Invalid event ID'),
  type: matchEventTypeSchema,
  minute: z.number().int().min(0, 'Minute must be non-negative').max(200, 'Invalid minute'),
  extraTime: z.number().int().min(0, 'Extra time must be non-negative').optional(),
  team: z.enum(['home', 'away']),
  player: personSchema.optional(),
  assistPlayer: personSchema.optional(),
  description: z.string().min(1, 'Event description required'),
  coordinates: z.object({
    x: z.number().min(0).max(100, 'X coordinate must be between 0 and 100'),
    y: z.number().min(0).max(100, 'Y coordinate must be between 0 and 100'),
  }).optional(),
});

// Odds outcome schema
export const oddsOutcomeSchema = z.object({
  name: z.string().min(1, 'Outcome name required'),
  odds: z.number().min(1, 'Odds must be at least 1'),
  probability: z.number().min(0).max(100, 'Probability must be between 0 and 100').optional(),
});

// Odds market schema
export const oddsMarketSchema = z.object({
  name: z.string().min(1, 'Market name required'),
  type: oddsMarketTypeSchema,
  outcomes: z.array(oddsOutcomeSchema).min(1, 'At least one outcome required'),
});

// Match odds schema
export const matchOddsSchema = z.object({
  bookmaker: z.string().min(1, 'Bookmaker name required'),
  markets: z.array(oddsMarketSchema).min(1, 'At least one market required'),
  updatedAt: z.string().datetime('Invalid updated date'),
});

// Match prediction schema
export const matchPredictionSchema = z.object({
  id: z.string().uuid('Invalid prediction ID'),
  type: predictionTypeSchema,
  outcome: z.string().min(1, 'Outcome required'),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  odds: z.number().min(1, 'Odds must be at least 1').optional(),
  reasoning: z.string().optional(),
  accuracy: z.number().min(0).max(100, 'Accuracy must be between 0 and 100').optional(),
  createdAt: z.string().datetime('Invalid creation date'),
});

// Weather conditions schema
export const weatherConditionsSchema = z.object({
  temperature: z.number().min(-50, 'Invalid temperature').max(60, 'Invalid temperature'),
  humidity: z.number().min(0).max(100, 'Humidity must be between 0 and 100'),
  windSpeed: z.number().min(0, 'Wind speed must be non-negative'),
  windDirection: z.string().min(1, 'Wind direction required'),
  conditions: z.string().min(1, 'Weather conditions required'),
  visibility: z.number().min(0, 'Visibility must be non-negative'),
});

// Match coverage schema
export const matchCoverageSchema = z.object({
  live: z.boolean(),
  video: z.boolean(),
  audio: z.boolean(),
  statistics: z.boolean(),
  lineups: z.boolean(),
  events: z.boolean(),
});

// Broadcast info schema
export const broadcastInfoSchema = z.object({
  country: z.string().length(2, 'Country code must be 2 characters'),
  broadcaster: z.string().min(1, 'Broadcaster name required'),
  type: broadcastTypeSchema,
  language: z.string().min(2, 'Language code must be at least 2 characters'),
});

// Match metadata schema
export const matchMetadataSchema = z.object({
  importance: z.number().int().min(1, 'Importance must be at least 1').max(10, 'Importance must be at most 10'),
  rivalry: z.boolean().optional(),
  derby: z.boolean().optional(),
  cupFinal: z.boolean().optional(),
  playoff: z.boolean().optional(),
  tags: z.array(z.string()),
  broadcastInfo: z.array(broadcastInfoSchema).optional(),
});
// Main Match schema
export const matchSchema = z.object({
  id: z.string().uuid('Invalid match ID'),
  externalId: z.string().optional(),
  sport: sportSchema,
  competition: competitionSchema,
  season: seasonSchema.optional(),
  round: z.string().optional(),
  homeTeam: teamSchema,
  awayTeam: teamSchema,
  venue: venueSchema.optional(),
  referee: refereeSchema.optional(),
  status: matchStatusSchema,
  scheduledAt: z.string().datetime('Invalid scheduled date'),
  startedAt: z.string().datetime('Invalid start date').optional(),
  finishedAt: z.string().datetime('Invalid finish date').optional(),
  score: matchScoreSchema,
  statistics: matchStatisticsSchema.optional(),
  events: z.array(matchEventSchema),
  odds: matchOddsSchema.optional(),
  predictions: z.array(matchPredictionSchema).optional(),
  weather: weatherConditionsSchema.optional(),
  attendance: z.number().int().min(0, 'Attendance must be non-negative').optional(),
  coverage: matchCoverageSchema,
  metadata: matchMetadataSchema,
});

// Match search params schema
export const matchSearchParamsSchema = z.object({
  sportId: z.string().uuid('Invalid sport ID').optional(),
  competitionId: z.string().uuid('Invalid competition ID').optional(),
  teamId: z.string().uuid('Invalid team ID').optional(),
  status: matchStatusSchema.optional(),
  dateFrom: z.string().datetime('Invalid date from').optional(),
  dateTo: z.string().datetime('Invalid date to').optional(),
  live: z.boolean().optional(),
  hasOdds: z.boolean().optional(),
  hasPredictions: z.boolean().optional(),
  sortBy: z.enum(['scheduledAt', 'importance', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1, 'Page must be at least 1').optional(),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').optional(),
});

// Match search response schema
export const matchSearchResponseSchema = z.object({
  matches: z.array(matchSchema),
  total: z.number().int().min(0, 'Total must be non-negative'),
  page: z.number().int().min(1, 'Page must be at least 1'),
  limit: z.number().int().min(1, 'Limit must be at least 1'),
  hasMore: z.boolean(),
  filters: z.object({
    sports: z.array(sportSchema),
    competitions: z.array(competitionSchema),
    statuses: z.array(matchStatusSchema),
  }),
});

// Live match update schema
export const liveMatchUpdateSchema = z.object({
  matchId: z.string().uuid('Invalid match ID'),
  type: z.enum(['score', 'event', 'status', 'statistics']),
  data: z.any(), // This would be more specific based on the update type
  timestamp: z.string().datetime('Invalid timestamp'),
});

// Export inferred types for use in other modules
export type MatchSchemaType = z.infer<typeof matchSchema>;
export type TeamSchemaType = z.infer<typeof teamSchema>;
export type SportSchemaType = z.infer<typeof sportSchema>;
export type CompetitionSchemaType = z.infer<typeof competitionSchema>;
export type MatchSearchParamsSchemaType = z.infer<typeof matchSearchParamsSchema>;
export type MatchSearchResponseSchemaType = z.infer<typeof matchSearchResponseSchema>;
export type LiveMatchUpdateSchemaType = z.infer<typeof liveMatchUpdateSchema>;
export type MatchEventSchemaType = z.infer<typeof matchEventSchema>;
export type MatchScoreSchemaType = z.infer<typeof matchScoreSchema>;
export type MatchStatisticsSchemaType = z.infer<typeof matchStatisticsSchema>;
