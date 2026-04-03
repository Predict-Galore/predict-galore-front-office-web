/**
 * AUTH API - Public Exports
 *
 * Public API for authentication feature
 */

// React Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Service
export { AuthService } from './service';

// Hooks
export {
  useProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyPasswordResetOtpMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useAuth,
  useAuthWithProfile,
} from './hooks';

// Types
export type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  LoginResponse,
  RegisterResponse,
  LocalUser,
  ApiResponseWithUser,
} from './types';
