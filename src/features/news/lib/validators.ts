/**
 * NEWS VALIDATORS
 *
 * Business logic validators for news
 */

import type { NewsFilter } from '../model/types';

/**
 * Validate news filters
 */
export function validateNewsFilters(filters: NewsFilter): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (filters.page !== undefined && filters.page < 1) {
    errors.push('Page must be greater than 0');
  }

  if (filters.pageSize !== undefined && (filters.pageSize < 1 || filters.pageSize > 100)) {
    errors.push('Page size must be between 1 and 100');
  }

  if (filters.search && filters.search.trim().length < 2) {
    errors.push('Search term must be at least 2 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate news ID
 */
export function validateNewsId(newsId: number): {
  isValid: boolean;
  error?: string;
} {
  if (!newsId || newsId < 0) {
    return { isValid: false, error: 'News ID must be a positive number' };
  }

  return { isValid: true };
}
