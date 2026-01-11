/**
 * Contact Validators
 * Business logic validators for contact feature
 */

import type { ContactFormData } from '../model/types';

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
 * Validate contact form data
 */
export function validateContactFormData(data: ContactFormData): {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
} {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  if (!data.name || data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.subject || data.subject.length < 1) {
    errors.subject = 'Subject is required';
  }

  if (!data.message || data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  if (!data.phoneNumber || !isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
