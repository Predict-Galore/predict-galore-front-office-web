/**
 * PREDICTION ENTITY - Validation Schemas
 *
 * Zod validation schemas for Prediction entity and related types
 */

import { z } from 'zod';

// Enums and basic types
export const predictionTypeSchema = z.enum([
  'match_result',
  'over_under',
  'both_teams_score',
  'correct_score',
  'handicap',
  'double_chance',
  'first_goal_scorer',
  'anytime_scorer',
  'clean_sheet',
  'corners',
  'cards',
  'halftime_result',
  'combo',
  'custom',
]);

export const predictionStatusSchema = z.enum([
  'pending',
  'active',
  'won',
  'lost',
  'void',
  'pushed',
  'cancelled',
  'suspended',
]);

export const predictionSourceSchema = z.enum([
  'ai_algorithm',
  'expert_tipster',
  'community',
  'statistical_model',
  'machine_learning',
  'hybrid',
]);

export const motivationLevelSchema = z.enum(['very_high', 'high', 'normal', 'low', 'very_low']);
export const difficultySchema = z.enum(['easy', 'medium', 'hard', 'expert']);
export const liquiditySchema = z.enum(['high', 'medium', 'low']);
export const stakingStrategyTypeSchema = z.enum([
  'fixed',
  'percentage',
  'kelly',
  'fibonacci',
  'martingale',
]);

// Team info schema
export const teamInfoSchema = z.object({
  id: z.string().uuid('Invalid team ID'),
  name: z.string().min(1, 'Team name required'),
  shortName: z.string().min(1, 'Short name required'),
  logo: z.string().url('Invalid logo URL').optional(),
  form: z.string().optional(),
  position: z.number().int().min(1).optional(),
});

// Match info schema
export const matchInfoSchema = z.object({
  id: z.string().uuid('Invalid match ID'),
  homeTeam: teamInfoSchema,
  awayTeam: teamInfoSchema,
  competition: z.string().min(1, 'Competition required'),
  scheduledAt: z.string().datetime('Invalid scheduled date'),
  status: z.string().min(1, 'Status required'),
  venue: z.string().optional(),
});

// Market option schema
export const marketOptionSchema = z.object({
  id: z.string().uuid('Invalid option ID'),
  name: z.string().min(1, 'Option name required'),
  value: z.string().min(1, 'Option value required'),
  odds: z.number().min(1, 'Odds must be at least 1').optional(),
  probability: z.number().min(0).max(1, 'Probability must be between 0 and 1').optional(),
});

// Prediction market schema
export const predictionMarketSchema = z.object({
  name: z.string().min(1, 'Market name required'),
  type: predictionTypeSchema,
  description: z.string().min(1, 'Market description required'),
  options: z.array(marketOptionSchema).min(1, 'At least one option required'),
  handicap: z.number().optional(),
  total: z.number().min(0).optional(),
  period: z.enum(['full_time', 'first_half', 'second_half']).optional(),
});

// Prediction outcome schema
export const predictionOutcomeSchema = z.object({
  selection: z.string().min(1, 'Selection required'),
  value: z.union([z.string(), z.number()]),
  display: z.string().min(1, 'Display text required'),
  odds: z.number().min(1, 'Odds must be at least 1').optional(),
  probability: z.number().min(0).max(1, 'Probability must be between 0 and 1').optional(),
});

// Game result schema
export const gameResultSchema = z.object({
  opponent: z.string().min(1, 'Opponent required'),
  result: z.enum(['W', 'D', 'L']),
  score: z.string().min(1, 'Score required'),
  date: z.string().datetime('Invalid date'),
  venue: z.enum(['home', 'away']),
});

// Form data schema
export const formDataSchema = z.object({
  last5Games: z.array(gameResultSchema).max(5, 'Maximum 5 games'),
  goalsFor: z.number().int().min(0, 'Goals for must be non-negative'),
  goalsAgainst: z.number().int().min(0, 'Goals against must be non-negative'),
  cleanSheets: z.number().int().min(0, 'Clean sheets must be non-negative'),
  btts: z.number().int().min(0, 'BTTS must be non-negative'),
  averageGoals: z.number().min(0, 'Average goals must be non-negative'),
  winPercentage: z.number().min(0).max(100, 'Win percentage must be between 0 and 100'),
});

