/**
 * Dashboard Shell Component
 * Main layout wrapper for dashboard pages
 *
 * @component
 * @description Provides the main layout structure for dashboard pages including
 * sidebar navigation, header, news sidebar, and mobile bottom navigation. Handles responsive
 * behavior and sidebar toggle functionality.
 */

'use client';

import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/store';

const Sidebar = dynamic(() => import('@/widgets/Sidebar/Sidebar'));
const Header = dynamic(() => import('@/widgets/Header/Header'));
const MobileBottomNav = dynamic(() => import('@/widgets/Footer/MobileBottomNav'));
const QuoteBanner = dynamic(() => import('@/features/dashboard/components/Banner'));

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
 * Includes responsive sidebar, header, news sidebar (except on news page), and mobile navigation.
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
  const pathname = usePathname();

  const { user, isAuthenticated } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isProfilePage = pathname?.startsWith('/dashboard/profile');
  const isNotificationsPage = pathname?.startsWith('/dashboard/notifications');
  const showQuoteBanner = !isProfilePage && !isNotificationsPage;

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
          minHeight: '100vh',
          height: { xs: '100dvh', md: '100vh' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Header user={user} isAuthenticated={isAuthenticated} />

          <Box
            component="main"
            sx={{
              p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
              pb: isMobile ? 12 : { xs: 1.5, sm: 2, md: 3, lg: 4 },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 3,
                alignItems: 'flex-start',
              }}
            >
              {/* Quote Banner - First row (spans full width) */}
              {showQuoteBanner && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <QuoteBanner className="h-[150px] sm:h-[170px] md:h-[190px]" />
                </Box>
              )}

              {/* Main Content */}
              <Box sx={{ minWidth: 0 }}>{children}</Box>
            </Box>
          </Box>
        </Box>

        {isMobile && <MobileBottomNav />}
      </Box>
    </Box>
  );
}
