/**
 * Register Form Component
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
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Paper,
  Fade,
  Snackbar,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from 'next/navigation';
import { registerSchema, RegisterFormData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useRegisterMutation } from '../api/hooks';
import { useAuthStore } from '../model/store';
import { validatePasswordStrength } from '../lib/utils';
import { createLogger } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import type { ApiResponseWithUser, RegisterResponse, LocalUser } from '../api/types';

const logger = createLogger('RegisterForm');

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const router = useRouter();
  const { login } = useAuthStore();

  // ===================================================================
  // STATE
  // ===================================================================
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [phoneValue, setPhoneValue] = React.useState('');

  // ===================================================================
  // REACT QUERY MUTATION - Registration Submission Logic
  // ===================================================================
  const {
    mutate: submitRegistration,
    isPending: isRegistrationSubmitting,
    isError: registrationHasSubmissionError,
    error: registrationSubmissionError,
    isSuccess: isRegistrationSuccessful,
    data: registrationResponseData,
    reset: resetRegistrationMutation,
  } = useRegisterMutation();

  // ===================================================================
  // REACT HOOK FORM - Form State & Validation
  // ===================================================================
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: {
      isValid: isFormValid,
      errors: formValidationErrors,
      isSubmitting: isReactHookFormSubmitting,
    },
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

  // ===================================================================
  // FORM VALIDATION HELPER
  // ===================================================================
  const formHasAnyValidationError = Object.keys(formValidationErrors).length > 0;

  // ===================================================================
  // FORM WATCHERS
  // ===================================================================
  const password = useWatch({ control, name: 'password' });

  // ===================================================================
  // PASSWORD STRENGTH CALCULATION
  // ===================================================================
  const passwordStrength = React.useMemo(() => {
    return password ? validatePasswordStrength(password) : null;
  }, [password]);

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handlePhoneChange = (value: string, country: CountryData) => {
    setPhoneValue(value);

    const countryCode = country.dialCode;
    let phoneNumberWithoutCode = '';

    if (value.startsWith(`+${countryCode}`)) {
      phoneNumberWithoutCode = value.substring(countryCode.length + 1);
    } else {
      phoneNumberWithoutCode = value.replace(/\D/g, '');
    }

    setValue('phone', value, { shouldValidate: true });
    setValue('countryCode', countryCode, { shouldValidate: true });
    setValue('phoneNumber', phoneNumberWithoutCode, { shouldValidate: true });

    trigger(['phone', 'countryCode', 'phoneNumber']);
  };

  const handleFormSubmission = async (formData: RegisterFormData) => {
    try {
      // Clean and prepare registration data
      const cleanRegistrationData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        userTypeId: AUTH_CONSTANTS.DEFAULT_USER_TYPE_ID,
      };

      // Submit registration
      await submitRegistration(cleanRegistrationData, {
        onSuccess: (result) => {
          const responseData = result?.data as ApiResponseWithUser<RegisterResponse> | undefined;
          const user = (responseData?.user || result?.user) as LocalUser | undefined;
          const token = responseData?.token || result?.token;

          if (user && token) {
            // Convert to app User type with required properties
            const appUser = {
              ...user,
              role: 'user' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Store in Zustand store
            login(appUser, token);

            // Always check if email verification is needed based on user status
            if (!user.isEmailVerified) {
              sessionStorage.setItem('pendingVerificationEmail', formData.email);
              router.push(AUTH_CONSTANTS.ROUTES.VERIFY_EMAIL);
            } else {
              sessionStorage.removeItem('pendingVerificationEmail');
              if (onSuccess) {
                onSuccess();
              } else {
                router.push(AUTH_CONSTANTS.ROUTES.DASHBOARD);
              }
            }
          }
        },
      });
    } catch (error) {
      // Log error with context
      logger.error('Registration submission error', {
        error,
        timestamp: new Date().toISOString(),
      });

      // Re-throw for React Query UI handling
      throw error;
    }
  };

  const handleLoginRedirect = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Paper className={cn('p-4 sm:p-6 md:p-8', 'rounded-xl md:rounded-2xl', 'shadow-lg', 'w-full')}>
      {/* Form Header */}
      <Typography
        variant="h5"
        className={cn('font-bold text-gray-900 mb-2', 'text-xl sm:text-2xl')}
      >
        Create Your Account
      </Typography>

      <Typography
        variant="body2"
        className={cn('text-gray-600 mb-4 sm:mb-6', 'text-sm sm:text-base')}
      >
        Sign up to get started on Predict~Galore!
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
          SUCCESS MESSAGE
      =================================================================== */}
      {isRegistrationSuccessful && (
        <Snackbar
          open={isRegistrationSuccessful}
          autoHideDuration={5000}
          onClose={resetRegistrationMutation}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={resetRegistrationMutation}
            sx={{ width: '100%' }}
          >
            {registrationResponseData?.message || 'Account created successfully!'}
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          ERROR MESSAGE
      =================================================================== */}
      {registrationHasSubmissionError && (
        <Snackbar
          open={registrationHasSubmissionError}
          autoHideDuration={7000}
          onClose={resetRegistrationMutation}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={resetRegistrationMutation}
            sx={{ width: '100%' }}
          >
            {registrationSubmissionError instanceof Error
              ? registrationSubmissionError.message
              : 'Registration failed. Please try again.'}
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          REGISTRATION FORM
      =================================================================== */}
      <form
        onSubmit={handleSubmit(handleFormSubmission)}
        className={cn('space-y-3 sm:space-y-4 md:space-y-5', 'w-full')}
      >
        {/* NAME FIELDS */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* FIRST NAME FIELD */}
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="First Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isRegistrationSubmitting}
                required
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person className="text-gray-400" />
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

          {/* LAST NAME FIELD */}
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Last Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isRegistrationSubmitting}
                required
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person className="text-gray-400" />
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
        </Grid>

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
                disabled={isRegistrationSubmitting}
                required
                className="bg-white"
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

        {/* PHONE FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="phone"
            control={control}
            render={({ fieldState }) => (
              <Box>
                <Typography className="text-sm font-medium mb-2 text-gray-700">
                  Phone Number
                </Typography>
                <Box
                  sx={{
                    '& .react-tel-input': {
                      width: '100%',
                      '& .form-control': {
                        width: '100%',
                        height: '48px',
                        borderRadius: '12px',
                        borderColor: fieldState.error ? '#ef4444' : '#d1d5db',
                        backgroundColor: 'white',
                        fontSize: '16px',
                        paddingLeft: '60px',
                        '&:hover': {
                          borderColor: fieldState.error ? '#ef4444' : AUTH_CONSTANTS.COLORS.PRIMARY,
                        },
                        '&:focus': {
                          borderColor: fieldState.error ? '#ef4444' : AUTH_CONSTANTS.COLORS.PRIMARY,
                          boxShadow: fieldState.error
                            ? 'none'
                            : `0 0 0 2px ${AUTH_CONSTANTS.COLORS.PRIMARY}20`,
                          borderWidth: '2px',
                        },
                      },
                      '& .flag-dropdown': {
                        borderRight: 'none',
                        borderRadius: '12px 0 0 12px',
                        borderColor: '#d1d5db',
                        backgroundColor: 'white',
                        '&.open': {
                          borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                          backgroundColor: 'white',
                        },
                        '& .selected-flag': {
                          borderRadius: '12px 0 0 12px',
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          '&:hover, &.open': {
                            backgroundColor: 'white',
                          },
                        },
                      },
                      '& .country-list': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        '& .country': {
                          padding: '10px 15px',
                          '&:hover': {
                            backgroundColor: '#f0fdf4',
                          },
                          '&.highlight': {
                            backgroundColor: '#dcfce7',
                          },
                        },
                      },
                    },
                  }}
                >
                  <PhoneInput
                    country={'ng'}
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: false,
                    }}
                    specialLabel=""
                    placeholder="(+234) 000-000-0000"
                    enableSearch
                    searchPlaceholder="Search country"
                    inputStyle={{
                      width: '100%',
                      height: '48px',
                      fontSize: '16px',
                    }}
                    buttonStyle={{
                      borderRight: 'none',
                      borderRadius: '12px 0 0 12px',
                    }}
                    dropdownStyle={{
                      borderRadius: '12px',
                    }}
                    disabled={isRegistrationSubmitting}
                  />
                </Box>
                {fieldState.error && (
                  <Typography className="text-red-600 text-xs mt-2 ml-1">
                    {fieldState.error.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        </Box>

        {/* PASSWORD FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isRegistrationSubmitting}
                required
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
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

        {/* PASSWORD STRENGTH INDICATOR */}
        {passwordStrength && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Password Strength
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              {[0, 1, 2, 3, 4].map((index) => (
                <Box
                  key={index}
                  sx={{
                    height: 8,
                    flex: 1,
                    borderRadius: 1,
                    transition: 'background-color 0.3s',
                    bgcolor:
                      index < Object.values(passwordStrength.meetsRequirements).filter(Boolean).length
                        ? passwordStrength.isValid
                          ? 'success.main'
                          : 'warning.main'
                        : 'grey.300',
                  }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Password strength: {passwordStrength.score}% -{' '}
              <Typography
                component="span"
                variant="caption"
                sx={{ color: passwordStrength.isValid ? 'success.main' : 'warning.main' }}
              >
                {passwordStrength.isValid ? 'Strong' : 'Needs improvement'}
              </Typography>
            </Typography>
            {passwordStrength.feedback.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'warning.main', display: 'block', mt: 0.5 }}>
                  {passwordStrength.feedback.join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* CONFIRM PASSWORD FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isRegistrationSubmitting}
                required
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
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

        {/* TERMS ACCEPTANCE */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      color="primary"
                      disabled={isRegistrationSubmitting}
                      sx={{
                        color: AUTH_CONSTANTS.COLORS.PRIMARY,
                        '&.Mui-checked': {
                          color: AUTH_CONSTANTS.COLORS.PRIMARY,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" className="text-gray-700">
                      I agree to the{' '}
                      <Link
                        href={AUTH_CONSTANTS.ROUTES.TERMS}
                        className="text-green-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href={AUTH_CONSTANTS.ROUTES.PRIVACY}
                        className="text-green-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
                {fieldState.error && (
                  <Typography variant="caption" className="text-red-600 block mt-1 ml-7">
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />
        </Box>

        {/* TERMS FOOTNOTE */}
        <Box className="pt-2">
          <Typography variant="body2" className="text-gray-600">
            By creating an account, you agree to our{' '}
            <Link
              href={AUTH_CONSTANTS.ROUTES.TERMS}
              className="text-green-600 hover:text-green-800 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>{' '}
            &{' '}
            <Link
              href={AUTH_CONSTANTS.ROUTES.PRIVACY}
              className="text-green-600 hover:text-green-800 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            .
          </Typography>
        </Box>

        {/* ===================================================================
            SUBMIT BUTTON
        =================================================================== */}
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={
              isRegistrationSubmitting ||
              isRegistrationSuccessful ||
              !isFormValid ||
              isReactHookFormSubmitting
            }
            startIcon={
              isRegistrationSubmitting ? <CircularProgress size={20} color="inherit" /> : null
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
            {isRegistrationSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        {/* ===================================================================
            FORM STATUS INDICATOR
        =================================================================== */}
        <Fade in={isRegistrationSubmitting}>
          <Typography variant="caption" className="text-gray-500 text-center block">
            {isRegistrationSubmitting ? 'Creating your account...' : ''}
          </Typography>
        </Fade>

        {/* ===================================================================
            OR DIVIDER
        =================================================================== */}
        <Box className="flex items-center gap-4 my-6">
          <Divider className="flex-1" />
          <Typography className="text-gray-500 text-sm font-medium">Or sign up with</Typography>
          <Divider className="flex-1" />
        </Box>

        {/* ===================================================================
            SOCIAL SIGNUP BUTTONS
        =================================================================== */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {AUTH_CONSTANTS.SOCIAL_PROVIDERS.map((provider) => (
            <Button
              key={provider.name}
              variant="outlined"
              fullWidth
              onClick={() => {
                // Handle social signup
                logger.info('Social sign up initiated', { provider: provider.name });
              }}
              disabled={isRegistrationSubmitting}
              sx={{
                height: '56px',
                borderRadius: '12px',
                borderColor: '#e5e7eb',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#d1d5db',
                },
              }}
            >
              <provider.icon size={24} color={provider.color} />
            </Button>
          ))}
        </Box>

        {/* ===================================================================
            LOGIN LINK
        =================================================================== */}
        <Box className="text-center mt-8 pt-6 border-t border-gray-200">
          <Typography className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={handleLoginRedirect}
              className="font-semibold text-green-600 hover:text-green-800"
              underline="hover"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
};

export default RegisterForm;
