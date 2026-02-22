/**
 * FORGOT PASSWORD PAGE
 *
 * Page for requesting password reset instructions.
 */
import React from 'react';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Predict Galore',
  description: 'Reset your Predict Galore account password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
