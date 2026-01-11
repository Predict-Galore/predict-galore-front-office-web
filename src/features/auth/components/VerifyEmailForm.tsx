/**
 * Verify Email Form Component
 * Migrated to feature architecture
 */

'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Fade,
  Snackbar,
  TextField,
} from '@mui/material';
import { CheckCircle, Email, ArrowBack, Refresh, Error as ErrorIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { verifyEmailSchema, VerifyEmailFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useVerifyEmailMutation, useResendVerificationMutation } from '../api/hooks';
import { createLogger } from '@/shared/api';

const logger = createLogger('VerifyEmailForm');

interface VerifyEmailFormProps {
  onBack?: () => void;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ onBack }) => {
  const router = useRouter();

  // ===================================================================
  // STATE
  // ===================================================================
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [storedEmail, setStoredEmail] = React.useState<string>('');
  const [isEmailLoaded, setIsEmailLoaded] = React.useState(false);

  // ===================================================================
  // REACT QUERY MUTATIONS
  // ===================================================================
  const {
    mutate: submitVerification,
    isPending: isVerificationSubmitting,
    isError: verificationHasSubmissionError,
    error: verificationSubmissionError,
    isSuccess: isVerificationSuccessful,
    reset: resetVerificationMutation,
  } = useVerifyEmailMutation();

  const {
    mutate: submitResendVerification,
    isPending: isResendVerificationSubmitting,
    isSuccess: isResendVerificationSuccessful,
    reset: resetResendVerificationMutation,
  } = useResendVerificationMutation();

  // ===================================================================
  // REACT HOOK FORM - Form State & Validation
  // ===================================================================
  const {
    control,
    handleSubmit,
    setValue,
    formState: {
      isValid: isFormValid,
      errors: formValidationErrors,
      isSubmitting: isReactHookFormSubmitting,
    },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: '',
    },
    mode: 'onChange',
  });

  // ===================================================================
  // FORM VALIDATION HELPER
  // ===================================================================
  const formHasAnyValidationError = Object.keys(formValidationErrors).length > 0;

  // ===================================================================
  // LOAD EMAIL FROM SESSION STORAGE
  // ===================================================================
  React.useEffect(() => {
    const loadEmail = () => {
      try {
        const email = sessionStorage.getItem('pendingVerificationEmail') || '';
        setStoredEmail(email);
      } catch (error) {
        logger.error('Error reading from sessionStorage', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setIsEmailLoaded(true);
      }
    };

    loadEmail();
  }, []);

  // ===================================================================
  // RESEND COOLDOWN TIMER
  // ===================================================================
  React.useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handleFormSubmission = async (formData: VerifyEmailFormData) => {
    try {
      if (!storedEmail) {
        throw new Error('Email not found. Please restart the registration process.');
      }

      await submitVerification(
        {
          token: formData.token.trim(),
          email: storedEmail,
        },
        {
          onSuccess: () => {
            // Clear sessionStorage after successful verification
            sessionStorage.removeItem('pendingVerificationEmail');

            // Redirect after delay
            setTimeout(() => {
              router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
            }, 2000);
          },
        }
      );
    } catch (error) {
      // Log error with context
      logger.error('Email verification error', {
        error,
        timestamp: new Date().toISOString(),
      });

      // Re-throw for React Query UI handling
      throw error;
    }
  };

  const handleResendToken = async () => {
    if (!storedEmail) {
      return;
    }

    if (resendCooldown > 0) {
      return;
    }

    try {
      await submitResendVerification(
        { email: storedEmail },
        {
          onSuccess: () => {
            setResendCooldown(AUTH_CONSTANTS.VERIFICATION.RESEND_COOLDOWN);
            setValue('token', '', { shouldValidate: false });
          },
        }
      );
    } catch (error) {
      // Log error with context
      logger.error('Resend verification error', {
        error,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleBackToRegister = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(AUTH_CONSTANTS.ROUTES.REGISTER);
    }
  };

  const handleTokenChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setValue('token', digits, { shouldValidate: true });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text');
    const digits = pasted.replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      setValue('token', digits, { shouldValidate: true });
    }
  };

  // ===================================================================
  // LOADING STATE
  // ===================================================================
  if (!isEmailLoaded) {
    return (
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading verification...
          </Typography>
        </Box>
      </Paper>
    );
  }

  // ===================================================================
  // SUCCESS STATE
  // ===================================================================
  if (isVerificationSuccessful) {
    return (
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Success Icon */}
          <Box sx={{ mb: 2 }}>
            <CheckCircle sx={{ fontSize: 96, color: 'success.main', mx: 'auto' }} />
          </Box>

          {/* Success Message */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 1 }}>
            Email Verified Successfully!
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your email has been verified. You can now sign in to your account.
          </Typography>

          {/* Redirect Message */}
          <Fade in={true}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2 }}>
              Redirecting to login page...
            </Typography>
          </Fade>

          {/* Login Button */}
          <Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => router.push(AUTH_CONSTANTS.ROUTES.LOGIN)}
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

  // ===================================================================
  // NO EMAIL FOUND STATE
  // ===================================================================
  if (!storedEmail) {
    return (
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Warning Icon */}
          <Email sx={{ fontSize: 80, color: 'warning.main', mb: 2, mx: 'auto' }} />

          {/* Warning Message */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 1 }}>
            Email Not Found
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              No email address found for verification. Please make sure you completed registration
              recently. If you just registered, try refreshing the page or going back to
              registration.
            </Typography>
          </Alert>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBackToRegister}
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
              Back to Registration
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push(AUTH_CONSTANTS.ROUTES.LOGIN)}
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
              Go to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: 3 }}>
      {/* Form Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Email sx={{ fontSize: 80, color: 'primary.main', mb: 2, mx: 'auto' }} />

        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 1 }}>
          Verify Your Email
        </Typography>

        <Typography variant="body2" color="text.secondary">
          We sent a verification code to: <strong>{storedEmail}</strong>
        </Typography>
      </Box>

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
              {Object.entries(formValidationErrors).map(([fieldName, error]) => (
                <Box component="li" key={fieldName}>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: {error.message}
                </Box>
              ))}
            </Box>
          </Alert>
        </Box>
      )}

      {/* ===================================================================
          ERROR MESSAGE
      =================================================================== */}
      {verificationHasSubmissionError && (
        <Snackbar
          open={verificationHasSubmissionError}
          autoHideDuration={7000}
          onClose={resetVerificationMutation}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={resetVerificationMutation}
            sx={{ width: '100%' }}
          >
            {verificationSubmissionError instanceof Error
              ? verificationSubmissionError.message
              : 'Invalid verification code. Please try again.'}
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          RESEND SUCCESS MESSAGE
      =================================================================== */}
      {isResendVerificationSuccessful && (
        <Snackbar
          open={isResendVerificationSuccessful}
          autoHideDuration={5000}
          onClose={resetResendVerificationMutation}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={resetResendVerificationMutation}
            sx={{ width: '100%' }}
          >
            New verification code sent! Please check your email.
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          VERIFICATION FORM
      =================================================================== */}
      <form onSubmit={handleSubmit(handleFormSubmission)} className="space-y-4">
        {/* TOKEN FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="token"
            control={control}
            render={({ field, fieldState }) => (
              <Box>
                <TextField
                  {...field}
                  inputRef={(input) => input && input.focus()}
                  fullWidth
                  type="text"
                  inputMode="numeric"
                  value={field.value || ''}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  onPaste={handlePaste}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isVerificationSubmitting || isResendVerificationSubmitting}
                  required
                  className="bg-white"
                  placeholder="Enter 6-digit code"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      height: '64px',
                      fontSize: '1.2rem',
                      letterSpacing: '0.5em',
                      textAlign: 'center',
                      '& input': {
                        textAlign: 'center',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                        borderWidth: '2px',
                      },
                    },
                  }}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center' },
                  }}
                />

                <Typography variant="caption" className="text-gray-500 text-center block mt-2">
                  {(field.value || '').length}/6 digits
                </Typography>
              </Box>
            )}
          />
        </Box>

        {/* ===================================================================
            ACTION BUTTONS
        =================================================================== */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleBackToRegister}
            startIcon={<ArrowBack />}
            disabled={isVerificationSubmitting || isResendVerificationSubmitting}
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
            Back
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={
              isVerificationSubmitting ||
              isResendVerificationSubmitting ||
              !isFormValid ||
              isReactHookFormSubmitting
            }
            startIcon={
              isVerificationSubmitting ? <CircularProgress size={20} color="inherit" /> : null
            }
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
              '&.Mui-disabled': {
                backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY_LIGHT,
                color: '#ffffff',
              },
            }}
          >
            {isVerificationSubmitting ? 'Verifying...' : 'Verify Email'}
          </Button>
        </Box>

        {/* ===================================================================
            FORM STATUS INDICATOR
        =================================================================== */}
        <Fade in={isVerificationSubmitting}>
          <Typography variant="caption" className="text-gray-500 text-center block">
            {isVerificationSubmitting ? 'Verifying your email...' : ''}
          </Typography>
        </Fade>

        {/* ===================================================================
            RESEND TOKEN SECTION
        =================================================================== */}
        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Didn&apos;t receive the code?
          </Typography>

          <Box>
            <Button
              variant="text"
              onClick={handleResendToken}
              disabled={
                isResendVerificationSubmitting || resendCooldown > 0 || isVerificationSubmitting
              }
              startIcon={
                isResendVerificationSubmitting ? <CircularProgress size={16} /> : <Refresh />
              }
              sx={{
                color: AUTH_CONSTANTS.COLORS.PRIMARY,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(22, 163, 74, 0.04)',
                },
                '&.Mui-disabled': {
                  color: '#9ca3af',
                },
              }}
            >
              {isResendVerificationSubmitting
                ? 'Sending...'
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Verification Code'}
            </Button>
          </Box>

          {/* Resend Instructions */}
          {resendCooldown > 0 && (
            <Box>
              <Typography variant="caption" sx={{ color: 'success.main', display: 'block', mt: 1 }}>
                New code sent! Please check your email.
              </Typography>
            </Box>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default VerifyEmailForm;
