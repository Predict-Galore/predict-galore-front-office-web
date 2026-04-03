/**
 * AUTH SERVICE
 *
 * Business logic and API calls for authentication
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  LoginResponse,
  RegisterResponse,
  ApiResponseWithUser,
  LocalUser,
} from './types';
import type { ApiResponse } from '@/shared/types';

const logger = createLogger('AuthService');

/**
 * Auth Service Class
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<ApiResponseWithUser<LoginResponse>> {
    logger.info('Login request', { username: data.username });

    const response = await api.post<ApiResponseWithUser<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, {
      username: data.username,
      password: data.password,
    });

    return response;
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<ApiResponseWithUser<RegisterResponse>> {
    logger.info('Register request', { email: data.email });

    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      phoneNumber: data.phoneNumber.replace(/\D/g, ''),
      countryCode: data.countryCode,
      password: data.password,
      userTypeId: data.userTypeId || 2,
    };

    const response = await api.post<ApiResponseWithUser<RegisterResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload
    );

    return response;
  }

  /**
   * Request password reset (checks email + triggers reset flow on backend)
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    logger.info('Forgot password request', { email: data.email });

    return api.get<ApiResponse>(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email: data.email });
  }

  /**
   * Verify OTP for password reset
   */
  static async verifyPasswordResetOtp(
    data: VerifyOtpRequest
  ): Promise<ApiResponse<VerifyOtpResponse>> {
    logger.info('Verify password reset OTP request', { email: data.email });

    return api.post<ApiResponse<VerifyOtpResponse>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    logger.info('Reset password request');

    return api.post<ApiResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  /**
   * Verify email
   */
  static async verifyEmail(
    data: VerifyEmailRequest
  ): Promise<ApiResponse<{ emailVerified: boolean }>> {
    logger.info('Verify email request');

    return api.post<ApiResponse<{ emailVerified: boolean }>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
  }

  /**
   * Resend verification email
   */
  static async resendVerification(data: ResendVerificationRequest): Promise<ApiResponse> {
    logger.info('Resend verification request');

    return api.post<ApiResponse>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, data);
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<ApiResponse<{ user: LocalUser }>> {
    logger.info('Get profile request');

    return api.get<ApiResponse<{ user: LocalUser }>>(API_ENDPOINTS.AUTH.PROFILE);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    data: UpdateProfileRequest
  ): Promise<ApiResponse<{ user: LocalUser }>> {
    logger.info('Update profile request');

    return api.put<ApiResponse<{ user: LocalUser }>>(API_ENDPOINTS.AUTH.PROFILE, data);
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    logger.info('Change password request');

    return api.post<ApiResponse>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    logger.info('Logout request');

    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT, {});
      logger.info('Logout successful');
    } catch (error) {
      logger.warn('Logout failed', { error });
      // Continue with local logout even if API call fails
    }
  }
}
