/**
 * Profile Panel Component
 * Updated to match Figma UI design
 */

'use client';

import React, { useCallback } from 'react';
import {
  Paper,
  Avatar,
  Button,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { Person, Group, CreditCard, Settings, Logout, Bolt } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useUser } from '@/features/auth/model/store';
import { useLogoutMutation } from '@/features/auth';
import { useCurrentSubscription } from '@/features/profile';
import { cn } from '@/shared/lib/utils';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick?: (action: string) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isOpen, onClose, onMenuItemClick }) => {
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

  if (!isOpen) return null;

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', pt: 8, pr: { xs: 2, md: 3 } }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.2)' }} onClick={onClose} />
      <Paper
        sx={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 384,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'success.200',
          boxShadow: 5,
          bgcolor: 'white',
          p: 2,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar
            className="w-16 h-16 bg-green-100 text-green-700 font-bold text-lg"
            sx={{ border: '2px solid', borderColor: 'green.300' }}
          >
            {getUserInitial()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {getUserName()}
            </Typography>
            {isPremium && (
              <Box sx={{ mt: 0.5 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Bolt className="w-4 h-4" />}
                  className={cn(
                    'normal-case text-xs px-2 py-0.5 h-6',
                    'bg-green-50 border-green-500 text-green-700',
                    'hover:bg-green-100'
                  )}
                  disabled
                >
                  Premium
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider className="my-3" />

        {/* Menu Items */}
        <Stack spacing={0.5}>
          <ListItem
            onClick={() => handleMenuItemClick('profile-details')}
            className="rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <ListItemIcon>
              <Person className="text-gray-600" />
            </ListItemIcon>
            <ListItemText primary="Profile details" className="text-gray-700" />
            <ListItemIcon className="min-w-0 ml-2">
              <span className="text-gray-400">›</span>
            </ListItemIcon>
          </ListItem>

          <ListItem
            onClick={() => handleMenuItemClick('followings')}
            className="rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <ListItemIcon>
              <Group className="text-gray-600" />
            </ListItemIcon>
            <ListItemText primary="Followings" className="text-gray-700" />
            <ListItemIcon className="min-w-0 ml-2">
              <span className="text-gray-400">›</span>
            </ListItemIcon>
          </ListItem>

          <ListItem
            onClick={() => handleMenuItemClick('subscriptions')}
            className="rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <ListItemIcon>
              <CreditCard className="text-gray-600" />
            </ListItemIcon>
            <ListItemText primary="Subscriptions" className="text-gray-700" />
            <ListItemIcon className="min-w-0 ml-2">
              <span className="text-gray-400">›</span>
            </ListItemIcon>
          </ListItem>

          <ListItem
            onClick={() => handleMenuItemClick('settings')}
            className="rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <ListItemIcon>
              <Settings className="text-gray-600" />
            </ListItemIcon>
            <ListItemText primary="Settings" className="text-gray-700" />
            <ListItemIcon className="min-w-0 ml-2">
              <span className="text-gray-400">›</span>
            </ListItemIcon>
          </ListItem>
        </Stack>

        <Divider className="my-3" />

        {/* Log Out Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => handleMenuItemClick('logout')}
          className={cn(
            'normal-case border-red-500 text-red-600',
            'hover:bg-red-50 hover:border-red-600'
          )}
        >
          Log Out
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfilePanel;
