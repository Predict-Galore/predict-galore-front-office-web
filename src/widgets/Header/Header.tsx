/**
 * Header Widget
 * Professional implementation with clean dropdown architecture
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AppBar, Toolbar, Box, useMediaQuery } from '@mui/material';
import BrandLogo from './components/BrandLogo';
import DatePickerComponent from './components/DatePicker';
import SearchBar from './components/SearchBar';
import { NotificationButton, ProfileDropdown } from './components';
import { NotificationService } from '@/features/notifications/api/service';
import type { SearchResult } from '@/features/search/model/types';
import { useHeaderNavigation } from './useHeaderNavigation';
import { useAuthStore } from '@/features/auth/model/store';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onDateChange?: (date: Date) => void;
  onMenuToggle?: () => void;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    avatar?: string;
  } | null;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onDateChange,
  user,
  isAuthenticated = false,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const navigateSearchResult = useHeaderNavigation();
  const { logout } = useAuthStore();

  // Prefetch notifications on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    queryClient.prefetchQuery({
      queryKey: ['notifications', { page: 1, pageSize: 50 }],
      queryFn: () => NotificationService.getNotifications({ page: 1, pageSize: 50 }),
    });
  }, [queryClient]);

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

  const handleSearchResultClick = useCallback(
    (result: SearchResult) => {
      // Handle search result click based on type
      console.log('Search result clicked:', result);
      navigateSearchResult(result);
    },
    [navigateSearchResult]
  );

  const handleProfileClick = useCallback(() => {
    router.push('/dashboard/profile?tab=profile-details');
  }, [router]);

  const handleSettingsClick = useCallback(() => {
    router.push('/dashboard/profile?tab=settings');
  }, [router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        width: '100%',
        minHeight: { xs: 88, md: 120 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'common.white',
        zIndex: 30,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 88, md: 120 },
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          gap: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left Side - Brand Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: 3 }}>
          <BrandLogo />
        </Box>

        {/* Center Section - Search Bar (Desktop Only) */}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              minWidth: 0,
              mx: { xs: 1, md: 2 },
              flex: 2,
            }}
          >
            <div className="w-full max-w-md">
              <SearchBar
                onSearch={handleSearch}
                onResultClick={handleSearchResultClick}
                variant="header"
              />
            </div>
          </Box>
        )}

        {/* Right Section - Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 4, md: 6 },
            }}
          >
            <DatePickerComponent value={selectedDate} onDateChange={handleDateChange} />

            <NotificationButton />

            {isAuthenticated ? (
              <ProfileDropdown
                user={user}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onLogout={handleLogout}
              />
            ) : null}
          </Box>
        </Box>
      </Toolbar>

      {/* Mobile Search Bar */}
      {isMobile && (
        <Box sx={{ px: 2, pb: 3 }}>
          <SearchBar
            onSearch={handleSearch}
            onResultClick={handleSearchResultClick}
            variant="header"
          />
        </Box>
      )}
    </AppBar>
  );
};

export default Header;
