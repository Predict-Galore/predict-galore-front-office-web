'use client';

import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface AuthLayoutClientProps {
  children: ReactNode;
}

export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  return (
    <Box
      sx={{
        height: { xs: '100dvh', md: '100vh' },
        minHeight: { xs: '100dvh', md: '100vh' },
        display: 'flex',
        bgcolor: 'common.white',
        overflow: 'hidden',
      }}
    >
      {/* LEFT PANEL: Imagery (55% width) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          flex: '0 0 55%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/auth/auth-bg.jpg"
          alt="Basketball Action"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />

        {/* Floating Logo Container */}
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: 40,
            bgcolor: 'common.white',
            borderRadius: '12px',
            px: 3.5,
            py: 2,
            boxShadow: '0px 10px 30px rgba(0,0,0,0.15)',
            zIndex: 10,
          }}
        >
          <Image src="/predict-galore-logo.png" alt="Predict Galore" width={220} height={56} />
        </Box>

        {/* Red Text Overlay Card */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: 6,
            pb: 8,
            pt: 12,
            zIndex: 10,
            background:
              'linear-gradient(180deg, rgba(235, 59, 59, 0) 0%, rgba(235, 59, 59, 0.9) 60%)',
          }}
        >
          <Typography
            sx={{
              fontSize: '3.5rem',
              fontWeight: 900,
              color: 'common.white',
              lineHeight: 1.1,
              mb: 2,
              fontFamily: '"Arial Black", sans-serif',
            }}
          >
            Stay ahead of the game!
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            Get real-time match updates, expert predictions, and personalized notifications for your
            favorite teams—all in one place.
          </Typography>
        </Box>
      </Box>

      {/* RIGHT PANEL: Form Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          px: { xs: 3, md: 8 },
          position: 'relative',
          py: { xs: 6, md: 10 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box
            sx={{
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 560, mx: 'auto' }}>{children}</Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: '#667085', display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                © 2025 Predict Galore. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
