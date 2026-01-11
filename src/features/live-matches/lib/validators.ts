/**
 * LIVE MATCHES VALIDATORS
 *
 * Business logic validators for live matches
 */

import type { LiveMatchesFilter } from '../model/types';

/**
 * Validate live matches filter
 */
export function validateLiveMatchesFilter(filter: LiveMatchesFilter): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (filter.leagueId !== undefined && filter.leagueId < 0) {
    errors.push('League ID must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate match ID
 */
export function validateMatchId(matchId: string): {
  isValid: boolean;
  error?: string;
} {
  if (!matchId || matchId.trim().length === 0) {
    return { isValid: false, error: 'Match ID is required' };
  }

  return { isValid: true };
}

/**
 * Validate fixture ID
 */
export function validateFixtureId(fixtureId: number): {
  isValid: boolean;
  error?: string;
} {
  if (!fixtureId || fixtureId < 0) {
    return { isValid: false, error: 'Fixture ID must be a positive number' };
  }

  return { isValid: true };
}
