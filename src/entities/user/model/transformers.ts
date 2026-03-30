/**
 * USER ENTITY - API Transformers
 *
 * Utilities for transforming between API responses and User entities
 */

import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserProfile,
  AuthUser,
  UserSearchResponse,
  UserPreferences,
  UserStats,
  UserSubscription,
  NotificationPreferences,
} from './types';
import {
  userSchema,
  createUserRequestSchema,
  updateUserRequestSchema,
  userProfileSchema,
  authUserSchema,
  userSearchResponseSchema,
} from './schemas';

// API response interfaces (what we receive from backend)
export interface ApiUserResponse {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  phone?: string;
  date_of_birth?: string;
  country?: string;
  timezone?: string;
  language?: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  status: string;
  role: string;
  subscription?: ApiSubscriptionResponse;
  preferences: ApiPreferencesResponse;
  stats: ApiStatsResponse;
}

export interface ApiSubscriptionResponse {
  id: string;
  plan: string;
  status: string;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  payment_method?: string;
  features: string[];
}

export interface ApiPreferencesResponse {
  theme: string;
  notifications: ApiNotificationPreferencesResponse;
  sports: string[];
  leagues: string[];
  default_currency: string;
  default_odds_format: string;
  language: string;
  timezone: string;
}

export interface ApiNotificationPreferencesResponse {
  email: boolean;
  push: boolean;
  sms: boolean;
  predictions: boolean;
  live_matches: boolean;
  news: boolean;
  marketing: boolean;
}

export interface ApiStatsResponse {
  total_predictions: number;
  correct_predictions: number;
  accuracy: number;
  total_winnings: number;
  current_streak: number;
  longest_streak: number;
  favorite_leagues: string[];
  favorite_sports: string[];
  join_date: string;
  last_activity: string;
}

export interface ApiCreateUserRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  country?: string;
  accept_terms: boolean;
  accept_marketing?: boolean;
}

export interface ApiUpdateUserRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  date_of_birth?: string;
  country?: string;
  avatar?: string;
  preferences?: Partial<ApiPreferencesResponse>;
}

/**
 * Transform API subscription response to UserSubscription entity
 */
export function transformApiSubscriptionToEntity(
  apiSubscription: ApiSubscriptionResponse
): UserSubscription {
  return {
    id: apiSubscription.id,
    plan: apiSubscription.plan as UserSubscription['plan'],
    status: apiSubscription.status as UserSubscription['status'],
    startDate: apiSubscription.start_date,
    endDate: apiSubscription.end_date,
    autoRenew: apiSubscription.auto_renew,
    paymentMethod: apiSubscription.payment_method,
    features: apiSubscription.features,
  };
}

/**
 * Transform API notification preferences to NotificationPreferences entity
 */
export function transformApiNotificationPreferencesToEntity(
  apiNotifications: ApiNotificationPreferencesResponse
): NotificationPreferences {
  return {
    email: apiNotifications.email,
    push: apiNotifications.push,
    sms: apiNotifications.sms,
    predictions: apiNotifications.predictions,
    liveMatches: apiNotifications.live_matches,
    news: apiNotifications.news,
    marketing: apiNotifications.marketing,
  };
}

/**
 * Transform API preferences response to UserPreferences entity
 */
export function transformApiPreferencesToEntity(
  apiPreferences: ApiPreferencesResponse
): UserPreferences {
  return {
    theme: apiPreferences.theme as UserPreferences['theme'],
    notifications: transformApiNotificationPreferencesToEntity(apiPreferences.notifications),
    sports: apiPreferences.sports,
    leagues: apiPreferences.leagues,
    defaultCurrency: apiPreferences.default_currency,
    defaultOddsFormat: apiPreferences.default_odds_format as UserPreferences['defaultOddsFormat'],
    language: apiPreferences.language,
    timezone: apiPreferences.timezone,
  };
}

/**
 * Transform API stats response to UserStats entity
 */
