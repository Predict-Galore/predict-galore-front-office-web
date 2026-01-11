/**
 * Premium Modal Component
 * Displays when user reaches prediction limit
 */

'use client';

import React from 'react';
import { Dialog, Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Close, Lock } from '@mui/icons-material';
import { cn } from '@/shared/lib/utils';

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  onGetPremium: () => void;
  limit?: number;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ open, onClose, onGetPremium, limit = 5 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    >
      <Box sx={isMobile ? { height: '100%', display: 'flex', alignItems: 'flex-end' } : undefined}>
        <Box
          className={cn('relative w-full bg-white', isMobile ? 'rounded-t-3xl' : 'rounded-2xl')}
          sx={{
            px: { xs: 3, sm: 6 },
            pt: { xs: 3, sm: 5 },
            pb: { xs: 4, sm: 5 },
          }}
        >
          {/* Close */}
          <IconButton
            onClick={onClose}
            className="absolute right-3 top-3 bg-gray-100 border border-gray-200"
            size="small"
            aria-label="Close"
          >
            <Close fontSize="small" />
          </IconButton>

          {/* Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock sx={{ fontSize: 32, color: 'success.main' }} />
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Unlock Unlimited Predictions
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              You have reached your limit of {limit} free predictions. Subscribe to get premium
              access to all predictions
            </Typography>
          </Box>

          {/* CTA */}
          <Box className="mt-8">
            <Button
              onClick={onGetPremium}
              variant="contained"
              fullWidth
              className={cn(
                'normal-case rounded-xl py-3 text-base font-semibold',
                'bg-green-600 hover:bg-green-700 text-white'
              )}
            >
              Get premium access
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PremiumModal;
