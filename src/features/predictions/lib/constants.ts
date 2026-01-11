/**
 * Predictions Feature Constants
 * Migrated from dashboard constants
 */

export const PREDICTIONS_CONSTANTS = {
  MOCK_DATA: {
    BANNER_QUOTE:
      'Bet with your head, not over it. Stay in control and enjoy the game responsibly.',
    BANNER_AUTHOR: 'Billy Walters',
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

  PREDICTION_STATS: {
    AVERAGE_ACCURACY: 78,
    PREDICTIONS_THIS_WEEK: 24,
    TOP_MATCH_CONFIDENCE: 92,
    WIN_RATE: 65,
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

  // Default sports for tabs (without IDs, IDs are assigned dynamically)
  DEFAULT_SPORTS: [
    { name: 'All Sports', icon: 'all', isActive: true },
    { name: 'Soccer', icon: 'soccer', isActive: true },
    { name: 'Basketball', icon: 'basketball', isActive: true },
    { name: 'Tennis', icon: 'tennis', isActive: true },
    { name: 'Cricket', icon: 'cricket', isActive: true },
    { name: 'American Football', icon: 'american-football', isActive: true },
  ] as const,
} as const;

// Export as DASHBOARD_CONSTANTS for backward compatibility during migration
export const DASHBOARD_CONSTANTS = PREDICTIONS_CONSTANTS;
