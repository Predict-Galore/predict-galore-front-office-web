/**
 * Selected Prediction View Component
 * Migrated to feature architecture
 */

import React, { useMemo } from 'react';
import Image from 'next/image';
import {
  CalendarDays,
  MapPin,
  Trophy,
  BarChart3,
  TrendingUp,
  ChevronLeft,
  Vote,
  Award,
  Target,
} from 'lucide-react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Badge,
} from '@mui/material';
import { Match, DetailedPrediction } from '../model/types';
import { PREDICTIONS_CONSTANTS } from '../lib/constants';
import { formatDateTime, getInitials } from '@/shared/lib/utils';
import { statusColors, textColors } from '@/shared/constants/color-tokens';

interface SelectedPredictionViewProps {
  prediction: Match;
  detailedPrediction: DetailedPrediction;
  onBack: () => void;
  onVote?: (voteOptionId: string) => void;
}

const SelectedPredictionView: React.FC<SelectedPredictionViewProps> = ({
  prediction,
  detailedPrediction,
  onBack,
  onVote,
}) => {
  const getVotePercentage = (votes: number) => {
    return Math.round((votes / detailedPrediction.totalVotes) * 100);
  };

  return (
    <Stack spacing={2}>
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              onClick={onBack}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {prediction.homeTeam.name} vs {prediction.awayTeam.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <CalendarDays size={16} color="#6b7280" />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {formatDateTime(prediction.dateTime)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Chip
            label={prediction.status}
            sx={{
              bgcolor: 'grey.100',
              color: 'text.primary',
              fontWeight: 500,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
            }}
          />
        </Box>
      </Box>

      {/* Match Info */}
      <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, sm: 4 },
            mb: 3,
          }}
        >
          {/* Home Team */}
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                mx: 'auto',
                mb: 1,
                bgcolor: 'primary.main',
              }}
            >
              {prediction.homeTeam.logoUrl ? (
                <Image
                  src={prediction.homeTeam.logoUrl}
                  alt={prediction.homeTeam.name}
                  width={64}
                  height={64}
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                getInitials(prediction.homeTeam.name)
              )}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {prediction.homeTeam.name}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {prediction.result.split('-')[0]}
            </Typography>
          </Box>

          {/* VS */}
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              VS
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              League {prediction.leagueId}
            </Typography>
          </Box>

          {/* Away Team */}
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                mx: 'auto',
                mb: 1,
                bgcolor: 'primary.main',
              }}
            >
              {prediction.awayTeam.logoUrl ? (
                <Image
                  src={prediction.awayTeam.logoUrl}
                  alt={prediction.awayTeam.name}
                  width={64}
                  height={64}
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                getInitials(prediction.awayTeam.name)
              )}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {prediction.awayTeam.name}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {prediction.result.split('-')[1]}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Prediction Details */}
      <Stack spacing={3}>
        {/* Expert Analysis */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Expert Analysis
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {detailedPrediction.expertAnalysis}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<TrendingUp />}
              label="Trending"
              size="small"
              sx={{ bgcolor: 'success.light', color: 'success.dark' }}
            />
            <Chip
              icon={<Target />}
              label="High Confidence"
              size="small"
              sx={{ bgcolor: 'info.light', color: 'info.dark' }}
            />
          </Box>
        </Paper>

        {/* Voting Section */}
        {detailedPrediction.voteOptions.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Community Vote
            </Typography>

            <Stack spacing={2}>
              {detailedPrediction.voteOptions.map((option) => (
                <Box key={option.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.score}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {option.votes} votes ({getVotePercentage(option.votes)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getVotePercentage(option.votes)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Stack>

            {onVote && (
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => onVote(detailedPrediction.voteOptions[0].id)}
              >
                Cast Your Vote
              </Button>
            )}
          </Paper>
        )}

        {/* Statistics */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Match Statistics
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {Math.round(detailedPrediction.homeTeamStats.winPercentage * 100)}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Home Win %
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {Math.round(detailedPrediction.awayTeamStats.winPercentage * 100)}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Away Win %
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {detailedPrediction.homeTeamStats.goalsPerGame.toFixed(1)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Goals/Game
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {detailedPrediction.awayTeamStats.goalsPerGame.toFixed(1)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Goals/Game
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<BarChart3 />}
          sx={{ flex: 1 }}
        >
          View Statistics
        </Button>
        <Button
          variant="contained"
          startIcon={<Vote />}
          sx={{ flex: 1 }}
        >
          Place Bet
        </Button>
      </Box>
    </Stack>
  );
};

export default React.memo(SelectedPredictionView);