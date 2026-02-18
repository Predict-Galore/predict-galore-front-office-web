// features/auth/components/RegisterForm.tsx
'use client';

import React from 'react';
import { useForm, Controller, useWatch, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { Box, Typography } from '@mui/material';

// UI Components
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Input/Input';
import { Checkbox } from '@/shared/components/ui/Checkbox/Checkbox';
import { Alert } from '@/shared/components/ui/Alert/Alert';
import SocialAuthButtons from './SocialAuthButtons';

// Logic & Types
import { registerSchema, RegisterFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useRegisterMutation } from '../api/hooks';
import { useAuthStore } from '../model/store';
import { validatePasswordStrength } from '../lib/utils';
import type { ApiResponseWithUser, RegisterResponse, LocalUser } from '../api/types';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const router = useRouter();
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [phoneValue, setPhoneValue] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);

  const { mutate: submitRegistration, isPending: isLoginSubmitting } = useRegisterMutation();

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { isValid: isFormValid },
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
      acceptTerms: false,
    },
    mode: 'onBlur',
  });

  const password = useWatch({ control, name: 'password' });
  const passwordStrength = React.useMemo(() => (password ? validatePasswordStrength(password) : null), [password]);

  const handlePhoneChange = (value: string, country: CountryData) => {
    setPhoneValue(value);
    const countryCode = country.dialCode;
    const phoneNumberWithoutCode = value.startsWith(countryCode) ? value.slice(countryCode.length) : value;
    
    setValue('phone', value, { shouldValidate: true });
    setValue('countryCode', countryCode, { shouldValidate: true });
    setValue('phoneNumber', phoneNumberWithoutCode, { shouldValidate: true });
    trigger(['phone', 'countryCode', 'phoneNumber']);
  };

  const handleFormSubmission: SubmitHandler<RegisterFormData> = (formData) => {
    setLocalError(null);
    const cleanData = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
      userTypeId: AUTH_CONSTANTS.DEFAULT_USER_TYPE_ID,
    };

    submitRegistration(cleanData, {
      onSuccess: (result) => {
        const responseData = result?.data as ApiResponseWithUser<RegisterResponse> | undefined;
        const user = (responseData?.user || result?.user) as LocalUser | undefined;
        const token = responseData?.token || result?.token || null;

        if (user) {
          login({ ...user, role: 'user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, token);
          if (!user.isEmailVerified) {
            sessionStorage.setItem('pendingVerificationEmail', formData.email);
            router.push(AUTH_CONSTANTS.ROUTES.VERIFY_EMAIL);
          } else {
            if (onSuccess) onSuccess();
            else router.push(AUTH_CONSTANTS.ROUTES.DASHBOARD);
          }
        }
      },
      onError: (error) => setLocalError(error.message || 'Registration failed'),
    });
  };

  return (
    <Box>
      {/* Header - Matching Login Style */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#101828',
            fontFamily: '"Arial Black", sans-serif',
            lineHeight: 1,
            mb: 1,
          }}
        >
          Join Us!
        </Typography>
        <Typography sx={{ color: '#667085', fontSize: '1.1rem' }}>
          Create your account to get started
        </Typography>
      </Box>

      {localError && (
        <Alert variant="error" sx={{ mb: 3 }}>
          {localError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(handleFormSubmission)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        
        {/* Name Fields Row */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <Input {...field} label="First Name" placeholder="First name" errorText={fieldState.error?.message} leftIcon={<User size={20} />} fullWidth />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <Input {...field} label="Last Name" placeholder="Last name" errorText={fieldState.error?.message} leftIcon={<User size={20} />} fullWidth />
            )}
          />
        </Box>

        {/* Email Field */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input {...field} label="Email Address" type="email" placeholder="Enter your email" errorText={fieldState.error?.message} leftIcon={<Mail size={20} />} fullWidth />
          )}
        />

        {/* Phone Field */}
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1, color: '#344054' }}>Phone Number</Typography>
          <Box className="phone-wrapper">
            <PhoneInput
              country={'ng'}
              value={phoneValue}
              onChange={handlePhoneChange}
              placeholder="(+234) 000-000-0000"
            />
          </Box>
        </Box>

        {/* Password Fields */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              errorText={fieldState.error?.message}
              leftIcon={<Lock size={20} />}
              rightIcon={
                <Box component="button" type="button" onClick={() => setShowPassword(!showPassword)} sx={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Box>
              }
            />
          )}
        />

        {/* Password Strength - Small refinement to match clean look */}
        {passwordStrength && (
          <Box sx={{ mt: -1 }}>
            <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ height: 6, flex: 1, borderRadius: 1, bgcolor: i < (passwordStrength.score / 20) ? '#4AA900' : '#E4E7EC' }} />
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: '#667085' }}>
              Strength: <span style={{ color: '#4AA900', fontWeight: 600 }}>{passwordStrength.isValid ? 'Strong' : 'Weak'}</span>
            </Typography>
          </Box>
        )}

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              errorText={fieldState.error?.message}
              leftIcon={<Lock size={20} />}
              rightIcon={
                <Box component="button" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Box>
              }
            />
          )}
        />

        {/* Terms */}
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              label={<Typography variant="body2">I agree to the <span style={{ color: '#4AA900', fontWeight: 600 }}>Terms of Service</span></Typography>}
            />
          )}
        />

        {/* Submit Button - BRAND GREEN */}
        <Button
          type="submit"
          fullWidth
          loading={isLoginSubmitting}
          disabled={!isFormValid || isLoginSubmitting}
          sx={{
            bgcolor: '#4AA900',
            height: '60px',
            fontSize: '1.1rem',
            fontWeight: 700,
            mt: 1,
            '&:hover': { bgcolor: '#3d8a00' },
          }}
        >
          Create Account
        </Button>

        <SocialAuthButtons label="Or sign up with" />

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#667085', mt: 2 }}>
          Already have an account?{' '}
          <Box
            component="span"
            onClick={() => {
              if (onSwitchToLogin) {
                onSwitchToLogin();
              } else {
                router.push('/login');
              }
            }}
            sx={{ color: '#4AA900', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in
          </Box>
        </Typography>
      </Box>

      {/* Shared Phone Styles */}
      <style jsx global>{`
        .phone-wrapper .react-tel-input .form-control {
          width: 100% !important;
          height: 60px !important;
          border-radius: 12px !important;
          border: 1px solid #D0D5DD !important;
          font-size: 1rem !important;
        }
        .phone-wrapper .react-tel-input .flag-dropdown {
          border-radius: 12px 0 0 12px !important;
          border: 1px solid #D0D5DD !important;
          background: #fff !important;
        }
      `}</style>
    </Box>
  );
};

export default RegisterForm;
