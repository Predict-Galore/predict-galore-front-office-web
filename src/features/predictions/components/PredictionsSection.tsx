/**
 * Predictions Section Component
 * Pixel-perfect league accordion list with match rows
 */

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { Box, Typography, Button, IconButton, Paper, Stack, Divider, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Prediction } from '../model/types';
import { LoadingState, ErrorState } from '@/shared/components/shared';

export interface PredictionsSectionProps {
  predictions: Prediction[];
  isLoading: boolean;
  error?: string;
  selectedSport: string;
  onRetry?: () => void;
}

export const PredictionsSection: React.FC<PredictionsSectionProps> = ({
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
    return d.isValid() ? d.format('MM/DD/YY · HH:mm [EST]') : date;
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
              borderRadius: 4,
              boxShadow: 1,
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
                px: { xs: 2, sm: 2.5 },
                py: 2,
                borderRadius: 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  fontWeight: 'semibold',
                  color: 'grey.900'
                }}
              >
                {league}
              </Typography>
              <KeyboardArrowUp
                sx={{
                  fontSize: 20,
                  color: 'grey.500',
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
                    <Box key={match.id} sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          color: 'primary.main',
                          fontWeight: 500,
                        }}
                      >
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                          {formatStadium(match.stadium)}
                        </Typography>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                          {formatDateTime(match.startTime)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          mt: { xs: 1.5, sm: 2 },
                          display: 'grid',
                          gridTemplateColumns: '1fr auto 1fr',
                          alignItems: 'center',
                          gap: { xs: 1.5, sm: 3 },
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', gap: { xs: 0.5, sm: 0.75 } }}>
                          <Avatar
                            src={match.homeTeam.logoUrl}
                            alt={match.homeTeam.name}
                            sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {match.homeTeam.shortName || match.homeTeam.name}
                          </Typography>
                        </Box>

                        <Button
                          onClick={() => {
                            if (isLocked) return;
                            router.push(`/dashboard/predictions/${match.id}`);
                          }}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minWidth: 90,
                            '&:hover': {
                              transform: isLocked ? 'none' : 'scale(1.01)',
                            },
                            transition: 'transform 0.2s',
                          }}
                        >
                          {isLocked ? (
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                border: '1px solid',
                                borderColor: 'grey.300',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'grey.500',
                              }}
                            >
                              <LockOutlined fontSize="small" />
                            </Box>
                          ) : (
                            <Typography
                              variant="h4"
                              sx={{
                                fontSize: { xs: '1.5rem', sm: '2rem' },
                                fontWeight: 'bold',
                                color: 'grey.900',
                                lineHeight: 1,
                              }}
                            >
                              {match.predictedScore}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              fontSize: '0.6875rem',
                            }}
                          >
                            Prediction
                          </Typography>
                        </Button>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: { xs: 0.5, sm: 0.75 } }}>
                          <Avatar
                            src={match.awayTeam.logoUrl}
                            alt={match.awayTeam.name}
                            sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {match.awayTeam.shortName || match.awayTeam.name}
                          </Typography>
                        </Box>
                      </Box>
                      {index < leaguePredictions.length - 1 && <Divider />}
                    </Box>
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

export default React.memo(PredictionsSection);
