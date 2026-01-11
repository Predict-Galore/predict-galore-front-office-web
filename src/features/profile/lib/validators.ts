/**
 * Profile Validators
 * Business logic validators for profile feature
 */

import type { UpdateProfileRequest, ChangePasswordRequest } from '../api/types';

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate update profile request
 */
export function validateUpdateProfileRequest(data: UpdateProfileRequest): {
  isValid: boolean;
  errors: Partial<Record<keyof UpdateProfileRequest, string>>;
} {
  const errors: Partial<Record<keyof UpdateProfileRequest, string>> = {};

  if (data.firstName && data.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (data.lastName && data.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate change password request
 */
export function validateChangePasswordRequest(data: ChangePasswordRequest): {
  isValid: boolean;
  errors: Partial<Record<keyof ChangePasswordRequest, string>>;
} {
  const errors: Partial<Record<keyof ChangePasswordRequest, string>> = {};

  if (!data.oldPassword) {
    errors.oldPassword = 'Old password is required';
  }

  if (!data.newPassword || !isStrongPassword(data.newPassword)) {
    errors.newPassword =
      'Password must be at least 8 characters with uppercase, lowercase, and number';
  }

  if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