export function transformApiStatsToEntity(apiStats: ApiStatsResponse): UserStats {
  return {
    totalPredictions: apiStats.total_predictions,
    correctPredictions: apiStats.correct_predictions,
    accuracy: apiStats.accuracy,
    totalWinnings: apiStats.total_winnings,
    currentStreak: apiStats.current_streak,
    longestStreak: apiStats.longest_streak,
    favoriteLeagues: apiStats.favorite_leagues,
    favoriteSports: apiStats.favorite_sports,
    joinDate: apiStats.join_date,
    lastActivity: apiStats.last_activity,
  };
}

/**
 * Transform API user response to User entity with validation
 */
export function transformApiUserToEntity(apiUser: ApiUserResponse): User {
  const transformedUser: User = {
    id: apiUser.id,
    email: apiUser.email,
    username: apiUser.username,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    avatar: apiUser.avatar,
    phone: apiUser.phone,
    dateOfBirth: apiUser.date_of_birth,
    country: apiUser.country,
    timezone: apiUser.timezone,
    language: apiUser.language,
    isEmailVerified: apiUser.is_email_verified,
    isPhoneVerified: apiUser.is_phone_verified,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
    lastLoginAt: apiUser.last_login_at,
    status: apiUser.status as User['status'],
    role: apiUser.role as User['role'],
    subscription: apiUser.subscription
      ? transformApiSubscriptionToEntity(apiUser.subscription)
      : undefined,
    preferences: transformApiPreferencesToEntity(apiUser.preferences),
    stats: transformApiStatsToEntity(apiUser.stats),
  };

  // Validate the transformed user
  const validationResult = userSchema.safeParse(transformedUser);
  if (!validationResult.success) {
    throw new Error(`Invalid user data: ${validationResult.error.message}`);
  }

  return validationResult.data;
}

/**
 * Transform User entity to API format for updates
 */
export function transformUserEntityToApi(user: User): ApiUserResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    first_name: user.firstName,
    last_name: user.lastName,
    avatar: user.avatar,
    phone: user.phone,
    date_of_birth: user.dateOfBirth,
    country: user.country,
    timezone: user.timezone,
    language: user.language,
    is_email_verified: user.isEmailVerified,
    is_phone_verified: user.isPhoneVerified,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    last_login_at: user.lastLoginAt,
    status: user.status,
    role: user.role,
    subscription: user.subscription
      ? {
          id: user.subscription.id,
          plan: user.subscription.plan,
          status: user.subscription.status,
          start_date: user.subscription.startDate,
          end_date: user.subscription.endDate,
          auto_renew: user.subscription.autoRenew,
          payment_method: user.subscription.paymentMethod,
          features: user.subscription.features,
        }
      : undefined,
    preferences: {
      theme: user.preferences.theme,
      notifications: {
        email: user.preferences.notifications.email,
        push: user.preferences.notifications.push,
        sms: user.preferences.notifications.sms,
        predictions: user.preferences.notifications.predictions,
        live_matches: user.preferences.notifications.liveMatches,
        news: user.preferences.notifications.news,
        marketing: user.preferences.notifications.marketing,
      },
      sports: user.preferences.sports,
      leagues: user.preferences.leagues,
      default_currency: user.preferences.defaultCurrency,
      default_odds_format: user.preferences.defaultOddsFormat,
      language: user.preferences.language,
      timezone: user.preferences.timezone,
    },
    stats: {
      total_predictions: user.stats.totalPredictions,
      correct_predictions: user.stats.correctPredictions,
      accuracy: user.stats.accuracy,
      total_winnings: user.stats.totalWinnings,
      current_streak: user.stats.currentStreak,
      longest_streak: user.stats.longestStreak,
      favorite_leagues: user.stats.favoriteLeagues,
      favorite_sports: user.stats.favoriteSports,
      join_date: user.stats.joinDate,
      last_activity: user.stats.lastActivity,
    },
  };
}

/**
 * Transform CreateUserRequest to API format
 */
