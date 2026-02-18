/**
 * Profile Details Tab Component
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Box, IconButton, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useProfile } from '@/features/profile';
import EditPersonalDetailsModal from './EditPersonalDetailsModal';
import DeleteAccountModal from './DeleteAccountModal';

const ProfileDetailsTab: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature required by parent
  const handleEditClick = useCallback((field: 'firstName' | 'lastName' | 'email') => {
    setIsEditModalOpen(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  if (isLoading) {
    return <Paper sx={{ p: 3, borderRadius: 2 }}>Loading...</Paper>;
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Stack spacing={3}>
        {[
          { label: 'First Name', value: profile?.firstName, field: 'firstName' },
          { label: 'Last Name', value: profile?.lastName, field: 'lastName' },
          { label: 'Email Address', value: profile?.email, field: 'email' },
        ].map((item) => (
          <Box key={item.field}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              {item.label}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight={600}>
                {item.value || 'Not set'}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleEditClick(item.field as 'firstName' | 'lastName' | 'email')}
                sx={{ color: 'grey.500', '&:hover': { color: 'grey.700' } }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Stack>
            <Divider sx={{ mt: 1.5 }} />
          </Box>
        ))}

        <Box sx={{ pt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Delete />}
            onClick={handleDeleteClick}
            sx={{
              borderColor: '#e11d48',
              color: '#e11d48',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              py: 1.5,
              '&:hover': { borderColor: '#b91c1c', bgcolor: '#fff1f2', color: '#b91c1c' },
            }}
          >
            Delete Account
          </Button>
        </Box>

        <EditPersonalDetailsModal
          open={isEditModalOpen}
          onClose={handleEditClose}
          profile={profile || undefined}
        />

        <DeleteAccountModal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      </Stack>
    </Paper>
  );
};

export default ProfileDetailsTab;
