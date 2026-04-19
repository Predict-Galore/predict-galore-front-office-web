// app/hoc/withAuth.tsx
'use client';

import { useEffect, useRef, ComponentType } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '@/features/auth/api/hooks';

/**
 * HOC that protects pages requiring authentication.
 *
 * Redirect logic is intentionally deferred by one tick (via a mounted ref)
 * so that AuthInitializer has time to set isLoading = true before we check
 * the auth state. Without this guard the component would redirect on the
 * very first render when the store is still in its default
 * { isAuthenticated: false, isLoading: false } state.
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
    const { user, isAuthenticated, isLoading } = useAuth();

    // True after the first render cycle — prevents premature redirects while
    // AuthInitializer is still setting isLoading = true.
    const isMounted = useRef(false);
    useEffect(() => {
      isMounted.current = true;
    }, []);

    // Redirect to login when we are certain the user is not authenticated
    // (mounted + not loading + not authenticated).
    useEffect(() => {
      if (!isMounted.current) return;

      const isAuthPage = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
      ].some((page) => pathname.startsWith(page));

      if (isAuthPage) return;

      if (!isAuthenticated && !isLoading) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`${redirectTo}?returnUrl=${returnUrl}`);
      }
    }, [isAuthenticated, isLoading, pathname, router]);

    // Role-based access check
    useEffect(() => {
      if (!isAuthenticated || isLoading || !user || !requiredRole) return;

      const userRole = user.role;
      const hasRole = Array.isArray(requiredRole)
        ? requiredRole.includes(userRole)
        : userRole === requiredRole;

      if (!hasRole) {
        router.replace('/unauthorized');
      }
    }, [user, isAuthenticated, isLoading, router]);

    // Show spinner while auth state is being resolved
    if (isLoading && showLoading) {
      if (FallbackComponent) return <FallbackComponent />;

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

    // Render nothing while the redirect is in flight
    if (!isAuthenticated) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
