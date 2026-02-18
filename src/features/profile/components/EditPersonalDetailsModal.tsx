/**
 * Edit Personal Details Modal Component
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
} from '@mui/material';
import { Close, Person, Email } from '@mui/icons-material';
import { useUpdateProfile } from '@/features/profile';
import { cn } from '@/shared/lib/utils';
import { text } from '@/shared/constants/styles';
import { buttonColors } from '@/shared/components';
import type { ProfileUser } from '@/features/profile/model/types';

interface EditPersonalDetailsModalProps {
  open: boolean;
  onClose: () => void;
  profile?: ProfileUser;
}

const EditPersonalDetailsModal: React.FC<EditPersonalDetailsModalProps> = ({
  open,
  onClose,
  profile,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setEmail(profile.email || '');
    }
  }, [profile, open]);

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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'rounded-lg',
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
        <span className={cn(text.heading.h5, 'font-bold')}>Edit Personal Details</span>
        <IconButton onClick={onClose} size="small" className="text-gray-500 hover:text-gray-700">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            className="mb-4"
          />
          <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            disabled
            helperText="Email cannot be changed"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} className="normal-case text-gray-600" disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isPending || !firstName.trim() || !lastName.trim()}
          className={cn(
            'normal-case',
            buttonColors.primary.bg,
            buttonColors.primary.text,
            buttonColors.primary.bgHover
          )}
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPersonalDetailsModal;
