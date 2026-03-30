/**
 * CHECKBOX COMPONENT - Material UI Implementation
 *
 * Matches Figma design specifications exactly
 * Uses Material UI Checkbox with custom theme styling
 */

import React, { forwardRef } from 'react';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from '@mui/material';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'color'> {
  label?: React.ReactNode;
  helperText?: string;
  errorText?: string;
}

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, helperText, errorText, disabled, className, ...props }, ref) => {
    const hasError = !!errorText;
    const message = errorText || helperText;

    const checkbox = (
      <MuiCheckbox
        ref={ref}
        disabled={disabled}
        color="primary"
        className={className}
        sx={{
          borderRadius: 1, // Slightly rounded corners
          padding: 1,
        }}
        {...props}
      />
    );

    if (!label) {
      return (
        <>
          {checkbox}
          {message && (
            <FormHelperText error={hasError} sx={{ ml: 4.5 }}>
              {message}
            </FormHelperText>
          )}
        </>
      );
    }

    return (
      <FormControl error={hasError} disabled={disabled}>
        <FormControlLabel
          control={checkbox}
          label={label}
          sx={{
            '& .MuiFormControlLabel-label': {
              fontSize: '0.875rem',
              color: disabled ? 'text.disabled' : 'text.primary',
            },
          }}
        />
        {message && <FormHelperText sx={{ ml: 0, mt: 0.5 }}>{message}</FormHelperText>}
      </FormControl>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
