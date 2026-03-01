// app/hoc/withAuth.tsx
'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '@/features/auth/api/hooks';

/**
 * Simplified HOC to protect pages that require authentication
 * Only checks for authentication, components should use hooks for user data
 */
interface WithAuthOptions {
  requiredRole?: string | string[];
  redirectTo?: string;
  showLoading?: boolean;
  FallbackComponent?: ComponentType;
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const { requiredRole, redirectTo = '/login', showLoading = true, FallbackComponent } = options;

  const AuthComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();

    // Use the auth hook to get auth state
    const { user, isAuthenticated, isLoading, error } = useAuth();

    // Redirect effects
    useEffect(() => {
      // Skip for auth pages
      const isAuthPage = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
      ].some((page) => pathname.startsWith(page));

      if (isAuthPage) return;

      // Redirect if not authenticated
      if (!isAuthenticated && !isLoading && !error) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        const loginUrl = `${redirectTo}?returnUrl=${returnUrl}`;
        router.replace(loginUrl);
      }
    }, [isAuthenticated, isLoading, error, pathname, router]);

    // Check role-based access
    useEffect(() => {
      if (!isAuthenticated || isLoading || !user) return;

      if (requiredRole) {
        const userRole = user.role;
        const hasRole = Array.isArray(requiredRole)
          ? requiredRole.includes(userRole)
          : userRole === requiredRole;

        if (!hasRole) {
          router.replace('/unauthorized');
        }
      }
    }, [user, isAuthenticated, isLoading, router]);

    // Show loading state
    if (isLoading && showLoading) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }

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
            Loading...
          </Typography>
        </Box>
      );
    }

    // Don't render anything if not authenticated (redirect will happen)
    if (!isAuthenticated) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    // Pass through props without auth data
    return <WrappedComponent {...props} />;
  };

  // Add display name
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
