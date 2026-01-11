/**
 * Sidebar Widget
 * Migrated to widget architecture
 */

'use client';

import React, { useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { IconButton, Drawer, useMediaQuery, useTheme, Box, Tooltip } from '@mui/material';
import {
  Dashboard,
  ChevronLeft,
  FeedOutlined,
  SportsSoccerOutlined,
  Home,
} from '@mui/icons-material';
import Link from 'next/link';

// Constants
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

// Types
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactElement<{ fontSize?: 'small' | 'medium' | 'large' | 'inherit' }>;
  path: string;
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

// Menu items configuration
const MENU_ITEMS: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home />,
    path: '/dashboard',
  },
  {
    id: 'predictions',
    label: 'Predictions',
    icon: <Dashboard />,
    path: '/dashboard/predictions',
  },
  {
    id: 'news',
    label: 'News',
    icon: <FeedOutlined />,
    path: '/dashboard/news',
  },
  {
    id: 'live-matches',
    label: 'Live Matches',
    icon: <SportsSoccerOutlined />,
    path: '/dashboard/live-matches',
  },
];

// Sidebar Item Component
const SidebarItem: React.FC<{
  item: SidebarItem;
  isActive: boolean;
  onClick?: () => void;
}> = ({ item, isActive, onClick }) => {
  const { icon, path } = item;

  return (
    <Tooltip title={item.label} placement="right" arrow>
      <Link href={path} onClick={onClick} className="block w-full">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            my: 1,
            transition: 'all 0.2s',
            width: 48,
            height: 48,
            borderRadius: '50%',
            ...(isActive
              ? {
                  bgcolor: 'success.50',
                  border: '2px solid',
                  borderColor: 'success.main',
                  color: 'success.main',
                }
              : {
                  bgcolor: 'grey.100',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'grey.200',
                    color: 'text.primary',
                  },
                }),
          }}
        >
          {React.cloneElement(icon, { fontSize: 'medium' as const })}
        </Box>
      </Link>
    </Tooltip>
  );
};

// Main Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  // Determine active item based on current pathname
  const activeItemId = useMemo(() => {
    // Exact match for dashboard
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      return 'dashboard';
    }
    // Sort items by path length (longest first) to match most specific paths first
    const sortedItems = [...MENU_ITEMS].sort((a, b) => b.path.length - a.path.length);
    // Find the first matching item (most specific first)
    return sortedItems.find((item) => pathname.startsWith(item.path))?.id || '';
  }, [pathname]);

  const handleCloseMobile = useCallback(() => {
    if (isMobile) {
      onMobileToggle();
    }
  }, [isMobile, onMobileToggle]);

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
      className="bg-white"
    >
      {/* Top spacing + mobile close button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : 'center',
          px: 1.5,
          py: isMobile ? 1.5 : 2,
        }}
      >
        {isMobile && (
          <IconButton
            onClick={handleCloseMobile}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close sidebar"
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* Navigation menu items */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 0,
          py: isMobile ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? 0 : 1,
        }}
      >
        {MENU_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            onClick={handleCloseMobile}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleCloseMobile}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: isMobile ? 'auto' : COLLAPSED_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            ...(isMobile && {
              boxShadow: '0 0 24px rgba(0,0,0,0.1)',
              borderRight: 'none',
            }),
            ...(!isMobile && {
              borderRight: '1px solid',
              borderColor: 'divider',
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1,
          }}
          onClick={handleCloseMobile}
        />
      )}
    </>
  );
};

export default Sidebar;
