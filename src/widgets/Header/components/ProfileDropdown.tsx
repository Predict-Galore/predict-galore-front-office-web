/**
 * Profile Dropdown Component
 * Uses MUI primitives for interaction and semantics for layout sections.
 */

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ChevronRight,
  CreditCardOutlined,
  KeyboardArrowDown,
  Logout,
  OpenInNew,
  PeopleOutline,
  PersonOutline,
  SettingsOutlined,
  TuneOutlined,
} from '@mui/icons-material';
import { cn } from '@/shared/lib/utils';

interface ProfileDropdownProps {
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: string;
  } | null;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  external?: boolean;
}

const PROFILE_ROUTES = [
  '/dashboard/profile?tab=profile-details',
  '/dashboard/profile?tab=followings',
  '/dashboard/profile?tab=subscriptions',
  '/dashboard/profile?tab=settings',
];

function getUserInitials(name?: string, email?: string) {
  if (name) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (email) return email[0].toUpperCase();
  return 'U';
}

function getRoleBadgeLabel(role?: string) {
  if (!role) return 'Free';

  const normalized = role.toLowerCase();
  if (normalized === 'premium' || normalized === 'pro') return 'Premium';
  if (normalized === 'admin') return 'Admin';

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isOpen = Boolean(anchorEl);
  const closeDropdown = useCallback(() => setAnchorEl(null), []);
  const toggleDropdown = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  }, []);

  const navigateToProfileTab = useCallback(
    (href: string) => {
      router.push(href);
      closeDropdown();
    },
    [closeDropdown, router]
  );

  const handleProfileClick = useCallback(() => {
    onProfileClick?.();
    closeDropdown();
  }, [closeDropdown, onProfileClick]);

  const handleSettingsClick = useCallback(() => {
    onSettingsClick?.();
    closeDropdown();
  }, [closeDropdown, onSettingsClick]);

  const handleLogoutClick = useCallback(() => {
    onLogout?.();
    closeDropdown();
  }, [closeDropdown, onLogout]);

  useEffect(() => {
    PROFILE_ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        id: 'profile',
        label: 'Profile details',
        icon: <PersonOutline sx={{ fontSize: isMobile ? 20 : 22 }} />,
        onClick: handleProfileClick,
      },
      {
        id: 'followings',
        label: 'Followings',
        icon: <PeopleOutline sx={{ fontSize: isMobile ? 20 : 22 }} />,
        onClick: () => navigateToProfileTab('/dashboard/profile?tab=followings'),
      },
      {
        id: 'subscriptions',
        label: 'Subscriptions',
        icon: <CreditCardOutlined sx={{ fontSize: isMobile ? 20 : 22 }} />,
        onClick: () => navigateToProfileTab('/dashboard/profile?tab=subscriptions'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsOutlined sx={{ fontSize: isMobile ? 20 : 22 }} />,
        onClick: handleSettingsClick,
      },
    ],
    [handleProfileClick, handleSettingsClick, navigateToProfileTab, isMobile]
  );

  const initials = getUserInitials(user?.name, user?.email);
  const roleBadgeLabel = getRoleBadgeLabel(user?.role);

  return (
    <section className="relative">
      <IconButton
        ref={triggerRef}
        onClick={toggleDropdown}
        size={isMobile ? 'small' : 'medium'}
        aria-label="Profile menu"
        sx={{
          borderRadius: 999,
          p: { xs: 0.25, sm: 0.5 },
          '&:hover': { bgcolor: 'grey.100' },
        }}
      >
        <Avatar
          src={user?.avatar}
          sx={{
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            bgcolor: 'success.main',
            color: 'common.white',
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          {initials}
        </Avatar>
        <KeyboardArrowDown
          className={cn('transition-transform', isOpen && 'rotate-180')}
          sx={{ fontSize: { xs: 16, sm: 20 } }}
        />
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={closeDropdown}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'center' : 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: isMobile ? '100%' : 620,
              maxWidth: isMobile ? 'calc(100vw - 32px)' : '90vw',
              maxHeight: '80vh',
              borderRadius: isMobile ? 3 : 2,
              mx: isMobile ? 2 : 0,
            },
          },
        }}
      >
        <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar
              src={user?.avatar}
              sx={{
                width: { xs: 44, sm: 56 },
                height: { xs: 44, sm: 56 },
                bgcolor: '#c8e6c9',
                color: 'text.primary',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              {initials}
            </Avatar>

            <div className="flex-1 min-w-0">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                {user?.name || 'User'}
              </Typography>
              <Chip
                icon={<TuneOutlined sx={{ fontSize: { xs: 12, sm: 14 } }} />}
                label={roleBadgeLabel}
                size="small"
                variant="outlined"
                sx={{
                  mt: 0.75,
                  borderColor: 'success.main',
                  color: 'success.main',
                  fontWeight: 700,
                  height: { xs: 22, sm: 24 },
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                }}
              />
            </div>
          </div>
        </header>

        <nav>
          <List
            disablePadding
            sx={{
              maxHeight: isMobile ? '50vh' : 420,
              overflow: 'auto',
            }}
          >
            {menuItems.map((item, index) => (
              <Box key={item.id}>
                <ListItemButton
                  onClick={item.onClick}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 }, color: 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: { xs: '0.85rem', sm: '0.9375rem' },
                      fontWeight: 600,
                    }}
                  />
                  {item.external ? (
                    <OpenInNew sx={{ fontSize: { xs: 16, sm: 18 }, color: 'text.disabled' }} />
                  ) : (
                    <ChevronRight sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.disabled' }} />
                  )}
                </ListItemButton>
                {index < menuItems.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </nav>

        <footer className="px-2 sm:px-3 pb-2 sm:pb-3 pt-1 sm:pt-2">
          <ListItemButton
            onClick={handleLogoutClick}
            sx={{
              justifyContent: 'center',
              gap: 1,
              border: '1px solid',
              borderColor: 'error.main',
              borderRadius: 2,
              color: 'error.main',
              fontWeight: 700,
              py: { xs: 1, sm: 1.25 },
              '&:hover': { bgcolor: 'error.50' },
            }}
          >
            <Logout sx={{ fontSize: { xs: 16, sm: 18 } }} />
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Log Out
            </Typography>
          </ListItemButton>
        </footer>
      </Popover>
    </section>
  );
};

export default ProfileDropdown;
