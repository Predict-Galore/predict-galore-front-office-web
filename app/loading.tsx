/**
 * LOADING COMPONENT - SIMPLIFIED
 *
 * Clean loading spinner with minimal animations.
 */
'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 4,
        bgcolor: 'background.default',
      }}
    >
      {/* Spinner */}
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          mb: 3,
          color: 'primary.main',
        }}
      />

      {/* Loading Text */}
      <Typography
        variant="h6"
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          mb: 1,
        }}
      >
        Loading...
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          maxWidth: '300px',
        }}
      >
        Please wait while we prepare your experience
      </Typography>
    </Box>
  );
}
