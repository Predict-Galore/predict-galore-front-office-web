/**
 * AUTH UTILITIES
 *
 * Feature-specific utility functions
 */

import type { PasswordStrength } from '../model/types';

/**
 * Check if user is authenticated
 */
export function isAuthenticated(token: string | null): boolean {
  return !!token;
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem('auth-token');
  } catch {
    return null;
  }
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('auth-token', token);
  } catch {
    console.error('Failed to set auth token');
  }
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('auth-token');
  } catch {
    console.error('Failed to remove auth token');
  }
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
