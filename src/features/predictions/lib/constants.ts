/**
 * Predictions Feature Constants
 * Migrated from dashboard constants
 */

export const PREDICTIONS_CONSTANTS = {
  /** Static banner content (no backend endpoint). */
  BANNER: {
    QUOTE: 'Bet with your head, not over it. Stay in control and enjoy the game responsibly.',
    AUTHOR: 'Billy Walters',
  },

  TEAM_STATS: {
    FORM_COLORS: {
      W: 'bg-green-100 text-green-800 border-green-200',
      D: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      L: 'bg-red-100 text-red-800 border-red-200',
    },
  },

  SPORTS: {
    SOCCER: 'soccer',
    BASKETBALL: 'basketball',
    TENNIS: 'tennis',
    HOCKEY: 'hockey',
    ALL: 'all',
  },

  MATCH_STATUS: {
    PREDICTION: 'Prediction',
    LIVE: 'Live',
    HT: 'HT',
    ET: 'ET',
    FT: 'FT',
    LOCKED: 'Locked',
  },

  // Competition sorting priorities
  COMPETITIONS: {
    PREMIER_LEAGUE: 'Premier League',
    PRIORITY_COMPETITIONS: [
      'Premier League',
      'La Liga',
      'Serie A',
      'Bundesliga',
      'Champions League',
    ],
  },
} as const;

// Export as DASHBOARD_CONSTANTS for backward compatibility during migration
export const DASHBOARD_CONSTANTS = PREDICTIONS_CONSTANTS;
