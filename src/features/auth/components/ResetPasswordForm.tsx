/**
 * Reset Password Form Component
 * Migrated to feature architecture
 */

'use client';

import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Fade,
  Snackbar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Error as ErrorIcon,
  ArrowBack,
} from '@mui/icons-material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useResetPasswordMutation } from '../api/hooks';
import { validatePasswordStrength } from '../lib/utils';
import { createLogger } from '@/shared/api';

const logger = createLogger('ResetPasswordForm');

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token: propToken, onSuccess }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===================================================================
  // STATE
  // ===================================================================
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // ===================================================================
  // TOKEN HANDLING
  // ===================================================================
  const urlToken = propToken || searchParams.get('token') || '';
  const isTokenValid = urlToken.length > 0;

  // ===================================================================
  // REACT QUERY MUTATION - Reset Password Submission Logic
  // ===================================================================
  const {
    mutate: submitResetPassword,
    isPending: isResetPasswordSubmitting,
    isError: resetPasswordHasSubmissionError,
    error: resetPasswordSubmissionError,
    isSuccess: isResetPasswordSuccessful,
    reset: resetPasswordResetMutation,
  } = useResetPasswordMutation();

  // ===================================================================
  // REACT HOOK FORM - Form State & Validation
  // ===================================================================
  const {
    control,
    handleSubmit,
    formState: {
      isValid: isFormValid,
      errors: formValidationErrors,
      isSubmitting: isReactHookFormSubmitting,
    },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: urlToken,
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  // ===================================================================
  // FORM VALIDATION HELPER
  // ===================================================================
  const formHasAnyValidationError = Object.keys(formValidationErrors).length > 0;

  // ===================================================================
  // FORM WATCHERS
  // ===================================================================
  const password = useWatch({ control, name: 'password' });

  // ===================================================================
  // PASSWORD STRENGTH CALCULATION
  // ===================================================================
  const passwordStrength = React.useMemo(() => {
    return password ? validatePasswordStrength(password) : null;
  }, [password]);

  // ===================================================================
  // FORM SUBMISSION HANDLER
  // ===================================================================
  const handleFormSubmission = async (formData: ResetPasswordFormData) => {
    try {
      // Ensure we have a valid token
      if (!isTokenValid) {
        throw new Error('Invalid reset token');
      }

      // Submit reset password request
      await submitResetPassword(
        {
          ...formData,
          token: urlToken,
        },
        {
          onSuccess: () => {
            setIsSubmitted(true);

            // Redirect after successful reset
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push(`${AUTH_CONSTANTS.ROUTES.LOGIN}?reset=success`);
              }
            }, 2000);
          },
        }
      );
    } catch (error) {
      // Log error with context
      logger.error('Reset password submission error', {
        error,
        timestamp: new Date().toISOString(),
      });

      // Re-throw for React Query UI handling
      throw error;
    }
  };

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handleRequestNewReset = () => {
    router.push(AUTH_CONSTANTS.ROUTES.FORGOT_PASSWORD);
  };

  const handleBackToLogin = () => {
    router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // ===================================================================
  // INVALID TOKEN SCREEN
  // ===================================================================
  if (!isTokenValid) {
    return (
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: 3 }}>
        <Box>
          {/* Error Header */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 2 }}>
            Invalid Reset Link
          </Typography>

          {/* Error Message */}
          <Alert
            severity="error"
            sx={{ mb: 3, '& .MuiAlert-message': { width: '100%' } }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              Reset Link Issue
            </Typography>
            <Typography variant="body2">
              The password reset link is invalid or has expired. Please request a new password reset
              link.
            </Typography>
          </Alert>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRequestNewReset}
              sx={{
                height: '48px',
                backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY_DARK,
                  boxShadow: AUTH_CONSTANTS.STYLES.BUTTON_SHADOW,
                },
              }}
            >
              Request New Reset Link
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBackToLogin}
              sx={{
                height: '48px',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '16px',
                borderColor: '#e5e7eb',
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#d1d5db',
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  // ===================================================================
  // SUCCESS SCREEN
  // ===================================================================
  if (isSubmitted || isResetPasswordSuccessful) {
    return (
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: 3 }}>
        <Box>
          {/* Success Header */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 2 }}>
            Password Reset Successful!
          </Typography>

          {/* Success Message */}
          <Alert
            severity="success"
            sx={{ mb: 3, '& .MuiAlert-message': { width: '100%' } }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              Your password has been successfully updated
            </Typography>
            <Typography variant="body2">
              You will be redirected to the login page shortly. Please use your new password to sign
              in.
            </Typography>
          </Alert>

          {/* Action Buttons */}
          <Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBackToLogin}
              sx={{
                height: '48px',
                backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY_DARK,
                  boxShadow: AUTH_CONSTANTS.STYLES.BUTTON_SHADOW,
                },
              }}
            >
              Go to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper className="p-6 md:p-8 rounded-2xl shadow-lg">
      {/* Form Header */}
      <Typography variant="h5" className="font-bold text-gray-900 mb-2">
        Reset Your Password
      </Typography>

      <Typography variant="body2" className="text-gray-600 mb-6">
        Enter your new password below. Make sure it&apos;s strong and different from previous
        passwords.
      </Typography>

      {/* ===================================================================
          VALIDATION ERROR SUMMARY
      =================================================================== */}
      {formHasAnyValidationError && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="warning" icon={<ErrorIcon />}>
            <Typography variant="body2" fontWeight="medium">
              Please fix the following errors:
            </Typography>
            <Box component="ul" sx={{ mt: 0.5, ml: 2, pl: 1, '& li': { fontSize: '0.875rem' } }}>
              {Object.entries(formValidationErrors)
                .map(([fieldName, error]) => {
                  if (fieldName === 'token') return null; // Don't show token errors to user
                  return (
                    <Box component="li" key={fieldName}>
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: {error.message}
                    </Box>
                  );
                })
                .filter(Boolean)}
            </Box>
          </Alert>
        </Box>
      )}

      {/* ===================================================================
          ERROR MESSAGE
      =================================================================== */}
      {resetPasswordHasSubmissionError && (
        <Snackbar
          open={resetPasswordHasSubmissionError}
          autoHideDuration={7000}
          onClose={resetPasswordResetMutation}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={resetPasswordResetMutation}
            sx={{ width: '100%' }}
          >
            {resetPasswordSubmissionError instanceof Error
              ? resetPasswordSubmissionError.message
              : 'Failed to reset password. Please try again.'}
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          RESET PASSWORD FORM
      =================================================================== */}
      <form onSubmit={handleSubmit(handleFormSubmission)} className="space-y-4">
        {/* Hidden token field */}
        <Controller
          name="token"
          control={control}
          render={({ field }) => <input type="hidden" {...field} value={urlToken} />}
        />

        {/* PASSWORD FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isResetPasswordSubmitting}
                required
                className="bg-white"
                placeholder="Enter your new password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    height: '56px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            )}
          />
        </Box>

        {/* CONFIRM PASSWORD FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isResetPasswordSubmitting}
                required
                className="bg-white"
                placeholder="Confirm your new password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    height: '56px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            )}
          />
        </Box>

        {/* PASSWORD STRENGTH INDICATOR */}
        {passwordStrength && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Password Strength
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              {[0, 1, 2, 3, 4].map((index) => (
                <Box
                  key={index}
                  sx={{
                    height: 8,
                    flex: 1,
                    borderRadius: 1,
                    transition: 'background-color 0.3s',
                    bgcolor:
                      index < Object.values(passwordStrength.meetsRequirements).filter(Boolean).length
                        ? passwordStrength.isValid
                          ? 'success.main'
                          : 'warning.main'
                        : 'grey.300',
                  }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Password strength: {passwordStrength.score}% -{' '}
              <Typography
                component="span"
                variant="caption"
                sx={{ color: passwordStrength.isValid ? 'success.main' : 'warning.main' }}
              >
                {passwordStrength.isValid ? 'Strong' : 'Needs improvement'}
              </Typography>
            </Typography>
            {passwordStrength.feedback.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'warning.main', display: 'block', mt: 0.5 }}>
                  {passwordStrength.feedback.join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* ===================================================================
            SUBMIT BUTTON
        =================================================================== */}
        <Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={
              isResetPasswordSubmitting ||
              !isFormValid ||
              isReactHookFormSubmitting ||
              !isTokenValid
            }
            startIcon={
              isResetPasswordSubmitting ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              height: '56px',
              backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY,
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY_DARK,
                boxShadow: AUTH_CONSTANTS.STYLES.BUTTON_SHADOW,
              },
              '&.Mui-disabled': {
                backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY_LIGHT,
                color: '#ffffff',
              },
            }}
          >
            {isResetPasswordSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Box>

        {/* ===================================================================
            FORM STATUS INDICATOR
        =================================================================== */}
        <Fade in={isResetPasswordSubmitting}>
          <Typography variant="caption" className="text-gray-500 text-center block">
            {isResetPasswordSubmitting ? 'Updating your password...' : ''}
          </Typography>
        </Fade>

        {/* ===================================================================
            BACK TO LOGIN BUTTON
        =================================================================== */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="text"
            onClick={handleBackToLogin}
            startIcon={<ArrowBack />}
            disabled={isResetPasswordSubmitting}
            sx={{
              color: '#6b7280',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#374151',
              },
            }}
          >
            Back to Login
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ResetPasswordForm;
