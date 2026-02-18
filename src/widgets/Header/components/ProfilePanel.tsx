/**
 * Profile Panel Component
 * Updated to match Figma UI design
 */

'use client';

import React, { useCallback } from 'react';
import {
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Person, Group, CreditCard, Settings, Logout } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useUser } from '@/features/auth/model/store';
import { useLogoutMutation } from '@/features/auth';
import { useCurrentSubscription } from '@/features/profile';

interface ProfilePanelProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onMenuItemClick?: (action: string) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ anchorEl, onClose, onMenuItemClick }) => {
  const router = useRouter();
  const user = useUser();
  const { mutate: logout } = useLogoutMutation();
  const { data: subscription } = useCurrentSubscription();

  const isPremium = subscription?.status === 'active' && subscription?.planCode === 'premium';

  const getUserInitial = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName) return firstName[0].toUpperCase();
    if (lastName) return lastName[0].toUpperCase();
    return 'U';
  };

  const getUserName = () => {
    if (!user) return 'User';
    return (
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'User'
    );
  };

  const handleMenuItemClick = useCallback(
    (action: string) => {
      onClose();
      if (onMenuItemClick) {
        onMenuItemClick(action);
      } else {
        switch (action) {
          case 'profile-details':
            router.push('/dashboard/profile');
            break;
          case 'followings':
            router.push('/dashboard/profile?tab=followings');
            break;
          case 'subscriptions':
            router.push('/dashboard/profile?tab=subscriptions');
            break;
          case 'settings':
            router.push('/dashboard/profile?tab=settings');
            break;
          case 'logout':
            logout();
            break;
          default:
            break;
        }
      }
    },
    [onClose, onMenuItemClick, router, logout]
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{ sx: { minWidth: 280 } }}
    >
      <MenuItem disabled>
        <ListItemIcon>
          <Avatar sx={{ width: 32, height: 32 }}>{getUserInitial()}</Avatar>
        </ListItemIcon>
        <ListItemText
          primary={getUserName()}
          secondary={isPremium ? 'Premium' : undefined}
        />
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => handleMenuItemClick('profile-details')}>
        <ListItemIcon><Person /></ListItemIcon>
        <ListItemText primary="Profile details" />
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('followings')}>
        <ListItemIcon><Group /></ListItemIcon>
        <ListItemText primary="Followings" />
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('subscriptions')}>
        <ListItemIcon><CreditCard /></ListItemIcon>
        <ListItemText primary="Subscriptions" />
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('settings')}>
        <ListItemIcon><Settings /></ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => handleMenuItemClick('logout')}>
        <ListItemIcon><Logout /></ListItemIcon>
        <ListItemText primary="Log Out" />
      </MenuItem>
    </Menu>
  );
};

export default ProfilePanel;
