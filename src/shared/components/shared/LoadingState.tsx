/**
 * LOADING STATE COMPONENT
 *
 * Reusable loading state component with customizable message and icon
 * Migrated to shared components
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

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  icon?: React.ReactNode;
  variant?: 'spinner' | 'skeleton';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  subMessage,
  icon,
  variant = 'spinner',
  className,
}) => {
  if (variant === 'skeleton') {
    return (
      <Stack spacing={3} className={className}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2}>
            <Skeleton variant="text" width="33%" height={32} />
            <Skeleton variant="text" width="25%" height={16} />
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2}>
            <Skeleton variant="text" width="25%" height={24} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" width={96} height={40} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
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

  return (
    <Box
      className={className}
      sx={{
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        {icon || <SportsSoccer sx={{ fontSize: 96, color: 'grey.400', mb: 2 }} />}
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          {message}
        </Typography>
        {subMessage && (
          <Typography variant="body2" color="text.disabled">
            {subMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(LoadingState);
