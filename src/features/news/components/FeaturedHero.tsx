/**
 * FeaturedHero Component
 *
 * Displays the top featured news article as a full-width hero banner
 * with a sport badge, bold title, and summary overlaid on the image.
 */

'use client';

import React from 'react';
import { Box, Chip, Typography, Paper } from '@mui/material';
import dayjs from 'dayjs';
import type { NewsItem } from '../model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';

interface FeaturedHeroProps {
  article: NewsItem;
  onClick?: (article: NewsItem) => void;
}

const FeaturedHero: React.FC<FeaturedHeroProps> = ({ article, onClick }) => {
  const imageUrl = getSafeNewsImageUrl(article.imageUrl ?? article.thumbnailUrl);

  // Format the match label (e.g. "RCB VS PUNJAB KINGS , FINAL 2025")
  const matchLabel = article.tags?.join(' • ') ?? '';

  return (
    <Paper
      elevation={0}
      onClick={() => onClick?.(article)}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        minHeight: { xs: 320, md: 460 },
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': onClick
          ? {
              '& .hero-overlay': { background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 80%)' },
            }
          : {},
      }}
    >
      {/* Background image */}
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt={article.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'grey.800' }} />
      )}

      {/* Dark gradient overlay */}
      <Box
        className="hero-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 80%)',
          transition: 'background 0.3s ease',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          minHeight: { xs: 320, md: 460 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: { xs: 2.5, md: 4 },
        }}
      >
        {/* Sport / category badge */}
        <Box sx={{ mb: 1.5 }}>
          <Chip
            label={article.category || article.sport || 'Highlight'}
            size="small"
            sx={{
              bgcolor: 'rgba(0,0,0,0.65)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          />
        </Box>

        {/* Match label (e.g. "RCB VS PUNJAB KINGS , FINAL 2025") */}
        {matchLabel && (
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.75)', mb: 0.5, letterSpacing: 0.5 }}
          >
            {matchLabel}
          </Typography>
        )}

        {/* Article title */}
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.15,
            mb: 1.5,
            fontSize: { xs: '1.4rem', md: '2rem' },
          }}
        >
          {article.title}
        </Typography>

        {/* Summary */}
        {(article.summary || article.content) && (
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 780,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {article.summary || article.content?.slice(0, 200)}
          </Typography>
        )}

        {/* Date */}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', mt: 1 }}>
          {dayjs(article.publishedAt).format('DD MMMM YYYY')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FeaturedHero;
