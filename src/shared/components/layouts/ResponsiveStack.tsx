/**
 * RESPONSIVE STACK COMPONENT
 * Simple wrapper around MUI Stack with responsive spacing
 */

'use client';

import React, { ReactNode } from 'react';
import { Stack, StackProps } from '@mui/material';

interface ResponsiveStackProps extends Omit<StackProps, 'direction' | 'alignItems'> {
  children: ReactNode;
  direction?: StackProps['direction'];
  responsiveDirection?: {
    mobile?: 'row' | 'column';
    tablet?: 'row' | 'column';
    desktop?: 'row' | 'column';
  };
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = 'row',
  responsiveDirection,
  gap = 'md',
  align,
  sx,
  ...props
}) => {
  // Map gap to theme spacing
  const gapSpacing = {
    sm: { xs: 1, sm: 2 },
    md: { xs: 2, sm: 3, lg: 4 },
    lg: { xs: 3, sm: 4, lg: 5 },
  };

  // Map align to MUI alignItems
  const alignItemsMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  } as const;

  // Determine responsive direction
  const getDirection = (): StackProps['direction'] => {
    if (responsiveDirection) {
      const mobileDir = responsiveDirection.mobile || direction;
      const tabletDir = responsiveDirection.tablet || responsiveDirection.desktop || direction;
      const desktopDir = responsiveDirection.desktop || direction;

      // Return responsive object if directions differ, otherwise return single value
      if (mobileDir !== tabletDir || tabletDir !== desktopDir) {
        return {
          xs: mobileDir,
          sm: tabletDir,
          lg: desktopDir,
        } as unknown as StackProps['direction'];
      }
      return mobileDir;
    }
    return direction;
  };

  return (
    <Stack
      direction={getDirection()}
      spacing={gapSpacing[gap]}
      alignItems={align ? alignItemsMap[align] : undefined}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default ResponsiveStack;
