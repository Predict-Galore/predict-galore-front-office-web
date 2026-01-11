/**
 * Cancel Subscription Modal Component
 */

'use client';

import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { cn } from '@/shared/lib/utils';
import { text } from '@/shared/constants/styles';

interface CancelSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  open,
  onClose,
  onConfirm,
  isPending = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'rounded-lg',
      }}
    >
      <DialogContent sx={{ px: 3, pb: 2, pt: 3 }}>
        <Box className="flex flex-col items-center text-center">
          {/* Icon */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'error.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cancel sx={{ fontSize: 32, color: 'error.main' }} />
            </Box>
          </Box>

          {/* Title */}
          <h3 className={cn(text.heading.h5, 'font-bold mb-3')}>Cancel Subscription</h3>

          {/* Message */}
          <p className={cn(text.body.medium, 'text-gray-700')}>
            Are you sure you want to cancel your access to unlimited match predictions, expert
            player and club insights?
          </p>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          className="normal-case border-gray-400 text-gray-900 hover:bg-gray-50"
          disabled={isPending}
          fullWidth
          sx={{ borderWidth: 2, borderRadius: 1.5, py: 1.2 }}
        >
          No, cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          className="normal-case bg-red-600 text-white hover:bg-red-700"
          disabled={isPending}
          fullWidth
          sx={{ borderRadius: 1.5, py: 1.2 }}
        >
          {isPending ? 'Cancelling...' : 'Yes, cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelSubscriptionModal;
