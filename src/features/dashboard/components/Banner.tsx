'use client';

import React, { useCallback } from 'react';
import { Refresh, Share } from '@mui/icons-material';
import { IconButton, Box, Typography, Skeleton, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { useQuoteOfTheDay, useRefreshQuote } from '@/features/quotes/api/hooks';

interface BannerProps {
  className?: string;
}

const FALLBACK_QUOTE = 'Study the game, understand the odds, and bet with purpose.';

const Banner: React.FC<BannerProps> = ({ className }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: quote, isLoading } = useQuoteOfTheDay();
  const { mutate: refreshQuote, isPending: isRefreshing } = useRefreshQuote();

  const quoteText = quote?.text ?? FALLBACK_QUOTE;

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: 'Predict Galore', text: quoteText, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(quoteText);
    }
  }, [quoteText]);

  const handleRefresh = useCallback(() => {
    refreshQuote();
  }, [refreshQuote]);

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'green.950',
        backgroundImage: (t) =>
          `radial-gradient(circle at 20% 10%, ${t.palette.coolRed[600]}E6 0 140px, transparent 141px),` +
          `radial-gradient(circle at 60% 40%, ${t.palette.coolRed[600]}D9 0 180px, transparent 181px),` +
          `radial-gradient(circle at 90% 70%, ${t.palette.coolRed[600]}CC 0 160px, transparent 161px)`,
      }}
    >
      {/* Darkening overlay */}
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.1)' }} />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          px: { xs: 3, sm: 4, md: 5 },
          py: { xs: 3, sm: 3.5, md: 4 },
          pr: { xs: 10, sm: 12 }, // space for the two action buttons
        }}
      >
        {isLoading ? (
          <>
            <Skeleton variant="text" width="80%" height={48} sx={{ bgcolor: 'rgba(255,255,255,0.15)', mb: 1 }} />
            <Skeleton variant="text" width="20%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          </>
        ) : (
          <>
            <Typography
              sx={{
                color: 'common.white',
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.375rem', lg: '2.625rem' },
                maxWidth: 980,
              }}
            >
              &ldquo;{quoteText}&rdquo;
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              — Predict Galore
            </Typography>
          </>
        )}
      </Box>

      {/* Action buttons — refresh + share */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: 8, sm: 10, md: 12 },
          top: { xs: 8, sm: 10, md: '50%' },
          transform: { xs: 'none', md: 'translateY(-50%)' },
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {/* Refresh button */}
        <Tooltip title="Get a new quote" placement="left">
          <span>
            <IconButton
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                color: 'white',
                backdropFilter: 'blur(4px)',
                p: isMobile ? 1 : 0.75,
                // Spin animation while refreshing
                '& svg': {
                  transition: 'transform 0.4s ease',
                  animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none',
                },
                '@keyframes spin': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' },
                },
              }}
              size={isMobile ? 'medium' : 'small'}
              aria-label="Refresh quote"
            >
              <Refresh fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Share button */}
        <Tooltip title="Share quote" placement="left">
          <span>
            <IconButton
              onClick={handleShare}
              disabled={isLoading}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                color: 'white',
                backdropFilter: 'blur(4px)',
                p: isMobile ? 1 : 0.75,
              }}
              size={isMobile ? 'medium' : 'small'}
              aria-label="Share quote"
            >
              <Share fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Banner;
