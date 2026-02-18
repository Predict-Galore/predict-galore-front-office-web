/**
 * Predictions Tab Component
 * Shows comprehensive prediction details including all picks
 * 
 * This component displays:
 * - List of all prediction picks for a match
 * - Market information and selection details
 * - Confidence levels and odds
 * - Additional prediction metadata
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import {
  SportsSoccer,
  Info,
} from '@mui/icons-material';

// ==================== TYPES ====================

interface Pick {
  market: string;
  selectionKey: string;
  selectionLabel: string;
  confidence: number;
  odds: number;
  tip: string;
  recentForm: string;
  homeScore: number;
  awayScore: number;
  tipGoals: number;
  playerId: number;
  playerName: string;
  teamId: number;
  teamName: string;
  subType: string;
}

interface PredictionsTabProps {
  picks?: Array<Record<string, unknown>>;
  isLoading: boolean;
}

// ==================== HELPER COMPONENTS ====================

/**
 * Loading skeleton for picks
 */
const PicksSkeleton: React.FC = () => (
  <Stack spacing={2}>
    {[1, 2, 3].map((i) => (
      <Paper key={i} elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={20} />
          <Box sx={{ flex: 1, height: 24, bgcolor: 'grey.200', borderRadius: 1 }} />
        </Box>
        <Box sx={{ height: 16, bgcolor: 'grey.100', borderRadius: 1, mb: 1 }} />
        <Box sx={{ height: 16, width: '60%', bgcolor: 'grey.100', borderRadius: 1 }} />
      </Paper>
    ))}
  </Stack>
);

/**
 * Empty state when no picks available
 */
const EmptyState: React.FC = () => (
  <Paper
    elevation={2}
    sx={{
      p: 6,
      textAlign: 'center',
      borderRadius: 3,
      bgcolor: 'grey.50',
    }}
  >
    <Info sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      No Predictions Available
    </Typography>
    <Typography variant="body2" color="text.secondary">
      No prediction details available for this match.
    </Typography>
  </Paper>
);

/**
 * Detail item component for pick information
 */
interface DetailItemProps {
  label: string;
  value: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'grey.50',
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 2,
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: 0.5,
        display: 'block',
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600} color="text.primary">
      {value}
    </Typography>
  </Paper>
);

// ==================== MAIN COMPONENT ====================

const PredictionsTab: React.FC<PredictionsTabProps> = ({ picks, isLoading }) => {
  // ==================== LOADING STATE ====================
  
  if (isLoading) {
    return <PicksSkeleton />;
  }

  // ==================== EMPTY STATE ====================
  
  if (!picks || picks.length === 0) {
    return <EmptyState />;
  }

  // ==================== RENDER PICKS ====================

  return (
    <Stack spacing={3}>
      {/* Picks Count */}
      <Typography variant="body2" color="text.secondary">
        Showing {picks.length} prediction{picks.length !== 1 ? 's' : ''}
      </Typography>

      {/* Picks List */}
      {picks.map((pickData, index) => {
        // Type assertion with proper null checks
        const pick = pickData as Partial<Pick>;

        return (
          <Card
            key={index}
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            {/* Pick Header */}
            <CardHeader
              avatar={
                <SportsSoccer sx={{ color: 'success.dark' }} />
              }
              title={
                <Typography variant="h6" fontWeight={600}>
                  {pick.market || 'N/A'}
                </Typography>
              }
              action={
                pick.confidence && pick.confidence > 0 ? (
                  <Chip
                    label={`${pick.confidence}% Confidence`}
                    color="success"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                ) : null
              }
              sx={{
                bgcolor: 'success.50',
                borderBottom: '1px solid',
                borderColor: 'success.200',
              }}
            />

            {/* Pick Content */}
            <CardContent sx={{ p: 3 }}>
              {/* Main Prediction */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  Prediction
                </Typography>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {pick.selectionLabel || 'N/A'}
                </Typography>
                {pick.selectionKey && (
                  <Typography variant="body2" color="text.secondary">
                    Selection: {pick.selectionKey}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Additional Details Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {/* Odds */}
                {pick.odds && pick.odds > 0 && (
                  <DetailItem
                    label="Odds"
                    value={Number(pick.odds).toFixed(2)}
                  />
                )}

                {/* Tip */}
                {pick.tip && <DetailItem label="Tip" value={pick.tip} />}

                {/* Recent Form */}
                {pick.recentForm && (
                  <DetailItem label="Recent Form" value={pick.recentForm} />
                )}

                {/* Predicted Score */}
                {(pick.homeScore || pick.awayScore) &&
                  ((pick.homeScore ?? 0) > 0 || (pick.awayScore ?? 0) > 0) && (
                    <DetailItem
                      label="Predicted Score"
                      value={`${pick.homeScore || 0} - ${pick.awayScore || 0}`}
                    />
                  )}

                {/* Tip Goals */}
                {pick.tipGoals && pick.tipGoals > 0 && (
                  <DetailItem label="Tip Goals" value={pick.tipGoals} />
                )}

                {/* Player Name */}
                {pick.playerName && (
                  <DetailItem label="Player" value={pick.playerName} />
                )}

                {/* Team Name */}
                {pick.teamName && <DetailItem label="Team" value={pick.teamName} />}

                {/* Sub Type */}
                {pick.subType && <DetailItem label="Sub Type" value={pick.subType} />}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default PredictionsTab;
