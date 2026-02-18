/**
 * Profile Dropdown Component
 * Clean white card dropdown matching the design system
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  PersonOutline,
  PeopleOutline,
  CreditCardOutlined,
  SettingsOutlined,
  HelpOutline,
  PublicOutlined,
  Logout,
  ChevronRight,
  OpenInNew,
  TuneOutlined,
  KeyboardArrowDown,
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

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'Profile details',
      icon: <PersonOutline sx={{ fontSize: 22 }} />,
      onClick: () => {
        onProfileClick?.();
        setIsOpen(false);
      },
    },
    {
      id: 'followings',
      label: 'Followings',
      icon: <PeopleOutline sx={{ fontSize: 22 }} />,
      onClick: () => {
        router.push('/dashboard/profile?tab=followings');
        setIsOpen(false);
      },
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: <CreditCardOutlined sx={{ fontSize: 22 }} />,
      onClick: () => {
        router.push('/dashboard/profile?tab=subscriptions');
        setIsOpen(false);
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsOutlined sx={{ fontSize: 22 }} />,
      onClick: () => {
        onSettingsClick?.();
        setIsOpen(false);
      },
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: <HelpOutline sx={{ fontSize: 22 }} />,
      onClick: () => {
        router.push('/contact-us');
        setIsOpen(false);
      },
      external: true,
    },
    {
      id: 'legals',
      label: 'Legals',
      icon: <PublicOutlined sx={{ fontSize: 22 }} />,
      onClick: () => {
        router.push('/terms');
        setIsOpen(false);
      },
      external: true,
    },
  ];

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const roleBadgeLabel = (() => {
    const role = user?.role;
    if (!role) return 'Free';
    const r = role.toLowerCase();
    if (r === 'premium' || r === 'pro') return 'Premium';
    if (r === 'admin') return 'Admin';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  })();

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-2 p-1 rounded-full',
          'hover:bg-gray-100 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-green-500/20'
        )}
        aria-label="Profile menu"
      >
        <Avatar
          src={user?.avatar}
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'success.main',
            color: 'common.white',
            fontWeight: 600,
          }}
        >
          {getInitials(user?.name, user?.email)}
        </Avatar>
        <KeyboardArrowDown
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200',
            isMobile
              ? 'fixed left-4 right-4 top-[72px] w-auto'
              : 'absolute right-0 w-[320px]'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={cn(
              'bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-4',
              isMobile && 'max-h-[85vh]'
            )}
          >
            {/* User header */}
            <div className="px-2 pt-2 pb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: '#c8e6c9',
                    color: 'text.primary',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  {getInitials(user?.name, user?.email)}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, lineHeight: 1.3 }}
                  >
                    {user?.name || 'User'}
                  </Typography>
                  <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded border border-green-500 text-green-600">
                    <TuneOutlined sx={{ fontSize: 14 }} />
                    <span className="text-xs font-semibold">{roleBadgeLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200" />

            {/* Menu items — scrollable */}
            <Box
              sx={{
                maxHeight: isMobile ? '50vh' : 400,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <div className="py-3 space-y-1">
                {menuItems.map((item, index) => (
                  <div key={item.id}>
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-4 px-3 py-4 text-left rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="shrink-0 text-gray-700">
                        {item.icon}
                      </div>
                      <Typography
                        variant="body1"
                        sx={{ flex: 1, fontWeight: 500, fontSize: '0.9375rem' }}
                      >
                        {item.label}
                      </Typography>
                      <div className="shrink-0 text-gray-400">
                        {item.external ? (
                          <OpenInNew sx={{ fontSize: 18 }} />
                        ) : (
                          <ChevronRight sx={{ fontSize: 20 }} />
                        )}
                      </div>
                    </button>

                    {index < menuItems.length - 1 && (
                      <div className="border-b border-gray-100" />
                    )}
                  </div>
                ))}
              </div>

              {/* Log Out button */}
              <div className="pt-2 pb-2">
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-center gap-2',
                    'py-3.5 rounded-lg border border-red-400',
                    'text-red-500 font-semibold text-sm',
                    'hover:bg-red-50 transition-colors'
                  )}
                >
                  <Logout sx={{ fontSize: 18 }} />
                  <span>Log Out</span>
                </button>
              </div>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
