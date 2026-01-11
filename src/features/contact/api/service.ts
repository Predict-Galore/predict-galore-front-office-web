/**
 * Contact Service
 * Application layer - Business logic and API calls for contact
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { ContactTransformer } from '../lib/transformers';
import { formatContactFormData } from '../lib/utils';
import type { ContactFormData, ContactInfo, ContactFormSubmissionResponse } from './types';
import type { ApiResponse } from '@/shared/types';

const logger = createLogger('ContactService');

/**
 * Contact Service Class
 * Handles all contact-related API calls
 */
export class ContactService {
  /**
   * Get contact information
   */
  static async getContactInfo(): Promise<ContactInfo> {
    logger.info('Get contact info request');

    const response = await api.get<ApiResponse<ContactInfo> | ContactInfo>(
      API_ENDPOINTS.CONTACT.INFO
    );

    // Handle both wrapped and direct responses
    if ('data' in response && response.data) {
      return ContactTransformer.transformContactInfo({ data: response.data });
    }
    return ContactTransformer.transformContactInfo({ data: response as ContactInfo });
  }

  /**
   * Submit contact form
   */
  static async submitContactForm(data: ContactFormData): Promise<ContactFormSubmissionResponse> {
    logger.info('Submit contact form request');

    // Format data
    const formattedData = formatContactFormData(data);

    // Business logic validation
    this.validateContactData(formattedData);

    const response = await api.post<
      ApiResponse<ContactFormSubmissionResponse> | ContactFormSubmissionResponse
    >(API_ENDPOINTS.CONTACT.SUBMIT, formattedData);

    // Handle both wrapped and direct responses
    if ('data' in response && response.data) {
      return ContactTransformer.transformSubmissionResponse({ data: response.data });
    }
    return ContactTransformer.transformSubmissionResponse({
      data: response as ContactFormSubmissionResponse,
    });
  }

  /**
   * Business logic validation
   */
  private static validateContactData(data: ContactFormData): void {
    if (!data.name || data.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    if (!data.subject || data.subject.length < 1) {
      throw new Error('Subject is required');
    }
    if (!data.message || data.message.length < 10) {
      throw new Error('Message must be at least 10 characters');
    }
    if (!data.phoneNumber || data.phoneNumber.length < 8) {
      throw new Error('Please enter a valid phone number');
    }
  }
}
