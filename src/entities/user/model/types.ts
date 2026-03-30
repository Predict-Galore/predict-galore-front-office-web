/**
 * USER ENTITY - Domain Model
 *
 * Core user business entity with comprehensive type definitions
 */

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  timezone?: string;
  language?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  status: UserStatus;
  role: UserRole;
  subscription?: UserSubscription;
  preferences: UserPreferences;
  stats: UserStats;
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export type UserRole = 'user' | 'premium' | 'admin' | 'moderator';

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  features: string[];
}

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  sports: string[]; // Preferred sports IDs
  leagues: string[]; // Preferred league IDs
  defaultCurrency: string;
  defaultOddsFormat: 'decimal' | 'fractional' | 'american';
  language: string;
  timezone: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  predictions: boolean;
  liveMatches: boolean;
  news: boolean;
  marketing: boolean;
}

export interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  totalWinnings: number;
  currentStreak: number;
  longestStreak: number;
  favoriteLeagues: string[];
  favoriteSports: string[];
  joinDate: string;
  lastActivity: string;
}

// User creation and update DTOs
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  country?: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UserProfile extends Omit<User, 'password'> {
  displayName: string;
  initials: string;
  isOnline: boolean;
  lastSeen?: string;
}

// User authentication states
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  subscription?: UserSubscription;
  isEmailVerified: boolean;
  preferences: UserPreferences;
}

// User search and filtering
export interface UserSearchParams {
  query?: string;
  role?: UserRole;
  status?: UserStatus;
  country?: string;
  subscription?: SubscriptionPlan;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'accuracy' | 'totalPredictions';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserSearchResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
