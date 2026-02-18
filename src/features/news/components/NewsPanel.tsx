/**
 * News Panel Component
 * Migrated to news feature
 */

'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Chip,
  Skeleton,
  Alert,
  AlertTitle,
  Button,
  type SxProps,
  type Theme,
} from '@mui/material';
import VirtualizedList from '@/shared/components/shared/VirtualizedList';
import { NewReleases, AccessTime, ErrorOutline, ExpandMore, ExpandLess } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewsItem } from '../model/types';

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

// Legacy interface for backward compatibility
export interface NewsItemProps {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: Date;
  isBreaking?: boolean;
  sport?: string;
  priority?: 'top' | 'regular' | 'league';
  author?: string;
  tags?: string[];
}

interface NewsPanelProps {
  topNews?: NewsItemProps[] | NewsItem[];
  leagueNews?: NewsItemProps[] | NewsItem[];
  news?: NewsItemProps[] | NewsItem[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  selectedSport?: string;
}

// Helper to normalize news items
const normalizeNewsItem = (item: NewsItemProps | NewsItem): NewsItemProps => {
  if ('message' in item) {
    return item as NewsItemProps;
  }
  // Convert NewsItem to NewsItemProps
  const newsItem = item as NewsItem;
  return {
    id: String(newsItem.id),
    title: newsItem.title,
    message: newsItem.content || newsItem.summary || '',
    category: newsItem.category,
    timestamp: new Date(newsItem.publishedAt),
    isBreaking: newsItem.isBreaking,
    sport: newsItem.sport,
    author: newsItem.author,
    tags: newsItem.tags,
  };
};

// Update NewsItemComponent to use the new interface
const NewsItemComponent: React.FC<{
  news: NewsItemProps;
}> = ({ news }) => {
  const [expanded, setExpanded] = useState(false);
  const formattedTime = useMemo(() => {
    return dayjs(news.timestamp).fromNow();
  }, [news.timestamp]);

  const getCategoryVariant = (
    category: string
  ): 'error' | 'warning' | 'info' | 'success' | 'neutral' => {
    const key = (category || '').trim().toLowerCase();
    if (key.includes('breaking')) return 'error';
    if (key.includes('transfer')) return 'warning';
    if (key.includes('match')) return 'info';
    if (key.includes('analysis') || key.includes('prediction')) return 'success';
    return 'neutral';
  };

  const categoryChipSx: SxProps<Theme> = (theme) => {
    const v = getCategoryVariant(news.category);
    const base = {
      fontWeight: 600,
      border: '1px solid',
    } as const;

    switch (v) {
      case 'error':
        return { ...base, bgcolor: theme.palette.error.light, color: theme.palette.error.dark, borderColor: theme.palette.error.main };
      case 'warning':
        return { ...base, bgcolor: theme.palette.warning.light, color: theme.palette.warning.dark, borderColor: theme.palette.warning.main };
      case 'info':
        return { ...base, bgcolor: theme.palette.info.light, color: theme.palette.info.dark, borderColor: theme.palette.info.main };
      case 'success':
        return { ...base, bgcolor: theme.palette.success.light, color: theme.palette.success.dark, borderColor: theme.palette.success.main };
      default:
        return {
          ...base,
          bgcolor: theme.palette.neutral[100],
          color: theme.palette.neutral[800],
          borderColor: theme.palette.neutral[200],
        };
    }
  };

  // Truncate content for preview
  const MAX_PREVIEW_LENGTH = 150;
  const shouldTruncate = news.message.length > MAX_PREVIEW_LENGTH;
  const previewContent = news.message.substring(0, MAX_PREVIEW_LENGTH).trim();
  const displayContent = expanded ? news.message : previewContent;

  return (
    <Box sx={{ transition: 'opacity 0.2s' }}>
      <Paper
        sx={{
          mb: 2,
          '&:hover': {
            boxShadow: 3,
          },
          transition: 'box-shadow 0.3s',
        }}
        elevation={1}
      >
        <ListItem sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
          {/* Header */}
          <Box
            sx={{
              width: '100%',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'neutral.200',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Chip
                label={news.category.toUpperCase()}
                size="small"
                sx={categoryChipSx}
              />
              {news.isBreaking && (
                <Chip
                  icon={<NewReleases fontSize="small" />}
                  label="BREAKING"
                  size="small"
                  sx={{
                    bgcolor: 'error.light',
                    color: 'error.dark',
                    border: '1px solid',
                    borderColor: 'error.main',
                    ml: 1,
                  }}
                />
              )}
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {news.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 0.5, sm: 0 },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {news.author && (
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {news.author} •{' '}
                  </Box>
                )}
                <AccessTime fontSize="small" />
                <span>{formattedTime}</span>
              </Typography>
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              width: '100%',
              p: { xs: 1.5, sm: 2 },
              flex: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                mb: 1.5,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'none' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {displayContent}
              {shouldTruncate && !expanded && '...'}
            </Typography>

            {shouldTruncate && (
              <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                sx={{
                  textTransform: 'none',
                  color: 'info.main',
                  '&:hover': { color: 'info.dark', bgcolor: 'transparent' },
                }}
              >
                {expanded ? 'Read Less' : 'Read More'}
              </Button>
            )}

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  mt: 1.5,
                  pt: 1.5,
                  borderTop: '1px solid',
                  borderColor: 'neutral.100',
                }}
              >
                {news.tags.map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    sx={{ color: 'text.secondary', borderColor: 'neutral.300' }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </ListItem>
      </Paper>
    </Box>
  );
};

const LoadingSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {Array.from({ length: 3 }).map((_, i) => (
      <Paper key={i} sx={{ p: 2 }} elevation={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="text" width="100%" height={28} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="90%" height={60} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Paper>
    ))}
  </Box>
);

const NewsPanel: React.FC<NewsPanelProps> = ({
  topNews = [],
  leagueNews = [],
  news = [], // For backward compatibility
  isLoading = false,
  isError = false,
  errorMessage,
  selectedSport = 'all',
}) => {
  // Combine all news sources and normalize
  const allNews = useMemo(() => {
    // If using old format (single news array)
    if (news && news.length > 0) {
      return news.map(normalizeNewsItem);
    }

    // If using new format (topNews + leagueNews)
    return [...topNews.map(normalizeNewsItem), ...leagueNews.map(normalizeNewsItem)];
  }, [topNews, leagueNews, news]);

  const filteredNews = useMemo(() => {
    if (!selectedSport || selectedSport === 'all') {
      return allNews;
    }
    return allNews.filter((item) => item.sport === selectedSport);
  }, [allNews, selectedSport]);

  const getPanelTitle = useMemo(() => {
    if (selectedSport === 'all') return 'Latest News';
    return `${selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} News`;
  }, [selectedSport]);

  // Show top news count in header if available
  const topNewsCount = topNews.length;

  if (isLoading) {
    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'neutral.200',
          width: '100%',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.125rem' },
          }}
        >
          {getPanelTitle}
        </Typography>
        <LoadingSkeleton />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'neutral.200',
          width: '100%',
        }}
      >
        <Alert severity="error" icon={<ErrorOutline />}>
          <AlertTitle>Failed to load news</AlertTitle>
          {errorMessage || 'An error occurred while loading news.'}
        </Alert>
      </Paper>
    );
  }

  if (filteredNews.length === 0) {
    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'neutral.200',
          width: '100%',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.125rem' },
          }}
        >
          {getPanelTitle}
        </Typography>
        <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
          <NewReleases
            sx={{
              color: 'neutral.300',
              fontSize: { xs: '2.25rem', sm: '3rem' },
              mx: 'auto',
              mb: 2,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            No news available
          </Typography>
          {selectedSport !== 'all' && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Try selecting &quot;All&quot; sports
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'neutral.200',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderBottom: '1px solid',
          borderColor: 'neutral.200',
          bgcolor: 'neutral.50',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1rem', sm: '1.125rem' },
            }}
          >
            {getPanelTitle}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {topNewsCount > 0 && (
              <Chip
                label={`${topNewsCount} Top News`}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
            <Chip
              label={`${filteredNews.length} items`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        </Box>
      </Box>

      {/* News List - Use virtualization for long lists */}
      <Box className="p-4" sx={{ height: '600px' }}>
        {filteredNews.length > 10 ? (
          // Use virtualization for lists with more than 10 items
          <VirtualizedList
            items={filteredNews}
            height={600}
            itemHeight={180} // Approximate height per news item
            renderItem={(item, index) => (
              <Box className="px-2 pb-2">
                <NewsItemComponent key={`${item.id}-${index}`} news={item} />
              </Box>
            )}
            overscanCount={3}
          />
        ) : (
          <List disablePadding>
            {filteredNews.map((item, index) => (
              <NewsItemComponent key={`${item.id}-${index}`} news={item} />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default React.memo(NewsPanel);
