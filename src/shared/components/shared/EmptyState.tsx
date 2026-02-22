/**
 * EMPTY STATE COMPONENT
 *
 * Reusable empty state component for displaying when there's no data
 * 
 * @component
 * @description Displays a centered empty state message with optional icon and action button.
 * Used throughout the application when lists or data sets are empty.
 */
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Props for the EmptyState component
 */
interface EmptyStateProps {
  /** Main title text */
  title: string;
  /** Descriptive text explaining the empty state */
  description: string;
  /** Optional icon to display above the title */
  icon?: React.ReactNode;
  /** Optional action button or element */
  action?: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

/**
 * EmptyState Component
 * 
 * Displays a user-friendly empty state with icon, title, description, and optional action.
 * Includes proper ARIA attributes for accessibility.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   title="No results found"
 *   description="Try adjusting your search criteria"
 *   icon={<SearchIcon />}
 *   action={<Button>Clear Filters</Button>}
 * />
 * ```
 */
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
