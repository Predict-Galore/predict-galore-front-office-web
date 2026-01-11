/**
 * COMMON TYPES
 *
 * Shared type definitions used across the application
 */

// ==================== USER TYPE ====================
/**
 * Base User interface - single source of truth for user data
 * Used across authentication, profile, and dashboard components
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'guest';
  isEmailVerified: boolean;
  phoneNumber?: string;
  countryCode?: string;
  avatar?: string;
  userTypeId?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Profile User - subset of User for profile components
 * All fields are optional for partial updates
 */
export type ProfileUser = Partial<User> & {
  id: string;
  email: string;
};

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = unknown> {
  success?: boolean;
  status?: string;
  data?: T;
  message?: string;
  code?: string;
  error?: string;
}

// ==================== PAGINATION TYPES ====================
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
