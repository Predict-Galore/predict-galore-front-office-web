import React from 'react';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - Predict Galore',
  description: 'Create a new Predict Galore account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
