'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Paper,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { SportsSoccer, TrendingUp, Article } from '@mui/icons-material';

// ==================== TYPES ====================

interface Pick {
  market: string | null;
  selectionKey: string | null;
  selectionLabel: string | null;
  confidence: number | null;
  odds: number | null;
  tip: string | null;
  recentForm: string | null;
  homeScore: number | null;
  awayScore: number | null;
  tipGoals: number | null;
  playerId: number | null;
  playerName: string | null;
  teamId: number | null;
  teamName: string | null;
  subType: string | null;
}

interface PredictionsTabProps {
  picks?: Array<Record<string, unknown>>;
  raw?: Record<string, unknown>;
  isLoading: boolean;
}

// ==================== HELPERS ====================

function val(v: unknown): string {
  if (v === null || v === undefined || v === '') return '-';
  return String(v);
}

function getConfidenceColor(n: number): string {
  if (n >= 70) return '#22c55e';
  if (n >= 50) return '#f59e0b';
  return '#ef4444';
}

// ==================== SUB-COMPONENTS ====================

const FieldRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: 120 }}>
      {label}
    </Typography>
    <Box sx={{ textAlign: 'right' }}>{value}</Box>
  </Stack>
);

const PickCard: React.FC<{ pick: Pick; index: number }> = ({ pick, index }) => {
  const confidence = pick.confidence ?? 0;

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SportsSoccer sx={{ fontSize: 18, color: 'success.dark' }} />
          <Typography variant="subtitle2" fontWeight={700}>
            Pick #{index + 1}
          </Typography>
          <Chip
            label={val(pick.market)}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Stack>
        {confidence > 0 && (
          <Chip
            label={`${confidence}% confidence`}
            size="small"
            sx={{
              bgcolor: getConfidenceColor(confidence),
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* Selection — most prominent */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            Selection
          </Typography>
          <Typography variant="h6" fontWeight={800} sx={{ mt: 0.25 }}>
            {val(pick.selectionLabel)}
          </Typography>
        </Box>

        {/* Confidence bar */}
        {confidence > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Confidence
              </Typography>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: getConfidenceColor(confidence) }}
              >
                {confidence}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={confidence}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getConfidenceColor(confidence),
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* All pick fields */}
        <Stack divider={<Divider sx={{ opacity: 0.4 }} />}>
          <FieldRow
            label="Selection Key"
            value={
              <Typography variant="body2" fontWeight={600}>
                {val(pick.selectionKey)}
              </Typography>
            }
          />
          <FieldRow
            label="Odds"
            value={
              <Typography variant="body2" fontWeight={600}>
                {pick.odds !== null && pick.odds !== undefined
                  ? Number(pick.odds).toFixed(2)
                  : '-'}
              </Typography>
            }
          />
          <FieldRow
            label="Tip"
            value={
              <Typography variant="body2" fontWeight={600}>
                {val(pick.tip)}
              </Typography>
            }
          />
          <FieldRow
            label="Recent Form"
            value={
              <Typography variant="body2" fontWeight={600}>
                {val(pick.recentForm)}
              </Typography>
            }
          />
          <FieldRow
            label="Predicted Score"
            value={
              <Typography variant="body2" fontWeight={600}>
                {pick.homeScore !== null || pick.awayScore !== null
                  ? `${pick.homeScore ?? '-'} – ${pick.awayScore ?? '-'}`
                  : '-'}
              </Typography>
            }
          />
          <FieldRow
            label="Tip Goals"
            value={
              <Typography variant="body2" fontWeight={600}>
                {val(pick.tipGoals)}
              </Typography>
            }
          />
          <FieldRow
            label="Player"
            value={
              <Typography variant="body2" fontWeight={600}>
                {val(pick.playerName)}
              </Typography>
            }
          />
          <FieldRow
            label="Team"
            value={
              <Typography variant="body2" fontWeight={600}>
                {val(pick.teamName)}
              </Typography>
            }
          />
          <FieldRow
            label="Sub Type"
            value={
              <Typography variant="body2" fontWeight={600}>
                {val(pick.subType)}
              </Typography>
            }
          />
        </Stack>
      </Box>
    </Paper>
  );
};

// ==================== MAIN COMPONENT ====================

const PredictionsTab: React.FC<PredictionsTabProps> = ({ picks, raw, isLoading }) => {
  if (isLoading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          Loading predictions...
        </Typography>
      </Stack>
    );
  }

  const expertAnalysis = raw
    ? ((raw.expertAnalysis as string) || (raw.analysis as string) || null)
    : null;
  const accuracy = raw ? (raw.accuracy as number) ?? null : null;

  return (
    <Stack spacing={0} divider={<Divider />}>
      {/* Expert Analysis */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Article sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Expert Analysis
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{ color: 'text.primary', lineHeight: 1.8, whiteSpace: 'pre-line' }}
        >
          {expertAnalysis ?? '-'}
        </Typography>
      </Paper>

      {/* Accuracy */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TrendingUp sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Accuracy
          </Typography>
        </Stack>
        {accuracy !== null ? (
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Prediction accuracy
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: getConfidenceColor(accuracy) }}
              >
                {accuracy}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={accuracy}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getConfidenceColor(accuracy),
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.disabled">
            -
          </Typography>
        )}
      </Paper>

      {/* Picks */}
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Picks
          </Typography>
          {picks && picks.length > 0 && (
            <Chip
              label={`${picks.length} pick${picks.length !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
            />
          )}
        </Stack>

        {!picks || picks.length === 0 ? (
          <Paper
            elevation={0}
            sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2 }}
          >
            <SportsSoccer sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No picks available for this prediction.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {picks.map((pickData, index) => (
              <PickCard key={index} pick={pickData as unknown as Pick} index={index} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default PredictionsTab;
