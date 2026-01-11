/**
 * BUTTON COMPONENT
 *
 * Reusable button component with multiple variants, sizes, and loading states.
 * Integrates with MUI for consistent styling and accessibility.
 */
import React from 'react';
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
  CircularProgress,
  Box,
} from '@mui/material';

export interface ButtonProps extends MUIButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  disabled,
  startIcon,
  endIcon,
  className = '',
  ...props
}) => {
  // Size mapping
  const sizeClasses = {
    small: 'h-9 px-4 text-sm',
    medium: 'h-11 px-6',
    large: 'h-14 px-8 text-lg',
  };

  // Variant classes for Tailwind
  const variantClasses = {
    contained: 'bg-primary-500 hover:bg-primary-600 text-white',
    outlined: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    text: 'text-primary-500 hover:bg-primary-50',
  };

  return (
    <MUIButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      startIcon={isLoading ? undefined : startIcon}
      endIcon={isLoading ? undefined : endIcon}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold
        rounded-lg
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={20} color="inherit" />
          {loadingText}
        </Box>
      ) : (
        children
      )}
    </MUIButton>
  );
};
