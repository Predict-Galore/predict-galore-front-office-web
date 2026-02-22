/**
 * VERIFY OTP PAGE
 *
 * Page for verifying OTP sent to email for password reset
 */
import React from 'react';
import VerifyOTPForm from '@/features/auth/components/VerifyOTPForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify OTP - Predict Galore',
  description: 'Verify your identity with the OTP sent to your email',
};

type VerifyOTPPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyOTPPage({ searchParams }: VerifyOTPPageProps) {
  const params = await searchParams;
  const email = params?.email;

  return <VerifyOTPForm email={email} />;
}
