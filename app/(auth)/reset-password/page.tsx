/**
 * RESET PASSWORD PAGE
 *
 * Page for resetting password with token validation.
 */
import React from 'react';
import { Box, Typography } from '@mui/material';
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

  return (
    <>
      {/* Header */}
      <Box className="mb-8">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.1,
            mb: 1.5,
          }}
        >
          Set New Password
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            lineHeight: 1.6,
          }}
        >
          Enter your new password below
        </Typography>
      </Box>

      {/* Reset Password Form */}
      <ResetPasswordForm token={token} />
    </>
  );
}
