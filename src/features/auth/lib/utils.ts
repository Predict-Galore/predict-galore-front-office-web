/**
 * AUTH UTILITIES
 *
 * Feature-specific utility functions
 */

import { AUTH_COOKIE_NAME } from './constants';
import type { PasswordStrength } from '../model/types';

/** Set auth cookie so middleware allows protected routes (must match middleware cookie name) */
export function setAuthCookie(token: string, maxAgeDays = 7): void {
  if (typeof document === 'undefined') return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Clear auth cookie on logout */
export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const score = Math.round((metRequirements / 5) * 100);
  const isValid = metRequirements >= 4; // At least 4 out of 5 requirements

  const feedback: string[] = [];
  if (!requirements.length) feedback.push('At least 8 characters');
  if (!requirements.uppercase) feedback.push('One uppercase letter');
  if (!requirements.lowercase) feedback.push('One lowercase letter');
  if (!requirements.number) feedback.push('One number');
  if (!requirements.special) feedback.push('One special character (@$!%*?&)');

  return {
    score,
    isValid,
    meetsRequirements: requirements,
    feedback,
  };
}

/**
 * Check if password is strong
 */
export function isStrongPassword(password: string): boolean {
  const strength = validatePasswordStrength(password);
  return strength.isValid;
}
