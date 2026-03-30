/**
 * MODAL COMPONENT - Material UI Implementation
 *
 * Uses Material UI Dialog with custom theme styling to match Figma
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  BoxProps,
} from '@mui/material';
import { Close } from '@mui/icons-material';

export interface ModalProps extends Omit<DialogProps, 'open' | 'onClose'> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  maxWidth,
  ...props
}) => {
  const maxWidthMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
    xl: 'xl' as const,
    full: false as const,
  };

  return (
    <Dialog
      open={open}
      onClose={closeOnOverlayClick ? onClose : undefined}
      maxWidth={maxWidth || maxWidthMap[size]}
      fullWidth={size === 'full'}
      disableEscapeKeyDown={!closeOnEscape}
      PaperProps={{
        sx: {
          borderRadius: 3, // 12px to match Figma
          minWidth: size === 'full' ? '100%' : undefined,
        },
      }}
      {...props}
    >
      {(title || showCloseButton) && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 3,
            borderBottom: '1px solid',
            borderColor: 'neutral.200',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {title && (
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>
            )}
            {description && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: 0.5,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                ml: 2,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'neutral.100',
                  color: 'text.primary',
                },
              }}
              aria-label="Close modal"
            >
              <Close />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent
        sx={{
          padding: 3,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

// Modal sub-components
export interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  onClose,
  showCloseButton = true,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 3,
        borderBottom: '1px solid',
        borderColor: 'neutral.200',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {showCloseButton && onClose && (
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            ml: 2,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'neutral.100',
              color: 'text.primary',
            },
          }}
          aria-label="Close modal"
        >
          <Close />
        </IconButton>
      )}
    </Box>
  );
};

export interface ModalContentProps {
  children: React.ReactNode;
  sx?: BoxProps['sx'];
}

const ModalContent: React.FC<ModalContentProps> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        padding: 3,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  sx?: BoxProps['sx'];
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1.5,
        padding: 3,
        borderTop: '1px solid',
        borderColor: 'neutral.200',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export { Modal, ModalHeader, ModalContent, ModalFooter };
