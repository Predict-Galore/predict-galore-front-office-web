// src/hoc/withEmailVerified.tsx
'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { useAuthStore, useProfileQuery } from '@/features/auth';

/**
 * HOC to protect pages that require email verification
 * Redirects to verification page if email is not verified
 */
interface WithEmailVerifiedOptions {
  redirectTo?: string;
  showLoading?: boolean;
}

const withEmailVerified = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithEmailVerifiedOptions = {}
) => {
  const { redirectTo = '/verify-email', showLoading = true } = options;

  const EmailVerifiedComponent = (props: P) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    // Use Zustand store directly
    const { token, user, isAuthenticated } = useAuthStore();

    // Validate session to get latest user data
    const {
      data: sessionUser,
      isLoading: isSessionLoading,
      refetch: checkSession,
    } = useProfileQuery();

    // Use session user if available, otherwise use store user
    const currentUser = sessionUser || user;

    useEffect(() => {
      const verifyAuth = async () => {
        // Check if we have a token
        const hasToken =
          token || (typeof window !== 'undefined' && localStorage.getItem('auth-token'));

        if (!hasToken) {
          setIsChecking(false);
          return;
        }

        // Validate session to ensure we have latest user data
        if (hasToken && !isSessionLoading) {
          try {
            await checkSession();
          } catch {
            // Session validation failed - handled by error state
          }
        }

        setIsChecking(false);
      };

      verifyAuth();
    }, [token, isSessionLoading, checkSession]);

    // Determine if user is actually authenticated
    const isUserAuthenticated =
      isAuthenticated || (typeof window !== 'undefined' && !!localStorage.getItem('auth-token'));

    // Show loading state
    if ((isChecking || isSessionLoading) && showLoading) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Checking email verification status...
          </Typography>
        </Box>
      );
    }

    // Redirect to login if not authenticated
    if (!isUserAuthenticated) {
      if (typeof window !== 'undefined') {
        // User not authenticated - redirecting to login
        setTimeout(() => {
          router.replace('/login');
        }, 0);
      }
      return null;
    }

    // Check if email is verified
    if (!currentUser?.isEmailVerified) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 3,
            p: 3,
          }}
        >
          <Typography variant="h4" color="primary" gutterBottom>
            Email Verification Required
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 500 }}>
            Please verify your email address before accessing this page. We&apos;ve sent a
            verification link to your email.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => router.push(redirectTo)}>
              Verify Email
            </Button>

            <Button variant="outlined" color="primary" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </Box>
        </Box>
      );
    }

    // Email is verified, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Add display name for better debugging
  EmailVerifiedComponent.displayName = `withEmailVerified(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return EmailVerifiedComponent;
};

export default withEmailVerified;
