/**
 * ENTITIES - Public API
 *
 * Central export point for all business entities with comprehensive validation,
 * transformers, and utilities
 */

// Base entity utilities
export * from '../shared/lib/entity-base';

// User Entity - Enhanced with validation, transformers, and utilities
export * from './user';

// News Entity
export type * from './news/model/types';

// Re-export commonly used types for convenience
export type {
  User,
  UserProfile,
  AuthUser,
  UserRole,
  UserStatus,
  UserSubscription,
  UserPreferences,
  UserStats,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchParams,
  UserSearchResponse,
} from './user/model/types';

export type {
  Match,
  Team,
  Sport,
  Competition,
  MatchStatus,
  MatchScore,
  MatchEvent,
  MatchStatistics,
  MatchOdds,
  WeatherConditions,
  MatchCoverage,
  MatchMetadata,
  MatchSearchParams,
  MatchSearchResponse,
  LiveMatchUpdate,
  Country,
  Person,
  Venue,
  Season,
  Referee,
} from './match/model/types';

export type {
  Prediction,
  PredictionType,
  PredictionStatus,
  PredictionOutcome,
  PredictionAnalysis,
  PredictionResult,
  PredictionMarket,
  PredictionSource,
  MatchInfo,
  TeamInfo,
  AlgorithmInfo,
  CreatePredictionRequest,
  UpdatePredictionRequest,
  PredictionSearchParams,
  PredictionSearchResponse,
  PredictionStats,
  PredictionPortfolio,
  PerformanceMetrics,
} from './prediction/model/types';

export type {
  NewsArticle,
  NewsCategory,
  NewsSource,
  Author,
  MediaContent,
  ArticleStatus,
  ArticlePriority,
} from './news/model/types';

// Re-export validation schemas
export {
  userSchema,
  createUserRequestSchema,
  updateUserRequestSchema,
  userProfileSchema,
  authUserSchema,
  userSearchParamsSchema,
  userSearchResponseSchema,
} from './user/model/schemas';

export {
  matchSchema,
  teamSchema,
  sportSchema,
  competitionSchema,
  matchSearchParamsSchema,
  matchSearchResponseSchema,
  liveMatchUpdateSchema,
  matchEventSchema,
  matchScoreSchema,
  matchStatisticsSchema,
} from './match/model/schemas';

export {
  predictionSchema,
  createPredictionRequestSchema,
  updatePredictionRequestSchema,
  predictionSearchParamsSchema,
  predictionSearchResponseSchema,
  predictionStatsSchema,
} from './prediction/model/schemas';

// Re-export transformers
export {
  transformApiUserToEntity,
  transformUserEntityToApi,
  transformCreateUserRequestToApi,
  transformUpdateUserRequestToApi,
  transformUserToProfile,
  transformUserToAuthUser,
  transformApiUsersToSearchResponse,
  transformApiUsersToEntities,
  transformUsersToProfiles,
} from './user/model/transformers';

export {
  transformApiPredictionToEntity,
  transformPredictionEntityToApi,
  transformCreatePredictionRequestToApi,
  transformUpdatePredictionRequestToApi,
  transformApiPredictionsToSearchResponse,
  transformApiPredictionsToEntities,
} from './prediction/model/transformers';

// Re-export user utility functions
export * from './user/model/utils';
