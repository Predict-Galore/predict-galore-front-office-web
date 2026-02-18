/**
 * Header Widget
 * Professional implementation with clean dropdown architecture
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AppBar, Toolbar, Box, useMediaQuery } from '@mui/material';
import BrandLogo from './components/BrandLogo';
import DatePickerComponent from './components/DatePicker';
import { NotificationButton, ProfileMenuAvatar } from './components';
import { SearchBar } from '@/features/search';
import { NotificationService } from '@/features/notifications';
import type { SearchResult } from '@/features/search/model/types';
import { useHeaderNavigation } from './useHeaderNavigation';

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
  isAuthenticated = false
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const navigateSearchResult = useHeaderNavigation();

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

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        width: '100%',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'common.white',
        zIndex: 30,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          gap: 3,
          justifyContent: 'space-between',
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 4, md: 6 } }}>
            <DatePickerComponent 
              value={selectedDate} 
              onDateChange={handleDateChange} 
            />
            
            <NotificationButton />
            
            <ProfileMenuAvatar 
              user={user} 
              isAuthenticated={isAuthenticated} 
            />
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
