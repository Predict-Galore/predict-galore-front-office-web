/**
 * Forgot Password Form Component
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
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useForgotPasswordMutation } from '../api/hooks';
import { createLogger } from '@/shared/api';

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
  // REACT QUERY MUTATION
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
  // REACT HOOK FORM
  // ===================================================================
  const {
    control,
    handleSubmit,
    formState: { isValid: isFormValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  // ===================================================================
  // FORM SUBMISSION HANDLER
  // ===================================================================
  const handleFormSubmission = async (formData: ForgotPasswordFormData) => {
    try {
      const cleanFormData = {
        email: formData.email.toLowerCase().trim(),
      };

      setSubmittedEmail(formData.email);

      await submitForgotPassword(cleanFormData, {
        onSuccess: () => {
          setIsSubmitted(true);
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    } catch (error) {
      logger.error('Forgot password submission error', {
        error,
        timestamp: new Date().toISOString(),
      });
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
          Check Your Email
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#667085',
            fontSize: '1rem',
            mb: 4,
          }}
        >
          We&apos;ve sent password reset instructions to your email
        </Typography>

        {/* Success Message */}
        <Alert
          severity="success"
          sx={{
            mb: 4,
            borderRadius: '12px',
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Password Reset Instructions Sent
          </Typography>
          <Typography variant="body2">
            If an account exists with <strong>{submittedEmail}</strong>, you will receive password
            reset instructions shortly.
          </Typography>
        </Alert>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleResetForm}
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
            Send Another Reset Link
          </Button>

          <Button
            fullWidth
            variant="text"
            startIcon={<ArrowBack />}
            onClick={handleBackToLogin}
            sx={{
              height: '56px',
              color: '#667085',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#1a1a1a',
              },
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    );
  }

  // ===================================================================
  // MAIN FORM
  // ===================================================================
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
        Forgot Password
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#667085',
          fontSize: '1rem',
          mb: 4,
        }}
      >
        Enter your registered email address to reset your password
      </Typography>

      {/* Error Snackbar */}
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

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(handleFormSubmission)}>
        {/* Email Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#1a1a1a',
              fontSize: '14px',
              fontWeight: 500,
              mb: 1,
            }}
          >
            Email address
          </Typography>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="email"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isPasswordResetSubmitting}
                placeholder="Enter your email address"
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isPasswordResetSubmitting || !isFormValid}
          sx={{
            height: '56px',
            backgroundColor: '#42A605',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            mb: 2,
            '&:hover': {
              backgroundColor: '#368005',
            },
            '&.Mui-disabled': {
              backgroundColor: '#9ca3af',
              color: '#ffffff',
            },
          }}
        >
          {isPasswordResetSubmitting ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Sending...</span>
            </Box>
          ) : (
            'Continue'
          )}
        </Button>

        {/* Back to Login Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="text"
            onClick={handleBackToLogin}
            disabled={isPasswordResetSubmitting}
            sx={{
              color: '#667085',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                textDecoration: 'underline',
              },
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
