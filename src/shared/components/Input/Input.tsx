/**
 * INPUT COMPONENT
 *
 * Reusable text input component with validation, error states, and custom styling.
 * Integrates with react-hook-form for form management.
 */
import React, { forwardRef } from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  error?: boolean;
  helperText?: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      label,
      error = false,
      helperText,
      showPasswordToggle = false,
      isPasswordVisible = false,
      onTogglePassword,
      startIcon,
      endIcon,
      type = 'text',
      className = '',
      ...props
    },
    ref
  ) => {
    // Determine input type for password fields
    const inputType = showPasswordToggle ? (isPasswordVisible ? 'text' : 'password') : type;

    // Build input adornments
    const inputProps: TextFieldProps['InputProps'] = {};

    if (startIcon) {
      inputProps.startAdornment = <InputAdornment position="start">{startIcon}</InputAdornment>;
    }

    if (showPasswordToggle || endIcon) {
      inputProps.endAdornment = (
        <InputAdornment position="end">
          {showPasswordToggle ? (
            <IconButton onClick={onTogglePassword} edge="end" size="small">
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ) : (
            endIcon
          )}
        </InputAdornment>
      );
    }

    return (
      <TextField
        ref={ref}
        label={label}
        variant="outlined"
        type={inputType}
        error={error}
        helperText={helperText}
        InputProps={inputProps}
        className={`
          w-full
          bg-white
          rounded-lg
          [&_.MuiOutlinedInput-root]:rounded-lg
          [&_.MuiOutlinedInput-notchedOutline]:border-gray-300
          [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:border-primary-500
          [&_.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-2
          [&_.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-primary-500
          ${error ? '[&_.MuiOutlinedInput-notchedOutline]:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
