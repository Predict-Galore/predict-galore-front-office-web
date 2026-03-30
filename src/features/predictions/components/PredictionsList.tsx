/**
 * Predictions List Component
 * Renders only backend-provided prediction list fields.
 */

'use client';

import React, { useCallback } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Box, Chip, Paper, Stack, Typography, Avatar, Divider } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { ErrorState, LoadingState } from '@/shared/components/shared';
import { Prediction } from '../model/types';

export interface PredictionsListProps {
  predictions: Prediction[];
  isLoading: boolean;
  error?: string;
  selectedSport: string;
  onRetry?: () => void;
  onPredictionClick?: (prediction: Prediction) => void;
}

const getStatusConfig = (status?: string) => {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'ft' || normalized === 'expired') {
    return { label: 'FT', bgcolor: 'success.light', color: 'success.dark' };
  }
  if (normalized === 'ht') {
    return { label: 'HT', bgcolor: 'grey.200', color: 'grey.700' };
  }
  if (normalized === 'et') {
    return { label: 'ET', bgcolor: 'error.light', color: 'error.dark' };
  }
  if (normalized === 'live') {
    return { label: 'LIVE_ICON', bgcolor: 'primary.light', color: 'primary.dark' };
  }

  return { label: 'Vs', bgcolor: 'grey.100', color: 'text.primary' };
};

export const PredictionsList: React.FC<PredictionsListProps> = ({
  predictions,
  isLoading,
  error,
  selectedSport,
  onRetry,
  onPredictionClick,
}) => {
  const router = useRouter();

  const formatDate = useCallback((datePostedUtc?: string) => {
    if (!datePostedUtc) return 'N/A';
    const date = dayjs(datePostedUtc);
    return date.isValid() ? date.format('MMM D, YYYY h:mm A') : datePostedUtc;
  }, []);

  const handleRowClick = useCallback(
    (prediction: Prediction) => {
      if (onPredictionClick) {
        onPredictionClick(prediction);
        return;
      }

      router.push(`/dashboard/predictions/${prediction.id}`);
    },
    [onPredictionClick, router]
  );

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 0, p: 3 }}
      >
        <ErrorState error={error} title="Error loading predictions" onRetry={onRetry} />
      </Paper>
    );
  }

  if (predictions.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 0, p: 3 }}
      >
        <Typography variant="h6">No predictions available for {selectedSport}</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}
    >
      <Box>
        {predictions.map((prediction, index) => {
          const status = getStatusConfig(prediction.status);
          const hasScore = Boolean(
            prediction.predictedScore && prediction.predictedScore !== 'N/A'
          );

          return (
            <Box
              key={prediction.id}
              onClick={() => handleRowClick(prediction)}
              sx={{
                px: { xs: 2, sm: 3 },
                py: 2.25,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'grey.50' },
              }}
            >
              {index > 0 && <Divider sx={{ mb: 2.25, mt: -2.25 }} />}

              <Stack spacing={4} sx={{ width: '100%' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '44px 1fr',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Chip
                    label={
                      status.label === 'LIVE_ICON' ? (
                        <AccessTime sx={{ fontSize: 16 }} />
                      ) : (
                        status.label
                      )
                    }
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.6875rem',
                      fontWeight: 'bold',
                      bgcolor: status.bgcolor,
                      color: status.color,
                      '& .MuiChip-label': {
                        px: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: 1,
                      minWidth: 0,
                      mb: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 0,
                      }}
                    >
                      <Avatar
                        src={prediction.homeTeam?.logoUrl}
                        alt={prediction.homeTeam?.name || 'Home Team'}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          maxWidth: 140,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'center',
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        }}
                      >
                        {prediction.homeTeam?.shortName || prediction.homeTeam?.name || 'Home'}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        px: 1.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 700,
                        color: 'text.primary',
                        textAlign: 'center',
                        minWidth: 72,
                      }}
                    >
                      {hasScore ? prediction.predictedScore : 'Vs'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 0,
                      }}
                    >
                      <Avatar
                        src={prediction.awayTeam?.logoUrl}
                        alt={prediction.awayTeam?.name || 'Away Team'}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          maxWidth: 140,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'center',
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        }}
                      >
                        {prediction.awayTeam?.shortName || prediction.awayTeam?.name || 'Away'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Picks:{' '}
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {prediction.picksCount ?? 0}
                    </Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accuracy:{' '}
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {prediction.accuracy ?? 0}%
                    </Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posted:{' '}
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {formatDate(prediction.datePostedUtc || prediction.startTime)}
                    </Box>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default React.memo(PredictionsList);
