/**
 * Edit Personal Details Modal Component
 * Allows users to edit their first name, last name, and view email
 *
 * @component
 * @description Modal dialog for editing user profile information.
 * Email field is read-only as it cannot be changed.
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { Close, Person, Email } from '@mui/icons-material';
import { useUpdateProfile } from '@/features/profile';
import type { ProfileUser } from '@/features/profile/model/types';

/**
 * Props for the EditPersonalDetailsModal component
 */
interface EditPersonalDetailsModalProps {
  /** Controls modal visibility */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Current user profile data */
  profile?: ProfileUser;
}

/**
 * EditPersonalDetailsModal Component
 *
 * Provides a form for users to update their personal information.
 * Email is displayed but cannot be edited.
 *
 * @example
 * ```tsx
 * <EditPersonalDetailsModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   profile={userProfile}
 * />
 * ```
 */
const EditPersonalDetailsModal: React.FC<EditPersonalDetailsModalProps> = ({
  open,
  onClose,
  profile,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const handleDialogEnter = useCallback(() => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setEmail(profile?.email || '');
  }, [profile]);

  /**
   * Handles form submission to update profile
   */
  const handleSave = useCallback(() => {
    updateProfile(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }, [firstName, lastName, updateProfile, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{ onEnter: handleDialogEnter }}
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          width: '100%',
          maxWidth: 760,
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 4,
          pb: 2.5,
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            Edit Personal Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your name details below. Your email is read-only.
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500', mt: 0.25, '&:hover': { color: 'grey.700' } }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 2.5 }}>
        <Stack spacing={4} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="First name"
            size="medium"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: 'grey.400' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Last name"
            size="medium"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: 'grey.400' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email address"
            type="email"
            size="medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'grey.400' }} />
                </InputAdornment>
              ),
            }}
            disabled
            helperText="Email cannot be changed"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3.5, pt: 1.5, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isPending}
          sx={{ textTransform: 'none', color: 'grey.600', minWidth: 110 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isPending || !firstName.trim() || !lastName.trim()}
          sx={{
            textTransform: 'none',
            bgcolor: 'success.main',
            color: 'white',
            minWidth: 150,
            '&:hover': { bgcolor: 'success.dark' },
          }}
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPersonalDetailsModal;
