/**
 * Contact Transformers
 * Business logic for data transformation
 */

import type { ContactInfo, ContactFormSubmissionResponse } from '../model/types';
import type { ContactResponse, ContactSubmissionResponse } from '../api/types';

export class ContactTransformer {
  /**
   * Transform API response to domain model
   */
  static transformContactInfo(response: ContactResponse): ContactInfo {
    return response.data;
  }

  /**
   * Transform submission response
   */
  static transformSubmissionResponse(
    response: ContactSubmissionResponse
  ): ContactFormSubmissionResponse {
    return response.data;
  }
}
