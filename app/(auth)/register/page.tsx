// app/(auth)/register/page.tsx
/**
 * REGISTER PAGE
 *
 * User registration page for creating new accounts.
 */
import React from 'react';
import { Box, Typography } from '@mui/material';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - Predict Galore',
  description: 'Create a new Predict Galore account',
};

export default function RegisterPage() {
  return (
    <>
      {/* Header - Dynamic based on step */}
      <Box className="mb-6">
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
          Create account
        </Typography>

        {/* Subtitle will be shown inside the form component based on step */}
      </Box>

      {/* Register Form */}
      <RegisterForm />

      {/* Already have account link is now inside the form component */}
    </>
  );
}
