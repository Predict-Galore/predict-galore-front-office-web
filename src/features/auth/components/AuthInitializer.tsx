/**
 * Authentication Initializer Component
 *
 * This component handles authentication state initialization on app startup.
 * It validates the user's session via the /me endpoint and hydrates client state.
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../model/store';
import { createLogger } from '@/shared/api';
import { AuthService } from '../api/service';
import { ApiError } from '@/shared/lib/errors';

const logger = createLogger('AuthInitializer');

/** 401 means no valid session — expected when not logged in or session expired */
function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, setLoading, login, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        if (user && isAuthenticated) {
          logger.info('User already authenticated from store');
          return;
        }

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
          logger.info('Authentication initialized successfully', { user: userData });
        } else {
          logger.info('No session user returned');
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
  }, [user, isAuthenticated, setLoading, login, logout]);

  // Load dev helpers in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('../lib/dev-helpers').catch(console.error);
    }
  }, []);

  return <>{children}</>;
};

export default AuthInitializer;
