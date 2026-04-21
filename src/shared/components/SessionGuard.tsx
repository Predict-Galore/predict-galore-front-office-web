'use client';

/**
 * SessionGuard
 *
 * Registers a global 401 handler on the API client at app boot.
 * When any API call returns 401 AFTER the app has fully initialized,
 * this component:
 *   1. Clears the auth store
 *   2. Clears the React Query cache
 *   3. Redirects to /login with the current path as returnUrl
 *
 * The handler is intentionally suppressed for the first few seconds so
 * that the AuthInitializer's /me call (which returns 401 when the user
 * is not logged in) does NOT trigger a redirect — AuthInitializer handles
 * that case itself by calling logout() and letting withAuth redirect.
 *
 * Mount this once inside Providers, inside QueryProvider.
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

// How long (ms) to wait before the 401 handler becomes active.
// This covers the AuthInitializer /me call on first load.
const INIT_GRACE_PERIOD_MS = 3000;

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  // Keep a ref to the latest values so the handler closure is always current
  const stateRef = useRef({ router, pathname, queryClient, logout });
  useEffect(() => {
    stateRef.current = { router, pathname, queryClient, logout };
  });

  // Whether the grace period has elapsed
  const readyRef = useRef(false);

  useEffect(() => {
    // Activate the handler after the grace period
    const timer = setTimeout(() => {
      readyRef.current = true;
    }, INIT_GRACE_PERIOD_MS);

    setUnauthorizedHandler(() => {
      // Ignore 401s during the initial auth check
      if (!readyRef.current) return;

      const { router, pathname, queryClient, logout } = stateRef.current;

      // Never redirect away from auth pages
      if (AUTH_PAGES.has(pathname)) return;

      logout();
      queryClient.clear();
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?returnUrl=${returnUrl}`);
    });

    return () => {
      clearTimeout(timer);
      setUnauthorizedHandler(() => {});
    };
  }, []); // empty deps: intentional — registers the handler once on mount

  return <>{children}</>;
}
