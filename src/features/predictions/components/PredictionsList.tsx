/**
 * Predictions Section Component
 * Pixel-perfect league accordion list with match rows
 */

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { Box, Typography, IconButton, Paper, Stack, Divider, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Prediction } from '../model/types';
import { LoadingState, ErrorState } from '@/shared/components/shared';

export interface PredictionsListProps {
  predictions: Prediction[];
  isLoading: boolean;
  error?: string;
  selectedSport: string;
  onRetry?: () => void;
}

export const PredictionsList: React.FC<PredictionsListProps> = ({
  predictions,
  isLoading,
  error,
  selectedSport,
  onRetry,
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groupedPredictions = useMemo(() => {
    const groups = new Map<string, Prediction[]>();
    predictions.forEach((p) => {
      const key = p.competition || 'League';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    });
    return Array.from(groups.entries());
  }, [predictions]);

  const formatDateTime = useCallback((date: string) => {
    const d = dayjs(date);
    return d.isValid() ? d.format('MM/DD/YY • HH:mm [EST]') : date;
  }, []);

  const formatStadium = (stadium?: string) => stadium || '—';

  const toggleLeague = (league: string) => {
    setExpanded((prev) => ({ ...prev, [league]: !prev[league] }));
  };

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'white',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 4,
          p: 3,
          textAlign: 'center',
          boxShadow: 1,
        }}
      >
        <ErrorState error={error} title="Error loading predictions" onRetry={onRetry} />
      </Paper>
    );
  }

  if (predictions.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'white',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 4,
          p: 3,
          textAlign: 'center',
          boxShadow: 1,
        }}
      >
        <Typography variant="h6">No predictions available for {selectedSport}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Try selecting a different sport
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {groupedPredictions.map(([league, leaguePredictions]) => {
        const isOpen = expanded[league] ?? true;
        return (
          <Paper
            key={league}
            elevation={0}
            sx={{
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <IconButton
              onClick={() => toggleLeague(league)}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2.5, sm: 3 },
                py: 2,
                borderRadius: 0,
                '&:hover': {
                  bgcolor: 'grey.50',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    PL
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    fontWeight: 'bold',
                    color: 'grey.900',
                  }}
                >
                  {league}
                </Typography>
              </Box>
              <KeyboardArrowUp
                sx={{
                  fontSize: 24,
                  color: 'grey.600',
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </IconButton>

            {isOpen && (
              <Box>
                {leaguePredictions.map((match, index) => {
                  const isLocked = match.status === 'Locked' || !match.predictedScore;
                  return (
                    <React.Fragment key={match.id}>
                      <Box
                        sx={{
                          px: { xs: 2.5, sm: 3 },
                          py: { xs: 2.5, sm: 3 },
                          cursor: isLocked ? 'default' : 'pointer',
                          '&:hover': {
                            bgcolor: isLocked ? 'transparent' : 'grey.50',
                          },
                          transition: 'background-color 0.2s',
                        }}
                        onClick={() => {
                          if (!isLocked) {
                            router.push(`/dashboard/predictions/${match.id}`);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="primary.main"
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                            }}
                          >
                            {formatStadium(match.stadium)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="primary.main"
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                            }}
                          >
                            {match.startTime ? formatDateTime(match.startTime) : 'Date TBD'}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            alignItems: 'center',
                            gap: { xs: 2, sm: 3 },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Avatar
                              src={match.homeTeam.logoUrl}
                              alt={match.homeTeam.name}
                              sx={{ width: { xs: 44, sm: 52 }, height: { xs: 44, sm: 52 } }}
                            />
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{
                                textTransform: 'uppercase',
                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                fontWeight: 600,
                                textAlign: 'center',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {match.homeTeam.shortName || match.homeTeam.name}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              minWidth: { xs: 80, sm: 90 },
                            }}
                          >
                            {isLocked ? (
                              <Box
                                sx={{
                                  width: { xs: 40, sm: 48 },
                                  height: { xs: 40, sm: 48 },
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: 'grey.300',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'grey.400',
                                }}
                              >
                                <LockOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
                              </Box>
                            ) : (
                              <Typography
                                variant="h4"
                                sx={{
                                  fontSize: { xs: '1.75rem', sm: '2.125rem' },
                                  fontWeight: 'bold',
                                  color: 'grey.900',
                                  lineHeight: 1,
                                  letterSpacing: '-0.02em',
                                }}
                              >
                                {match.predictedScore}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                mt: 0.75,
                                textTransform: 'capitalize',
                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                fontWeight: 500,
                              }}
                            >
                              Prediction
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Avatar
                              src={match.awayTeam.logoUrl}
                              alt={match.awayTeam.name}
                              sx={{ width: { xs: 44, sm: 52 }, height: { xs: 44, sm: 52 } }}
                            />
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{
                                textTransform: 'uppercase',
                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                fontWeight: 600,
                                textAlign: 'center',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {match.awayTeam.shortName || match.awayTeam.name}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index < leaguePredictions.length - 1 && (
                        <Divider sx={{ mx: { xs: 2.5, sm: 3 } }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </Box>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
};

export default React.memo(PredictionsList);
