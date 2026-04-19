'use client';

import React, { useCallback, useState } from 'react';
import { Typography, Paper, Box, Skeleton, Stack, Link } from '@mui/material';
import { Article } from '@mui/icons-material';
import { ErrorState, EmptyState } from '@/shared/components/shared';
import type { NewsItem } from '@/features/news/model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface DashboardNewsSidebarProps {
  topNews?: NewsItem[];
  laligaNews?: NewsItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onReadMore?: (item: NewsItem) => void;
}

const DashboardNewsSidebar: React.FC<DashboardNewsSidebarProps> = ({
  topNews = [],
  laligaNews = [],
  isLoading = false,
  isError = false,
  onRetry,
  onReadMore,
}) => {
  const [imageFailures, setImageFailures] = useState<Record<string, boolean>>({});

  const allItems = [...topNews, ...laligaNews];

  const formatTime = (dateString: string) => {
    const date = dayjs(dateString);
    const diffInHours = dayjs().diff(date, 'hour');
    if (diffInHours < 24) return `Today • ${date.format('HH:mm')}`;
    return date.format('DD MMM YYYY');
  };

  const handleImageError = useCallback((id: string | number) => {
    setImageFailures((prev) => ({ ...prev, [id]: true }));
  }, []);

  if (isError) {
    return (
      <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
        <ErrorState
          title="News unavailable"
          error="Could not load news. Please try again."
          onRetry={onRetry}
        />
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
        <Skeleton variant="text" width="50%" height={28} sx={{ mb: 1.5 }} />
        <Stack spacing={1.5}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
              <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 1, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="90%" height={16} />
                <Skeleton variant="text" width="60%" height={14} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  }

  if (allItems.length === 0) {
    return (
      <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Latest News</Typography>
        <EmptyState
          title="No news at the moment"
          description="Check back later for the latest updates."
          icon={<Article sx={{ fontSize: 48, color: 'grey.400' }} />}
        />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Latest News</Typography>

      <Stack spacing={1.5}>
        {allItems.slice(0, 7).map((item) => {
          const imgUrl = getSafeNewsImageUrl(item.imageUrl);
          const showImg = !!imgUrl && !imageFailures[item.id];

          return (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                gap: 1.5,
                p: 1,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: 'grey.50' },
              }}
            >
              {/* Thumbnail */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: 'hidden',
                  bgcolor: 'grey.200',
                }}
              >
                {showImg && (
                  <Box
                    component="img"
                    src={imgUrl}
                    alt={item.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => handleImageError(item.id)}
                  />
                )}
              </Box>

              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="grey.800"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(item.publishedAt)}
                  </Typography>
                  <Link
                    component="button"
                    variant="caption"
                    onClick={() => onReadMore?.(item)}
                    sx={{
                      color: 'error.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Read more
                  </Link>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default DashboardNewsSidebar;
