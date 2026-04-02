/**
 * Banner Component
 * Displays the responsible betting quote banner with share functionality
 *
 * @component
 * @description A visually striking banner featuring a responsible betting quote
 * with an abstract gradient background and share functionality.
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import { Share } from '@mui/icons-material';
import { IconButton, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PREDICTIONS_CONSTANTS } from '@/features/predictions/lib/constants';

/**
 * Props for the Banner component
 */
interface BannerProps {
  /** Optional CSS class name for additional styling */
  className?: string;
}

const DAILY_QUOTES: Array<{ quote: string; author: string }> = [
  { quote: 'Predictions are earned: research, stake, repeat.', author: 'Predict Galore' },
  { quote: 'Good bets start with good data.', author: 'Predict Galore' },
  { quote: 'Discipline beats excitement—every single ticket.', author: 'Predict Galore' },
  { quote: 'Your edge is preparation, not luck.', author: 'Predict Galore' },
  { quote: 'When the odds move, your thinking should too.', author: 'Predict Galore' },
  { quote: 'Chase value, not wins.', author: 'Predict Galore' },
  { quote: 'A small edge, consistently applied, compounds.', author: 'Predict Galore' },
  { quote: 'Bankroll management is the real superpower.', author: 'Predict Galore' },
  { quote: 'If you can’t explain the pick, don’t place it.', author: 'Predict Galore' },
  { quote: 'Let the numbers talk; keep emotions quiet.', author: 'Predict Galore' },
  { quote: 'The best bettors know when to pass.', author: 'Predict Galore' },
  { quote: 'One game doesn’t define your strategy.', author: 'Predict Galore' },
  { quote: 'Sharp decisions look boring—until they win long-term.', author: 'Predict Galore' },
  { quote: 'Form is temporary; process is permanent.', author: 'Predict Galore' },
  { quote: 'Think in probabilities, not guarantees.', author: 'Predict Galore' },
  { quote: 'Back your model, but audit your bias.', author: 'Predict Galore' },
  { quote: 'Your plan matters more than your prediction.', author: 'Predict Galore' },
  { quote: 'Stay selective: fewer bets, better bets.', author: 'Predict Galore' },
  { quote: 'Great picks are patient picks.', author: 'Predict Galore' },
  { quote: 'Track results. Improve the process. Repeat.', author: 'Predict Galore' },
  { quote: 'Variance is loud; discipline is louder.', author: 'Predict Galore' },
  { quote: 'The goal is growth, not glory.', author: 'Predict Galore' },
  { quote: 'Betting is a marathon—pace your stakes.', author: 'Predict Galore' },
  { quote: 'A calm mind finds better lines.', author: 'Predict Galore' },
  { quote: 'Protect your bankroll like it’s your trophy.', author: 'Predict Galore' },
  { quote: 'The strongest move is sometimes no move.', author: 'Predict Galore' },
  { quote: 'Smart bettors respect uncertainty.', author: 'Predict Galore' },
  { quote: 'A system you follow beats a hunch you love.', author: 'Predict Galore' },
  { quote: 'Winning starts before kickoff.', author: 'Predict Galore' },
  { quote: 'Play it smart. Play it responsible.', author: 'Predict Galore' },
];

function getLocalDaySeed(date: Date) {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfDay = new Date(year, date.getMonth(), date.getDate());
  const dayOfYear = Math.floor((startOfDay.getTime() - startOfYear.getTime()) / 86400000);
  return year * 1000 + dayOfYear;
}

const Banner: React.FC<BannerProps> = ({ className }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dailyQuote = useMemo(() => {
    if (DAILY_QUOTES.length === 0) {
      return { quote: PREDICTIONS_CONSTANTS.BANNER.QUOTE, author: PREDICTIONS_CONSTANTS.BANNER.AUTHOR };
    }
    const seed = getLocalDaySeed(new Date());
    const index = ((seed % DAILY_QUOTES.length) + DAILY_QUOTES.length) % DAILY_QUOTES.length;
    return DAILY_QUOTES[index];
  }, []);

  /**
   * Handles sharing the banner quote
   * Uses native share API if available, otherwise copies to clipboard
   */
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Predict Galore',
          text: dailyQuote.quote,
          url: window.location.href,
        })
        .catch(() => {
          // User cancelled or error occurred
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(dailyQuote.quote);
    }
  }, [dailyQuote.quote]);

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
          “{dailyQuote.quote}”
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            color: 'rgba(255,255,255,0.8)',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          - {dailyQuote.author}
        </Typography>
      </Box>

      {/* Share Button */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: 8, sm: 10, md: 2 },
          top: { xs: 8, sm: 10, md: '50%' },
          transform: { xs: 'none', md: 'translateY(-50%)' },
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
            p: isMobile ? 1 : 0.75,
          }}
          size={isMobile ? 'medium' : 'small'}
          aria-label="Share quote"
        >
          <Share fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Banner;
