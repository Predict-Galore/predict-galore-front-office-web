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
} from '@mui/material';
import VirtualizedList from '@/shared/components/shared/VirtualizedList';
import { NewReleases, AccessTime, ErrorOutline, ExpandMore, ExpandLess } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '@/shared/lib/utils';
import { getCategoryColorClass } from '@/shared/constants/color-tokens';
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

  const getCategoryColor = (category: string) => {
    return getCategoryColorClass(category);
  };

  // Truncate content for preview
  const MAX_PREVIEW_LENGTH = 150;
  const shouldTruncate = news.message.length > MAX_PREVIEW_LENGTH;
  const previewContent = news.message.substring(0, MAX_PREVIEW_LENGTH).trim();
  const displayContent = expanded ? news.message : previewContent;

  return (
    <Box sx={{ transition: 'opacity 0.2s' }}>
      <Paper className="mb-4 hover:shadow-lg transition-shadow duration-300" elevation={1}>
        <ListItem className="flex flex-col p-0">
          {/* Header */}
          <Box className="w-full p-4 border-b border-gray-200">
            <Box className="flex justify-between items-start mb-2">
              <Chip
                label={news.category.toUpperCase()}
                size="small"
                className={`${getCategoryColor(news.category)} font-medium`}
              />
              {news.isBreaking && (
                <Chip
                  icon={<NewReleases fontSize="small" />}
                  label="BREAKING"
                  size="small"
                  className="bg-red-100 text-red-800 border border-red-300 ml-2"
                />
              )}
            </Box>

            <Typography
              variant="h6"
              className={cn(
                'font-semibold text-gray-900 mb-2',
                'text-sm sm:text-base',
                'line-clamp-2'
              )}
            >
              {news.title}
            </Typography>

            <Box
              className={cn(
                'flex flex-col sm:flex-row',
                'justify-between items-start sm:items-center',
                'gap-1 sm:gap-0'
              )}
            >
              <Typography
                variant="caption"
                className={cn('text-gray-500', 'text-xs', 'flex items-center gap-1')}
              >
                {news.author && <span className="hidden sm:inline">{news.author} • </span>}
                <AccessTime fontSize="small" className="inline" />
                <span>{formattedTime}</span>
              </Typography>
            </Box>
          </Box>

          {/* Content */}
          <Box className={cn('w-full p-3 sm:p-4', 'flex-1')}>
            <Typography
              variant="body2"
              className={cn('text-gray-700 mb-3', 'text-xs sm:text-sm', 'line-clamp-3')}
            >
              {displayContent}
              {shouldTruncate && !expanded && '...'}
            </Typography>

            {shouldTruncate && (
              <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                className="normal-case text-blue-600 hover:text-blue-800"
              >
                {expanded ? 'Read Less' : 'Read More'}
              </Button>
            )}

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <Box className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                {news.tags.map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    className="text-gray-500 border-gray-300"
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
  <Box className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <Paper key={i} className="p-4" elevation={1}>
        <Box className="space-y-3">
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
      <Paper className="p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200 w-full">
        <Typography
          variant="h6"
          className={cn('font-bold text-gray-800 mb-4', 'text-base sm:text-lg')}
        >
          {getPanelTitle}
        </Typography>
        <LoadingSkeleton />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper className="p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200 w-full">
        <Alert severity="error" icon={<ErrorOutline />}>
          <AlertTitle>Failed to load news</AlertTitle>
          {errorMessage || 'An error occurred while loading news.'}
        </Alert>
      </Paper>
    );
  }

  if (filteredNews.length === 0) {
    return (
      <Paper className="p-4 sm:p-5 md:p-6 rounded-xl border border-gray-200 w-full">
        <Typography
          variant="h6"
          className={cn('font-bold text-gray-800 mb-4', 'text-base sm:text-lg')}
        >
          {getPanelTitle}
        </Typography>
        <Box className="text-center py-6 sm:py-8">
          <NewReleases className="text-gray-300 text-4xl sm:text-5xl mx-auto mb-4" />
          <Typography variant="body1" className={cn('text-gray-500 mb-2', 'text-sm sm:text-base')}>
            No news available
          </Typography>
          {selectedSport !== 'all' && (
            <Typography variant="caption" className="text-gray-400">
              Try selecting &quot;All&quot; sports
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper className={cn('rounded-xl border border-gray-200 overflow-hidden', 'w-full')}>
      {/* Header */}
      <Box className={cn('p-3 sm:p-4', 'border-b border-gray-200 bg-gray-50')}>
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
            sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.125rem' } }}
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
                className="text-xs"
              />
            )}
            <Chip
              label={`${filteredNews.length} items`}
              size="small"
              color="primary"
              variant="outlined"
              className="text-xs"
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
