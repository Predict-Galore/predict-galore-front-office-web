/**
 * Auth Guard Component
 * Migrated to feature architecture
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuthStore } from '../model/store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requiredRoles = [],
  fallback,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Only run auth check if authentication status is loaded
    if (isLoading) return;

    // If auth is required and user is not authenticated, redirect to login
    if (requireAuth && !isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check role-based access
    if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
      const userRole = user?.role;
      const hasRequiredRole = userRole && requiredRoles.includes(userRole);

      if (!hasRequiredRole) {
        router.push('/unauthorized');
        return;
      }
    }

    // If user is authenticated but trying to access auth pages, redirect to dashboard
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    if (isAuthenticated && authPages.includes(pathname)) {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, requireAuth, requiredRoles, router, user?.role]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-screen">
        <CircularProgress size={60} />
        <Typography className="mt-4 text-gray-600">Verifying authentication...</Typography>
      </Box>
    );
  }

  // If auth is not required or user is authenticated, show children
  if (!requireAuth || (requireAuth && isAuthenticated)) {
    // Check role access if required
    if (requiredRoles.length > 0) {
      const userRole = user?.role;
      const hasRequiredRole = userRole && requiredRoles.includes(userRole);

      if (!hasRequiredRole) {
        return (
          fallback || (
            <Box className="flex flex-col items-center justify-center min-h-screen">
              <Typography variant="h5" className="text-red-600 mb-4">
                Access Denied
              </Typography>
              <Typography className="text-gray-600">
                You don&apos;t have permission to access this page.
              </Typography>
            </Box>
          )
        );
      }
    }

    return <>{children}</>;
  }

  // Show fallback or loading while redirecting
  return (
    fallback || (
      <Box className="flex flex-col items-center justify-center min-h-screen">
        <CircularProgress size={60} />
        <Typography className="mt-4 text-gray-600">Redirecting to login...</Typography>
      </Box>
    )
  );
};

export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function WithAuthGuardComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

export default AuthGuard;
