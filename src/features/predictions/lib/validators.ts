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

  return {
    isValid: errors.length === 0,
    errors,
  };
}
