/**
 * INPUT COMPONENT - Material UI Implementation
 *
 * Matches Figma design specifications exactly
 * Uses Material UI TextField with custom theme styling
 */

'use client';

import React, { forwardRef } from 'react';
import { Box, TextField, TextFieldProps, InputAdornment, Typography } from '@mui/material';
import { ErrorOutline, CheckCircle } from '@mui/icons-material';

export interface InputProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  helperText?: string;
  errorText?: string;
  successText?: string;
  state?: 'default' | 'error' | 'success';
  /**
   * Backwards-compatible prop used by some forms.
   * Do NOT forward to the DOM (React warns on unknown attributes).
   */
  invalid?: boolean;
  readOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      successText,
      state = 'default',
      invalid = false,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      className,
      readOnly,
      ...props
    },
    ref
  ) => {
    // Determine the actual state based on props
    const hasError = !!errorText || invalid;
    const hasSuccess = !!successText;
    const message = errorText || successText || helperText;

    // Determine MUI error state
    const error = hasError || state === 'error';

    // Custom helper text with icons matching Figma
    const renderHelperText = () => {
      if (!message) return null;

      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasError && <ErrorOutline sx={{ fontSize: 16 }} />}
          {hasSuccess && <CheckCircle sx={{ fontSize: 16 }} />}
          {message}
        </span>
      );
    };

    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto' }} className={className}>
        {label ? (
          <Typography
            component="label"
            sx={{
              display: 'block',
              mb: 1,
              fontSize: '1rem',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {label}
          </Typography>
        ) : null}

        <TextField
          ref={ref}
          // Figma: label is above, not floating inside the field
          label={undefined}
          placeholder={props.placeholder}
          error={error}
          helperText={renderHelperText()}
          disabled={disabled}
          fullWidth={fullWidth}
          InputProps={{
            startAdornment: leftIcon ? (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'neutral.400',
                  }}
                >
                  {leftIcon}
                </Box>
              </InputAdornment>
            ) : undefined,
            endAdornment: rightIcon ? (
              <InputAdornment position="end" sx={{ ml: 0.5 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'neutral.400',
                  }}
                >
                  {rightIcon}
                </Box>
              </InputAdornment>
            ) : undefined,
            readOnly,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              minHeight: 64,
              borderRadius: '12px',
              fontSize: '1.125rem',
              '& fieldset': {
                borderWidth: 1,
                borderColor: 'neutral.200',
              },
              '&:hover fieldset': {
                borderColor: error ? 'error.main' : 'neutral.300',
              },
              '&.Mui-focused fieldset': {
                borderWidth: 2,
                borderColor: error
                  ? 'error.main'
                  : hasSuccess || state === 'success'
                    ? 'success.main'
                    : 'primary.main',
              },
              '&.Mui-disabled': {
                bgcolor: 'neutral.50',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'text.primary',
              '&::placeholder': {
                color: 'neutral.400',
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              color: error
                ? 'error.main'
                : hasSuccess || state === 'success'
                  ? 'success.main'
                  : 'text.secondary',
              marginLeft: 0,
              marginRight: 0,
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
            },
          }}
          {...props}
        />
      </Box>
    );
  }
);

Input.displayName = 'Input';

export { Input };
