// features/auth/components/LoginForm.tsx
'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter, useSearchParams } from 'next/navigation';

import { Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';

import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Input/Input';
import { RedirectLoader } from '@/shared/components/ui';
import SocialAuthButtons from './SocialAuthButtons';

import { loginSchema, LoginFormData, toLoginRequest } from '../validations/schemas';
import { useLoginMutation } from '../api/hooks';
import { createLogger } from '@/shared/api';
import { AUTH_CONSTANTS } from '../lib/constants';

const logger = createLogger('LoginForm');

/** Allow redirect only to same-origin app paths (no external or protocol-relative) */
function getSafeRedirectTarget(targetUrl: string | null): string {
  if (!targetUrl || typeof targetUrl !== 'string') return AUTH_CONSTANTS.ROUTES.DASHBOARD;
  const trimmed = targetUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    return AUTH_CONSTANTS.ROUTES.DASHBOARD;
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const callbackUrl = searchParams.get('callbackUrl');
  const redirectTarget = returnUrl || callbackUrl;

  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [loginMethod, setLoginMethod] = React.useState<'phone' | 'email'>('phone');
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { mutate: submitLogin, isPending: isLoginSubmitting } = useLoginMutation();

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
    mode: 'onChange',
  });

  const handleFormSubmission: SubmitHandler<LoginFormData> = (formData) => {
    setLocalError(null);
    logger.info('Login form submitted', { loginMethod });

    submitLogin(toLoginRequest(formData), {
      onSuccess: () => {
        setSnackbar({ open: true, severity: 'success', message: 'Login successful! Redirecting...' });
        setIsRedirecting(true);

        if (onSuccess) {
          onSuccess();
          return;
        }
        const target = getSafeRedirectTarget(redirectTarget);
        setTimeout(() => {
          router.replace(target);
        }, 300);
      },
      onError: (err: Error) => {
        setLocalError(err.message || 'Login failed');
        setSnackbar({
          open: true,
          severity: 'error',
          message: err.message || 'Login failed',
        });
      },
    });
  };

  const handleLoginMethodSwitch = () => {
    setLoginMethod((curr) => (curr === 'phone' ? 'email' : 'phone'));
    setValue('username', '', { shouldValidate: true, shouldDirty: true });
    trigger('username');
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
          Welcome Back!
        </Typography>
        <Typography sx={{ color: '#667085', fontSize: { xs: '1.25rem', md: '1.35rem' } }}>
          Login to Continue
        </Typography>
      </Box>

      {localError ? (
        <Alert severity="error" icon={<AlertTriangle size={20} />} sx={{ mb: 3, borderRadius: 2 }}>
          {localError}
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit(handleFormSubmission)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1, color: '#101828' }}>
              {loginMethod === 'phone' ? 'Phone number' : 'Email address'}
            </Typography>

            {loginMethod === 'phone' ? (
              <Box className="phone-wrapper">
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      country={'ng'}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        setValue('username', val, { shouldValidate: true, shouldDirty: true });
                        trigger('username');
                      }}
                      placeholder="(+234) 000-000-0000"
                      inputProps={{ name: field.name, required: true }}
                      inputStyle={{
                        width: '100%',
                        height: '64px',
                        borderRadius: '12px',
                        border: '1px solid #D0D5DD',
                        fontSize: '1.1rem',
                      }}
                      buttonStyle={{
                        borderRadius: '12px 0 0 12px',
                        border: '1px solid #D0D5DD',
                        background: '#fff',
                      }}
                      containerStyle={{ width: '100%' }}
                    />
                  )}
                />
              </Box>
            ) : (
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="johndoe@email.com"
                    leftIcon={<Mail size={20} />}
                    errorText={fieldState.error?.message?.toString()}
                    autoComplete="email"
                  />
                )}
              />
            )}

            {errors.username ? (
              <Typography color="error" sx={{ mt: 1, fontSize: '0.95rem' }}>
                {errors.username.message?.toString()}
              </Typography>
            ) : null}
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1, color: '#101828' }}>Password</Typography>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  leftIcon={<Lock size={20} />}
                  rightIcon={
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      sx={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Box>
                  }
                  errorText={fieldState.error?.message?.toString()}
                  autoComplete="current-password"
                />
              )}
            />

            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography
                onClick={() => router.push(AUTH_CONSTANTS.ROUTES.FORGOT_PASSWORD)}
                sx={{
                  color: '#D92D20',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </Typography>
              <Typography
                onClick={() => router.push(AUTH_CONSTANTS.ROUTES.REGISTER)}
                sx={{
                  color: '#4AA900',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Sign up
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              disabled={isLoginSubmitting || isRedirecting}
              sx={{
                bgcolor: '#4AA900',
                height: { xs: 72, md: 64 },
                fontSize: { xs: '1.25rem', md: '1.1rem' },
                fontWeight: 700,
                borderRadius: '14px',
                '&:hover': { bgcolor: '#3d8a00' },
                '&:disabled': { bgcolor: '#C8E6B8', color: '#7FB36D' },
              }}
            >
              {isLoginSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            <Button
              variant="outline"
              fullWidth
              type="button"
              onClick={handleLoginMethodSwitch}
              sx={{
                height: { xs: 72, md: 64 },
                borderColor: '#4AA900',
                color: '#4AA900',
                fontWeight: 700,
                borderRadius: '14px',
                borderWidth: 2,
                '&:hover': { borderColor: '#3d8a00', color: '#3d8a00', bgcolor: 'transparent' },
              }}
            >
              Login with {loginMethod === 'phone' ? 'email address' : 'phone number'}
            </Button>
          </Box>

          <SocialAuthButtons label="Or sign up with" />
        </Box>

        <style jsx global>{`
          .phone-wrapper .react-tel-input .form-control:focus {
            border-color: #4aa900 !important;
            box-shadow: 0 0 0 4px rgba(74, 169, 0, 0.12) !important;
          }
          .phone-wrapper .react-tel-input .flag-dropdown.open,
          .phone-wrapper .react-tel-input .flag-dropdown:focus {
            border-color: #4aa900 !important;
          }
        `}</style>
      </Box>

      <RedirectLoader show={isRedirecting} variant="app" />

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

export default LoginForm;
