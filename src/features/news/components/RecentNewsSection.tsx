/**
 * Recent News Section Component
 * Displays recent news in a responsive grid layout with expandable cards
 * 
 * This component shows:
 * - News articles in a grid layout (1-4 columns based on screen size)
 * - Expandable cards that show full content when clicked
 * - Article images, titles, summaries, and metadata
 * - Category badges and publication dates
 * - Author information and tags
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Link,
  Paper,
  Chip,
  Stack,
  CardMedia,
} from '@mui/material';
import {
  Image as ImageIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { NewsItem } from '../model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';

// ==================== TYPES ====================

interface RecentNewsSectionProps {
  news: NewsItem[];
  title?: string;
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
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 1 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
        {formatDate(publishedAt)}
      </Typography>
      {category && (
        <Chip
          label={category}
          size="small"
          sx={{
            bgcolor: 'primary.main',
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
 * Article Tags Component
 * Displays article tags as chips
 */
interface ArticleTagsProps {
  tags: string[];
}

const ArticleTags: React.FC<ArticleTagsProps> = ({ tags }) => (
  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
    {tags.map((tag, idx) => (
      <Chip
        key={idx}
        label={`#${tag}`}
        size="small"
        variant="outlined"
        sx={{
          bgcolor: 'grey.100',
          color: 'text.secondary',
          borderColor: 'grey.300',
          fontWeight: 500,
          fontSize: '0.75rem',
        }}
      />
    ))}
  </Stack>
);

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

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ news }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // ==================== EVENT HANDLERS ====================

  /**
   * Toggle article expansion
   */
  const handleToggleExpand = useCallback(
    (e: React.MouseEvent, articleId: number) => {
      e.stopPropagation();
      setExpandedId((prev) => (prev === articleId ? null : articleId));
    },
    []
  );

  /**
   * Check if article is expanded
   */
  const isExpanded = useCallback(
    (articleId: number): boolean => expandedId === articleId,
    [expandedId]
  );

  /**
   * Calculate grid column span based on position and expansion state
   */
  const getGridColumn = useCallback(
    (index: number, expanded: boolean): string | { xs: string; md: string } => {
      if (!expanded) return 'span 1';

      // Desktop: expanded card takes remaining space in row
      if (index === 0) return { xs: 'span 1', md: 'span 4' }; // First card: full row
      if (index === 1) return { xs: 'span 1', md: 'span 3' }; // Second card: 3 columns
      if (index === 2) return { xs: 'span 1', md: 'span 2' }; // Third card: 2 columns
      return { xs: 'span 1', md: 'span 4' }; // Fourth card: full next row
    },
    []
  );

  // ==================== RENDER ====================

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
        alignItems: 'start',
      }}
    >
      {news.slice(0, 4).map((item, index) => {
        const expanded = isExpanded(item.id);
        const gridColumn = getGridColumn(index, expanded);

        return (
          <Paper
            key={item.id}
            elevation={1}
            sx={{
              gridColumn,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              height: expanded ? 'auto' : { xs: 'auto', md: '480px' },
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            {/* Article Image */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: expanded ? { xs: 240, md: 400 } : { xs: 200, md: 220 },
                transition: 'height 0.3s ease-in-out',
                flexShrink: 0,
              }}
            >
              <ArticleImage
                imageUrl={item.imageUrl}
                title={item.title}
              />
            </Box>

            {/* Article Content */}
            <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Metadata */}
              <ArticleMetadata publishedAt={item.publishedAt} category={item.category} />

              {/* Title */}
              <Typography
                variant={expanded ? 'h5' : 'h6'}
                sx={{
                  fontWeight: 600,
                  display: expanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: expanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 1,
                  transition: 'font-size 0.3s ease-in-out',
                  fontSize: expanded ? '1.5rem' : '1rem',
                  lineHeight: 1.3,
                  minHeight: expanded ? 'auto' : '2.6rem',
                }}
              >
                {item.title}
              </Typography>

              {/* Summary */}
              {item.summary && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: expanded ? 'block' : '-webkit-box',
                    WebkitLineClamp: expanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1,
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    minHeight: expanded ? 'auto' : '3.9rem',
                    flex: expanded ? 0 : 1,
                  }}
                >
                  {item.summary}
                </Typography>
              )}

              {/* Full Content (when expanded) */}
              {expanded && item.content && (
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.7,
                    fontSize: '1rem',
                  }}
                >
                  {item.content}
                </Typography>
              )}

              {/* Tags (when expanded) */}
              {expanded && item.tags && item.tags.length > 0 && (
                <ArticleTags tags={item.tags} />
              )}

              {/* Footer */}
              <Box sx={{ mt: 'auto' }}>
                <ArticleAuthor author={item.author} source={item.source} />

                {/* Read More/Less Link */}
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => handleToggleExpand(e, item.id)}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {expanded ? 'Read less' : 'Read more'}
                </Link>
              </Box>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default RecentNewsSection;
