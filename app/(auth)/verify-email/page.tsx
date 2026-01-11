// app/(auth)/verify-email/page.tsx
/**
 * VERIFY EMAIL PAGE
 *
 * Page for email verification with token validation.
 */
import React from 'react';
import { Box, Typography, Button, Alert, Container, Paper } from '@mui/material';
import { Metadata } from 'next';
import VerifyEmailForm from '@/features/auth/components/VerifyEmailForm';

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
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8 mt-8">
          <Box className="text-center space-y-6">
            <Alert severity="info" className="w-full">
              <Typography variant="body2">
                You&apos;ve clicked a verification link. The system is verifying your email...
              </Typography>
            </Alert>
            <Typography variant="body1" className="text-gray-600">
              If verification doesn&apos;t complete automatically, please use the manual
              verification form.
            </Typography>
            <Button variant="contained" href="/verify-email" fullWidth size="large">
              Go to Manual Verification
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Main manual verification form - no email passed via props
  return <VerifyEmailForm />;
}
