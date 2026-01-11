/**
 * Contact Utilities
 * Feature-specific utility functions
 */

import type { ContactFormData } from '../model/types';

/**
 * Validate contact form data
 */
export function validateContactForm(data: ContactFormData): boolean {
  return !!(data.name && data.email && data.subject && data.message && data.phoneNumber);
}

/**
 * Format contact form data for submission
 */
export function formatContactFormData(data: ContactFormData): ContactFormData {
  return {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    phoneNumber: data.phoneNumber.replace(/\D/g, ''),
  };
}
