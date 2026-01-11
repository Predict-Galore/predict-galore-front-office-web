/**
 * Dashboard News Sidebar Component
 * Displays Top News and LaLiga News sections
 * Shared component used across dashboard, predictions, and live-matches pages
 */

'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  Box,
  Button,
  Skeleton,
  Stack,
} from '@mui/material';
import { Favorite, Lock } from '@mui/icons-material';
import { getFallbackImage } from '@/shared/constants/image-fallbacks';
import type { NewsItem } from '@/features/news/model/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface DashboardNewsSidebarProps {
  topNews?: NewsItem[];
  laligaNews?: NewsItem[];
  isLoading?: boolean;
  onUnlockPersonalized?: () => void;
  className?: string;
}

const DashboardNewsSidebar: React.FC<DashboardNewsSidebarProps> = ({
  topNews = [],
  laligaNews = [],
  isLoading = false,
  onUnlockPersonalized,
  className,
}) => {
  const router = useRouter();
  const [imageFailures, setImageFailures] = useState<Record<string, boolean>>({});

  const topNewsItems = isLoading ? [] : topNews;
  const laligaItems = isLoading ? [] : laligaNews;

  const handleNewsClick = useCallback(
    (newsId: number) => {
      router.push(`/dashboard/news/${newsId}`);
    },
    [router]
  );

  const formatTime = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diffInHours = now.diff(date, 'hour');

    if (diffInHours < 24) {
      return `Today • ${date.format('HH:mm')}`;
    }
    return date.format('DD MMMM YYYY');
  };

  const resolveSrc = useCallback(
    (id: string | number, url: string | undefined, size: 'full' | 'thumb') => {
      if (!url || imageFailures[`${id}-${size}`]) {
        return getFallbackImage(size === 'thumb' ? 'thumb' : 'full');
      }
      return url;
    },
    [imageFailures]
  );

  const handleImageError = useCallback((id: string | number, size: 'full' | 'thumb') => {
    setImageFailures((prev) => ({ ...prev, [`${id}-${size}`]: true }));
  }, []);

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        ...className,
      }}
    >
      {/* Top News */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2 }}>
          Top News
        </Typography>

        {topNewsItems.length > 0 ? (
          topNewsItems.slice(0, 1).map((item) => (
            <Box
              key={item.id}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.95,
                },
                transition: 'opacity 0.2s',
              }}
              onClick={() => handleNewsClick(item.id)}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 192,
                  mb: 1.5,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={resolveSrc(item.id, item.imageUrl, 'full')}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={() => handleImageError(item.id, 'full')}
                />
              </Box>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'semibold', mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {item.title}
                <Typography component="span" sx={{ color: 'error.main', fontWeight: 'semibold' }}>
                  ...read more
                </Typography>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Favorite sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">
                  {item.likeCount || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(item.publishedAt)}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Stack spacing={1.5}>
            <Skeleton variant="rectangular" width="100%" height={192} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" width="92%" height={24} />
            <Skeleton variant="text" width="82%" height={24} />
            <Skeleton variant="text" width="55%" height={16} />
          </Stack>
        )}
      </Box>

      {/* LaLiga News */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2 }}>
          LaLiga News
        </Typography>
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'grey.50',
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <Stack spacing={1.5}>
              {(laligaItems.length > 0
                ? (laligaItems.slice(0, 6) as Array<NewsItem | null>)
                : (Array.from({ length: 6 }).map(() => null) as Array<NewsItem | null>)
              ).map((item, index) => (
                <Box
                  key={(item?.id ?? index) as React.Key}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    borderRadius: 1,
                    p: 1,
                    transition: 'background-color 0.2s',
                    cursor: item && index < 2 ? 'pointer' : 'default',
                    opacity: index < 2 && item ? 1 : 0.5,
                    filter: index < 2 && item ? 'none' : 'blur(1px)',
                    '&:hover': {
                      bgcolor: item && index < 2 ? 'white' : 'transparent',
                    },
                  }}
                  onClick={() => item && index < 2 && handleNewsClick(item.id)}
                >
                  <Box sx={{ position: 'relative', width: 56, height: 56, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: 'white' }}>
                    {item ? (
                      <Box
                        component="img"
                        src={resolveSrc(item.id, item.imageUrl, 'thumb')}
                        alt={item.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={() => handleImageError(item.id, 'thumb')}
                      />
                    ) : (
                      <Skeleton variant="rectangular" width="100%" height="100%" />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {item ? (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: 'grey.800',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(item.publishedAt)}
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Skeleton variant="text" width="83%" height={16} />
                        <Skeleton variant="text" width="50%" height={14} sx={{ mt: 1 }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {onUnlockPersonalized && (
            <Box sx={{ p: 1.5, pt: 0 }}>
              <Button
                variant="contained"
                startIcon={<Lock />}
                onClick={onUnlockPersonalized}
                sx={{
                  textTransform: 'none',
                  width: '100%',
                  borderRadius: 2,
                  py: 1.25,
                  bgcolor: 'success.main',
                  '&:hover': {
                    bgcolor: 'success.dark',
                  },
                }}
              >
                Unlock Personalized News
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DashboardNewsSidebar;






