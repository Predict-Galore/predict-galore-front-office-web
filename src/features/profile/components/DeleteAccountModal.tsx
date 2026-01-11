/**
 * Delete Account Modal Component
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { Close, Notifications } from '@mui/icons-material';
import { useDeleteAccount } from '@/features/profile';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const DELETE_REASONS = [
  'I no longer need the app',
  'I found a better alternative',
  "I'm concerned about my privacy and data",
  'I receive too many notifications',
  'Others',
] as const;

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ open, onClose }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleReasonToggle = useCallback((reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedReasons.length === 0) return;
    setShowConfirmation(true);
  }, [selectedReasons]);

  const handleConfirmDelete = useCallback(() => {
    deleteAccount(undefined, {
      onSuccess: () => {
        onClose();
        // Redirect will be handled by auth store
      },
    });
  }, [deleteAccount, onClose]);

  const handleClose = useCallback(() => {
    if (showConfirmation) {
      setShowConfirmation(false);
    } else {
      onClose();
    }
  }, [showConfirmation, onClose]);

  const canContinue =
    selectedReasons.length > 0 &&
    (!selectedReasons.includes('Others') || otherReason.trim().length > 0);

  if (showConfirmation) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: 'rounded-lg',
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, pb: 2 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'error.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Notifications sx={{ fontSize: 32, color: 'error.main' }} />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5 }}>
            Delete Account
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            By deleting your account, you&apos;ll lose access to your profile, followings and
            subscription. However, if you change your mind, you can restore your account by logging
            back in within 30 days.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: 'grey.400',
              color: 'grey.700',
              '&:hover': { bgcolor: 'grey.50', borderColor: 'grey.500' },
            }}
            disabled={isPending}
          >
            No, cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' },
            }}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Yes, delete'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'rounded-lg',
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Delete Account
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: 'grey.500', '&:hover': { color: 'grey.700' } }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              We are sad to see you go
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Please let us know why you&apos;re leaving. Your feedback helps us improve
            </Typography>
          </Box>

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {DELETE_REASONS.map((reason) => (
              <FormControlLabel
                key={reason}
                control={
                  <Checkbox
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleReasonToggle(reason)}
                    className="text-green-600"
                  />
                }
                label={reason}
                className="block"
              />
            ))}
          </Stack>

          {selectedReasons.includes('Others') && (
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Please share your reason ..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="mt-4"
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleContinue}
          variant="contained"
          disabled={!canContinue || isPending}
          fullWidth
          sx={{
            textTransform: 'none',
            ...(canContinue
              ? {
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                }
              : {
                  bgcolor: 'grey.300',
                  color: 'grey.500',
                  cursor: 'not-allowed',
                }),
          }}
        >
          Continue to delete account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountModal;
