/**
 * Forgot Password Form Component
 * Matches UI screenshots and routes into verify-otp flow.
 */

'use client';

import React from 'react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { forgotPasswordSchema, ForgotPasswordFormData } from '../validations/schemas';
import { useForgotPasswordMutation } from '../api/hooks';
import { Input } from '@/shared/components/ui/Input/Input';
import { Button } from '@/shared/components/ui/Button/Button';
import { RedirectLoader } from '@/shared/components/ui';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const router = useRouter();

  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { mutate: submitForgotPassword, isPending } = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const handleFormSubmission = (formData: ForgotPasswordFormData) => {
    const normalizedEmail = formData.email.toLowerCase().trim();

    submitForgotPassword(
      { email: normalizedEmail },
      {
        onSuccess: (resp) => {
          const ok = (resp as { success?: boolean })?.success;
          if (ok === false) {
            setSnackbar({
              open: true,
              severity: 'error',
              message: 'Email not found. Please check and try again.',
            });
            return;
          }
          setSnackbar({ open: true, severity: 'success', message: 'Verification code sent.' });
          setIsRedirecting(true);
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(normalizedEmail)}`);
          }, 400);
          onSuccess?.();
        },
        onError: (err: Error) => {
          setSnackbar({
            open: true,
            severity: 'error',
            message: err.message || 'Unable to continue. Please try again.',
          });
        },
      }
    );
  };

  return (
    <Box>
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography
          sx={{
            fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem' },
            fontWeight: 900,
            color: '#101828',
            fontFamily: '"Arial Black", sans-serif',
            lineHeight: 1,
            mb: 1,
          }}
        >
          Forgot Password
        </Typography>
        <Typography sx={{ color: '#667085', fontSize: { xs: '1.25rem', md: '1.35rem' } }}>
          Enter your registered email address to reset your password
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmission)}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Email address"
              placeholder="Enter your email address"
              errorText={fieldState.error?.message}
              disabled={isPending}
              autoComplete="email"
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          disabled={!isValid || isPending}
          sx={{
            bgcolor: '#4AA900',
            height: { xs: 72, md: 64 },
            fontSize: { xs: '1.25rem', md: '1.1rem' },
            fontWeight: 700,
            borderRadius: '14px',
            mt: 3,
            '&:hover': { bgcolor: '#3d8a00' },
            '&:disabled': { bgcolor: '#C8E6B8', color: '#7FB36D' },
          }}
        >
          {isPending ? 'Sending...' : 'Continue'}
        </Button>
      </Box>

      <RedirectLoader show={isRedirecting} message="Sending verification code..." />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPasswordForm;
