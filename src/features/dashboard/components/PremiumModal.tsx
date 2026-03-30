/**
 * Premium Modal Component
 * Displays when user reaches prediction limit
 *
 * @component
 * @description A modal dialog that appears when users reach their free prediction limit,
 * prompting them to upgrade to premium for unlimited access.
 */

'use client';

import React from 'react';
import { Dialog, Box, IconButton, Typography, useMediaQuery, Stack } from '@mui/material';
import { Close, Lock } from '@mui/icons-material';
import { Button } from '@/shared/components/ui';

/**
 * Props for the PremiumModal component
 */
interface PremiumModalProps {
  /** Controls modal visibility */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when user clicks "Get premium access" button */
  onGetPremium: () => void;
  /** Number of free predictions allowed (default: 5) */
  limit?: number;
}

/**
 * PremiumModal Component
 *
 * Displays a modal dialog when users reach their prediction limit.
 * Adapts to mobile screens with fullscreen mode and bottom sheet style.
 *
 * @example
 * ```tsx
 * <PremiumModal
 *   open={showModal}
 *   onClose={() => setShowModal(false)}
 *   onGetPremium={() => router.push('/premium')}
 *   limit={5}
 * />
 * ```
 */
const PremiumModal: React.FC<PremiumModalProps> = ({ open, onClose, onGetPremium, limit = 5 }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={
        isMobile
          ? { sx: { background: 'transparent', boxShadow: 'none' } }
          : { sx: { borderRadius: 3 } }
      }
      BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.75)' } }}
      aria-labelledby="premium-modal-title"
      aria-describedby="premium-modal-description"
    >
      <Box
        sx={
          isMobile
            ? {
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
              }
            : undefined
        }
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            bgcolor: 'white',
            borderRadius: isMobile ? '24px 24px 0 0' : 4,
            px: { xs: 3, sm: 6 },
            pt: { xs: 3, sm: 5 },
            pb: { xs: 4, sm: 5 },
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close modal"
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              bgcolor: 'grey.100',
              border: '1px solid',
              borderColor: 'grey.200',
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>

          <Stack spacing={3} alignItems="center">
            {/* Lock Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'success.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <Lock sx={{ fontSize: 32, color: 'success.main' }} />
            </Box>

            {/* Content */}
            <Stack spacing={1.5} alignItems="center" sx={{ textAlign: 'center' }}>
              <Typography id="premium-modal-title" variant="h5" sx={{ fontWeight: 'bold' }}>
                Unlock Unlimited Predictions
              </Typography>
              <Typography
                id="premium-modal-description"
                variant="body1"
                sx={{ color: 'text.secondary' }}
              >
                You have reached your limit of {limit} free predictions. Subscribe to get premium
                access to all predictions
              </Typography>
            </Stack>

            {/* CTA Button */}
            <Box sx={{ width: '100%', mt: 2 }}>
              <Button onClick={onGetPremium} variant="primary" size="lg" fullWidth>
                Get premium access
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PremiumModal;
