/**
 * League Section Component
 * Displays matches grouped by league with expandable/collapsible functionality
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
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

interface LeagueSectionProps {
  leagueName: string;
  leagueLogo?: string;
  matches: Prediction[];
  onMatchClick?: (match: Prediction) => void;
  className?: string;
}

const LeagueSection: React.FC<LeagueSectionProps> = ({
  leagueName,
  leagueLogo,
  matches,
  onMatchClick,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  // Competition logos mapping
  const competitionLogos = useMemo(
    () => ({
      'Premier League': 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
      'La Liga': 'https://upload.wikimedia.org/wikipedia/en/0/0c/LaLiga_Santander_logo.svg',
      'Serie A': 'https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo_%282019%29.svg',
      Bundesliga: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
      'UEFA Champions League':
        'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg',
      'Italian Serie A':
        'https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo_%282019%29.svg',
      'Nigeria League': 'https://upload.wikimedia.org/wikipedia/en/0/0c/LaLiga_Santander_logo.svg',
    }),
    []
  );

  const displayLogo = leagueLogo || competitionLogos[leagueName as keyof typeof competitionLogos];

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


  if (matches.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        overflow: 'hidden',
        ...className,
      }}
    >
      {/* League Header */}
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
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {displayLogo && (
            <Avatar
              src={displayLogo}
              alt={leagueName}
              sx={{ width: 32, height: 32 }}
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
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
                {/* Row layout (matches screenshot) */}
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
