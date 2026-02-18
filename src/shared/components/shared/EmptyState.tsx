/**
 * EMPTY STATE COMPONENT
 *
 * Reusable empty state component for displaying when there's no data
 * Migrated to shared components
 */
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, className }) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
        textAlign: 'center',
      }}
      role="status"
      aria-live="polite"
    >
      {icon && <Box sx={{ mb: 3 }}>{icon}</Box>}
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 2,
          maxWidth: '28rem',
        }}
      >
        {description}
      </Typography>
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
};

export default React.memo(EmptyState);
