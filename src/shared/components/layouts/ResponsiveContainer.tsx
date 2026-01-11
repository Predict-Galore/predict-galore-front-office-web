/**
 * RESPONSIVE CONTAINER COMPONENT
 * Simple wrapper around MUI Container with responsive padding
 */

'use client';

import React, { ReactNode } from 'react';
import { Container } from '@mui/material';
import type { ContainerProps } from '@mui/material/Container';

interface ResponsiveContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  children: ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'xl',
  sx,
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        px: { xs: 2, sm: 3, lg: 4 },
        py: { xs: 2, sm: 3, lg: 4 },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

export default ResponsiveContainer;
