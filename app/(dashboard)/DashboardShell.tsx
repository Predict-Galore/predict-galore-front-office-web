/**
 * Dashboard Shell Component
 * Main layout wrapper for dashboard pages
 * 
 * @component
 * @description Provides the main layout structure for dashboard pages including
 * sidebar navigation, header, and mobile bottom navigation. Handles responsive
 * behavior and sidebar toggle functionality.
 */

'use client';

import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import Sidebar from '@/widgets/Sidebar/Sidebar';
import { Header } from '@/widgets/Header';
import { useAuthStore } from '@/features/auth/model/store';
import MobileBottomNav from '@/widgets/Footer/MobileBottomNav';

/**
 * Props for the DashboardShell component
 */
interface DashboardShellProps {
  /** Child components to render in the main content area */
  children: ReactNode;
}

/**
 * DashboardShell Component
 * 
 * Provides the main layout structure for all dashboard pages.
 * Includes responsive sidebar, header, and mobile navigation.
 * 
 * @example
 * ```tsx
 * <DashboardShell>
 *   <YourDashboardContent />
 * </DashboardShell>
 * ```
 */
export default function DashboardShell({ children }: DashboardShellProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, isAuthenticated } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /**
   * Toggles the mobile sidebar open/closed state
   */
  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'grey.50',
      }}
    >
      <Sidebar mobileOpen={mobileSidebarOpen} onMobileToggle={toggleMobileSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Header onMenuToggle={toggleMobileSidebar} user={user} isAuthenticated={isAuthenticated} />

        <Box
          component="main"
          sx={{
            p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            pb: isMobile ? 12 : { xs: 1.5, sm: 2, md: 3, lg: 4 },
            minHeight: 'calc(100vh - 4rem)',
            width: '100%',
          }}
        >
          {children}
        </Box>
        
        {isMobile && <MobileBottomNav />}
      </Box>
    </Box>
  );
}
