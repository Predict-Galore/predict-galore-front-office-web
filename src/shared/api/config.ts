/**
 * API CONFIGURATION
 *
 * Centralized configuration for API endpoints and settings
 */

/**
 * Use same-origin (empty string) by default so browser requests go to this app
 * and Next.js rewrites proxy them to the backend — avoids CORS when API is on another domain.
 * Set NEXT_PUBLIC_API_URL to the full API base (e.g. https://apidev.predictgalore.com) only if
 * the backend allows your frontend origin in CORS.
 */
const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL ?? '';
  return url.trim() || '';
};

export const API_CONFIG = {
  get BASE_URL(): string {
    return getApiBaseUrl();
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/user/login',
    REGISTER: '/api/v1/auth/user/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    CHECK_EMAIL: '/api/v1/auth/user/check-email',
    SOCIAL_GOOGLE: '/api/v1/auth/social/google',
    SOCIAL_APPLE: '/api/v1/auth/social/apple',
    FORGOT_PASSWORD: '/api/v1/auth/forgot_password/confirm_token',
    RESET_PASSWORD: '/api/v1/auth/forgot_password/reset_password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
    CONFIRM_EMAIL: '/api/v1/auth/user/confirmemail',
    PROFILE: '/api/v1/auth/user/me',
    CHANGE_PASSWORD: '/api/v1/auth/change_password',
  },

  // Live scores endpoints
  LIVE: {
    SCORES: '/api/v1/livescores',
    DETAILED_MATCH: (matchId: string) => `/api/v1/live/match/${matchId}`,
    FIXTURE: (fixtureId: number) => `/api/v1/livescores/fixture/${fixtureId}`,
    LEAGUE: (leagueId: number) => `/api/v1/livescores/league/${leagueId}`,
  },

  // Predictions endpoints (backend: /api/v1/prediction)
  PREDICTIONS: {
    SPORTS: '/api/v1/sports',
    LEAGUES: (sportId: number) => `/api/v1/predictions/leagues?sportId=${sportId}`,
    /** List predictions: query params sportId, leagueId, page, pageSize */
    LIST: '/api/v1/prediction',
    /** Get prediction by id (includes picks) */
    BY_ID: (id: number) => `/api/v1/prediction/${id}`,
    /** Get prediction for a selected match */
    MATCH: (matchId: number) => `/api/v1/prediction/matches/${matchId}`,
    ODDS: (matchId: number) => `/api/v1/predictions/matches/${matchId}/odds`,
  },

  // League table (backend: /api/v1/leagues/leagues/{leagueId}/table)
  LEAGUES: {
    TABLE: (leagueId: number) => `/api/v1/leagues/leagues/${leagueId}/table`,
  },

  // News endpoints
  NEWS: {
    LIST: '/api/v1/news',
    DETAIL: (id: number) => `/api/v1/news/${id}`,
    BREAKING: '/api/v1/news/breaking',
    CATEGORIES: '/api/v1/news/category/{category}',
  },

  // Profile endpoints
  PROFILE: {
    DETAILS: '/api/v1/auth/user/me',
    UPDATE: '/api/v1/auth/user/profile/update',
    SUBSCRIPTIONS: '/api/v1/subscriptions/plans',
    SUBSCRIPTION_PLANS: '/api/v1/subscriptions/plans',
    SUBSCRIPTION_PLAN_BY_ID: (id: number) => `/api/v1/subscriptions/plans/${id}`,
    TRANSACTIONS: '/api/v1/transactions',
    FOLLOWINGS: '/api/v1/teams/following',
    TEAMS_ALL: '/api/v1/teams/all-with-status',
    FOLLOW_TEAM: '/api/v1/teams/follow',
    UNFOLLOW_TEAM: (teamId: string | number) => `/api/v1/teams/unfollow/${teamId}`,
    UPDATE_NOTIFICATIONS: (teamId: string | number) => `/api/v1/teams/${teamId}/notifications`,
    CHANGE_PASSWORD: '/api/v1/admin/settings/password/change',
    TOGGLE_2FA: '/api/v1/admin/settings/2fa/toggle',
    CANCEL_SUBSCRIPTION: '/api/v1/subscriptions/cancel',
    UPDATE_SETTINGS: '/api/v1/user/settings',
    DELETE_ACCOUNT: '/api/v1/user/delete',
    NOTIFICATION_SETTINGS: '/api/v1/profile/notification-settings',
  },

  // Contact endpoints
  CONTACT: {
    INFO: '/api/v1/contact/info',
    SUBMIT: '/api/v1/contact',
    WAITLIST: '/api/v1/waitlist/join',
    /** Public waitlist endpoint (coming-soon page) */
    WAITLIST_PUBLIC: '/api/v1/waitlist',
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    UNREAD_COUNT: '/api/v1/notifications/unread-count',
    MARK_AS_READ: (id: number) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/api/v1/notifications/read-all',
    DELETE: (id: number) => `/api/v1/notifications/${id}`,
  },

  // Search endpoints
  SEARCH: {
    QUERY: '/api/v1/search',
    POPULAR: '/api/v1/search/popular',
  },

  // Quotes endpoint
  QUOTES: {
    TODAY: '/api/v1/quotes/today',
  },
} as const;
