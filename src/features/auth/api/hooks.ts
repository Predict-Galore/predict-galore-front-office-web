/**
 * AUTH API HOOKS
 *
 * React Query hooks for authentication
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../model/store';
import { AuthService } from './service';
import { createLogger } from '@/shared/api';
import { setAuthCookie } from '../lib/utils';
import { ApiError } from '@/shared/lib/errors';
import type { User } from '@/shared/types';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  GoogleSocialSignInRequest,
  AppleSocialSignInRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  LocalUser,
  ApiResponseWithUser,
  LoginResponse,
  RegisterResponse,
} from './types';
import type { ApiResponse } from '@/shared/types';
import { authKeys } from './index';

const logger = createLogger('AuthHooks');

/**
 * Transform LocalUser to User
 */
function transformLocalUserToUser(localUser: LocalUser): User {
  return {
    id: localUser.id,
    email: localUser.email,
    firstName: localUser.firstName,
    lastName: localUser.lastName,
    isEmailVerified: localUser.isEmailVerified,
    phoneNumber: localUser.phoneNumber,
    countryCode: localUser.countryCode,
    role: 'user',
    createdAt: localUser.createdAt || new Date().toISOString(),
    updatedAt: localUser.updatedAt || new Date().toISOString(),
  };
}

function extractAuthFromResponse(response: ApiResponseWithUser): { user: LocalUser; token: string | null } {
  const responseData = response?.data as LoginResponse | undefined;
  const userData = (responseData?.user as unknown as LocalUser | undefined) || response?.user;
  const token = (responseData?.token as unknown as string | undefined) || response?.token || null;

  if (!userData) {
    throw new Error(response?.message || response?.code || 'Authentication failed: Missing user data');
  }
  return { user: userData, token };
}

/**
 * Get user profile query
 */
export const useProfileQuery = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async (): Promise<LocalUser | null> => {
      try {
        logger.info('Fetching user profile');
        const response = await AuthService.getProfile();

        if (response.data?.user) {
          logger.info('Profile fetched successfully');
          return response.data.user;
        }

        logger.warn('No user data in profile response');
        return null;
      } catch (error) {
        logger.error('Failed to fetch profile', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        return null;
      }
    },
    initialData: user
      ? {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null,
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Login mutation
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<ApiResponseWithUser> => {
      logger.info('Login mutation called');

      const response = await AuthService.login(data);

      const { user, token } = extractAuthFromResponse(response);
      const appUser = transformLocalUserToUser(user);
      storeLogin(appUser, token);
      if (typeof document !== 'undefined' && token) setAuthCookie(token);
      logger.info('User logged in successfully');

      return response;
    },
    onSuccess: (response) => {
      logger.info('Login mutation onSuccess');

      const { user } = extractAuthFromResponse(response);
      const cacheUser = transformLocalUserToUser(user);
      queryClient.setQueryData(authKeys.user(), cacheUser);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      logger.info('Auth cache updated');
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        const apiError = error as ApiError;
        if (apiError.status && apiError.status >= 500) {
          logger.error('Login mutation error', {
            status: apiError.status,
            message: apiError.message,
          });
        } else {
          logger.debug('Login failed (expected)', {
            status: apiError.status || 'unknown',
            message: apiError.message,
          });
        }
      } else {
        logger.error('Login mutation error', {
          error: error.message,
        });
      }
    },
  });
};

export const useGoogleSocialSignInMutation = () => {
  const queryClient = useQueryClient();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (data: GoogleSocialSignInRequest): Promise<ApiResponseWithUser> => {
      logger.info('Google social sign-in mutation called');
      const response = await AuthService.socialGoogle(data);
      const { user, token } = extractAuthFromResponse(response);
      storeLogin(transformLocalUserToUser(user), token);
      if (typeof document !== 'undefined' && token) setAuthCookie(token);
      return response;
    },
    onSuccess: (response) => {
      const { user } = extractAuthFromResponse(response);
      queryClient.setQueryData(authKeys.user(), transformLocalUserToUser(user));
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: Error) => {
      logger.error('Google social sign-in mutation error', { error: error.message });
    },
  });
};

export const useAppleSocialSignInMutation = () => {
  const queryClient = useQueryClient();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (data: AppleSocialSignInRequest): Promise<ApiResponseWithUser> => {
      logger.info('Apple social sign-in mutation called');
      const response = await AuthService.socialApple(data);
      const { user, token } = extractAuthFromResponse(response);
      storeLogin(transformLocalUserToUser(user), token);
      if (typeof document !== 'undefined' && token) setAuthCookie(token);
      return response;
    },
    onSuccess: (response) => {
      const { user } = extractAuthFromResponse(response);
      queryClient.setQueryData(authKeys.user(), transformLocalUserToUser(user));
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: Error) => {
      logger.error('Apple social sign-in mutation error', { error: error.message });
    },
  });
};

