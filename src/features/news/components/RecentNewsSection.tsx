/**
 * RecentNewsSection Component
 *
 * Displays a "Recent News" block with:
 * - Left side: one large featured thumbnail card
 * - Right side: a vertical list of smaller news items (thumbnail + title + date)
 */

'use client';

import React from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import dayjs from 'dayjs';
import type { NewsItem } from '../model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';

interface RecentNewsSectionProps {
  /** All recent news items. First item becomes the large card; rest become the list. */
  articles: NewsItem[];
  onArticleClick?: (article: NewsItem) => void;
}

// ==================== SUB-COMPONENTS ====================

/**
 * Large featured card shown on the left side of the Recent News block.
 */
const LargeNewsCard: React.FC<{ article: NewsItem; onClick?: () => void }> = ({
  article,
  onClick,
}) => {
  const imageUrl = getSafeNewsImageUrl(article.imageUrl ?? article.thumbnailUrl);

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        height: { xs: 200, md: 260 },
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': onClick ? { boxShadow: 4 } : {},
      }}
    >
      {/* Background image */}
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt={article.title}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'grey.200' }} />
      )}

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Title at bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            fontWeight: 700,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {article.title}
        </Typography>
      </Box>
    </Paper>
  );
};

/**
 * Small news row shown in the right-side list.
 */
const SmallNewsRow: React.FC<{ article: NewsItem; onClick?: () => void }> = ({
  article,
  onClick,
}) => {
  const imageUrl = getSafeNewsImageUrl(article.imageUrl ?? article.thumbnailUrl);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
        '&:hover': onClick ? { bgcolor: 'action.hover', borderRadius: 1 } : {},
        px: 0.5,
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
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={article.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Category + date */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
          {article.category && (
            <Box component="span" sx={{ color: 'success.main', fontWeight: 600, mr: 0.5 }}>
              #{article.category}
            </Box>
          )}
          {dayjs(article.publishedAt).format('D MMMM YYYY')}
        </Typography>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.35,
          }}
        >
          {article.title}
        </Typography>
      </Box>
    </Stack>
  );
};

// ==================== MAIN COMPONENT ====================

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ articles, onArticleClick }) => {
  if (!articles || articles.length === 0) return null;

  // First item → large card; rest → small list (up to 3 items)
  const [largeArticle, ...listArticles] = articles;
  const smallArticles = listArticles.slice(0, 3);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
      }}
    >
      {/* Large card */}
      <LargeNewsCard
        article={largeArticle}
        onClick={() => onArticleClick?.(largeArticle)}
      />

      {/* Small list */}
      <Box>
        {smallArticles.map((article, index) => (
          <SmallNewsRow
            key={`${article.id}-${index}`}
            article={article}
            onClick={() => onArticleClick?.(article)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RecentNewsSection;
