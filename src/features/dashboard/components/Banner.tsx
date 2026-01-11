/**
 * Banner Component
 * Displays the responsible betting quote banner
 */

'use client';

import React, { useCallback } from 'react';
import { Share } from '@mui/icons-material';
import { IconButton, Box } from '@mui/material';
import { cn } from '@/shared/lib/utils';
import { PREDICTIONS_CONSTANTS } from '@/features/predictions/lib/constants';

interface BannerProps {
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ className }) => {
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Predict Galore',
          text: PREDICTIONS_CONSTANTS.MOCK_DATA.BANNER_QUOTE,
          url: window.location.href,
        })
        .catch(() => {
          // User cancelled or error occurred
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(PREDICTIONS_CONSTANTS.MOCK_DATA.BANNER_QUOTE);
    }
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        // Base green panel
        bgcolor: '#17390F',
        // Red abstract blobs similar to screenshot
        backgroundImage:
          'radial-gradient(circle at 20% 10%, rgba(220,38,38,0.9) 0 140px, transparent 141px),' +
          'radial-gradient(circle at 60% 40%, rgba(220,38,38,0.85) 0 180px, transparent 181px),' +
          'radial-gradient(circle at 90% 70%, rgba(220,38,38,0.8) 0 160px, transparent 161px)',
        ...className,
      }}
    >
      {/* Inner darkening overlay for contrast */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.1)' }} />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 10, px: { xs: 3, sm: 4, md: 5 }, py: { xs: 3, sm: 3.5, md: 4 } }}>
        <p
          className={cn(
            'text-white',
            'font-extrabold',
            'leading-tight',
            // Match screenshot: large quote, responsive
            'text-2xl sm:text-3xl md:text-4xl lg:text-[42px]',
            'max-w-[980px]'
          )}
        >
          “{PREDICTIONS_CONSTANTS.MOCK_DATA.BANNER_QUOTE}”
        </p>
        <p className="mt-3 text-white/80 text-sm sm:text-base">
          - {PREDICTIONS_CONSTANTS.MOCK_DATA.BANNER_AUTHOR}
        </p>
      </Box>

      {/* Share Button */}
      <Box sx={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
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
