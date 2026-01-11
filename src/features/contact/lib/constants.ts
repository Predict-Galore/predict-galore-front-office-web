/**
 * Contact Feature Constants
 */

export const CONTACT_CONSTANTS = {
  CONTACT_INFO: {
    email: 'support@predictgalore.com',
    phone: '+1 (555) 123-4567',
    address: '123 Sports Avenue, Predict City, PC 12345',
    workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
  },

  SUBJECT_OPTIONS: [
    'General Inquiry',
    'Technical Support',
    'Account Issues',
    'Feedback/Suggestions',
    'Partnership Opportunities',
    'Press/Media',
    'Other',
  ] as const,

  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE_MIN_LENGTH: 10,
    MESSAGE_MAX_LENGTH: 1000,
  } as const,
} as const;
