/**
 * AUTH API TYPES
 *
 * API-specific types for authentication feature
 */

import type { User } from '@/shared/types';

// ==================== API REQUEST TYPES ====================
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  userTypeId?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  token: string;
}

export interface VerifyOtpResponse {
  token?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
  email?: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterResponse {
  user: User;
  token: string;
  requiresEmailVerification: boolean;
}

export interface LocalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponseWithUser<T = unknown> {
  success?: boolean;
  status?: string;
  data?: T;
  message?: string;
  code?: string;
  error?: string;
  user?: LocalUser;
  token?: string;
}
