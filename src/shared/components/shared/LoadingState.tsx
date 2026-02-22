/**
 * LOADING STATE COMPONENT
 *
 * Reusable loading state component with customizable message and variants
 * 
 * @component
 * @description Displays loading indicators with two variants: spinner or skeleton.
 * Spinner variant shows a circular progress indicator with optional message.
 * Skeleton variant shows placeholder content that mimics the actual layout.
 */
'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Paper,
  Stack
} from '@mui/material';
import { SportsSoccer } from '@mui/icons-material';

/**
 * Props for the LoadingState component
 */
interface LoadingStateProps {
  /** Main loading message */
  message?: string;
  /** Optional secondary message */
  subMessage?: string;
  /** Optional custom icon to display */
  icon?: React.ReactNode;
  /** Loading indicator variant */
  variant?: 'spinner' | 'skeleton';
  /** Optional CSS class name */
  className?: string;
}

/**
 * LoadingState Component
 * 
 * Displays loading state with either a spinner or skeleton placeholders.
 * Spinner variant is best for initial loads or simple operations.
 * Skeleton variant provides better UX by showing content structure.
 * 
 * @example
 * ```tsx
 * // Spinner variant
 * <LoadingState
 *   message="Loading matches..."
 *   subMessage="This may take a moment"
 *   variant="spinner"
 * />
 * 
 * // Skeleton variant
 * <LoadingState variant="skeleton" />
 * ```
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  subMessage,
  icon,
  variant = 'spinner',
  className,
}) => {
  // Skeleton variant - shows placeholder content
  if (variant === 'skeleton') {
    return (
      <Stack spacing={3} className={className} aria-label="Loading content">
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2}>
            <Skeleton variant="text" width="33%" height={32} />
            <Skeleton variant="text" width="25%" height={16} />
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2}>
            <Skeleton variant="text" width="25%" height={24} />
            <Stack direction="row" spacing={1}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" width={96} height={40} sx={{ borderRadius: 1 }} />
              ))}
            </Stack>
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2}>
            <Skeleton variant="text" width="33%" height={24} />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height={128} sx={{ borderRadius: 1 }} />
            ))}
          </Stack>
        </Paper>
      </Stack>
    );
  }

  // Spinner variant - shows circular progress with message
  return (
    <Box
      className={className}
      sx={{
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
        {icon || <SportsSoccer sx={{ fontSize: 96, color: 'grey.400' }} />}
        <CircularProgress />
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
        {subMessage && (
          <Typography variant="body2" color="text.disabled">
            {subMessage}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default React.memo(LoadingState);
