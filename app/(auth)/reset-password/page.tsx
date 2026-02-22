/**
 * RESET PASSWORD PAGE
 *
 * Page for resetting password with token validation.
 */
import React from 'react';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Predict Galore',
  description: 'Set your new Predict Galore account password',
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params?.token;

  return <ResetPasswordForm token={token} />;
}
