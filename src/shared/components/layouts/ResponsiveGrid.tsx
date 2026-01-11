/**
 * RESPONSIVE GRID COMPONENT
 * Simple wrapper using CSS Grid with responsive columns
 */

'use client';

import React, { ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

interface ResponsiveGridProps extends BoxProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  sx,
  ...props
}) => {
  // Map gap to theme spacing
  const gapSpacing = {
    sm: { xs: 1, sm: 2 },
    md: { xs: 2, sm: 3, lg: 4 },
    lg: { xs: 3, sm: 4, lg: 5 },
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${cols.mobile || 1}, 1fr)`,
          sm: `repeat(${cols.tablet || cols.mobile || 2}, 1fr)`,
          md: `repeat(${cols.desktop || cols.tablet || 3}, 1fr)`,
        },
        gap: gapSpacing[gap],
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveGrid;
