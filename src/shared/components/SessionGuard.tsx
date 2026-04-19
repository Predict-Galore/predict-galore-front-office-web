'use client';

/**
 * SessionGuard
 *
 * Registers a global 401 handler on the API client at app boot.
 * When any API call returns 401 (token expired / missing), this component:
 *   1. Clears the auth store
 *   2. Clears the auth cookie
 *   3. Clears the React Query cache
 *   4. Redirects to /login with the current path as returnUrl
 *
 * Mount this once inside Providers, inside QueryProvider so the queryClient is available.
 */

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { setUnauthorizedHandler } from '@/shared/api';
import { useAuthStore } from '@/features/auth/model/store';

const AUTH_PAGES = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-otp',
]);

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const stateRef = useRef({ router, pathname, queryClient, logout });

  useEffect(() => {
    // Keep ref current inside effect — safe, not during render
    stateRef.current = { router, pathname, queryClient, logout };
  });

  useEffect(() => {
    setUnauthorizedHandler(() => {
      const { router, pathname, queryClient, logout } = stateRef.current;
      if (AUTH_PAGES.has(pathname)) return;
      logout();
      queryClient.clear();
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?returnUrl=${returnUrl}`);
    });

    return () => {
      setUnauthorizedHandler(() => {});
    };
  }, []); // register once on mount

  return <>{children}</>;
}
