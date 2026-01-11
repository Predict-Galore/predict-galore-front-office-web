'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import {
  HomeOutlined,
  QueryStatsOutlined,
  EmojiEventsOutlined,
  FeedOutlined,
} from '@mui/icons-material';
import clsx from 'clsx';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/dashboard', icon: <HomeOutlined fontSize="small" /> },
  {
    id: 'predictions',
    label: 'Predictions',
    path: '/dashboard/predictions',
    icon: <QueryStatsOutlined fontSize="small" />,
  },
  {
    id: 'live',
    label: 'Live Matches',
    path: '/dashboard/live-matches',
    icon: <EmojiEventsOutlined fontSize="small" />,
  },
  { id: 'news', label: 'News', path: '/dashboard/news', icon: <FeedOutlined fontSize="small" /> },
];

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const activeId = React.useMemo(() => {
    if (pathname === '/dashboard' || pathname === '/dashboard/') return 'home';
    const match = NAV_ITEMS.find((item) => pathname.startsWith(item.path));
    return match?.id || '';
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.25, px: 1.5, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <Link
              key={item.id}
              href={item.path}
              className="flex flex-col items-center justify-center gap-1 text-xs font-medium"
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
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
                        },
                      }),
                }}
              >
                {item.icon}
              </Box>
              <span className={clsx(isActive ? 'text-green-700' : 'text-gray-600')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </Box>
    </nav>
  );
};

export default MobileBottomNav;
