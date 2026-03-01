// src/hoc/withEmailVerified.tsx
'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Shield } from 'lucide-react';
import { useProfileQuery } from '@/features/auth/api/hooks';
import { useAuthStore } from '@/features/auth/model/store';
import { Button, Loading } from '@/shared/components/ui';

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
    const { user, isAuthenticated } = useAuthStore();

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
        if (!isAuthenticated && !user) {
          setIsChecking(false);
          return;
        }

        // Validate session to ensure we have latest user data
        if (!isSessionLoading) {
          try {
            await checkSession();
          } catch {
            // Session validation failed - handled by error state
          }
        }

        setIsChecking(false);
      };

      verifyAuth();
    }, [isAuthenticated, user, isSessionLoading, checkSession]);

    // Determine if user is actually authenticated
    const isUserAuthenticated = isAuthenticated || !!user;

    useEffect(() => {
      if (!isChecking && !isSessionLoading && !isUserAuthenticated) {
        router.replace('/login');
      }
    }, [isChecking, isSessionLoading, isUserAuthenticated, router]);

    // Show loading state
    if ((isChecking || isSessionLoading) && showLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loading variant="spinner" size="lg" />
          <h2 className="text-xl font-semibold text-gray-700">
            Checking email verification status...
          </h2>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isUserAuthenticated) {
      return null;
    }

    // Check if email is verified
    if (!currentUser?.isEmailVerified) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
          <div className="text-center">
            <div className="mb-4">
              <Shield className="w-16 h-16 text-primary mx-auto" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verification Required
            </h1>

            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Please verify your email address before accessing this page. We&apos;ve sent a
              verification link to your email.
            </p>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="primary" 
              onClick={() => router.push(redirectTo)}
              className="px-6"
            >
              <Mail className="w-4 h-4" />
              Verify Email
            </Button>

            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="px-6"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
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
