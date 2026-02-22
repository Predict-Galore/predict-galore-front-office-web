// features/auth/components/LoginForm.tsx
'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter, useSearchParams } from 'next/navigation';

import { Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import { Box, Typography, Alert } from '@mui/material';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Input/Input';
import { RedirectLoader } from '@/shared/components/ui';
import SocialAuthButtons from './SocialAuthButtons';
import toast from 'react-hot-toast';

import { loginSchema, LoginFormData } from '../validations/schemas';
import { useLoginMutation } from '../api/hooks';
import { createLogger } from '@/shared/api';
import { AUTH_CONSTANTS } from '../lib/constants';

const logger = createLogger('LoginForm');

/** Allow redirect only to same-origin app paths (no external or protocol-relative) */
function getSafeRedirectTarget(callbackUrl: string | null): string {
  if (!callbackUrl || typeof callbackUrl !== 'string') return AUTH_CONSTANTS.ROUTES.DASHBOARD;
  const trimmed = callbackUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    return AUTH_CONSTANTS.ROUTES.DASHBOARD;
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [loginMethod, setLoginMethod] = React.useState<'phone' | 'email'>('phone');
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const { mutate: submitLogin, isPending: isLoginSubmitting } = useLoginMutation();

  // We need to keep track of all values, not just isValid.
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { isValid: isFormValid, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
    mode: 'onChange',
  });

  // To ensure reactivity for phone/email username and password
  const watchedUsername = watch('username');
  const watchedPassword = watch('password');

  // Check if required fields are non-empty (to resolve textbook "button not clickable after filling" bugs)
  const isFieldsFilled =
    !!watchedUsername &&
    !!watchedPassword &&
    // This ensures phone-input and email-input both work correctly.
    (!errors.username && !errors.password);

  // Optional: To debug, you can view the errors and dirtyFields.
  // console.log({ errors, dirtyFields, watchedUsername, watchedPassword, isFormValid });

  const handleFormSubmission: SubmitHandler<LoginFormData> = (formData) => {
    setLocalError(null);
    logger.info('Login form submitted', { loginMethod });

    submitLogin(formData, {
      onSuccess: () => {
        toast.success('Login successful! Redirecting...');
        setIsRedirecting(true);
        
        if (onSuccess) {
          onSuccess();
          return;
        }
        const target = getSafeRedirectTarget(callbackUrl);
        // Short delay so cookie is committed before navigation
        setTimeout(() => {
          router.replace(target);
        }, 300);
      },
      onError: (err: Error) => {
        setLocalError(err.message || 'Login failed');
        toast.error(err.message || 'Login failed');
      },
    });
  };

  // On method switch, clear username and errors.
  const handleLoginMethodSwitch = () => {
    setLoginMethod((curr) => (curr === 'phone' ? 'email' : 'phone'));
    setValue('username', '', { shouldValidate: true, shouldDirty: true });
    trigger(); // For instant validation feedback
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#101828',
            fontFamily: '"Arial Black", sans-serif',
            lineHeight: 1,
            mb: 1,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography sx={{ color: '#667085', fontSize: '1.1rem' }}>
          Login to Continue
        </Typography>
      </Box>

      {localError && (
        <Alert severity="error" icon={<AlertTriangle size={20} />} sx={{ mb: 3, borderRadius: 2 }}>
          {localError}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmission)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}
        autoComplete="off"
      >
        {/* Username Field */}
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1, color: '#344054' }}>
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
                    placeholder="(+234) 000-000-0000"
                    value={field.value}
                    onChange={val => {
                      field.onChange(val);
                      setValue('username', val, { shouldValidate: true, shouldDirty: true });
                      trigger('username');
                    }}
                    inputProps={{
                      name: field.name,
                      required: true,
                      autoFocus: false,
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '64px',
                      borderRadius: '12px',
                      border: '1px solid #D0D5DD',
                      fontSize: '1.1rem',
                    }}
                  />
                )}
              />
              {/* Error below phone input */}
              {errors.username && (
                <Typography color="error" sx={{ mt: 1, fontSize: '0.95rem' }}>
                  {errors.username.message?.toString()}
                </Typography>
              )}
            </Box>
          ) : (
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Enter your email"
                  leftIcon={<Mail size={20} />}
                  fullWidth
                  errorText={fieldState.error?.message?.toString()}
                />
              )}
            />
          )}
        </Box>

        {/* Password Field */}
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1, color: '#344054' }}>Password</Typography>
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
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Box>
                }
                errorText={fieldState.error?.message?.toString()}
                autoComplete="current-password"
              />
            )}
          />
          <Typography
            onClick={() => router.push('/forgot-password')}
            sx={{ color: '#D92D20', fontWeight: 600, fontSize: '0.875rem', mt: 1.5, cursor: 'pointer' }}
          >
            Forgot password?
          </Typography>
        </Box>

        {/* Buttons */}
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            type="submit"
            fullWidth
            sx={{
              bgcolor: '#4AA900',
              height: '60px',
              fontSize: '1.1rem',
              fontWeight: 700,
              '&:hover': { bgcolor: '#3d8a00' },
              '&:disabled': { bgcolor: '#A6D388' }
            }}
            // The main fix: also require fields filled (not just isFormValid) for enabling.
            disabled={!isFieldsFilled || !isFormValid || isLoginSubmitting}
          >
            {isLoginSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={handleLoginMethodSwitch}
            sx={{ height: '60px', borderColor: '#4AA900', color: '#4AA900', fontWeight: 700 }}
          >
            Login with {loginMethod === 'phone' ? 'email address' : 'phone number'}
          </Button>
        </Box>

        <SocialAuthButtons label="Or sign up with" />

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#667085', mt: 2 }}>
          Don&apos;t have an account yet?{' '}
          <Box
            component="span"
            onClick={() => router.push('/register')}
            sx={{ color: '#4AA900', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign up
          </Box>
        </Typography>
      </Box>

      {/* CUSTOM PHONE STYLES */}
      <style jsx global>{`
        .phone-wrapper .react-tel-input .form-control {
          width: 100% !important;
          height: 64px !important;
          border-radius: 12px !important;
          border: 1px solid #D0D5DD !important;
          font-size: 1.1rem !important;
        }
        .phone-wrapper .react-tel-input .flag-dropdown {
          border-radius: 12px 0 0 12px !important;
          border: 1px solid #D0D5DD !important;
          background: #fff !important;
        }
      `}</style>

      {/* Redirect Loader */}
      <RedirectLoader show={isRedirecting} message="Logging you in..." />
    </Box>
  );
};

export default LoginForm;