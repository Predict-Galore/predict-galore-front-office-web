/**
 * Reset Password Form Component
 * Matches UI screenshots and ends by routing to login after success CTA.
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { resetPasswordSchema, ResetPasswordFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useResetPasswordMutation } from '../api/hooks';
import { validatePasswordStrength } from '../lib/utils';

import { Input } from '@/shared/components/ui/Input/Input';
import { Button } from '@/shared/components/ui/Button/Button';

interface ResetPasswordFormProps {
  token?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token: propToken }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const urlToken = propToken || searchParams.get('token') || '';
  const hasToken = urlToken.length > 0;

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { mutate: submitResetPassword, isPending } = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: urlToken,
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });

  const passwordStrength = React.useMemo(
    () => (password ? validatePasswordStrength(password) : null),
    [password]
  );
  const confirmStrength = React.useMemo(
    () => (confirmPassword ? validatePasswordStrength(confirmPassword) : null),
    [confirmPassword]
  );

  const strengthLevel = (score?: number) => {
    const s = score ?? 0;
    if (s >= 80) return 4;
    if (s >= 60) return 3;
    if (s >= 40) return 2;
    if (s >= 20) return 1;
    return 0;
  };

  const handleFormSubmission = (formData: ResetPasswordFormData) => {
    if (!hasToken) return;

    submitResetPassword(
      {
        ...formData,
        token: urlToken,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
        onError: (err: Error) => {
          setSnackbar({
            open: true,
            severity: 'error',
            message: err.message || 'Unable to update password. Please try again.',
          });
        },
      }
    );
  };

  const handleContinueToLogin = () => {
    setShowSuccess(false);
    router.replace(AUTH_CONSTANTS.ROUTES.LOGIN);
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
          Reset Password
        </Typography>
        <Typography sx={{ color: '#667085', fontSize: { xs: '1.25rem', md: '1.35rem' } }}>
          Create a new password to login with
        </Typography>
      </Box>

      {!hasToken ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Invalid or missing reset token. Please restart the password reset flow.
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit(handleFormSubmission)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Set a password"
                errorText={fieldState.error?.message}
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    size="small"
                    sx={{ color: '#98A2B3' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                }
                disabled={isPending}
                autoComplete="new-password"
              />
            )}
          />

          <Box sx={{ mt: -1 }}>
            <Box
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: '#E4E7EC',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${(strengthLevel(passwordStrength?.score) / 4) * 100}%`,
                  bgcolor: '#2F8F00',
                  transition: 'width 200ms ease',
                }}
              />
            </Box>
            <Typography sx={{ color: '#667085', fontSize: '0.95rem', mt: 1 }}>
              Password strength
            </Typography>
          </Box>

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                errorText={fieldState.error?.message}
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <IconButton
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    size="small"
                    sx={{ color: '#98A2B3' }}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                }
                disabled={isPending}
                autoComplete="new-password"
              />
            )}
          />

          <Box sx={{ mt: -1 }}>
            <Box
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: '#E4E7EC',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${(strengthLevel(confirmStrength?.score) / 4) * 100}%`,
                  bgcolor: '#2F8F00',
                  transition: 'width 200ms ease',
                }}
              />
            </Box>
            <Typography sx={{ color: '#667085', fontSize: '0.95rem', mt: 1 }}>
              Password strength
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            loading={isPending}
            disabled={!hasToken || !isValid || isPending}
            sx={{
              bgcolor: '#4AA900',
              height: { xs: 72, md: 64 },
              fontSize: { xs: '1.25rem', md: '1.1rem' },
              fontWeight: 700,
              borderRadius: '14px',
              mt: 1,
              '&:hover': { bgcolor: '#3d8a00' },
              '&:disabled': { bgcolor: '#C8E6B8', color: '#7FB36D' },
            }}
          >
            Update password
          </Button>
        </Box>
      </Box>

      <Dialog
        open={showSuccess}
        onClose={handleContinueToLogin}
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxWidth: 560,
            width: '100%',
            p: isMobile ? 2.5 : 3.5,
          },
        }}
        sx={{
          '& .MuiBackdrop-root': { bgcolor: 'rgba(0,0,0,0.8)' },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CheckCircle sx={{ fontSize: 64, color: '#22C55E' }} />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.25rem' },
                fontWeight: 900,
                color: '#101828',
                fontFamily: '"Arial Black", sans-serif',
                mb: 1.5,
              }}
            >
              Password Reset Successful
            </Typography>
            <Typography sx={{ color: '#667085', fontSize: { xs: '1.05rem', md: '1.15rem' }, mb: 3 }}>
              Your password has been successfully updated. You can now use your new password to log
              in securely
            </Typography>

            <Button
              fullWidth
              onClick={handleContinueToLogin}
              sx={{
                bgcolor: '#4AA900',
                height: { xs: 72, md: 64 },
                fontSize: { xs: '1.25rem', md: '1.1rem' },
                fontWeight: 700,
                borderRadius: '14px',
                '&:hover': { bgcolor: '#3d8a00' },
              }}
            >
              Continue to login
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

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

export default ResetPasswordForm;
