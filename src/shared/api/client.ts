/**
 * CENTRALIZED API CLIENT
 *
 * Unified API client for all HTTP requests with:
 * - Automatic token injection
 * - Request/response logging
 * - Error handling
 * - Type safety
 */

import { API_CONFIG } from './config';
import { createLogger } from './logger';
import { ApiError, NetworkError } from '@/shared/lib/errors';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private logger = createLogger('ApiClient');

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return localStorage.getItem('auth-token');
    } catch (error) {
      this.logger.warn('Failed to get auth token', { error });
      return null;
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number>): string {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    return `${url}?${queryParams.toString()}`;
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    return headers;
  }

  /**
   * Handle response and parse JSON
   */
  private async handleResponse<T>(response: Response, startTime: number): Promise<T> {
    const duration = Date.now() - startTime;
    const responseText = await response.text();

    if (!response.ok) {
      let errorData: unknown = {};
      try {
        errorData = responseText ? JSON.parse(responseText) : {};
      } catch {
        // If parsing fails, use response text as error message
      }

      const errorMessage =
        (errorData as { message?: string })?.message ||
        (errorData as { error?: string })?.error ||
        response.statusText ||
        'Request failed';

      // Only log as error if it's a server error (5xx) or unexpected client error
      // 4xx errors (like 404, 401) are expected in some cases and should be handled gracefully
      const isServerError = response.status >= 500;
      const isUnexpectedClientError =
        response.status === 400 || response.status === 403 || response.status === 409;

      if (isServerError || isUnexpectedClientError) {
        this.logger.error('API request failed', {
          status: response.status,
          statusText: response.statusText,
          duration,
          error: errorData,
        });
      } else {
        // Log 404, 401, etc. as debug/info in development only
        this.logger.debug('API request failed (expected)', {
          status: response.status,
          statusText: response.statusText,
          duration,
        });
      }

      throw new ApiError(errorMessage, response.status, response.statusText, errorData);
    }

    // Parse response
    try {
      const data = responseText ? JSON.parse(responseText) : null;

      this.logger.info('API request successful', {
        status: response.status,
        duration,
      });

      return data as T;
    } catch (error) {
      this.logger.error('Failed to parse response', { error, responseText });
      throw new ApiError('Failed to parse response', response.status, response.statusText);
    }
  }

  /**
   * Make HTTP request with timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, string | number>
  ): Promise<T> {
    const startTime = Date.now();
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(options.headers as Record<string, string>);

    this.logger.debug('Making API request', {
      method: options.method || 'GET',
      url,
      headers: Object.keys(headers),
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response, startTime);
    } catch (error) {
      const duration = Date.now() - startTime;

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.error('Request timeout', { url, duration });
        throw new ApiError('Request timeout', 408, 'Request Timeout');
      }

      this.logger.error('Request failed', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

      throw new NetworkError(error instanceof Error ? error.message : 'Request failed');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, params);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    params?: Record<string, string | number>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      params
    );
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    params?: Record<string, string | number>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      params
    );
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    params?: Record<string, string | number>
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      params
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, params);
  }
}

// Create singleton instance
const apiClient = new ApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

export default apiClient;
