/**
 * FORGOT PASSWORD PAGE
 *
 * Page for requesting password reset instructions.
 */
import React from 'react';
import { Box, Typography } from '@mui/material';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Predict Galore',
  description: 'Reset your Predict Galore account password',
};

export default function ForgotPasswordPage() {
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
          Forgot Password
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            lineHeight: 1.6,
          }}
        >
          Enter your email to receive reset instructions
        </Typography>
      </Box>

      {/* Forgot Password Form */}
      <ForgotPasswordForm />
    </>
  );
}