/**
 * Register mutation
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<ApiResponseWithUser> => {
      logger.info('Register mutation called');

      const response = await AuthService.register(data);

      const responseData = response?.data as RegisterResponse | undefined;
      const userData = responseData?.user || response?.user;
      const token = responseData?.token || response?.token || null;

      if (userData) {
        const appUser = transformLocalUserToUser(userData);
        storeLogin(appUser, token);
        if (typeof document !== 'undefined' && token) {
          setAuthCookie(token);
        }
        logger.info('User registered and logged in successfully');
      } else {
        logger.error('Registration failed: Missing user data');
        throw new Error(response?.message || response?.code || 'Registration failed');
      }

      return response;
    },
    onSuccess: (response) => {
      logger.info('Register mutation onSuccess');

      const responseData = response?.data as RegisterResponse | undefined;
      const userData = responseData?.user || response?.user;
      if (userData) {
        const cacheUser = transformLocalUserToUser(userData);
        queryClient.setQueryData(authKeys.user(), cacheUser);
        logger.info('Auth cache updated after registration');
      }
    },
    onError: () => {
      logger.error('Register mutation error');
    },
  });
};

/**
 * Forgot password mutation
 */
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest): Promise<ApiResponse> => {
      logger.info('Forgot password mutation called');
      return AuthService.forgotPassword(data);
    },
    onError: () => {
      logger.error('Forgot password mutation error');
    },
  });
};

/**
 * Verify password reset OTP mutation
 */
export const useVerifyPasswordResetOtpMutation = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> => {
      logger.info('Verify password reset OTP mutation called');
      return AuthService.verifyPasswordResetOtp(data);
    },
    onError: () => {
      logger.error('Verify password reset OTP mutation error');
    },
  });
};

/**
 * Reset password mutation
 */
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
      logger.info('Reset password mutation called');

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      return AuthService.resetPassword(data);
    },
    onError: () => {
      logger.error('Reset password mutation error');
    },
  });
};

/**
 * Verify email mutation
 */
export const useVerifyEmailMutation = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (
      data: VerifyEmailRequest
    ): Promise<ApiResponse<{ emailVerified: boolean }>> => {
      logger.info('Verify email mutation called');
      return AuthService.verifyEmail(data);
    },
    onSuccess: (response) => {
      if (response?.success && response.data?.emailVerified) {
        logger.info('Email verification successful');
        updateUser({ isEmailVerified: true });

        queryClient.setQueryData(authKeys.user(), (old: User | undefined) => {
          if (!old) return undefined;
          return {
            ...old,
            isEmailVerified: true,
          };
        });
      } else {
        logger.warn('Email verification failed');
      }
    },
    onError: () => {
      logger.error('Verify email mutation error');
    },
  });
};

/**
 * Resend verification email mutation
 */
export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: async (data: ResendVerificationRequest): Promise<ApiResponse> => {
      logger.info('Resend verification mutation called');
      return AuthService.resendVerification(data);
    },
    onError: () => {
      logger.error('Resend verification mutation error');
    },
  });
};

/**
 * Logout mutation
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout: storeLogout } = useAuthStore();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      logger.info('Logout mutation called');

      await AuthService.logout();
      storeLogout();
      logger.info('Local logout completed');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      logger.info('Auth queries cleared from cache');
    },
    onError: () => {
      logger.error('Logout mutation error');
    },
  });
};

/**
 * Update profile mutation
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (
      userData: UpdateProfileRequest
    ): Promise<ApiResponse<{ user: LocalUser }>> => {
      logger.info('Update profile mutation called');
      return AuthService.updateProfile(userData);
    },
    onSuccess: (response) => {
      if (response?.success && response.data) {
        const appUser = transformLocalUserToUser(response.data.user);
        updateUser(appUser);
        queryClient.setQueryData(authKeys.user(), appUser);
        logger.info('Profile cache updated');
      }
    },
    onError: () => {
      logger.error('Update profile mutation error');
    },
  });
};

/**
 * Change password mutation
 */
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest): Promise<ApiResponse> => {
      logger.info('Change password mutation called');

      if (data.newPassword !== data.confirmNewPassword) {
        throw new Error('New passwords do not match');
      }

      return AuthService.changePassword(data);
    },
    onError: () => {
      logger.error('Change password mutation error');
    },
  });
};

/**
 * Custom auth hook - simplified version without React Query dependency
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  logger.debug('Auth hook called');

  return {
    user: user || null,
    isAuthenticated: isAuthenticated || !!user,
    isLoading,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

/**
 * Enhanced auth hook with profile query - use when React Query context is available
 */
export const useAuthWithProfile = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profileQuery = useProfileQuery();

  logger.debug('Auth with profile hook called');

  return {
    user: user || null,
    isAuthenticated: isAuthenticated || !!profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
  };
};
