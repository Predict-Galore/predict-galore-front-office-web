/**
 * LIVE MATCHES UTILITIES
 *
 * Feature-specific utility functions
 */

import type { Match, MatchStatus } from '../model/types';

/**
 * Check if match is live
 */
export function isLiveMatch(match: Match): boolean {
  return match.status === 'Live' || match.status === 'HT' || match.status === 'ET';
}

/**
 * Check if match is upcoming
 */
export function isUpcomingMatch(match: Match): boolean {
  const matchTime = new Date(match.dateTime);
  const now = new Date();
  return matchTime > now && match.status === 'Prediction';
}

/**
 * Check if match is finished
 */
export function isFinishedMatch(match: Match): boolean {
  return match.status === 'FT';
}

/**
 * Get match status color
 */
export function getMatchStatusColor(status: MatchStatus): string {
  switch (status) {
    case 'Live':
    case 'HT':
    case 'ET':
      return 'text-red-500';
    case 'FT':
      return 'text-gray-500';
    case 'Prediction':
    default:
      return 'text-blue-500';
  }
}

/**
 * Format match time
 */
export function formatMatchTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get time elapsed for live match
 */
export function getTimeElapsed(match: Match): string {
  if (!isLiveMatch(match)) {
    return '';
  }

  const matchTime = new Date(match.dateTime);
  const now = new Date();
  const diff = Math.floor((now.getTime() - matchTime.getTime()) / (1000 * 60));

  return `${diff}'`;
}
