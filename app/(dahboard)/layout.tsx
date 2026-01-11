// app/(dashboard)/layout.tsx
'use client';

import { ReactNode, useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Sidebar from '@/widgets/Sidebar/Sidebar';
import { Header } from '@/widgets/Header';
import { useMediaQuery, useTheme } from '@mui/material';
import { useAuthStore } from '@/features/auth/model/store';
import MobileBottomNav from '@/widgets/Footer/MobileBottomNav';

// Lazy load heavy components
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
  { ssr: false }
);

// NotificationPanel is now rendered inside the Header widget

// Create a separate QueryClient provider component
function DashboardQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get user data from auth store
  const { user, isAuthenticated } = useAuthStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toggle mobile sidebar (mobile)
  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  return (
    <DashboardQueryProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - pass user data */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileToggle={toggleMobileSidebar}
        />

        {/* Main Content */}
        <div
          className={`
            grow transition-all duration-300 ease-in-out
            w-full
          `}
        >
          {/* Header - pass user data */}
          <Header
            onMenuToggle={toggleMobileSidebar}
            user={user}
            isAuthenticated={isAuthenticated}
          />

          {/* Main Content Area */}
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
    </DashboardQueryProvider>
  );
}
