'use client';

import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '@/widgets/Sidebar/Sidebar';
import { Header } from '@/widgets/Header';
import { useAuthStore } from '@/features/auth/model/store';
import MobileBottomNav from '@/widgets/Footer/MobileBottomNav';

export default function DashboardShell({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, isAuthenticated } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileSidebarOpen} onMobileToggle={toggleMobileSidebar} />

      <div
        className="
          grow transition-all duration-300 ease-in-out
          w-full
        "
      >
        <Header onMenuToggle={toggleMobileSidebar} user={user} isAuthenticated={isAuthenticated} />

        <main
          className={`
            p-3 sm:p-4 md:p-6 lg:p-8
            ${isMobile ? 'pb-24' : ''}
            min-h-[calc(100vh-4rem)]
            w-full
          `}
        >
          {children}
        </main>
        {isMobile && <MobileBottomNav />}
      </div>
    </div>
  );
}
