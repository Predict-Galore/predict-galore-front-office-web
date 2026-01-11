/**
 * AUTH MODEL TYPES
 *
 * Domain types and entities for authentication feature
 */

import type { User } from '@/shared/types';

// ==================== STORE STATE TYPE ====================
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ==================== FORM PROP TYPES ====================
export interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
}

export interface VerifyEmailFormProps {
  onBack?: () => void;
}

// ==================== VALIDATION TYPES ====================
export interface ValidationErrors {
  [key: string]: string;
}

// ==================== UTILITY TYPES ====================
export interface EmailAvailability {
  available: boolean;
  email: string;
}

export interface PasswordStrength {
  score: number;
  isValid: boolean;
  meetsRequirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  feedback: string[];
}

// ==================== FORM STATE TYPES ====================
export interface FormState {
  isLoading: boolean;
  errors: ValidationErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
}