// Form comparison schema
export const formComparisonSchema = z.object({
  goalsScoredAdvantage: z.enum(['home', 'away', 'equal']),
  goalsConcededAdvantage: z.enum(['home', 'away', 'equal']),
  formAdvantage: z.enum(['home', 'away', 'equal']),
  overallRating: z.number().min(-5).max(5, 'Overall rating must be between -5 and 5'),
});

// Team form analysis schema
export const teamFormAnalysisSchema = z.object({
  home: formDataSchema,
  away: formDataSchema,
  comparison: formComparisonSchema,
});

// Historical data schema
export const historicalDataSchema = z.object({
  totalMatches: z.number().int().min(0, 'Total matches must be non-negative'),
  homeWins: z.number().int().min(0, 'Home wins must be non-negative'),
  awayWins: z.number().int().min(0, 'Away wins must be non-negative'),
  draws: z.number().int().min(0, 'Draws must be non-negative'),
  averageGoals: z.number().min(0, 'Average goals must be non-negative'),
  bttsPercentage: z.number().min(0).max(100, 'BTTS percentage must be between 0 and 100'),
  over25Percentage: z.number().min(0).max(100, 'Over 2.5 percentage must be between 0 and 100'),
  cleanSheetPercentage: z
    .number()
    .min(0)
    .max(100, 'Clean sheet percentage must be between 0 and 100'),
});

// Head to head analysis schema
export const headToHeadAnalysisSchema = z.object({
  totalMeetings: z.number().int().min(0, 'Total meetings must be non-negative'),
  homeTeamWins: z.number().int().min(0, 'Home team wins must be non-negative'),
  awayTeamWins: z.number().int().min(0, 'Away team wins must be non-negative'),
  draws: z.number().int().min(0, 'Draws must be non-negative'),
  lastMeeting: gameResultSchema.optional(),
  averageGoals: z.number().min(0, 'Average goals must be non-negative'),
  trends: z.array(z.string()),
});

// Injury report schema
export const injuryReportSchema = z.object({
  playerId: z.string().uuid('Invalid player ID'),
  playerName: z.string().min(1, 'Player name required'),
  position: z.string().min(1, 'Position required'),
  importance: z.enum(['key', 'regular', 'squad']),
  injuryType: z.string().min(1, 'Injury type required'),
  expectedReturn: z.string().datetime('Invalid expected return date').optional(),
  impact: z.number().int().min(1).max(10, 'Impact must be between 1 and 10'),
});

// Weather impact schema
export const weatherImpactSchema = z.object({
  conditions: z.string().min(1, 'Weather conditions required'),
  temperature: z.number().min(-50).max(60, 'Invalid temperature'),
  windSpeed: z.number().min(0, 'Wind speed must be non-negative'),
  precipitation: z.number().min(0).max(100, 'Precipitation must be between 0 and 100'),
  impact: z.enum(['positive', 'negative', 'neutral']),
  reasoning: z.string().min(1, 'Weather reasoning required'),
});

// Motivation level schema
export const motivationLevelDetailSchema = z.object({
  level: motivationLevelSchema,
  factors: z.array(z.string()),
  impact: z.number().min(-3).max(3, 'Impact must be between -3 and 3'),
});

// Motivation factors schema
export const motivationFactorsSchema = z.object({
  homeTeam: motivationLevelDetailSchema,
  awayTeam: motivationLevelDetailSchema,
  context: z.array(z.string()),
});

// Prediction analysis schema
export const predictionAnalysisSchema = z.object({
  keyFactors: z.array(z.string()),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  historicalData: historicalDataSchema.optional(),
  teamForm: teamFormAnalysisSchema.optional(),
  headToHead: headToHeadAnalysisSchema.optional(),
  injuries: z.array(injuryReportSchema).optional(),
  weather: weatherImpactSchema.optional(),
  motivation: motivationFactorsSchema.optional(),
});

