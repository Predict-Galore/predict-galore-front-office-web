/**
 * BUTTON COMPONENT - Material UI Implementation
 *
 * Matches Figma design specifications exactly
 * Uses Material UI Button with custom theme styling
 */

import React, { forwardRef } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'icon' | 'social';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sizeSx =
      size === 'sm'
        ? { minHeight: 44, px: 2.5, fontSize: '0.95rem' }
        : size === 'lg'
          ? { minHeight: 64, px: 4, fontSize: '1.125rem' }
          : { minHeight: 56, px: 3.5, fontSize: '1.05rem' };

    // Map custom variants to MUI variants
    const muiVariant: 'contained' | 'outlined' | 'text' =
      variant === 'primary' || variant === 'danger'
        ? 'contained'
        : variant === 'outline' || variant === 'social'
          ? 'outlined'
          : 'text';

    // Map custom sizes to MUI sizes
    const muiSize: 'small' | 'medium' | 'large' =
      size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';

    // Map color based on variant
    const color: 'primary' | 'secondary' | 'error' =
      variant === 'danger' ? 'error' : variant === 'primary' ? 'primary' : 'primary';

    // For icon-only buttons, use IconButton
    if (variant === 'icon' || (!children && (leftIcon || rightIcon))) {
      return (
        <MuiButton
          ref={ref}
          disabled={disabled || loading}
          variant={muiVariant}
          color={color}
          size={muiSize}
          fullWidth={fullWidth}
          className={className}
          sx={{
            minWidth: '48px',
            minHeight: '48px',
            width: '48px',
            height: '48px',
            padding: 0,
            borderRadius: '12px',
            ...(muiVariant === 'contained' && {
              backgroundColor: color === 'error' ? 'error.main' : 'primary.main',
              '&:hover': {
                backgroundColor: color === 'error' ? 'error.dark' : 'primary.dark',
              },
              '&.Mui-disabled': {
                backgroundColor: color === 'error' ? 'error.light' : 'primary.light',
              },
            }),
            ...(muiVariant === 'outlined' && {
              // borderWidth: 2,
              borderColor: color === 'error' ? 'error.main' : 'primary.main',
              color: color === 'error' ? 'error.main' : 'primary.main',
              '&:hover': {
                borderWidth: 2,
                borderColor: color === 'error' ? 'error.dark' : 'primary.dark',
                backgroundColor: 'transparent',
              },
            }),
          }}
          {...props}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            leftIcon || rightIcon || <ChevronRight />
          )}
        </MuiButton>
      );
    }

    return (
      <MuiButton
        ref={ref}
        disabled={disabled || loading}
        variant={muiVariant}
        color={color}
        size={muiSize}
        fullWidth={fullWidth}
        startIcon={!loading && leftIcon ? leftIcon : undefined}
        endIcon={!loading && rightIcon ? rightIcon : undefined}
        className={className}
        sx={{
          borderRadius: '12px',
          fontWeight: 700,
          textTransform: 'none',
          ...sizeSx,
          ...(variant === 'social' && {
            minWidth: 72,
            width: 72,
            height: 72,
            px: 0,
            borderRadius: '12px',
            borderWidth: 1,
            borderColor: 'neutral.200',
            color: 'text.primary',
            bgcolor: 'common.white',
            '&:hover': {
              borderColor: 'neutral.300',
              bgcolor: 'neutral.50',
            },
          }),
          ...(variant === 'outline' && {
            borderWidth: 2,
            borderColor: 'primary.main',
            '&:hover': {
              borderWidth: 2,
              bgcolor: 'transparent',
            },
          }),
          ...(muiVariant === 'contained' && {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }),
          ...(muiVariant === 'outlined' && {
            '&:hover': {
              // keep width stable
            },
          }),
        }}
        {...props}
      >
        {loading ? (
          <>
            <CircularProgress
              size={muiSize === 'small' ? 16 : muiSize === 'large' ? 24 : 20}
              color="inherit"
              sx={{ mr: 1 }}
            />
            {children}
          </>
        ) : (
          children
        )}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
