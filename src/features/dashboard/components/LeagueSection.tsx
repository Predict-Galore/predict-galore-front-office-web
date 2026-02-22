/**
 * League Section Component
 * Displays matches grouped by league with expandable/collapsible functionality
 * 
 * @component
 * @description A collapsible section showing prediction matches for a specific league.
 * Each match displays team information, predicted scores, and match status.
 * Supports locked matches that cannot be accessed without premium.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown, Lock, AccessTime } from '@mui/icons-material';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import type { Prediction } from '@/features/predictions/model/types';

/**
 * Props for the LeagueSection component
 */
interface LeagueSectionProps {
  /** Name of the league */
  leagueName: string;
  /** Optional URL for the league logo */
  leagueLogo?: string;
  /** Array of prediction matches in this league */
  matches: Prediction[];
  /** Optional callback when a match is clicked */
  onMatchClick?: (match: Prediction) => void;
}

/**
 * LeagueSection Component
 * 
 * Displays a collapsible section of prediction matches for a specific league.
 * Shows match status, team information, and predicted scores.
 * Locked matches display a lock icon instead of the prediction.
 * 
 * @example
 * ```tsx
 * <LeagueSection
 *   leagueName="Premier League"
 *   leagueLogo="/logos/premier-league.png"
 *   matches={predictions}
 *   onMatchClick={(match) => router.push(`/predictions/${match.id}`)}
 * />
 * ```
 */

const LeagueSection: React.FC<LeagueSectionProps> = ({
  leagueName,
  leagueLogo,
  matches,
  onMatchClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  // Only use backend-provided leagueLogo if present (no static/mock logo mapping)
  const displayLogo = leagueLogo;

  /**
   * Handles match click event
   * Uses custom callback if provided, otherwise navigates to match detail page
   */
  const handleMatchClick = useCallback(
    (match: Prediction) => {
      if (onMatchClick) {
        onMatchClick(match);
      } else {
        router.push(`/dashboard/predictions/${match.id}`);
      }
    },
    [onMatchClick, router]
  );

  // Don't render if no matches
  if (matches.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* League Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.5, sm: 3 },
          py: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'grey.50',
          },
          transition: 'background-color 0.2s',
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {displayLogo ? (
            <Avatar
              src={displayLogo}
              alt={leagueName}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'grey.700' }}>
                {leagueName.trim().slice(0, 2).toUpperCase()}
              </Typography>
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 'bold',
              color: 'grey.900',
            }}
          >
            {leagueName}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          aria-label={isCollapsed ? 'Expand league' : 'Collapse league'}
          sx={{
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
        >
          {isCollapsed ? (
            <KeyboardArrowDown sx={{ fontSize: 24, color: 'grey.600' }} />
          ) : (
            <KeyboardArrowUp sx={{ fontSize: 24, color: 'grey.600' }} />
          )}
        </IconButton>
      </Box>

      {/* Matches List */}
      {!isCollapsed && (
        <Box>
          {matches.map((match, index) => {
            const isLocked = match.status === 'Locked';
            const isUpcoming = match.status === 'Prediction';
            const scoreText = match.predictedScore?.trim() ? match.predictedScore : 'Vs';

            return (
              <Box
                key={match.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleMatchClick(match)}
              >
                {/* Row layout  */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Status pill */}
                  <Chip
                    label={
                      isUpcoming ? (
                        <AccessTime sx={{ fontSize: 16 }} />
                      ) : isLocked ? (
                        <Lock sx={{ fontSize: 16 }} />
                      ) : (
                        match.status
                      )
                    }
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.6875rem',
                      fontWeight: 'bold',
                      bgcolor: match.status === 'FT' ? 'success.light' :
                             match.status === 'HT' ? 'grey.200' :
                             match.status === 'ET' ? 'error.light' :
                             match.status === 'Locked' ? 'grey.200' : 'primary.light',
                      color: match.status === 'FT' ? 'success.dark' :
                             match.status === 'HT' ? 'grey.700' :
                             match.status === 'ET' ? 'error.dark' :
                             match.status === 'Locked' ? 'grey.600' : 'primary.dark',
                      '& .MuiChip-label': {
                        px: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    }}
                  />

                  {/* Teams + score */}
                  <Box sx={{ flex: 1, ml: 2, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                    {/* Home */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
                      <Avatar
                        src={match.homeTeam.logoUrl}
                        alt={match.homeTeam.name}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          maxWidth: 160,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'center',
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        }}
                      >
                        {match.homeTeam.shortName || match.homeTeam.name}
                      </Typography>
                    </Box>

                    {/* Score */}
                    <Box sx={{ px: 2, textAlign: 'center', minWidth: 68 }}>
                      {isLocked ? (
                        <Lock sx={{ fontSize: 22, color: 'text.disabled' }} />
                      ) : (
                        <Typography
                          sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            fontWeight: 'semibold',
                            color: 'text.primary',
                          }}
                        >
                          {scoreText}
                        </Typography>
                      )}
                    </Box>

                    {/* Away */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
                      <Avatar
                        src={match.awayTeam.logoUrl}
                        alt={match.awayTeam.name}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          maxWidth: 160,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'center',
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        }}
                      >
                        {match.awayTeam.shortName || match.awayTeam.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {index < matches.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default LeagueSection;
