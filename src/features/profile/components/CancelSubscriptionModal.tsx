/**
 * Cancel Subscription Modal Component
 * Confirmation dialog for subscription cancellation
 *
 * @component
 * @description Displays a confirmation dialog when users attempt to cancel their subscription.
 * Warns users about losing access to premium features.
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { Cancel } from '@mui/icons-material';

/**
 * Props for the CancelSubscriptionModal component
 */
interface CancelSubscriptionModalProps {
  /** Controls modal visibility */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when cancellation is confirmed */
  onConfirm: () => void;
  /** Whether the cancellation is in progress */
  isPending?: boolean;
}

/**
 * CancelSubscriptionModal Component
 *
 * Shows a confirmation dialog before canceling a subscription.
 * Displays warning icon and explains what will be lost.
 *
 * @example
 * ```tsx
 * <CancelSubscriptionModal
 *   open={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleCancelSubscription}
 *   isPending={isCancelling}
 * />
 * ```
 */
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
        sx: { borderRadius: 2 },
      }}
    >
      <DialogContent sx={{ px: 3, pb: 2, pt: 3 }}>
        <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
          {/* Warning Icon */}
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

          {/* Title */}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Cancel Subscription
          </Typography>

          {/* Message */}
          <Typography variant="body1" sx={{ color: 'grey.700' }}>
            Are you sure you want to cancel your access to unlimited match predictions, expert
            player and club insights?
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isPending}
          fullWidth
          sx={{
            textTransform: 'none',
            borderColor: 'grey.400',
            color: 'grey.900',
            borderWidth: 2,
            borderRadius: 1.5,
            py: 1.2,
            '&:hover': { bgcolor: 'grey.50', borderColor: 'grey.500', borderWidth: 2 },
          }}
        >
          No, cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isPending}
          fullWidth
          sx={{
            textTransform: 'none',
            bgcolor: 'error.main',
            color: 'white',
            borderRadius: 1.5,
            py: 1.2,
            '&:hover': { bgcolor: 'error.dark' },
          }}
        >
          {isPending ? 'Cancelling...' : 'Yes, cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelSubscriptionModal;
