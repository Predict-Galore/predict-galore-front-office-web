/**
 * Live League Section Component
 * Displays live matches grouped by league with collapsible functionality
 * 
 * @component
 * @description A collapsible section showing live matches for a specific league.
 * Each match displays team logos, names, scores, and match status.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown, AccessTime } from '@mui/icons-material';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import type { Match } from '@/features/live-matches/model/types';

/**
 * Props for the LiveLeagueSection component
 */
interface LiveLeagueSectionProps {
  /** Name of the league */
  leagueName: string;
  /** Array of matches in this league */
  matches: Match[];
  /** Optional callback when a match is clicked */
  onMatchClick?: (match: Match) => void;
}

/**
 * LiveLeagueSection Component
 * 
 * Displays a collapsible section of live matches for a specific league.
 * Shows match status, team information, and current scores.
 * 
 * @example
 * ```tsx
 * <LiveLeagueSection
 *   leagueName="Premier League"
 *   matches={liveMatches}
 *   onMatchClick={(match) => router.push(`/match/${match.id}`)}
 * />
 * ```
 */

const LiveLeagueSection: React.FC<LiveLeagueSectionProps> = ({
  leagueName,
  matches,
  onMatchClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Handles match click event
   */
  const handleClick = useCallback(
    (match: Match) => {
      onMatchClick?.(match);
    },
    [onMatchClick]
  );

  // Don't render if no matches
  if (!matches || matches.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2.5,

        border: '1px solid',
        borderColor: 'grey.200',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.75,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'grey.50',
          },
          transition: 'background-color 0.2s',
        }}
        onClick={() => setIsCollapsed((v) => !v)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
            {leagueName}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed((v) => !v);
          }}
          aria-label={isCollapsed ? 'Expand league' : 'Collapse league'}
          sx={{
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
        >
          {isCollapsed ? (
            <KeyboardArrowDown sx={{ fontSize: 20, color: 'grey.600' }} />
          ) : (
            <KeyboardArrowUp sx={{ fontSize: 20, color: 'grey.600' }} />
          )}
        </IconButton>
      </Box>

      {!isCollapsed && (
        <Box>
          {matches.map((m, index) => {
            const [home, away] = (m.result || 'VS').split('-').map((s) => s.trim());
            const isVs = !m.result || m.result.toUpperCase() === 'VS';
            return (
              <Box
                key={m.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleClick(m)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Status pill */}
                  <Chip
                    label={m.status === 'Live' ? <AccessTime sx={{ fontSize: 16 }} /> : m.status}
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.6875rem',
                      fontWeight: 'bold',
                      bgcolor: m.status === 'FT' ? 'success.light' :
                             m.status === 'HT' ? 'grey.200' :
                             m.status === 'ET' ? 'error.light' : 'primary.light',
                      color: m.status === 'FT' ? 'success.dark' :
                             m.status === 'HT' ? 'grey.700' :
                             m.status === 'ET' ? 'error.dark' : 'primary.dark',
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
                        src={m.homeTeam.logoUrl}
                        alt={m.homeTeam.name}
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
                        {m.homeTeam.shortName || m.homeTeam.name}
                      </Typography>
                    </Box>

                    {/* Score */}
                    <Typography
                      sx={{
                        px: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 'semibold',
                        color: 'text.primary',
                        textAlign: 'center',
                        minWidth: 72,
                      }}
                    >
                      {isVs ? 'Vs' : `${home}-${away}`}
                    </Typography>

                    {/* Away */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
                      <Avatar
                        src={m.awayTeam.logoUrl}
                        alt={m.awayTeam.name}
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
                        {m.awayTeam.shortName || m.awayTeam.name}
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

export default LiveLeagueSection;
