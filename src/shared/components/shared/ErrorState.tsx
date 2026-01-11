/**
 * ERROR STATE COMPONENT
 *
 * Reusable error state component with retry and back actions
 * Migrated to shared components
 */
'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ErrorOutline, Refresh, ArrowBack } from '@mui/icons-material';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onBack?: () => void;
  title?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onBack,
  title = 'Something went wrong',
  className,
}) => {
  return (
    <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', ...className }}>
      <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
        <ErrorOutline sx={{ color: 'error.main', fontSize: '4rem', mb: 2, mx: 'auto' }} />
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {error || 'An unexpected error occurred'}
        </Typography>

        {(onRetry || onBack) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {onRetry && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={onRetry}
                className="w-full"
              >
                Try Again
              </Button>
            )}
            {onBack && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={onBack}
                className="w-full"
              >
                Go Back
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(ErrorState);
