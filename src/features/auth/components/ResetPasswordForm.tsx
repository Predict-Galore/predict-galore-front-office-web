/**
 * Reset Password Form Component
 * Updated to match UI design
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
  Snackbar,
  InputAdornment,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, CheckCircle } from '@mui/icons-material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useResetPasswordMutation } from '../api/hooks';
import { validatePasswordStrength } from '../lib/utils';
import { createLogger } from '@/shared/api';
import { RedirectLoader } from '@/shared/components/ui';

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
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  // ===================================================================
  // TOKEN HANDLING
  // ===================================================================
  const urlToken = propToken || searchParams.get('token') || '';
  const isTokenValid = urlToken.length > 0;

  // ===================================================================
  // REACT QUERY MUTATION
  // ===================================================================
  const {
    mutate: submitResetPassword,
    isPending: isResetPasswordSubmitting,
    isError: resetPasswordHasSubmissionError,
    error: resetPasswordSubmissionError,
    reset: resetPasswordResetMutation,
  } = useResetPasswordMutation();

  // ===================================================================
  // REACT HOOK FORM
  // ===================================================================
  const {
    control,
    handleSubmit,
    formState: { isValid: isFormValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: urlToken,
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // ===================================================================
  // FORM WATCHERS
  // ===================================================================
  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });

  // ===================================================================
  // PASSWORD STRENGTH CALCULATION
  // ===================================================================
  const passwordStrength = React.useMemo(() => {
    return password ? validatePasswordStrength(password) : null;
  }, [password]);

  const confirmPasswordStrength = React.useMemo(() => {
    return confirmPassword ? validatePasswordStrength(confirmPassword) : null;
  }, [confirmPassword]);

  // ===================================================================
  // FORM SUBMISSION HANDLER
  // ===================================================================
  const handleFormSubmission = async (formData: ResetPasswordFormData) => {
    try {
      if (!isTokenValid) {
        throw new Error('Invalid reset token');
      }

      await submitResetPassword(
        {
          ...formData,
          token: urlToken,
        },
        {
          onSuccess: () => {
            setShowSuccessModal(true);

            // Redirect after delay
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
              }
            }, 3000);
          },
        }
      );
    } catch (error) {
      logger.error('Reset password submission error', {
        error,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  };

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleContinueToLogin = () => {
    setShowSuccessModal(false);
    setIsRedirecting(true);
    setTimeout(() => {
      router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
    }, 300);
  };

  // ===================================================================
  // SUCCESS MODAL
  // ===================================================================
  const SuccessModal = () => (
    <Dialog
      open={showSuccessModal}
      onClose={handleContinueToLogin}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 2,
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        {/* Success Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#42A605',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <CheckCircle sx={{ fontSize: 48, color: 'white' }} />
        </Box>

        {/* Success Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
          }}
        >
          Password Reset Successful
        </Typography>

        {/* Success Message */}
        <Typography
          variant="body2"
          sx={{
            color: '#667085',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          Your password has been successfully updated. You can now use your new password to log in
          securely
        </Typography>

        {/* Continue Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleContinueToLogin}
          sx={{
            height: '56px',
            backgroundColor: '#42A605',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#368005',
            },
          }}
        >
          Continue to login
        </Button>
      </DialogContent>
    </Dialog>
  );

  // ===================================================================
  // INVALID TOKEN SCREEN
  // ===================================================================
  if (!isTokenValid) {
    return (
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
          }}
        >
          Invalid Reset Link
        </Typography>

        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          <Typography variant="body2">
            The password reset link is invalid or has expired. Please request a new password reset
            link.
          </Typography>
        </Alert>

        <Button
          fullWidth
          variant="contained"
          onClick={() => router.push(AUTH_CONSTANTS.ROUTES.FORGOT_PASSWORD)}
          sx={{
            height: '56px',
            backgroundColor: '#42A605',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#368005',
            },
          }}
        >
          Request New Reset Link
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem' },
          fontWeight: 700,
          color: '#1a1a1a',
          mb: 2,
        }}
      >
        Reset Password
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#667085',
          fontSize: '1rem',
          mb: 4,
        }}
      >
        Create a new password to login with
      </Typography>

      {/* Error Snackbar */}
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

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(handleFormSubmission)}>
        {/* Hidden token field */}
        <Controller
          name="token"
          control={control}
          render={({ field }) => <input type="hidden" {...field} value={urlToken} />}
        />

        {/* New Password Field */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#1a1a1a',
              fontSize: '14px',
              fontWeight: 500,
              mb: 1,
            }}
          >
            New Password
          </Typography>

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isResetPasswordSubmitting}
                placeholder="Set a password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{ color: '#9ca3af' }}
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
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover fieldset': {
                      borderColor: '#42A605',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#42A605',
                      borderWidth: '2px',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: '#ef4444',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '16px',
                  },
                  '& .MuiFormHelperText-root': {
                    marginLeft: 0,
                    marginTop: '8px',
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Password Strength Indicator */}
        {passwordStrength && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#667085',
                fontSize: '12px',
              }}
            >
              Password strength
            </Typography>
          </Box>
        )}

        {/* Confirm Password Field */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#1a1a1a',
              fontSize: '14px',
              fontWeight: 500,
              mb: 1,
            }}
          >
            Confirm Password
          </Typography>

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isResetPasswordSubmitting}
                placeholder="Confirm new password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{ color: '#9ca3af' }}
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
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover fieldset': {
                      borderColor: '#42A605',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#42A605',
                      borderWidth: '2px',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: '#ef4444',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '16px',
                  },
                  '& .MuiFormHelperText-root': {
                    marginLeft: 0,
                    marginTop: '8px',
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Confirm Password Strength Indicator */}
        {confirmPasswordStrength && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#667085',
                fontSize: '12px',
              }}
            >
              Password strength
            </Typography>
          </Box>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!isFormValid || isResetPasswordSubmitting}
          sx={{
            height: '56px',
            backgroundColor: '#42A605',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#368005',
            },
            '&.Mui-disabled': {
              backgroundColor: '#9ca3af',
              color: '#ffffff',
            },
          }}
        >
          {isResetPasswordSubmitting ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Updating...</span>
            </Box>
          ) : (
            'Update password'
          )}
        </Button>
      </Box>

      {/* Success Modal */}
      <SuccessModal />

      {/* Redirect Loader */}
      <RedirectLoader show={isRedirecting} message="Redirecting to login..." />
    </Box>
  );
};

export default ResetPasswordForm;