export function transformCreateUserRequestToApi(request: CreateUserRequest): ApiCreateUserRequest {
  // Validate the request first
  const validationResult = createUserRequestSchema.safeParse(request);
  if (!validationResult.success) {
    throw new Error(`Invalid create user request: ${validationResult.error.message}`);
  }

  return {
    email: request.email,
    password: request.password,
    first_name: request.firstName,
    last_name: request.lastName,
    username: request.username,
    phone: request.phone,
    country: request.country,
    accept_terms: request.acceptTerms,
    accept_marketing: request.acceptMarketing,
  };
}

/**
 * Transform UpdateUserRequest to API format
 */
export function transformUpdateUserRequestToApi(request: UpdateUserRequest): ApiUpdateUserRequest {
  // Validate the request first
  const validationResult = updateUserRequestSchema.safeParse(request);
  if (!validationResult.success) {
    throw new Error(`Invalid update user request: ${validationResult.error.message}`);
  }

  return {
    first_name: request.firstName,
    last_name: request.lastName,
    username: request.username,
    phone: request.phone,
    date_of_birth: request.dateOfBirth,
    country: request.country,
    avatar: request.avatar,
    preferences: request.preferences
      ? {
          theme: request.preferences.theme,
          notifications: request.preferences.notifications
            ? {
                email: request.preferences.notifications.email,
                push: request.preferences.notifications.push,
                sms: request.preferences.notifications.sms,
                predictions: request.preferences.notifications.predictions,
                live_matches: request.preferences.notifications.liveMatches,
                news: request.preferences.notifications.news,
                marketing: request.preferences.notifications.marketing,
              }
            : undefined,
          sports: request.preferences.sports,
          leagues: request.preferences.leagues,
          default_currency: request.preferences.defaultCurrency,
          default_odds_format: request.preferences.defaultOddsFormat,
          language: request.preferences.language,
          timezone: request.preferences.timezone,
        }
      : undefined,
  };
}

/**
 * Transform User entity to UserProfile (removes sensitive data)
 */
export function transformUserToProfile(user: User): UserProfile {
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || user.email.split('@')[0];

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.username
        ? user.username.substring(0, 2).toUpperCase()
        : user.email.substring(0, 2).toUpperCase();

  const profile: UserProfile = {
    ...user,
    displayName,
    initials,
    isOnline: false, // This would be determined by real-time status
    lastSeen: user.lastLoginAt,
  };

  // Validate the profile
  const validationResult = userProfileSchema.safeParse(profile);
  if (!validationResult.success) {
    throw new Error(`Invalid user profile: ${validationResult.error.message}`);
  }

  return validationResult.data;
}

/**
 * Transform User entity to AuthUser (subset for authentication)
 */
export function transformUserToAuthUser(user: User): AuthUser {
  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    role: user.role,
    subscription: user.subscription,
    isEmailVerified: user.isEmailVerified,
    preferences: user.preferences,
  };

  // Validate the auth user
  const validationResult = authUserSchema.safeParse(authUser);
  if (!validationResult.success) {
    throw new Error(`Invalid auth user: ${validationResult.error.message}`);
  }

  return validationResult.data;
}

/**
 * Transform array of API users to UserSearchResponse
 */
export function transformApiUsersToSearchResponse(
  apiUsers: ApiUserResponse[],
  total: number,
  page: number,
  limit: number
): UserSearchResponse {
  const users = apiUsers.map((apiUser) => {
    const user = transformApiUserToEntity(apiUser);
    return transformUserToProfile(user);
  });

  const response: UserSearchResponse = {
    users,
    total,
    page,
    limit,
    hasMore: page * limit < total,
  };

  // Validate the search response
  const validationResult = userSearchResponseSchema.safeParse(response);
  if (!validationResult.success) {
    throw new Error(`Invalid user search response: ${validationResult.error.message}`);
  }

  return validationResult.data;
}

/**
 * Batch transform multiple API users to User entities
 */
export function transformApiUsersToEntities(apiUsers: ApiUserResponse[]): User[] {
  return apiUsers.map(transformApiUserToEntity);
}

/**
 * Batch transform multiple User entities to UserProfiles
 */
export function transformUsersToProfiles(users: User[]): UserProfile[] {
  return users.map(transformUserToProfile);
}
