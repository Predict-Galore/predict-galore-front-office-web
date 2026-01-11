/**
 * Match List Section Component
 * Matches Figma UI design - Shows matches grouped by competition
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown, Lock } from '@mui/icons-material';
import { Box, Typography, Button, IconButton, Paper, Stack, Chip, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Match, CompetitionGroup } from '../model/types';
import dayjs from 'dayjs';

interface MatchListSectionProps {
  competition: CompetitionGroup;
  onSelectMatch?: (match: Match) => void;
}

const MatchListSection: React.FC<MatchListSectionProps> = ({ competition, onSelectMatch }) => {
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

  const competitionLogo = competitionLogos[competition.name as keyof typeof competitionLogos];

  const handleMatchClick = useCallback(
    (match: Match) => {
      if (onSelectMatch) {
        onSelectMatch(match);
      } else {
        // Navigate to match detail page
        router.push(`/dashboard/live-matches/${match.id}`);
      }
    },
    [onSelectMatch, router]
  );

  const formatDateTime = (dateString: string) => {
    const date = dayjs(dateString);
    return date.format('DD/MM/YY • HH:mm [EST]');
  };


  return (
    <Paper elevation={0} sx={{ mb: 2, overflow: 'hidden', borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
      {/* Competition Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'grey.50',
          },
          transition: 'background-color 0.2s',
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {competitionLogo && (
            <Avatar
              src={competitionLogo}
              alt={competition.name}
              sx={{ width: 32, height: 32 }}
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
            {competition.name}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
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
        <Box sx={{ p: 1.5 }}>
          <Stack spacing={1.5}>
            {competition.matches.map((match) => {
              const isLocked = !match.predictedScore && match.status === 'Prediction';
              const hasPrediction = match.predictedScore && match.status === 'Prediction';

              return (
                <Button
                  key={match.id}
                  onClick={() => handleMatchClick(match)}
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.100',
                    bgcolor: 'white',
                    p: 2,
                    '&:hover': {
                      boxShadow: 1,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, width: '100%', justifyContent: 'space-between' }}>
                    {/* Home */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Avatar
                        src={match.homeTeam.logoUrl}
                        alt={match.homeTeam.name}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                          {match.homeTeam.shortName || match.homeTeam.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={match.status}
                            size="small"
                            sx={{
                              height: 'auto',
                              fontSize: '0.75rem',
                              px: 1,
                              py: 0.25,
                              bgcolor: match.status === 'FT' ? 'success.light' :
                                       match.status === 'Live' ? 'error.light' :
                                       match.status === 'Prediction' ? 'primary.light' : 'grey.light',
                              color: match.status === 'FT' ? 'success.dark' :
                                     match.status === 'Live' ? 'error.dark' :
                                     match.status === 'Prediction' ? 'primary.dark' : 'grey.dark',
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {match.stadium || 'TBD'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Score / state */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.625rem' }}>
                        {formatDateTime(match.dateTime)}
                      </Typography>
                      {isLocked ? (
                        <>
                          <Lock sx={{ fontSize: 20, color: 'grey.400', mb: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            Prediction
                          </Typography>
                        </>
                      ) : hasPrediction ? (
                        <>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {match.predictedScore}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Prediction
                          </Typography>
                        </>
                      ) : match.result ? (
                        <>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {match.result}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {match.status}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
                            Vs
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Upcoming
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Away */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'flex-end' }}>
                      <Box sx={{ minWidth: 0, textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                          {match.awayTeam.shortName || match.awayTeam.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {match.competition || ''}
                        </Typography>
                      </Box>
                      <Avatar
                        src={match.awayTeam.logoUrl}
                        alt={match.awayTeam.name}
                        sx={{ width: 40, height: 40 }}
                      />
                    </Box>
                  </Box>
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default MatchListSection;
