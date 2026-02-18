/**
 * ALERT COMPONENT - Material UI Implementation
 * 
 * Matches Figma design specifications exactly
 * Uses Material UI Alert with custom theme styling
 */

import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps, AlertTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export interface AlertProps extends Omit<MuiAlertProps, 'severity' | 'onClose' | 'variant'> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  ...props
}) => {
  // Map custom variant to MUI severity
  const severity: 'success' | 'error' | 'warning' | 'info' = variant;

  return (
    <MuiAlert
      severity={severity}
      onClose={onClose}
      action={
        onClose ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        ) : undefined
      }
      sx={{
        borderRadius: 3, // 12px to match Figma
        border: '1px solid',
        borderColor:
          severity === 'success'
            ? 'success.light'
            : severity === 'error'
            ? 'error.light'
            : severity === 'warning'
            ? 'warning.light'
            : 'info.light',
        backgroundColor:
          severity === 'success'
            ? 'success.light'
            : severity === 'error'
            ? 'error.light'
            : severity === 'warning'
            ? 'warning.light'
            : 'info.light',
        color:
          severity === 'success'
            ? 'success.dark'
            : severity === 'error'
            ? 'error.dark'
            : severity === 'warning'
            ? 'warning.dark'
            : 'info.dark',
        '& .MuiAlert-icon': {
          color:
            severity === 'success'
              ? 'success.main'
              : severity === 'error'
              ? 'error.main'
              : severity === 'warning'
              ? 'warning.main'
              : 'info.main',
        },
      }}
      {...props}
    >
      {title && <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};

export { Alert };