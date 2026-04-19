// features/auth/components/RegisterForm.tsx
'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';

import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Input/Input';
import SocialAuthButtons from './SocialAuthButtons';

import { registerSchema, RegisterFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useRegisterMutation, useGoogleSocialSignInMutation, useAppleSocialSignInMutation } from '../api/hooks';
import { getGoogleIdToken, getAppleIdentityToken } from '../lib/social';
import { validatePasswordStrength } from '../lib/utils';

type RegisterStep = 'email' | 'basic';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = React.useState<RegisterStep>('email');

  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [phoneValue, setPhoneValue] = React.useState('');
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { mutate: submitRegistration, isPending: isSubmitting } = useRegisterMutation();
  const { mutate: googleSignIn, isPending: isGooglePending } = useGoogleSocialSignInMutation();
  const { mutate: appleSignIn, isPending: isApplePending } = useAppleSocialSignInMutation();
  const isSocialPending = isGooglePending || isApplePending;

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid: isFormValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '234',
      phoneNumber: '',
      phone: '',
      password: '',
      confirmPassword: '',
      // Screenshot flow implies acceptance by continuing
      acceptTerms: true,
    },
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' });

  React.useEffect(() => {
    // Keep confirmPassword in sync (field not shown in UI).
    setValue('confirmPassword', password ?? '', { shouldValidate: true, shouldDirty: true });
  }, [password, setValue]);

  const passwordStrength = React.useMemo(
    () => (password ? validatePasswordStrength(password) : null),
    [password]
  );

  const strengthLevel = React.useMemo(() => {
    const score = passwordStrength?.score ?? 0;
    if (score >= 80) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    if (score >= 20) return 1;
    return 0;
  }, [passwordStrength?.score]);

  const strengthLabel = React.useMemo(() => {
    const labels = ['', 'Weak', 'Fair', 'Strong', 'Very strong'] as const;
    return labels[strengthLevel] ?? '';
  }, [strengthLevel]);

  const handlePhoneChange = (value: string, country: CountryData) => {
    setPhoneValue(value);
    const countryCode = country.dialCode;
    const phoneNumberWithoutCode = value.startsWith(countryCode)
      ? value.slice(countryCode.length)
      : value;

    setValue('phone', value, { shouldValidate: true, shouldDirty: true });
    setValue('countryCode', countryCode, { shouldValidate: true, shouldDirty: true });
    setValue('phoneNumber', phoneNumberWithoutCode, { shouldValidate: true, shouldDirty: true });
    trigger(['phone', 'countryCode', 'phoneNumber']);
  };

  const handleContinueFromEmail = async () => {
    setLocalError(null);
    const ok = await trigger('email');
    if (!ok) return;
    setStep('basic');
  };

  const handleSocialAuth = async (providerName: string) => {
    setLocalError(null);
    try {
      if (providerName === 'Google') {
        const { idToken, sessionId } = await getGoogleIdToken();
        googleSignIn(
          { idToken, sessionId },
          {
            onSuccess: () => {
              router.replace(AUTH_CONSTANTS.ROUTES.DASHBOARD);
            },
            onError: (err) => {
              setLocalError(err.message || 'Google sign-in failed');
              setSnackbar({ open: true, severity: 'error', message: err.message || 'Google sign-in failed' });
            },
          }
        );
      } else if (providerName === 'Apple') {
        const { identityToken, firstName, lastName } = await getAppleIdentityToken();
        appleSignIn(
          { identityToken, firstName, lastName },
          {
            onSuccess: () => {
              router.replace(AUTH_CONSTANTS.ROUTES.DASHBOARD);
            },
            onError: (err) => {
              setLocalError(err.message || 'Apple sign-in failed');
              setSnackbar({ open: true, severity: 'error', message: err.message || 'Apple sign-in failed' });
            },
          }
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Social sign-in failed';
      setLocalError(message);
      setSnackbar({ open: true, severity: 'error', message });
    }
  };

  const handleFormSubmission: SubmitHandler<RegisterFormData> = (formData) => {
    setLocalError(null);
    const cleanData = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
      userTypeId: AUTH_CONSTANTS.DEFAULT_USER_TYPE_ID,
      // Ensure hidden fields are valid
      acceptTerms: true,
      confirmPassword: formData.password,
    };

    submitRegistration(cleanData, {
      onSuccess: () => {
        setSnackbar({ open: true, severity: 'success', message: 'Account created. Please login.' });
        router.replace(AUTH_CONSTANTS.ROUTES.LOGIN);
      },
      onError: (error) => {
        const message = error.message || 'Registration failed';
        setLocalError(message);
        setSnackbar({ open: true, severity: 'error', message });
      },
    });
  };

  return (
    <Box>
      {/* Header */}
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
          {step === 'email' ? 'Create account' : "Let's get to meet you..."}
        </Typography>

        {step === 'email' ? (
          <Typography sx={{ color: '#667085', fontSize: { xs: '1.25rem', md: '1.35rem' } }}>
            Sign up to get started on <span style={{ color: '#101828' }}>Predict~Galore!</span>
          </Typography>
        ) : (
          <Typography sx={{ color: '#667085', fontSize: { xs: '1.25rem', md: '1.35rem' } }}>
            Provide basic information about you to get started on{' '}
            <span style={{ color: '#4AA900', fontWeight: 700 }}>Predict~Galore.</span>
          </Typography>
        )}
      </Box>

      {localError ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {localError}
        </Alert>
      ) : null}

      {step === 'email' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Email address"
                placeholder="johndoe@email.com"
                errorText={fieldState.error?.message}
                autoComplete="email"
              />
            )}
          />

          <Typography sx={{ color: '#667085', fontSize: '0.95rem', lineHeight: 1.6 }}>
            We will send an email with a verification code. By continuing, you agree to our{' '}
            <Box
              component="a"
              href="/terms"
              sx={{
                color: '#4AA900',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Terms of Service &amp; Privacy Policy
            </Box>
            .
          </Typography>

          <Button
            type="button"
            fullWidth
            disabled={isSubmitting}
            onClick={handleContinueFromEmail}
            sx={{
              bgcolor: '#4AA900',
              height: { xs: 72, md: 64 },
              fontSize: { xs: '1.25rem', md: '1.1rem' },
              fontWeight: 700,
              borderRadius: '14px',
              '&:hover': { bgcolor: '#3d8a00' },
            }}
          >
            Continue
          </Button>

          <SocialAuthButtons
            label="Or sign up with"
            disabled={isSubmitting || isSocialPending}
            onProviderClick={handleSocialAuth}
          />

          <Typography variant="body2" sx={{ textAlign: 'center', color: '#667085', mt: 1 }}>
            Already have an account?{' '}
            <Box
              component="span"
              onClick={() => router.push(AUTH_CONSTANTS.ROUTES.LOGIN)}
              sx={{ color: '#4AA900', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign in
            </Box>
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmission)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="First name"
                  placeholder="Enter your first name"
                  errorText={fieldState.error?.message}
                  leftIcon={<User size={20} />}
                  autoComplete="given-name"
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Last name"
                  placeholder="Enter your last name"
                  errorText={fieldState.error?.message}
                  leftIcon={<User size={20} />}
                  autoComplete="family-name"
                />
              )}
            />

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1, color: '#101828' }}>Phone number</Typography>
              <Box className="phone-wrapper">
                <PhoneInput
                  country={'ng'}
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  placeholder="(+234) 000-000-0000"
                  inputProps={{ name: 'phone', required: true }}
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
                    borderRight: '1px solid #D0D5DD',
                    background: '#fff',
                  }}
                  containerStyle={{ width: '100%' }}
                />
              </Box>
              {errors.phone || errors.phoneNumber ? (
                <Typography color="error" sx={{ mt: 1, fontSize: '0.95rem' }}>
                  {(errors.phone?.message || errors.phoneNumber?.message)?.toString()}
                </Typography>
              ) : null}
            </Box>

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Set a password"
                  errorText={fieldState.error?.message}
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
                  autoComplete="new-password"
                />
              )}
            />

            <Box sx={{ mt: -1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#667085', fontSize: '0.95rem' }}>
                  Password strength
                </Typography>
                {strengthLevel > 0 ? (
                  <Typography sx={{ color: '#4AA900', fontSize: '0.95rem', fontWeight: 600 }}>
                    {strengthLabel}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {[0, 1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      height: 8,
                      flex: 1,
                      borderRadius: 999,
                      bgcolor: i < strengthLevel ? '#2F8F00' : '#E4E7EC',
                      transition: 'background-color 200ms ease',
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={!isFormValid || !passwordStrength?.isValid || isSubmitting}
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
              Continue
            </Button>

            <SocialAuthButtons
              label="Or sign up with"
              disabled={isSubmitting || isSocialPending}
              onProviderClick={handleSocialAuth}
            />

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#667085', mt: 1 }}>
              Already have an account?{' '}
              <Box
                component="span"
                onClick={() => router.push(AUTH_CONSTANTS.ROUTES.LOGIN)}
                sx={{ color: '#4AA900', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign in
              </Box>
            </Typography>
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
      )}

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

export default RegisterForm;
