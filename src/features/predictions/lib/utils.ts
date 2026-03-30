/**
 * PREDICTIONS UTILITIES
 *
 * Feature-specific utility functions
 */

import type { Prediction, MatchStatus } from '../model/types';

/**
 * Check if prediction is upcoming
 */
export function isUpcomingPrediction(prediction: Prediction): boolean {
  if (!prediction.startTime) return false;

  const startTime = new Date(prediction.startTime);
  const now = new Date();
  return startTime > now && prediction.status === 'Prediction';
}

/**
 * Check if prediction is live
 */
export function isLivePrediction(prediction: Prediction): boolean {
  return prediction.status === 'Live' || prediction.status === 'HT' || prediction.status === 'ET';
}

/**
 * Check if prediction is finished
 */
export function isFinishedPrediction(prediction: Prediction): boolean {
  return prediction.status === 'FT' || prediction.status === 'Locked';
}

/**
 * Get prediction status color
 */
export function getStatusColor(status: MatchStatus): string {
  switch (status) {
    case 'Live':
    case 'HT':
    case 'ET':
      return 'text-red-500';
    case 'FT':
    case 'Locked':
      return 'text-gray-500';
    case 'Prediction':
    default:
      return 'text-blue-500';
  }
}

/**
 * Format prediction time
 */
export function formatPredictionTime(startTime: string): string {
  const date = new Date(startTime);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate time until prediction
 */
export function getTimeUntilPrediction(startTime: string): string {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start.getTime() - now.getTime();

  if (diff < 0) return 'Started';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
