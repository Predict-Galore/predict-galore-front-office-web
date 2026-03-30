/**
 * USER ENTITY - Utility Functions
 *
 * Common utility functions for User entity operations
 */

import {
  User,
  UserProfile,
  AuthUser,
  UserRole,
  SubscriptionPlan,
  SubscriptionStatus,
  UserPreferences,
  UserStats,
  NotificationPreferences,
} from './types';

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | AuthUser, role: UserRole): boolean {
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | AuthUser, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

/**
 * Check if user is an admin or moderator
 */
export function isStaff(user: User | AuthUser): boolean {
  return hasAnyRole(user, ['admin', 'moderator']);
}

/**
 * Check if user is premium (has premium role or active premium subscription)
 */
export function isPremium(user: User | AuthUser): boolean {
  if (hasAnyRole(user, ['premium', 'admin'])) {
    return true;
  }

  if ('subscription' in user && user.subscription) {
    return (
      user.subscription.status === 'active' &&
      ['premium', 'pro', 'enterprise'].includes(user.subscription.plan)
    );
  }

  return false;
}

/**
 * Check if user account is active
 */
export function isActive(user: User | AuthUser): boolean {
  if ('status' in user) {
    return user.status === 'active';
  }

  // AuthUser currently doesn't carry status field,
  // treat authenticated users as active by default.
  return true;
}

/**
 * Check if user account is verified
 */
export function isVerified(user: User | AuthUser): boolean {
  return user.isEmailVerified;
}

/**
 * Check if user can perform action based on status and verification
 */
export function canPerformAction(user: User | AuthUser): boolean {
  return isActive(user) && isVerified(user);
}

/**
 * Get user's display name
 */
export function getDisplayName(user: User | AuthUser | UserProfile): string {
  if ('displayName' in user) {
    return user.displayName;
  }

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.username) {
    return user.username;
  }

  return user.email.split('@')[0];
}

/**
 * Get user's initials
 */
export function getInitials(user: User | AuthUser | UserProfile): string {
  if ('initials' in user) {
    return user.initials;
  }

  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }

  return user.email.substring(0, 2).toUpperCase();
}

/**
 * Get user's full name
 */
export function getFullName(user: User | AuthUser): string | null {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return null;
}

/**
 * Check if user has completed their profile
 */
export function hasCompleteProfile(user: User): boolean {
  return !!(user.firstName && user.lastName && user.username && user.country && user.dateOfBirth);
}

/**
 * Calculate profile completion percentage
 */
export function getProfileCompletionPercentage(user: User): number {
  const fields = [
    user.firstName,
    user.lastName,
    user.username,
    user.avatar,
    user.phone,
    user.dateOfBirth,
    user.country,
  ];

  const completedFields = fields.filter((field) => field && field.trim() !== '').length;
  return Math.round((completedFields / fields.length) * 100);
}

/**
 * Check if user subscription is active
 */
export function hasActiveSubscription(user: User | AuthUser): boolean {
  if (!('subscription' in user) || !user.subscription) {
    return false;
  }

  return user.subscription.status === 'active';
}

/**
 * Check if user subscription is expiring soon (within 7 days)
 */