// Algorithm info schema
export const algorithmInfoSchema = z.object({
  name: z.string().min(1, 'Algorithm name required'),
  version: z.string().min(1, 'Algorithm version required'),
  accuracy: z.number().min(0).max(100, 'Accuracy must be between 0 and 100'),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  dataPoints: z.number().int().min(0, 'Data points must be non-negative'),
  lastUpdated: z.string().datetime('Invalid last updated date'),
  features: z.array(z.string()),
});

// Prediction result schema
export const predictionResultSchema = z.object({
  outcome: z.enum(['won', 'lost', 'void', 'pushed']),
  actualResult: z.string().min(1, 'Actual result required'),
  profit: z.number().optional(),
  roi: z.number().optional(),
  settledAt: z.string().datetime('Invalid settled date'),
  settledBy: z.enum(['automatic', 'manual']),
});

// Prediction metadata schema
export const predictionMetadataSchema = z.object({
  difficulty: difficultySchema,
  popularity: z.number().int().min(0, 'Popularity must be non-negative'),
  bookmakerCount: z.number().int().min(0, 'Bookmaker count must be non-negative'),
  marketLiquidity: liquiditySchema,
  variance: z.number().min(0, 'Variance must be non-negative'),
  trending: z.boolean(),
  featured: z.boolean(),
  premium: z.boolean(),
  categories: z.array(z.string()),
  region: z.string().min(1, 'Region required'),
  language: z.string().min(2, 'Language code must be at least 2 characters'),
});

// Main Prediction schema
export const predictionSchema = z.object({
  id: z.string().uuid('Invalid prediction ID'),
  matchId: z.string().uuid('Invalid match ID'),
  match: matchInfoSchema,
  type: predictionTypeSchema,
  market: predictionMarketSchema,
  outcome: predictionOutcomeSchema,
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  odds: z.number().min(1, 'Odds must be at least 1').optional(),
  probability: z.number().min(0).max(1, 'Probability must be between 0 and 1').optional(),
  stake: z.number().min(0, 'Stake must be non-negative').optional(),
  potentialReturn: z.number().min(0, 'Potential return must be non-negative').optional(),
  status: predictionStatusSchema,
  reasoning: z.string().optional(),
  analysis: predictionAnalysisSchema.optional(),
  tags: z.array(z.string()),
  source: predictionSourceSchema,
  algorithm: algorithmInfoSchema.optional(),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
  settledAt: z.string().datetime('Invalid settled date').optional(),
  result: predictionResultSchema.optional(),
  metadata: predictionMetadataSchema,
});

// Create prediction request schema
export const createPredictionRequestSchema = z.object({
  matchId: z.string().uuid('Invalid match ID'),
  type: predictionTypeSchema,
  market: predictionMarketSchema,
  outcome: predictionOutcomeSchema,
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
  odds: z.number().min(1, 'Odds must be at least 1').optional(),
  stake: z.number().min(0, 'Stake must be non-negative').optional(),
  reasoning: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source: predictionSourceSchema,
  algorithm: z.string().optional(),
});

// Update prediction request schema
export const updatePredictionRequestSchema = z.object({
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100').optional(),
  odds: z.number().min(1, 'Odds must be at least 1').optional(),
  stake: z.number().min(0, 'Stake must be non-negative').optional(),
  reasoning: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: predictionStatusSchema.optional(),
});

