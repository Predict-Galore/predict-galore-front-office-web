/**
 * PREDICTIONS VALIDATORS
 *
 * Business logic validators for predictions
 */

import type { PredictionFilter } from '../model/types';

/**
 * Validate prediction filters
 */
export function validatePredictionFilters(filters: PredictionFilter): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (filters.sportId !== undefined && filters.sportId < 0) {
    errors.push('Sport ID must be a positive number');
  }

  if (filters.leagueId !== undefined && filters.leagueId < 0) {
    errors.push('League ID must be a positive number');
  }

  if (filters.page !== undefined && filters.page < 1) {
    errors.push('Page must be greater than 0');
  }

  if (filters.pageSize !== undefined && (filters.pageSize < 1 || filters.pageSize > 100)) {
    errors.push('Page size must be between 1 and 100');
  }

  if (filters.fromUtc && filters.toUtc) {
    const fromDate = new Date(filters.fromUtc);
    const toDate = new Date(filters.toUtc);

    if (fromDate > toDate) {
      errors.push('Start date must be before end date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate date range
 */
export function validateDateRange(
  fromUtc: string,
  toUtc: string
): {
  isValid: boolean;
  error?: string;
} {
  const fromDate = new Date(fromUtc);
  const toDate = new Date(toUtc);
  const now = new Date();

  if (isNaN(fromDate.getTime())) {
    return { isValid: false, error: 'Invalid start date' };
  }

  if (isNaN(toDate.getTime())) {
    return { isValid: false, error: 'Invalid end date' };
  }

  if (fromDate > toDate) {
    return { isValid: false, error: 'Start date must be before end date' };
  }

  if (toDate < now) {
    return { isValid: false, error: 'End date must be in the future' };
  }

  // Check if range is too large (e.g., more than 1 year)
  const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
  if (toDate.getTime() - fromDate.getTime() > maxRange) {
    return { isValid: false, error: 'Date range cannot exceed 1 year' };
  }

  return { isValid: true };
}
