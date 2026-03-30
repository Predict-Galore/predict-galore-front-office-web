/**
 * Sports Article Section Component
 * Displays sports articles in a responsive grid layout with expandable cards
 */

'use client';

import React from 'react';
import { Box, Button, Typography, Paper, Chip, Stack, CardMedia } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { NewsItem } from '../model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';

// ==================== TYPES ====================

interface SportsArticleSectionProps {
  articles: NewsItem[];
  title?: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
  onReadMore?: (article: NewsItem) => void;
}

// ==================== HELPER COMPONENTS ====================

/**
 * Article Image Component
 * Displays article image or fallback placeholder
 */
interface ArticleImageProps {
  imageUrl?: string;
  title: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ imageUrl, title }) => {
  if (imageUrl) {
    return (
      <CardMedia
        component="img"
        image={getSafeNewsImageUrl(imageUrl)}
        alt={title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  }

  // Fallback placeholder
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        bgcolor: 'grey.100',
        color: 'text.disabled',
      }}
    >
      <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="body2">No Image</Typography>
    </Box>
  );
};

/**
 * Article Metadata Component
 * Displays publication date and category badge
 */
interface ArticleMetadataProps {
  publishedAt: string;
  category?: string;
}

const ArticleMetadata: React.FC<ArticleMetadataProps> = ({ publishedAt, category }) => {
  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
        {formatDate(publishedAt)}
      </Typography>
      {category && (
        <Chip
          label={category}
          size="small"
          sx={{
            bgcolor: 'success.main',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      )}
    </Stack>
  );
};

/**
 * Article Author Component
 * Displays author and source information
 */
interface ArticleAuthorProps {
  author?: string;
  source?: string;
}

const ArticleAuthor: React.FC<ArticleAuthorProps> = ({ author, source }) => {
  if (!author && !source) return null;

  return (
    <Typography
      variant="caption"
      color="text.disabled"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1.5,
        fontSize: '0.75rem',
      }}
    >
      {author && <span>By {author}</span>}
      {author && source && <span>•</span>}
      {source && <span>{source}</span>}
    </Typography>
  );
};

// ==================== MAIN COMPONENT ====================

const SportsArticleSection: React.FC<SportsArticleSectionProps> = ({ articles, onReadMore }) => {
  // ==================== RENDER ====================

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(3, minmax(0, 1fr))',
        },
        gap: 2.5,
        alignItems: 'start',
      }}
    >
      {articles.map((article) => (
        <Paper
          key={article.id}
          elevation={1}
          sx={{
            overflow: 'hidden',
            transition: 'all 0.25s ease-in-out',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)',
            },
          }}
        >
          {/* Article Image */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 220, md: 280 },
              flexShrink: 0,
            }}
          >
            <ArticleImage imageUrl={article.imageUrl} title={article.title} />
          </Box>

          {/* Article Content */}
          <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Metadata */}
            <ArticleMetadata publishedAt={article.publishedAt} category={article.category} />

            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1.25,
                lineHeight: 1.3,
              }}
            >
              {article.title}
            </Typography>

            {/* Summary */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              {article.summary || article.content?.slice(0, 200) || 'No summary available.'}
            </Typography>

            {/* Footer */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <ArticleAuthor author={article.author} source={article.source} />

              {/* View Details Button */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => onReadMore?.(article)}
                sx={{
                  borderColor: 'success.main',
                  color: 'success.main',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  borderRadius: 1,
                  px: 2,
                  py: 0.75,
                  minWidth: 140,
                  '&:hover': {
                    borderColor: 'success.dark',
                    bgcolor: 'success.50',
                  },
                }}
              >
                View details
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default SportsArticleSection;
