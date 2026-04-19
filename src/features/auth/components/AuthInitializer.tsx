/**
 * Authentication Initializer Component
 *
 * Runs ONCE on app mount to validate the user's session via GET /me.
 * If a valid session exists it hydrates the Zustand auth store.
 * If not (401 or no user data) it clears the store — the withAuth HOC
 * will then redirect to /login.
 *
 * IMPORTANT: the effect must only run once. Having `user` or `isAuthenticated`
 * in the dependency array would cause an infinite loop:
 *   login() → store updates → effect re-runs → /me called again → login() → …
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../model/store';
import { createLogger } from '@/shared/api';
import { AuthService } from '../api/service';
import { ApiError } from '@/shared/lib/errors';

const logger = createLogger('AuthInitializer');

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setLoading, login, logout } = useAuthStore();

  // Guard so the effect never runs more than once per mount, even in React
  // Strict Mode (which double-invokes effects in development).
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAuth = async () => {
      // If the store already has a user (e.g. from a previous navigation within
      // the same session) skip the network call entirely.
      const { user, isAuthenticated } = useAuthStore.getState();
      if (user && isAuthenticated) {
        logger.info('User already authenticated — skipping /me call');
        return;
      }

      try {
        setLoading(true);
        logger.info('Validating session via /me');

        const profile = await AuthService.getProfile();
        const userData = profile?.data?.user;

        if (userData) {
          login({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isEmailVerified: userData.isEmailVerified,
            phoneNumber: userData.phoneNumber,
            countryCode: userData.countryCode,
            role: 'user',
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString(),
          });
          logger.info('Session validated — user authenticated');
        } else {
          logger.info('No user in /me response — clearing session');
          logout();
        }
      } catch (error) {
        if (isUnauthorized(error)) {
          logger.debug('No valid session (401) — user not authenticated');
        } else {
          logger.error('Failed to initialize authentication', { error });
        }
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Load dev helpers in development only
    if (process.env.NODE_ENV === 'development') {
      import('../lib/dev-helpers').catch(console.error);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Empty deps: intentional — must only run once on mount.

  return <>{children}</>;
};

export default AuthInitializer;
