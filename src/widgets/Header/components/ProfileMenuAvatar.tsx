/**
 * Profile Menu Avatar Component
 * Migrated to use auth feature store
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { IconButton, Badge, Box } from '@mui/material';
import ProfilePanel from './ProfilePanel';
import { useUser } from '@/features/auth/model/store';
import { AccountCircle } from '@mui/icons-material';

interface ProfileMenuAvatarProps {
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  } | null;
  isAuthenticated?: boolean;
}

const ProfileMenuAvatar: React.FC<ProfileMenuAvatarProps> = memo(
  ({ user: propUser, isAuthenticated: propIsAuthenticated }) => {
    const [panelOpen, setPanelOpen] = useState<boolean>(false);

    // Use the auth store directly
    const storeUser = useUser();

    // Prefer prop user if provided, otherwise use store user
    const user = propUser || storeUser;
    const isAuthenticated = propIsAuthenticated ?? !!storeUser;
    const userMeta = user as unknown as { isEmailVerified?: boolean } | null;

    const handleOpen = useCallback(() => {
      setPanelOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setPanelOpen(false);
    }, []);

    if (!isAuthenticated) {
      return null;
    }

    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handleOpen}
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'grey.100',
              border: '1px solid',
              borderColor: 'grey.300',
              '&:hover': {
                bgcolor: 'grey.200',
                transition: 'background-color 0.2s',
              },
            }}
            aria-label="profile menu"
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color={userMeta?.isEmailVerified ? 'success' : 'error'}
              sx={{
                '& .MuiBadge-badge': {
                  width: 10,
                  height: 10,
                  border: '2px solid white',
                },
              }}
            >
              <AccountCircle sx={{ fontSize: 26, color: '#374151' }} />
            </Badge>
          </IconButton>
        </Box>

        {/* Profile Panel */}
        <ProfilePanel isOpen={panelOpen} onClose={handleClose} />
      </>
    );
  }
);

ProfileMenuAvatar.displayName = 'ProfileMenuAvatar';

export default ProfileMenuAvatar;