export function isSubscriptionExpiringSoon(user: User): boolean {
  if (!user.subscription || !user.subscription.endDate) {
    return false;
  }

  const endDate = new Date(user.subscription.endDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
}

/**
 * Get subscription status display text
 */
export function getSubscriptionStatusText(status: SubscriptionStatus): string {
  const statusMap: Record<SubscriptionStatus, string> = {
    active: 'Active',
    cancelled: 'Cancelled',
    expired: 'Expired',
    trial: 'Trial',
    past_due: 'Past Due',
  };

  return statusMap[status] || 'Unknown';
}

/**
 * Get subscription plan display text
 */
export function getSubscriptionPlanText(plan: SubscriptionPlan): string {
  const planMap: Record<SubscriptionPlan, string> = {
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  return planMap[plan] || 'Unknown';
}

/**
 * Calculate user's prediction accuracy
 */
export function calculateAccuracy(stats: UserStats): number {
  if (stats.totalPredictions === 0) {
    return 0;
  }

  return Math.round((stats.correctPredictions / stats.totalPredictions) * 100);
}

/**
 * Get user's performance level based on accuracy
 */
export function getPerformanceLevel(
  stats: UserStats
): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const accuracy = calculateAccuracy(stats);

  if (accuracy >= 80) return 'expert';
  if (accuracy >= 65) return 'advanced';
  if (accuracy >= 50) return 'intermediate';
  return 'beginner';
}

/**
 * Check if user has notification enabled for a specific type
 */
export function hasNotificationEnabled(
  preferences: UserPreferences,
  type: keyof NotificationPreferences
): boolean {
  return preferences.notifications[type];
}

/**
 * Get user's preferred theme
 */
export function getPreferredTheme(preferences: UserPreferences): 'light' | 'dark' | 'system' {
  return preferences.theme;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(preferences: UserPreferences): boolean {
  if (preferences.theme === 'dark') return true;
  if (preferences.theme === 'light') return false;

  // For 'system', check system preference
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
}

/**
 * Format user's last activity time
 */
export function formatLastActivity(lastActivity: string): string {
  const now = new Date();
  const activityDate = new Date(lastActivity);
  const diffInMs = now.getTime() - activityDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return activityDate.toLocaleDateString();
}

/**
 * Check if user was recently active (within last 24 hours)
 */
export function isRecentlyActive(user: User): boolean {
  if (!user.stats.lastActivity) return false;

  const now = new Date();
  const lastActivity = new Date(user.stats.lastActivity);
  const diffInHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

  return diffInHours <= 24;
}

/**
 * Get user's timezone offset
 */
export function getTimezoneOffset(user: User): number {
  if (!user.timezone) return 0;

  try {
    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const userTime = new Date(utc.toLocaleString('en-US', { timeZone: user.timezone }));
    return (userTime.getTime() - utc.getTime()) / (1000 * 60 * 60);
  } catch {
    return 0;
  }
}

/**
 * Format date in user's timezone
 */
export function formatDateInUserTimezone(date: string | Date, user: User): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!user.timezone) {
    return dateObj.toLocaleDateString();
  }

  try {
    return dateObj.toLocaleDateString('en-US', {
      timeZone: user.timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateObj.toLocaleDateString();
  }
}

/**
 * Create default user preferences
 */
export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      sms: false,
      predictions: true,
      liveMatches: true,
      news: true,
      marketing: false,
    },
    sports: [],
    leagues: [],
    defaultCurrency: 'USD',
    defaultOddsFormat: 'decimal',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Create default user stats
 */
export function createDefaultStats(): UserStats {
  return {
    totalPredictions: 0,
    correctPredictions: 0,
    accuracy: 0,
    totalWinnings: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteLeagues: [],
    favoriteSports: [],
    joinDate: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };
}

/**
 * Sanitize user data for public display (remove sensitive information)
 */
export function sanitizeUserForPublic(user: User): Partial<User> {
  const {
    // Remove sensitive fields
    email,
    phone,
    dateOfBirth,
    isEmailVerified,
    isPhoneVerified,
    lastLoginAt,
    subscription,
    preferences,
    ...publicUser
  } = user;

  void email;
  void phone;
  void dateOfBirth;
  void isEmailVerified;
  void isPhoneVerified;
  void lastLoginAt;
  void subscription;

  const sanitizedPreferences: UserPreferences = {
    theme: preferences.theme,
    notifications: {
      email: false,
      push: false,
      sms: false,
      predictions: false,
      liveMatches: false,
      news: false,
      marketing: false,
    },
    sports: [],
    leagues: [],
    defaultCurrency: '',
    defaultOddsFormat: preferences.defaultOddsFormat,
    language: preferences.language,
    timezone: preferences.timezone,
  };

  return {
    ...publicUser,
    // Only include non-sensitive preference data
    preferences: sanitizedPreferences,
  };
}

/**
 * Validate user permissions for accessing another user's data
 */
export function canAccessUserData(
  currentUser: User | AuthUser,
  targetUserId: string,
  dataType: 'public' | 'private' | 'admin'
): boolean {
  // Users can always access their own data
  if (currentUser.id === targetUserId) {
    return true;
  }

  // Admin can access all data
  if (hasRole(currentUser, 'admin')) {
    return true;
  }

  // Moderators can access public and some private data
  if (hasRole(currentUser, 'moderator') && dataType !== 'admin') {
    return true;
  }

  // Regular users can only access public data of other users
  return dataType === 'public';
}
