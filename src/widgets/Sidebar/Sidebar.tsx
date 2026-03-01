/**
 * Sidebar Widget
 * Enhanced with collapsible functionality
 */

'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { IconButton, Drawer, useMediaQuery, Box, Tooltip, Typography } from '@mui/material';
import {
  Dashboard,
  ChevronLeft,
  ChevronRight,
  FeedOutlined,
  SportsSoccerOutlined,
  Home,
} from '@mui/icons-material';
import Link from 'next/link';

// Constants
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

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
    id: 'live-matches',
    label: 'Live Matches',
    icon: <SportsSoccerOutlined />,
    path: '/dashboard/live-matches',
  },
  {
    id: 'news',
    label: 'News',
    icon: <FeedOutlined />,
    path: '/dashboard/news',
  },
];

// Sidebar Item Component
const SidebarItem: React.FC<{
  item: SidebarItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}> = ({ item, isActive, isCollapsed, onClick }) => {
  const { icon, label, path } = item;

  const content = (
    <Link href={path} onClick={onClick} className="block w-full">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: isCollapsed ? 0 : 2,
          py: 1.5,
          mx: isCollapsed ? 'auto' : 2,
          my: 1,
          transition: 'all 0.2s',
          borderRadius: isCollapsed ? '50%' : '12px',
          width: isCollapsed ? 48 : 'auto',
          height: isCollapsed ? 48 : 'auto',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          ...(isActive
            ? {
                bgcolor: 'success.50',
                border: '2px solid',
                borderColor: 'success.main',
                color: 'success.main',
              }
            : {
                bgcolor: 'transparent',
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'grey.100',
                  color: 'text.primary',
                },
              }),
        }}
      >
        {React.cloneElement(icon, { fontSize: 'medium' as const })}
        {!isCollapsed && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.95rem',
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Link>
  );

  // Only show tooltip when collapsed
  if (isCollapsed) {
    return (
      <Tooltip title={label} placement="right" arrow>
        {content}
      </Tooltip>
    );
  }

  return content;
};

// Main Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileToggle }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const drawerWidth = isMobile ? DRAWER_WIDTH : isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'common.white',
      }}
    >
      {/* Top section with toggle button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : isCollapsed ? 'center' : 'flex-end',
          px: isCollapsed ? 1 : 2,
          py: 2,
          minHeight: 64,
        }}
      >
        {isMobile ? (
          <IconButton
            onClick={handleCloseMobile}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'grey.100',
              },
            }}
            aria-label="Close sidebar"
          >
            <ChevronLeft />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleToggleCollapse}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'grey.100',
              },
            }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {/* Navigation menu items */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 0,
          py: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {MENU_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            isCollapsed={!isMobile && isCollapsed}
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
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1)',
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
            zIndex: 1099,
          }}
          onClick={handleCloseMobile}
        />
      )}
    </>
  );
};

export default Sidebar;
