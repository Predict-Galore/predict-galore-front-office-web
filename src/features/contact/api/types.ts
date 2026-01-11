/**
 * Contact API Types
 * API layer - Types for API requests and responses
 */

import type {
  ContactFormData,
  ContactInfo,
  ContactFormSubmissionResponse,
  ContactFilter,
} from '../model/types';

export type { ContactFormData, ContactInfo, ContactFormSubmissionResponse, ContactFilter };

export interface ContactResponse {
  data: ContactInfo;
}

export interface ContactSubmissionResponse {
  data: ContactFormSubmissionResponse;
}
