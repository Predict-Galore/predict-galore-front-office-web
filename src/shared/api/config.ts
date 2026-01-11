/**
 * API CONFIGURATION
 *
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com',
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

  // Predictions endpoints
  PREDICTIONS: {
    SPORTS: '/api/v1/sports',
    LEAGUES: (sportId: number) => `/api/v1/predictions/leagues?sportId=${sportId}`,
    MATCHES: (sportId?: number, leagueId?: number) => {
      const params = new URLSearchParams();
      if (sportId) params.append('sportId', String(sportId));
      if (leagueId) params.append('leagueId', String(leagueId));
      return `/api/v1/predictions/matches?${params.toString()}`;
    },
    DETAIL: (matchId: number) => `/api/v1/predictions/matches/${matchId}`,
    ODDS: (matchId: number) => `/api/v1/predictions/matches/${matchId}/odds`,
    LEAGUE_TABLE: (leagueId: number) => `/api/v1/predictions/leagues/${leagueId}/table`,
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
} as const;
