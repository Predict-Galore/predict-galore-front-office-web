/**
 * CARD COMPONENT - Material UI Implementation
 * 
 * Uses Material UI Card/Paper components with custom theme styling
 */

import React, { forwardRef } from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, Box, Typography, BoxProps } from '@mui/material';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      rounded = 'lg',
      shadow = 'sm',
      hover = false,
      interactive = false,
      className,
      children,
      sx,
      ...props
    },
    ref
  ) => {
    const paddingMap = {
      none: 0,
      sm: 1.5,
      md: 2,
      lg: 3,
      xl: 4,
    };

    const borderRadiusMap = {
      none: 0,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 3,
      full: 9999,
    };

    const elevationMap = {
      none: 0,
      sm: 1,
      md: 2,
      lg: 4,
      xl: 8,
    };

    return (
      <MuiCard
        ref={ref}
        variant={variant === 'outlined' ? 'outlined' : 'elevation'}
        elevation={variant === 'elevated' ? elevationMap[shadow] : 0}
        className={className}
        sx={{
          borderRadius: borderRadiusMap[rounded],
          padding: paddingMap[padding],
          backgroundColor: variant === 'filled' ? 'neutral.50' : 'background.paper',
          border: variant === 'outlined' ? '2px solid' : '1px solid',
          borderColor: 'neutral.200',
          transition: 'all 0.2s',
          cursor: interactive ? 'pointer' : 'default',
          ...(hover && {
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)',
            },
          }),
          ...(interactive && {
            '&:hover': {
              boxShadow: 6,
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }),
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiCard>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components using MUI components
export interface CardHeaderProps extends BoxProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

const CardHeaderComponent = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          paddingBottom: 2,
          borderBottom: '1px solid',
          borderColor: 'neutral.200',
          ...sx,
        }}
        {...props}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
          {children}
        </Box>
        {action && (
          <Box sx={{ flexShrink: 0 }}>
            {action}
          </Box>
        )}
      </Box>
    );
  }
);

CardHeaderComponent.displayName = 'CardHeader';

export interface CardContentProps extends BoxProps {
  children: React.ReactNode;
}

const CardContentComponent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          paddingY: 2,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

CardContentComponent.displayName = 'CardContent';

export interface CardFooterProps extends BoxProps {
  children: React.ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          paddingTop: 2,
          borderTop: '1px solid',
          borderColor: 'neutral.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeaderComponent as CardHeader, CardContentComponent as CardContent, CardFooter };
