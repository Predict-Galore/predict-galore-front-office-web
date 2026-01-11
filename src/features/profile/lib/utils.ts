/**
 * Profile Utilities
 * Feature-specific utility functions
 */

import type { ProfileUser } from '../model/types';

/**
 * Get user full name
 */
export function getUserFullName(user: ProfileUser | null | undefined): string {
  if (!user) return '';
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName} ${lastName}`.trim() || user.email || 'User';
}

/**
 * Get user initials
 */
export function getUserInitials(user: ProfileUser | null | undefined): string {
  if (!user) return '';
  const fullName = getUserFullName(user);
  if (!fullName) return '';
  return fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
