/**
 * Dashboard News Sidebar Component
 * Displays Top News and Latest News sections.
 * Shared across dashboard, predictions, and live-matches pages.
 * No mock data, unlock, or fallback content. Empty, error, and data states.
 */

'use client';

import React, { useCallback, useState } from 'react';
import { Typography, Paper, Box, Skeleton, Stack, Link, Chip } from '@mui/material';
import { Article, Person, Source } from '@mui/icons-material';
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
}

const DashboardNewsSidebar: React.FC<DashboardNewsSidebarProps> = ({
  topNews = [],
  laligaNews = [],
  isLoading = false,
  isError = false,
  onRetry,
  // className,
}) => {
  const [imageFailures, setImageFailures] = useState<Record<string, boolean>>({});
  const [expandedNews, setExpandedNews] = useState<Record<number, boolean>>({});

  const topNewsItems = isLoading ? [] : topNews;
  const latestItems = isLoading ? [] : laligaNews;

  const handleNewsClick = useCallback((newsId: number) => {
    // Toggle expanded state instead of navigating
    setExpandedNews((prev) => ({
      ...prev,
      [newsId]: !prev[newsId],
    }));
  }, []);

  const handleReadMore = useCallback((newsId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedNews((prev) => ({
      ...prev,
      [newsId]: true,
    }));
  }, []);

  const handleReadLess = useCallback((newsId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedNews((prev) => ({
      ...prev,
      [newsId]: false,
    }));
  }, []);

  const formatTime = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diffInHours = now.diff(date, 'hour');
    if (diffInHours < 24) {
      return `Today • ${date.format('HH:mm')}`;
    }
    return date.format('DD MMMM YYYY');
  };

  const handleImageError = useCallback((id: string | number, size: 'full' | 'thumb') => {
    setImageFailures((prev) => ({ ...prev, [`${id}-${size}`]: true }));
  }, []);

  // Error state
  if (isError) {
    return (
      <Paper
        sx={{
          p: 2,
          // borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <ErrorState
          title="News unavailable"
          error="We could not load news. Please try again."
          onRetry={onRetry}
        />
      </Paper>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Stack spacing={1.5}>
          <Skeleton variant="rectangular" width="100%" height={192} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" width="92%" height={24} />
          <Skeleton variant="text" width="82%" height={24} />
          <Skeleton variant="text" width="55%" height={16} />
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2, mt: 3 }}>
          Latest News
        </Typography>
        <Stack spacing={1.5}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
              <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 1 }} />
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

  // Empty state (no news at all)
  if (topNewsItems.length === 0 && latestItems.length === 0) {
    return (
      <Paper
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2 }}>
          News
        </Typography>
        <EmptyState
          title="No news at the moment"
          description="Check back later for the latest updates."
          icon={<Article sx={{ fontSize: 48, color: 'grey.400' }} />}
        />
      </Paper>
    );
  }

  // Data state
  return (
    <Paper
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      {/* Latest News */}
      <Box sx={{ mt: 3, position: 'relative' }}>
        <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2 }}>
          Latest News
        </Typography>
        <Box
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'grey.50',
            position: 'relative',
          }}
        >
          <Box sx={{ p: 1.5 }}>
            {latestItems.length > 0 ? (
              <Stack spacing={1.5}>
                {latestItems.slice(0, 6).map((item) => {
                  const isExpanded = expandedNews[item.id];
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        borderRadius: 1,
                        p: 1,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: 'white' },
                        bgcolor: isExpanded ? 'white' : 'transparent',
                      }}
                      onClick={() => handleNewsClick(item.id)}
                    >
                      {isExpanded ? (
                        // Expanded view
                        <Box>
                          {/* Image */}
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              height: 160,
                              borderRadius: 1,
                              overflow: 'hidden',
                              bgcolor: 'white',
                              mb: 2,
                            }}
                          >
                            {getSafeNewsImageUrl(item.imageUrl) &&
                            !imageFailures[`${item.id}-thumb`] ? (
                              <Box
                                component="img"
                                src={getSafeNewsImageUrl(item.imageUrl)}
                                alt={item.title}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={() => handleImageError(item.id, 'thumb')}
                              />
                            ) : (
                              <Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.200' }} />
                            )}
                          </Box>

                          {/* Category and metadata */}
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {item.category && (
                                <Chip
                                  label={item.category}
                                  size="small"
                                  sx={{
                                    bgcolor: 'success.main',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    height: 24,
                                  }}
                                />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(item.publishedAt)}
                              </Typography>
                            </Box>

                            {(item.author || item.source) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                {item.author && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {item.author}
                                    </Typography>
                                  </Box>
                                )}
                                {item.source && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Source sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {item.source}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>

                          {/* Title */}
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'grey.800',
                              mb: 1,
                            }}
                          >
                            {item.title}
                          </Typography>

                          {/* Summary */}
                          {item.summary && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1, fontStyle: 'italic' }}
                            >
                              {item.summary}
                            </Typography>
                          )}

                          {/* Content */}
                          {item.content && (
                            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {item.content}
                            </Typography>
                          )}

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                              {item.tags.map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              ))}
                            </Box>
                          )}

                          {/* Read less link */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              pt: 1,
                              borderTop: '1px solid',
                              borderColor: 'grey.200',
                            }}
                          >
                            <Link
                              component="button"
                              variant="caption"
                              onClick={(e) => handleReadLess(item.id, e)}
                              sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              Read less
                            </Link>
                          </Box>
                        </Box>
                      ) : (
                        // Collapsed view
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Box
                            sx={{
                              position: 'relative',
                              width: 56,
                              height: 56,
                              flexShrink: 0,
                              borderRadius: 1,
                              overflow: 'hidden',
                              bgcolor: 'white',
                            }}
                          >
                            {getSafeNewsImageUrl(item.imageUrl) &&
                            !imageFailures[`${item.id}-thumb`] ? (
                              <Box
                                component="img"
                                src={getSafeNewsImageUrl(item.imageUrl)}
                                alt={item.title}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={() => handleImageError(item.id, 'thumb')}
                              />
                            ) : (
                              <Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.200' }} />
                            )}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: 'grey.800',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 0.5,
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(item.publishedAt)}
                              </Typography>
                              <Link
                                component="button"
                                variant="caption"
                                onClick={(e) => handleReadMore(item.id, e)}
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
                      )}
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No news at the moment
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default DashboardNewsSidebar;
