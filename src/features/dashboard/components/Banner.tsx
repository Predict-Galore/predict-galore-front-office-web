/**
 * Banner Component
 * Displays the responsible betting quote banner with share functionality
 *
 * @component
 * @description A visually striking banner featuring a responsible betting quote
 * with an abstract gradient background and share functionality.
 */

'use client';

import React, { useCallback } from 'react';
import { Share } from '@mui/icons-material';
import { IconButton, Box, Typography } from '@mui/material';
import { PREDICTIONS_CONSTANTS } from '@/features/predictions/lib/constants';

/**
 * Props for the Banner component
 */
interface BannerProps {
  /** Optional CSS class name for additional styling */
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ className }) => {
  /**
   * Handles sharing the banner quote
   * Uses native share API if available, otherwise copies to clipboard
   */
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Predict Galore',
          text: PREDICTIONS_CONSTANTS.BANNER.QUOTE,
          url: window.location.href,
        })
        .catch(() => {
          // User cancelled or error occurred
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(PREDICTIONS_CONSTANTS.BANNER.QUOTE);
    }
  }, []);

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        // Base green panel - using theme green-950
        bgcolor: 'green.950', // #0a2916 from Figma
        // Red abstract blobs using theme coolRed colors
        backgroundImage: (theme) =>
          `radial-gradient(circle at 20% 10%, ${theme.palette.coolRed[600]}E6 0 140px, transparent 141px),` +
          `radial-gradient(circle at 60% 40%, ${theme.palette.coolRed[600]}D9 0 180px, transparent 181px),` +
          `radial-gradient(circle at 90% 70%, ${theme.palette.coolRed[600]}CC 0 160px, transparent 161px)`,
      }}
    >
      {/* Inner darkening overlay for contrast */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.1)',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          px: { xs: 3, sm: 4, md: 5 },
          py: { xs: 3, sm: 3.5, md: 4 },
        }}
      >
        <Typography
          sx={{
            color: 'common.white',
            fontWeight: 800,
            lineHeight: 1.1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.375rem', lg: '2.625rem' },
            maxWidth: 980,
          }}
        >
          “{PREDICTIONS_CONSTANTS.BANNER.QUOTE}”
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            color: 'rgba(255,255,255,0.8)',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          - {PREDICTIONS_CONSTANTS.BANNER.AUTHOR}
        </Typography>
      </Box>

      {/* Share Button */}
      <Box
        sx={{
          position: 'absolute',
          right: 2,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={handleShare}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            color: 'white',
            backdropFilter: 'blur(4px)',
          }}
          size="small"
          aria-label="Share quote"
        >
          <Share fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Banner;
