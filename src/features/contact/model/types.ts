/**
 * Contact Domain Types
 * Domain layer - Core business entities for contact feature
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phoneNumber: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
}

export interface ContactFormSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

export interface ContactFilter {
  page?: number;
  pageSize?: number;
}
