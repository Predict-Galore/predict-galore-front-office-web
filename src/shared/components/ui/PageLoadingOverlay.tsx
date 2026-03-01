/**
 * Page Loading Overlay Component
 * Shows a loading overlay when navigating between pages
 */

'use client';

import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface PageLoadingOverlayProps {
  /** Whether the overlay is visible */
  isLoading: boolean;
  /** Optional loading message */
  message?: string;
}

/**
 * PageLoadingOverlay Component
 * 
 * Displays a full-screen overlay with a loading spinner when navigating between pages.
 * 
 * @example
 * ```tsx
 * <PageLoadingOverlay isLoading={isNavigating} message="Loading page..." />
 * ```
 */
const PageLoadingOverlay: React.FC<PageLoadingOverlayProps> = ({ 
  isLoading, 
  message = 'Loading...' 
}) => {
  // Don't render anything if not loading (for better performance)
  if (!isLoading) return null;

  return (
    <Fade in={isLoading} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          gap: 2,
        }}
      >
        <CircularProgress 
          size={56} 
          thickness={4}
          sx={{ color: 'success.main' }}
        />
        <Typography 
          variant="body1" 
          color="text.secondary"
          fontWeight={600}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default PageLoadingOverlay;
