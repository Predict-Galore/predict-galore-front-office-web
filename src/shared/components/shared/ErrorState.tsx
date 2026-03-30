/**
 * ERROR STATE COMPONENT
 *
 * Reusable error state component with retry and back actions
 *
 * @component
 * @description Displays a user-friendly error message with optional retry and back buttons.
 * Used throughout the application when errors occur during data fetching or operations.
 */
'use client';

import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { ErrorOutline, Refresh, ArrowBack } from '@mui/icons-material';

/**
 * Props for the ErrorState component
 */
interface ErrorStateProps {
  /** Error message to display */
  error: string;
  /** Optional callback to retry the failed operation */
  onRetry?: () => void;
  /** Optional callback to navigate back */
  onBack?: () => void;
  /** Optional custom title (default: "Something went wrong") */
  title?: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ErrorState Component
 *
 * Displays an error icon, title, message, and optional action buttons.
 * Provides a consistent error experience across the application.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Failed to load data"
 *   error="Network connection error"
 *   onRetry={() => refetch()}
 *   onBack={() => router.back()}
 * />
 * ```
 */
const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onBack,
  title = 'Something went wrong',
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
        <ErrorOutline sx={{ color: 'error.main', fontSize: '4rem', mb: 2, mx: 'auto' }} />
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {error || 'An unexpected error occurred'}
        </Typography>

        {(onRetry || onBack) && (
          <Stack spacing={1.5}>
            {onRetry && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={onRetry}
                fullWidth
                sx={{ textTransform: 'none' }}
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
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Go Back
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(ErrorState);
