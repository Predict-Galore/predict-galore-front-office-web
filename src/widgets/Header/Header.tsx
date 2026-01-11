/**
 * Header Widget
 * Migrated to widget architecture
 *
 * Note: Sub-components (BrandLogo, SearchBar, DatePicker, NotificationButton,
 * NotificationPanel, ProfileMenuAvatar) should be migrated separately or kept
 * in the Header widget directory structure.
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { AppBar, Toolbar, Box, IconButton, useMediaQuery, useTheme, Stack } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import clsx from 'clsx';
// Sub-components - some still need migration
import BrandLogo from '@/app/(dahboard)/components/Header/components/BrandLogo';
import DatePickerComponent from '@/app/(dahboard)/components/Header/components/DatePicker';
import { NotificationButton, NotificationPanel, ProfileMenuAvatar } from './components';
import { SearchBar, SearchModal } from '@/features/search';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onDateChange?: (date: Date) => void;
  onMenuToggle?: () => void;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  } | null;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = memo(
  ({ onSearch, onDateChange, onMenuToggle, user, isAuthenticated = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

    const handleDateChange = useCallback(
      (date: Date) => {
        setSelectedDate(date);
        onDateChange?.(date);
      },
      [onDateChange]
    );

    const handleSearch = useCallback(
      (query: string) => {
        onSearch?.(query);
      },
      [onSearch]
    );

    const handleSearchResultClick = useCallback((result: unknown) => {
      // Handle search result click
      // Navigate to the result page based on type
      console.log('Search result clicked:', result);
    }, []);

    const handleToggleNotifications = useCallback(() => {
      setIsNotificationsOpen((prev) => !prev);
    }, []);

    const handleCloseNotifications = useCallback(() => {
      setIsNotificationsOpen(false);
    }, []);

    return (
      <>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          className="w-full border-b border-gray-200 bg-white z-30"
        >
          <Toolbar
            className={clsx(
              'min-h-[72px] px-3 sm:px-4 md:px-6 lg:px-8 gap-3',
              isMobile ? 'justify-between' : 'justify-between'
            )}
          >
            {isMobile ? (
              <>
                <Box className="flex items-center gap-2 min-w-0">
                  <BrandLogo />
                </Box>
                <DatePickerComponent value={selectedDate} onDateChange={handleDateChange} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <NotificationButton
                    isOpen={isNotificationsOpen}
                    onToggle={handleToggleNotifications}
                  />
                  <ProfileMenuAvatar user={user} isAuthenticated={isAuthenticated} />
                </Stack>
              </>
            ) : (
              <>
                {/* Left Side - Mobile Menu Button and Brand Logo */}
                <Box className="flex items-center flex-1 min-w-0 gap-3">
                  {/* Mobile Menu Button - Only show if onMenuToggle exists (mobile sidebar) */}
                  {isMobile && onMenuToggle && (
                    <IconButton
                      onClick={onMenuToggle}
                      className="text-gray-700 hover:text-gray-900"
                      aria-label="menu"
                    >
                      <MenuIcon />
                    </IconButton>
                  )}

                  {/* Brand Logo */}
                  <BrandLogo />
                </Box>

                {/* Center Section - Search Bar (hidden on mobile) */}
                <Box className="flex-2 flex justify-center min-w-0 mx-2 md:mx-4">
                  <SearchBar onSearch={handleSearch} variant="header" className="max-w-[640px]" />
                </Box>

                {/* Right Section - Actions */}
                <Box className="flex items-center justify-end flex-1 min-w-0 gap-2 md:gap-4">
                  <DatePickerComponent value={selectedDate} onDateChange={handleDateChange} />

                  <NotificationButton
                    isOpen={isNotificationsOpen}
                    onToggle={handleToggleNotifications}
                  />

                  <ProfileMenuAvatar user={user} isAuthenticated={isAuthenticated} />
                </Box>
              </>
            )}
          </Toolbar>
          {isMobile && (
            <Box className="px-4 pb-3">
              <SearchBar onSearch={handleSearch} variant="header" className="w-full" />
            </Box>
          )}
        </AppBar>

        {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationsOpen}
        onClose={handleCloseNotifications}
      />

        {/* Search Modal */}
        <SearchModal onResultClick={handleSearchResultClick} />
      </>
    );
  }
);

Header.displayName = 'Header';

export default Header;
