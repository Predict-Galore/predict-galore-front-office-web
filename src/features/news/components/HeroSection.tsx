/**
 * Hero Section Component
 * Displays featured article with large image and overlay text
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Chip } from '@mui/material';
import { NewsItem } from '../model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';

interface HeroSectionProps {
  featuredArticle: NewsItem;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredArticle }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/news/${featuredArticle.id}`);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 400, md: 500 },
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover img': {
          transform: 'scale(1.05)',
        },
      }}
      onClick={handleClick}
    >
      {/* Background Image */}
      {featuredArticle.imageUrl && (
        <Box
          component="img"
          src={getSafeNewsImageUrl(featuredArticle.imageUrl)}
          alt={featuredArticle.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s',
          }}
        />
      )}

      {/* Overlay Gradient */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
        }}
      />

      {/* Sport Tag */}
      {featuredArticle.sport && (
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <Chip
            label={featuredArticle.sport.toUpperCase()}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              color: 'grey.900',
              fontWeight: 'semibold',
              fontSize: '0.75rem',
            }}
          />
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {featuredArticle.title.split(' - ')[0] || featuredArticle.title}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 1.5,
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {featuredArticle.title}
          </Typography>
          {featuredArticle.summary && (
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {featuredArticle.summary}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
