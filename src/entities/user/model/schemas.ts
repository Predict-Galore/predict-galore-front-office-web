/**
 * USER ENTITY - Validation Schemas
 *
 * Zod validation schemas for User entity and related types
 */

import { z } from 'zod';

// Base entity schema pattern
const baseEntitySchema = z.object({
  id: z.string().uuid('Invalid ID format'),
  createdAt: z.string().datetime('Invalid date format'),
  updatedAt: z.string().datetime('Invalid date format'),
});

// User status and role enums
export const userStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending_verification']);
export const userRoleSchema = z.enum(['user', 'premium', 'admin', 'moderator']);

// Subscription schemas
export const subscriptionPlanSchema = z.enum(['free', 'basic', 'premium', 'pro', 'enterprise']);
export const subscriptionStatusSchema = z.enum([
  'active',
  'cancelled',
  'expired',
  'trial',
  'past_due',
]);

export const userSubscriptionSchema = z.object({
  id: z.string().uuid('Invalid subscription ID'),
  plan: subscriptionPlanSchema,
  status: subscriptionStatusSchema,
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional(),
  autoRenew: z.boolean(),
  paymentMethod: z.string().optional(),
  features: z.array(z.string()),
});

// Notification preferences schema
export const notificationPreferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
  predictions: z.boolean(),
  liveMatches: z.boolean(),
  news: z.boolean(),
  marketing: z.boolean(),
});

// User preferences schema
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: notificationPreferencesSchema,
  sports: z.array(z.string()),
  leagues: z.array(z.string()),
  defaultCurrency: z.string().length(3, 'Currency code must be 3 characters'),
  defaultOddsFormat: z.enum(['decimal', 'fractional', 'american']),
  language: z.string().min(2, 'Language code must be at least 2 characters'),
  timezone: z.string().min(1, 'Timezone is required'),
});

// User stats schema
export const userStatsSchema = z.object({
  totalPredictions: z.number().int().min(0),
  correctPredictions: z.number().int().min(0),
  accuracy: z.number().min(0).max(100),
  totalWinnings: z.number().min(0),
  currentStreak: z.number().int().min(0),
  longestStreak: z.number().int().min(0),
  favoriteLeagues: z.array(z.string()),
  favoriteSports: z.array(z.string()),
  joinDate: z.string().datetime('Invalid join date'),
  lastActivity: z.string().datetime('Invalid last activity date'),
});

// Main User schema
export const userSchema = baseEntitySchema.extend({
  email: z.string().email('Invalid email format').max(100, 'Email too long'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .optional(),
  firstName: z.string().min(1, 'First name required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name required').max(50, 'Last name too long').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format')
    .optional(),
  dateOfBirth: z.string().datetime('Invalid date of birth').optional(),
  country: z.string().length(2, 'Country code must be 2 characters').optional(),
  timezone: z.string().min(1, 'Timezone required').optional(),
  language: z.string().min(2, 'Language code must be at least 2 characters').optional(),
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  lastLoginAt: z.string().datetime('Invalid last login date').optional(),
  status: userStatusSchema,
  role: userRoleSchema,
  subscription: userSubscriptionSchema.optional(),
  preferences: userPreferencesSchema,
  stats: userStatsSchema,
});

// User creation request schema
export const createUserRequestSchema = z.object({
  email: z.string().email('Invalid email format').max(100, 'Email too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1, 'First name required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name required').max(50, 'Last name too long').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format')
    .optional(),
  country: z.string().length(2, 'Country code must be 2 characters').optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'Must accept terms and conditions'),
  acceptMarketing: z.boolean().optional(),
});

// User update request schema
export const updateUserRequestSchema = z.object({
  firstName: z.string().min(1, 'First name required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name required').max(50, 'Last name too long').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format')
    .optional(),
  dateOfBirth: z.string().datetime('Invalid date of birth').optional(),
  country: z.string().length(2, 'Country code must be 2 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  preferences: userPreferencesSchema.partial().optional(),
});

// User profile schema (excludes sensitive data)
export const userProfileSchema = userSchema
  .omit({
    // Remove any sensitive fields that shouldn't be in public profiles
  })
  .extend({
    displayName: z.string().min(1, 'Display name required'),
    initials: z.string().min(1, 'Initials required').max(3, 'Initials too long'),
    isOnline: z.boolean(),
    lastSeen: z.string().datetime('Invalid last seen date').optional(),
  });

// Auth user schema (subset for authentication)
export const authUserSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  email: z.string().email('Invalid email format'),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  role: userRoleSchema,
  subscription: userSubscriptionSchema.optional(),
  isEmailVerified: z.boolean(),
  preferences: userPreferencesSchema,
});

// User search params schema
export const userSearchParamsSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters').optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  country: z.string().length(2, 'Country code must be 2 characters').optional(),
  subscription: subscriptionPlanSchema.optional(),
  sortBy: z.enum(['createdAt', 'lastLoginAt', 'accuracy', 'totalPredictions']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// User search response schema
export const userSearchResponseSchema = z.object({
  users: z.array(userProfileSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  hasMore: z.boolean(),
});

// Export inferred types for use in other modules
export type UserSchemaType = z.infer<typeof userSchema>;
export type CreateUserRequestSchemaType = z.infer<typeof createUserRequestSchema>;
export type UpdateUserRequestSchemaType = z.infer<typeof updateUserRequestSchema>;
export type UserProfileSchemaType = z.infer<typeof userProfileSchema>;
export type AuthUserSchemaType = z.infer<typeof authUserSchema>;
export type UserSearchParamsSchemaType = z.infer<typeof userSearchParamsSchema>;
export type UserSearchResponseSchemaType = z.infer<typeof userSearchResponseSchema>;
