// app/(auth)/layout.tsx
'use client';

import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box className="min-h-screen flex flex-row bg-white">
      {/* Left Column - Image with Text Overlay (50% width) */}
      <Box
        className={cn(
          'hidden lg:flex',
          'w-1/2', // Updated to two equal columns
          'relative',
          'overflow-hidden'
        )}
      >
        {/* Background Image */}
        <Box className="absolute inset-0">
          <Image
            src="/auth/auth-bg.jpg" // Using the provided image
            alt="Basketball Action"
            fill
            className="object-cover"
            priority
          />
        </Box>

        {/* Logo at Top Left */}
        <Box className="absolute top-8 left-8 z-10">
          <Box
            className="bg-white rounded-lg p-3 flex items-center justify-center shadow-md"
            sx={{ width: 'fit-content' }}
          >
            <Image src="/predict-galore-logo.png" alt="Predict Galore" width={140} height={40} />
          </Box>
        </Box>

        {/* Bottom Red Text Overlay as per screenshot */}
        <Box
          className="absolute bottom-0 left-0 right-0 p-12"
          sx={{
            background:
              'linear-gradient(to top, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)',
          }}
        >
          <Typography
            variant="h3"
            className="text-white font-bold mb-4"
            sx={{ fontFamily: 'serif' }} // Matches the stylized font in UI
          >
            Stay ahead of the game!
          </Typography>
          <Typography className="text-white text-lg opacity-90">
            Get real-time match updates, expert predictions, and personalized notifications for your
            favorite teams—all in one place.
          </Typography>
        </Box>
      </Box>

      {/* Right Column - Form Area (50% width) */}
      <Box
        className={cn(
          'flex-1 lg:w-1/2', // Updated to two equal columns
          'flex items-center justify-center',
          'p-6 lg:p-12',
          'bg-white relative'
        )}
      >
        <Box className="w-full max-w-md">
          {children}

          {/* Copyright at the bottom right */}
          <Box className="absolute bottom-8 right-8">
            <Typography variant="body2" color="text.secondary">
              © 2025 Predict Galore. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
