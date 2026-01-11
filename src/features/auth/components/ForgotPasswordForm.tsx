/**
 * Forgot Password Form Component
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
} from '@mui/material';
import { Email, ArrowBack, Error as ErrorIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useForgotPasswordMutation } from '../api/hooks';
import { createLogger } from '@/shared/api';
import { cn } from '@/shared/lib/utils';

const logger = createLogger('ForgotPasswordForm');

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess, onBackToLogin }) => {
  const router = useRouter();

  // ===================================================================
  // STATE
  // ===================================================================
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState<string>('');

  // ===================================================================
  // REACT QUERY MUTATION - Forgot Password Submission Logic
  // ===================================================================
  const {
    mutate: submitForgotPassword,
    isPending: isPasswordResetSubmitting,
    isError: passwordResetHasSubmissionError,
    error: passwordResetSubmissionError,
    isSuccess: isPasswordResetSuccessful,
    reset: resetPasswordResetMutation,
  } = useForgotPasswordMutation();

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
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  // ===================================================================
  // FORM VALIDATION HELPER
  // ===================================================================
  const formHasAnyValidationError = Object.keys(formValidationErrors).length > 0;

  // ===================================================================
  // FORM SUBMISSION HANDLER
  // ===================================================================
  const handleFormSubmission = async (formData: ForgotPasswordFormData) => {
    try {
      // Clean email data
      const cleanFormData = {
        email: formData.email.toLowerCase().trim(),
      };

      // Store the submitted email for display
      setSubmittedEmail(formData.email);

      // Submit forgot password request
      await submitForgotPassword(cleanFormData, {
        onSuccess: () => {
          // Show success state after successful submission
          setIsSubmitted(true);

          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    } catch (error) {
      // Log error with context
      logger.error('Forgot password submission error', {
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
  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSubmittedEmail('');
    resetPasswordResetMutation();
  };

  // ===================================================================
  // SUCCESS SCREEN
  // ===================================================================
  if (isSubmitted || isPasswordResetSuccessful) {
    return (
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: { xs: 2, md: 4 }, boxShadow: 3, width: '100%' }}>
        <Box>
          {/* Success Header */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            Check Your Email
          </Typography>

          {/* Success Message */}
          <Alert
            severity="success"
            className="mb-6"
            sx={{
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Typography variant="body1" className="font-medium mb-2">
              Password Reset Instructions Sent
            </Typography>
            <Typography variant="body2">
              If an account exists with <strong>{submittedEmail || 'this email'}</strong>, you will
              receive password reset instructions shortly.
            </Typography>
          </Alert>

          {/* Additional Instructions */}
          <Box className="space-y-3 mb-6">
            <Typography variant="body2" className="text-gray-600">
              <strong>What to do next:</strong>
            </Typography>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <Typography variant="body2" className="text-gray-600">
                  Check your email inbox (and spam/junk folder)
                </Typography>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <Typography variant="body2" className="text-gray-600">
                  Click the reset link in the email
                </Typography>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <Typography variant="body2" className="text-gray-600">
                  Create a new password for your account
                </Typography>
              </li>
            </ul>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
                fullWidth
                variant="contained"
                onClick={handleResetForm}
                sx={{
                  height: { xs: '48px', sm: '56px' },
                  backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                  color: 'white',
                  borderRadius: { xs: '10px', sm: '12px' },
                  textTransform: 'none',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY_DARK,
                    boxShadow: AUTH_CONSTANTS.STYLES.BUTTON_SHADOW,
                  },
                }}
              >
                Send Another Reset Link
              </Button>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBackToLogin}
              sx={{
                height: { xs: '48px', sm: '56px' },
                borderRadius: { xs: '10px', sm: '12px' },
                textTransform: 'none',
                fontSize: { xs: '14px', sm: '16px' },
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
      </Paper>
    );
  }

  return (
    <Paper className="p-6 md:p-8 rounded-2xl shadow-lg">
      {/* Form Header */}
      <Typography
        variant="h5"
        className={cn('font-bold text-gray-900 mb-2', 'text-xl sm:text-2xl')}
      >
        Reset Your Password
      </Typography>

      <Typography
        variant="body2"
        className={cn('text-gray-600 mb-4 sm:mb-6', 'text-sm sm:text-base')}
      >
        Enter your email address and we&apos;ll send you instructions to reset your password.
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
      {passwordResetHasSubmissionError && (
        <Snackbar
          open={passwordResetHasSubmissionError}
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
            {passwordResetSubmissionError instanceof Error
              ? passwordResetSubmissionError.message
              : 'Failed to send reset instructions. Please try again.'}
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          FORGOT PASSWORD FORM
      =================================================================== */}
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmission)}
        className={cn('space-y-3 sm:space-y-4 md:space-y-5', 'w-full')}
      >
        {/* EMAIL FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isPasswordResetSubmitting}
                required
                className="bg-white"
                placeholder="Enter your registered email address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '12px' },
                    height: { xs: '48px', sm: '56px' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              />
            )}
          />
        </Box>

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
            disabled={isPasswordResetSubmitting || !isFormValid || isReactHookFormSubmitting}
            startIcon={
              isPasswordResetSubmitting ? <CircularProgress size={20} color="inherit" /> : null
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
            {isPasswordResetSubmitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
          </Button>
        </Box>

        {/* ===================================================================
            FORM STATUS INDICATOR
        =================================================================== */}
        <Fade in={isPasswordResetSubmitting}>
          <Typography variant="caption" className="text-gray-500 text-center block">
            {isPasswordResetSubmitting ? 'Sending reset instructions...' : ''}
          </Typography>
        </Fade>

        {/* ===================================================================
            BACK TO LOGIN BUTTON
        =================================================================== */}
        <Box className="flex justify-end mt-4">
          <Button
            variant="text"
            onClick={handleBackToLogin}
            startIcon={<ArrowBack />}
            disabled={isPasswordResetSubmitting}
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
      </Box>
    </Paper>
  );
};

export default ForgotPasswordForm;
