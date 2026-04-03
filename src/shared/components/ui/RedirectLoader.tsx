/**
 * Redirect Loader Component
 *
 * Full-screen loader shown during page redirects
 */

'use client';

import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import AppLoading from './AppLoading';

interface RedirectLoaderProps {
  message?: string;
  show?: boolean;
  variant?: 'simple' | 'app';
}

const RedirectLoader: React.FC<RedirectLoaderProps> = ({
  message = 'Redirecting...',
  show = true,
  variant = 'simple',
}) => {
  if (!show) return null;

  return (
    <Fade in={show}>
      {variant === 'app' ? (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <AppLoading />
        </Box>
      ) : (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#42A605',
              mb: 3,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: '#1a1a1a',
              fontWeight: 600,
              fontSize: '1.125rem',
            }}
          >
            {message}
          </Typography>
        </Box>
      )}
    </Fade>
  );
};

export default RedirectLoader;
