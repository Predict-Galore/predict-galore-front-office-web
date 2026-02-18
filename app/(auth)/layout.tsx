// app/(auth)/layout.tsx
import type { ReactNode } from 'react';
import AuthLayoutClient from './AuthLayoutClient';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
