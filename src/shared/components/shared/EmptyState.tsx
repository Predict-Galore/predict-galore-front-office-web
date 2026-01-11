/**
 * EMPTY STATE COMPONENT
 *
 * Reusable empty state component for displaying when there's no data
 * Migrated to shared components
 */
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { cn } from '@/shared/lib/utils';

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
      className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
      role="status"
      aria-live="polite"
    >
      {icon && <Box className="mb-6">{icon}</Box>}
      <Typography variant="h6" className="text-gray-700 mb-2">
        {title}
      </Typography>
      <Typography variant="body2" className="text-gray-500 mb-4 max-w-md">
        {description}
      </Typography>
      {action && <Box className="mt-2">{action}</Box>}
    </Box>
  );
};

export default React.memo(EmptyState);
