// src/features/auth/validations/schemas.ts
import { z } from 'zod';

// Make rememberMe REQUIRED in the schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username or email is required')
    .max(100, 'Username must be less than 100 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(50, 'Password must be less than 50 characters'),
  rememberMe: z.boolean(), // REQUIRED - no default, no optional
});

// Create a separate type for API request
export type LoginRequestData = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

// Use a custom type for the form that matches the schema EXACTLY
export type LoginFormData = {
  username: string;
  password: string;
  rememberMe: boolean;
};

// Helper function to convert form data to API request data
export const toLoginRequest = (data: LoginFormData): LoginRequestData => {
  const request: LoginRequestData = {
    username: data.username.trim(),
    password: data.password,
  };

  // Only include rememberMe if it's true
  if (data.rememberMe) {
    request.rememberMe = true;
  }

  return request;
};

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s'-]+$/,
        'First name can only contain letters, spaces, hyphens, and apostrophes'
      ),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s'-]+$/,
        'Last name can only contain letters, spaces, hyphens, and apostrophes'
      ),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters'),
    countryCode: z.string().min(1, 'Country code is required'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\d+$/, 'Phone number must contain only digits'),
    phone: z.string().min(1, 'Phone number is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be less than 50 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be less than 50 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only digits'),
  email: z.string().email().optional(),
});

export const resendVerificationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

// Export other types
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;