// Prediction filter schema
export const predictionFilterSchema = z.object({
  sportId: z.string().uuid().optional(),
  competitionId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  type: predictionTypeSchema.optional(),
  status: predictionStatusSchema.optional(),
  source: predictionSourceSchema.optional(),
  minConfidence: z.number().min(0).max(100).optional(),
  maxConfidence: z.number().min(0).max(100).optional(),
  minOdds: z.number().min(1).optional(),
  maxOdds: z.number().min(1).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  premium: z.boolean().optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Prediction search params schema
export const predictionSearchParamsSchema = predictionFilterSchema.extend({
  query: z.string().min(2, 'Search query must be at least 2 characters').optional(),
  sortBy: z.enum(['confidence', 'odds', 'createdAt', 'popularity', 'roi']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Type stats schema
export const typeStatsSchema = z.object({
  count: z.number().int().min(0),
  winRate: z.number().min(0).max(100),
  averageOdds: z.number().min(1),
  profit: z.number(),
  roi: z.number(),
});

// Source stats schema
export const sourceStatsSchema = z.object({
  count: z.number().int().min(0),
  winRate: z.number().min(0).max(100),
  averageConfidence: z.number().min(0).max(100),
  profit: z.number(),
  roi: z.number(),
});

// Prediction stats schema
export const predictionStatsSchema = z.object({
  totalPredictions: z.number().int().min(0),
  winRate: z.number().min(0).max(100),
  averageOdds: z.number().min(1),
  averageConfidence: z.number().min(0).max(100),
  totalProfit: z.number(),
  roi: z.number(),
  bestStreak: z.number().int().min(0),
  currentStreak: z.number().int(),
  byType: z.record(predictionTypeSchema, typeStatsSchema),
  bySource: z.record(predictionSourceSchema, sourceStatsSchema),
});

// Prediction search response schema
export const predictionSearchResponseSchema = z.object({
  predictions: z.array(predictionSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  hasMore: z.boolean(),
  stats: predictionStatsSchema,
  filters: z.object({
    sports: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        count: z.number().int().min(0),
      })
    ),
    competitions: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        count: z.number().int().min(0),
      })
    ),
    types: z.array(
      z.object({
        type: predictionTypeSchema,
        count: z.number().int().min(0),
      })
    ),
    sources: z.array(
      z.object({
        source: predictionSourceSchema,
        count: z.number().int().min(0),
      })
    ),
    tags: z.array(
      z.object({
        tag: z.string(),
        count: z.number().int().min(0),
      })
    ),
  }),
});

// Risk management settings schema
export const riskManagementSettingsSchema = z.object({
  maxRiskPerBet: z.number().min(0).max(100, 'Max risk per bet must be between 0 and 100'),
  stopLossLimit: z.number().min(0, 'Stop loss limit must be non-negative'),
  profitTarget: z.number().min(0, 'Profit target must be non-negative'),
  maxConsecutiveLosses: z.number().int().min(1, 'Max consecutive losses must be at least 1'),
  cooldownPeriod: z.number().int().min(0, 'Cooldown period must be non-negative'),
});

// Prediction notification settings schema
export const predictionNotificationSettingsSchema = z.object({
  newPredictions: z.boolean(),
  resultUpdates: z.boolean(),
  winStreaks: z.boolean(),
  lossStreaks: z.boolean(),
  profitTargets: z.boolean(),
  riskAlerts: z.boolean(),
});

// Staking strategy schema
export const stakingStrategySchema = z.object({
  type: stakingStrategyTypeSchema,
  baseAmount: z.number().min(0, 'Base amount must be non-negative'),
  riskPercentage: z.number().min(0).max(100).optional(),
  maxStake: z.number().min(0).optional(),
  progressionFactor: z.number().min(1).optional(),
});

// Portfolio settings schema
export const portfolioSettingsSchema = z.object({
  defaultStake: z.number().min(0, 'Default stake must be non-negative'),
  maxStakePerBet: z.number().min(0, 'Max stake per bet must be non-negative'),
  maxDailyStake: z.number().min(0, 'Max daily stake must be non-negative'),
  riskManagement: riskManagementSettingsSchema,
  notifications: predictionNotificationSettingsSchema,
  autoStaking: z.boolean(),
  stakingStrategy: stakingStrategySchema,
});

// Export inferred types for use in other modules
export type PredictionSchemaType = z.infer<typeof predictionSchema>;
export type CreatePredictionRequestSchemaType = z.infer<typeof createPredictionRequestSchema>;
export type UpdatePredictionRequestSchemaType = z.infer<typeof updatePredictionRequestSchema>;
export type PredictionSearchParamsSchemaType = z.infer<typeof predictionSearchParamsSchema>;
export type PredictionSearchResponseSchemaType = z.infer<typeof predictionSearchResponseSchema>;
export type PredictionStatsSchemaType = z.infer<typeof predictionStatsSchema>;
