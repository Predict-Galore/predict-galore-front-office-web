// app/(auth)/verify-email/page.tsx
/**
 * VERIFY EMAIL PAGE
 *
 * Page for email verification with token validation.
 */
import React from 'react';
import { Mail } from 'lucide-react';
import { Metadata } from 'next';
import VerifyEmailForm from '@/features/auth/components/VerifyEmailForm';
import { Button, Alert } from '@/shared/components/ui';

export const metadata: Metadata = {
  title: 'Verify Email - Predict Galore',
  description: 'Verify your email address for Predict Galore account',
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const urlToken = params.token;

  // If token is provided in URL (email link), show simplified verification
  if (urlToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center space-y-6">
            <div className="mb-4">
              <Mail className="w-16 h-16 text-primary mx-auto" />
            </div>

            <Alert variant="info" title="Email Verification">
              You&apos;ve clicked a verification link. The system is verifying your email...
            </Alert>

            <p className="text-gray-600">
              If verification doesn&apos;t complete automatically, please use the manual
              verification form.
            </p>

            <Button variant="primary" fullWidth size="lg" component="a" href="/verify-email">
              Go to Manual Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main manual verification form - no email passed via props
  return <VerifyEmailForm />;
}
