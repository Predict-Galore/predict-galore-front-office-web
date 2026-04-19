'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Divider,
  Paper,
  Skeleton,
} from '@mui/material';
import { ArrowBack, Person, Source, AccessTime } from '@mui/icons-material';
import { useNewsItem } from '@/features/news/api/hooks';
import type { NewsItem } from '@/features/news/model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';
import dayjs from 'dayjs';

interface NewsDetailViewProps {
  newsItem: NewsItem;
  onBack: () => void;
}

const NewsDetailView: React.FC<NewsDetailViewProps> = ({ newsItem, onBack }) => {
  // Fetch full detail — may have more content than the list item
  const { data: fullItem, isLoading } = useNewsItem(newsItem.id, { enabled: !!newsItem.id });
  const item = fullItem ?? newsItem;

  const normalizedSource =
    item.source?.trim().toLowerCase() === 'betpredict' ? 'Predict Galore' : item.source;
  const normalizedAuthor =
    item.source?.trim().toLowerCase() === 'betpredict' &&
    item.author?.trim().toLowerCase() === 'editorial desk'
      ? undefined
      : item.author;

  const imageUrl = getSafeNewsImageUrl(item.imageUrl ?? item.thumbnailUrl);

  return (
    <Box>
      {/* Back button */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={onBack} size="small" sx={{ color: 'text.secondary' }}>
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={onBack}>
          Back
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        {/* Hero image */}
        {imageUrl && (
          <Box sx={{ width: '100%', height: { xs: 200, sm: 280, md: 360 }, overflow: 'hidden' }}>
            <Box
              component="img"
              src={imageUrl}
              alt={item.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Category + meta */}
          <Stack direction="row" flexWrap="wrap" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            {item.category && (
              <Chip
                label={item.category}
                size="small"
                sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600 }}
              />
            )}
            {item.isBreaking && (
              <Chip label="Breaking" size="small" color="error" sx={{ fontWeight: 600 }} />
            )}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {dayjs(item.publishedAt).format('DD MMM YYYY • HH:mm')}
              </Typography>
            </Stack>
            {normalizedAuthor && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{normalizedAuthor}</Typography>
              </Stack>
            )}
            {normalizedSource && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Source sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{normalizedSource}</Typography>
              </Stack>
            )}
          </Stack>

          {/* Title */}
          <Typography variant="h5" fontWeight={800} sx={{ mb: 2, lineHeight: 1.3 }}>
            {item.title}
          </Typography>

          {/* Summary */}
          {item.summary && (
            <>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontStyle: 'italic', mb: 2, lineHeight: 1.7 }}
              >
                {item.summary}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </>
          )}

          {/* Content */}
          {isLoading ? (
            <Stack spacing={1}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="text" width={i % 3 === 0 ? '70%' : '100%'} height={20} />
              ))}
            </Stack>
          ) : (
            <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {item.content}
            </Typography>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 3 }}>
              {item.tags.map((tag, i) => (
                <Chip key={i} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default NewsDetailView;
