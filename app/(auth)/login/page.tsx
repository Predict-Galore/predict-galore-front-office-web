// app/(auth)/login/page.tsx
import React from 'react';
import LoginForm from '@/features/auth/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Predict Galore',
  description: 'Sign in to your Predict Galore account to access predictions and insights.',
  keywords: ['sports predictions', 'login', 'authentication', 'sports analytics'],
};

export default function LoginPage() {
  return <LoginForm />;
}
