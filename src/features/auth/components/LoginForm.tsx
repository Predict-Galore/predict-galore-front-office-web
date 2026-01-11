/**
 * Login Form Component
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
  Fade,
  Snackbar,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email, Error as ErrorIcon } from '@mui/icons-material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginFormData, LoginRequestData } from '../validations/schemas';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useLoginMutation } from '../api/hooks';
import { useAuthStore } from '../model/store';
import { createLogger } from '@/shared/api';
import { ApiError } from '@/shared/lib/errors';

const logger = createLogger('LoginForm');

interface LoginFormProps {
  onSuccess?: () => void;
}

// Define extended response type to handle different API structures
interface ExtendedLoginResponse {
  success?: boolean;
  status?: string;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
      phoneNumber?: string;
      countryCode?: string;
      createdAt?: string;
      updatedAt?: string;
    };
    token: string;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    phoneNumber?: string;
    countryCode?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  token?: string;
  accessToken?: string;
  message?: string;
  error?: string;
  code?: string;
}

// Type guard to check if object has user property
function hasUserProperty(obj: unknown): obj is { user: unknown } {
  return typeof obj === 'object' && obj !== null && 'user' in obj;
}

// Type guard to check if object has id property (is a user object)
function hasIdProperty(obj: unknown): obj is { id: unknown } {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login } = useAuthStore();

  // ===================================================================
  // STATE
  // ===================================================================
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  // ===================================================================
  // REACT QUERY MUTATION - Login Submission Logic
  // ===================================================================
  const {
    mutate: submitLogin,
    isPending: isLoginSubmitting,
    isError: loginHasSubmissionError,
    error: loginSubmissionError,
    isSuccess: isLoginSuccessful,
    reset: resetLoginMutation,
  } = useLoginMutation();

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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
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
  const handleFormSubmission: SubmitHandler<LoginFormData> = async (formData: LoginFormData) => {
    try {
      setLocalError(null);
      logger.debug('Login form submitted', { username: formData.username });

      // Clean data
      const cleanFormData: LoginRequestData = {
        username: formData.username.trim(),
        password: formData.password,
        ...(formData.rememberMe && { rememberMe: formData.rememberMe }),
      };

      logger.debug('Sending login request');

      // Submit login
      submitLogin(cleanFormData, {
        onSuccess: (result) => {
          logger.debug('Login mutation onSuccess');

          // Cast result to extended type to handle different structures
          const extendedResult = result as ExtendedLoginResponse;

          // Extract user data from multiple possible response structures
          const userData =
            extendedResult?.data?.user || extendedResult?.user || extendedResult?.data;
          const token =
            extendedResult?.data?.token || extendedResult?.token || extendedResult?.accessToken;

          // Check success with multiple indicators
          const isSuccess =
            extendedResult?.success === true ||
            extendedResult?.status === 'success' ||
            (!!userData && !!token);

          logger.debug('Extracted login data', {
            isSuccess,
            hasUserData: !!userData,
            hasToken: !!token,
          });

          if (isSuccess && userData && token) {
            // Determine the actual user object based on structure
            let actualUser: ExtendedLoginResponse['user'];

            if (hasIdProperty(userData)) {
              // userData is already a user object
              actualUser = userData as ExtendedLoginResponse['user'];
            } else if (hasUserProperty(userData)) {
              // userData contains a user property
              actualUser = userData.user as ExtendedLoginResponse['user'];
            } else {
              logger.error('Invalid user data structure', { userData });
              setLocalError('Invalid user data received from server.');
              return;
            }

            if (!actualUser) {
              logger.error('No user data found', { userData });
              setLocalError('No user data received from server.');
              return;
            }

            // Convert to app User type
            const appUser = {
              ...actualUser,
              role: 'user' as const,
              createdAt: actualUser.createdAt || new Date().toISOString(),
              updatedAt: actualUser.updatedAt || new Date().toISOString(),
            };

            logger.debug('Storing user in auth store', {
              userId: appUser.id,
              email: appUser.email,
            });

            // Store in Zustand store
            login(appUser, token);

            // Handle success callback or navigation
            if (onSuccess) {
              logger.debug('Calling onSuccess callback');
              onSuccess();
            } else {
              logger.debug('Redirecting to dashboard');
              router.push('/dashboard');
              router.refresh();
            }
          } else {
            logger.error('Login response missing required data', { result });
            setLocalError(
              extendedResult?.message ||
                extendedResult?.error ||
                'Login failed. Please check your credentials.'
            );
          }
        },
        onError: (error: Error) => {
          // Only log unexpected errors, API errors are already logged in auth.actions
          if (!(error instanceof ApiError)) {
            logger.error('Login mutation onError', {
              error: error.message || 'Unknown error',
            });
          }
          // Set user-friendly error message
          const errorMessage =
            error instanceof ApiError
              ? error.status === 401 || error.status === 404
                ? 'Invalid username or password. Please check your credentials.'
                : error.message
              : error.message || 'Login failed. Please try again.';
          setLocalError(errorMessage);
        },
      });
    } catch (error) {
      logger.error('Login submission error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      setLocalError('An unexpected error occurred. Please try again.');
    }
  };

  // ===================================================================
  // HANDLERS
  // ===================================================================
  const handleForgotPassword = () => {
    router.push(AUTH_CONSTANTS.ROUTES.FORGOT_PASSWORD);
  };

  const handleRegister = () => {
    router.push(AUTH_CONSTANTS.ROUTES.REGISTER);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseError = () => {
    setLocalError(null);
    resetLoginMutation();
  };

  return (
    <Paper className="p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg w-full">
      {/* Header Section  */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            fontFamily: 'serif',
            color: 'black',
            mb: 1,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Login to Continue
        </Typography>
      </Box>

      {/* ===================================================================
          VALIDATION ERROR SUMMARY
      =================================================================== */}
      {formHasAnyValidationError && (
        <Box className="mb-4">
          <Alert severity="warning" icon={<ErrorIcon />}>
            <Typography variant="body2" fontWeight="medium">
              Please fix the following errors:
            </Typography>
            <ul className="mt-1 ml-4 list-disc text-sm">
              {Object.entries(formValidationErrors).map(([fieldName, error]) => (
                <li key={fieldName}>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: {error.message}
                </li>
              ))}
            </ul>
          </Alert>
        </Box>
      )}

      {/* ===================================================================
          LOCAL ERROR MESSAGE
      =================================================================== */}
      {localError && (
        <Snackbar
          open={!!localError}
          autoHideDuration={7000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={handleCloseError}
            sx={{ width: '100%' }}
          >
            {localError}
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          API ERROR MESSAGE
      =================================================================== */}
      {loginHasSubmissionError && !localError && (
        <Snackbar
          open={loginHasSubmissionError}
          autoHideDuration={7000}
          onClose={resetLoginMutation}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={resetLoginMutation}
            sx={{ width: '100%' }}
          >
            {loginSubmissionError instanceof Error
              ? loginSubmissionError.message
              : 'Login failed. Please check your credentials.'}
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          SUCCESS MESSAGE
      =================================================================== */}
      {isLoginSuccessful && (
        <Snackbar
          open={isLoginSuccessful}
          autoHideDuration={3000}
          onClose={resetLoginMutation}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={resetLoginMutation}
            sx={{ width: '100%' }}
          >
            Login successful! Redirecting...
          </Alert>
        </Snackbar>
      )}

      {/* ===================================================================
          LOGIN FORM
      =================================================================== */}
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmission)}
        noValidate
        className="space-y-3 sm:space-y-4 md:space-y-5"
        sx={{
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* USERNAME FIELD */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Username or Email"
                type="text"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isLoginSubmitting}
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
                    borderRadius: '12px',
                    height: '56px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: AUTH_CONSTANTS.COLORS.PRIMARY,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            )}
          />
        </Box>

        {/* PASSWORD FIELD */}
        <Box sx={{ mb: 2 }}>
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
                disabled={isLoginSubmitting}
                required
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock
                        className="text-gray-400"
                        sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                      />
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

          {/* FORGOT PASSWORD LINK */}
          <Box className="flex justify-end mt-2">
            <Link
              onClick={handleForgotPassword}
              className="text-red-600 text-sm cursor-pointer hover:text-red-700 transition-colors"
              underline="hover"
              sx={{
                fontWeight: 500,
              }}
            >
              Forgot password?
            </Link>
          </Box>
        </Box>

        {/* REMEMBER ME CHECKBOX */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="rememberMe"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    color="primary"
                    disabled={isLoginSubmitting}
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
                    Remember me
                  </Typography>
                }
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            )}
          />
        </Box>

        {/* ===================================================================
            SUBMIT BUTTON
        =================================================================== */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={
            isLoginSubmitting || isLoginSuccessful || !isFormValid || isReactHookFormSubmitting
          }
          startIcon={isLoginSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
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
            '&.Mui-disabled': {
              backgroundColor: AUTH_CONSTANTS.COLORS.PRIMARY_LIGHT,
              color: '#ffffff',
            },
          }}
        >
          {isLoginSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* ===================================================================
            FORM STATUS INDICATOR
        =================================================================== */}
        <Fade in={isLoginSubmitting}>
          <Typography variant="caption" className="text-gray-500 text-center block">
            {isLoginSubmitting ? 'Authenticating...' : ''}
          </Typography>
        </Fade>

        {/* ===================================================================
            OR DIVIDER
        =================================================================== */}
        <Box className="flex items-center gap-4 my-6">
          <Divider className="flex-1" />
          <Typography className="text-gray-500 text-sm font-medium">Or continue with</Typography>
          <Divider className="flex-1" />
        </Box>

        {/* ===================================================================
            SOCIAL LOGIN BUTTONS
        =================================================================== */}
        <Box className="grid grid-cols-3 gap-4">
          {AUTH_CONSTANTS.SOCIAL_PROVIDERS.map((provider) => (
            <Button
              key={provider.name}
              variant="outlined"
              fullWidth
              onClick={() => {
                logger.info('Social login initiated', { provider: provider.name });
              }}
              disabled={isLoginSubmitting}
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
            SIGN UP LINK
        =================================================================== */}
        <Box className="text-center mt-8 pt-6 border-t border-gray-200">
          <Typography className="text-gray-600 text-sm">
            Don&apos;t have an account yet?{' '}
            <Link
              onClick={handleRegister}
              className="text-green-600 cursor-pointer font-medium hover:text-green-700"
              underline="hover"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;
