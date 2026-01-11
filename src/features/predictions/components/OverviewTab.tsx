/**
 * Overview Tab Component
 * Shows predicted outcome, expert analysis, voting, team form, comparison, and top scorers
 */

'use client';

import React, { useState } from 'react';
import {
  AccessTime,
  ThumbUp,
  ThumbDown,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Assignment,
  BarChart,
  Star,
} from '@mui/icons-material';
import { Box, Stack, Paper, Typography, Button, Chip, Avatar, IconButton } from '@mui/material';
import { Prediction, DetailedPrediction } from '../model/types';

interface OverviewTabProps {
  prediction: Prediction;
  detailed: DetailedPrediction;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ prediction, detailed }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);


  const analysisText = detailed.expertAnalysis;
  const truncatedAnalysis =
    analysisText.length > 200 ? analysisText.substring(0, 200) + '...' : analysisText;

  return (
    <Stack spacing={2.5}>
      {/* Predicted Outcome */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'white',
          p: { xs: 2, sm: 2.5 },
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
            Predicted outcome
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: 'grey.500' }} />
            <Typography variant="body2" color="text.secondary">
              17:59:04
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar
            src={prediction.homeTeam.logoUrl}
            alt={prediction.homeTeam.name}
            sx={{ width: 40, height: 40 }}
          />
          <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
            {detailed.predictedOutcome}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {detailed.reasoning}
        </Typography>
        <Chip
          label={`${detailed.confidenceLevel}% Confidence`}
          sx={{
            bgcolor: 'success.main',
            color: 'white',
            fontWeight: 'semibold',
            borderRadius: '50px',
          }}
        />
      </Paper>

      {/* Expert Analysis */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'white',
          p: { xs: 2, sm: 2.5 },
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
            Expert analysis
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton size="small" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              <ThumbUp sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                24
              </Typography>
            </IconButton>
            <IconButton size="small" sx={{ color: 'grey.600', '&:hover': { color: 'grey.900' } }}>
              <ThumbDown sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: analysisText.length > 200 ? 1 : 0 }}>
          {showFullAnalysis ? analysisText : truncatedAnalysis}
        </Typography>
        {analysisText.length > 200 && (
          <Button
            onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            sx={{
              mt: 1,
              color: 'success.main',
              '&:hover': { color: 'success.dark' },
              fontSize: '0.875rem',
            }}
            startIcon={
              showFullAnalysis ? (
                <KeyboardArrowUp sx={{ fontSize: 16 }} />
              ) : (
                <KeyboardArrowDown sx={{ fontSize: 16 }} />
              )
            }
          >
            {showFullAnalysis ? 'Show less' : 'Show more'}
          </Button>
        )}
      </Paper>

      {/* Who will win? */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'white',
          p: { xs: 2, sm: 2.5 },
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
            Who will win?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total votes: {detailed.totalVotes}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Share your prediction by casting your vote with the community.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, sm: 3 } }}>
          <Button
            onClick={() => setSelectedVote('home')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: selectedVote === 'home' ? 'success.main' : 'grey.300',
              bgcolor: selectedVote === 'home' ? 'success.50' : 'transparent',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: selectedVote === 'home' ? 'success.main' : 'grey.400',
              },
            }}
          >
            <Avatar
              src={prediction.homeTeam.logoUrl}
              alt={prediction.homeTeam.name}
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800' }}>
              Home
            </Typography>
          </Button>
          <Button
            onClick={() => setSelectedVote('draw')}
            sx={{
              px: 3,
              py: 2,
              borderRadius: 3,
              border: '1px solid',
              borderColor: selectedVote === 'draw' ? 'success.main' : 'grey.300',
              bgcolor: selectedVote === 'draw' ? 'success.50' : 'transparent',
              color: selectedVote === 'draw' ? 'success.main' : 'grey.700',
              fontWeight: 'semibold',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: selectedVote === 'draw' ? 'success.main' : 'grey.400',
              },
            }}
          >
            Draw
          </Button>
          <Button
            onClick={() => setSelectedVote('away')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: selectedVote === 'away' ? 'success.main' : 'grey.300',
              bgcolor: selectedVote === 'away' ? 'success.50' : 'transparent',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: selectedVote === 'away' ? 'success.main' : 'grey.400',
              },
            }}
          >
            <Avatar
              src={prediction.awayTeam.logoUrl}
              alt={prediction.awayTeam.name}
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800' }}>
              Away
            </Typography>
          </Button>
        </Box>
      </Paper>

      {/* Team Form */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'white',
          p: { xs: 2, sm: 2.5 },
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
            Team Form
          </Typography>
          <Assignment sx={{ fontSize: 20, color: 'grey.400' }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'semibold', color: 'grey.800' }}>
              {prediction.homeTeam.shortName || prediction.homeTeam.name}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {detailed.homeTeamStats.recentForm.slice(0, 5).map((form, index) => (
                <Chip
                  key={index}
                  label={form}
                  size="small"
                  sx={{
                    height: 'auto',
                    fontSize: '0.75rem',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    ...(form === 'W'
                      ? { bgcolor: 'success.50', color: 'success.800', borderColor: 'success.300' }
                      : form === 'L'
                      ? { bgcolor: 'error.50', color: 'error.800', borderColor: 'error.300' }
                      : { bgcolor: 'grey.50', color: 'grey.800', borderColor: 'grey.300' }),
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'semibold', color: 'grey.800' }}>
              {prediction.awayTeam.shortName || prediction.awayTeam.name}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {detailed.awayTeamStats.recentForm.slice(0, 5).map((form, index) => (
                <Chip
                  key={index}
                  label={form}
                  size="small"
                  sx={{
                    height: 'auto',
                    fontSize: '0.75rem',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    ...(form === 'W'
                      ? { bgcolor: 'success.50', color: 'success.800', borderColor: 'success.300' }
                      : form === 'L'
                      ? { bgcolor: 'error.50', color: 'error.800', borderColor: 'error.300' }
                      : { bgcolor: 'grey.50', color: 'grey.800', borderColor: 'grey.300' }),
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Team Comparison */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'white',
          p: { xs: 2, sm: 2.5 },
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
            Team Comparison
          </Typography>
          <BarChart sx={{ fontSize: 20, color: 'grey.400' }} />
        </Box>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, fontWeight: 500, color: 'grey.600' }}>
          Statistics
        </Typography>
        <Stack spacing={1.5}>
          {[
            {
              label: 'Recent Form',
              home: detailed.homeTeamStats.recentForm.join('-'),
              away: detailed.awayTeamStats.recentForm.join('-'),
            },
            {
              label: 'Head-to-Head Wins',
              home: detailed.homeTeamStats.headToHeadWins.join('-'),
              away: detailed.awayTeamStats.headToHeadWins.join('-'),
            },
            {
              label: 'Goals per game',
              home: detailed.homeTeamStats.goalsPerGame,
              away: detailed.awayTeamStats.goalsPerGame,
            },
            {
              label: 'Goals conceded per game',
              home: detailed.homeTeamStats.goalsConcededPerGame,
              away: detailed.awayTeamStats.goalsConcededPerGame,
            },
            {
              label: 'Win percentage',
              home: `${detailed.homeTeamStats.winPercentage}%`,
              away: `${detailed.awayTeamStats.winPercentage}%`,
            },
            {
              label: 'Possession percentage',
              home: `${detailed.homeTeamStats.possessionPercentage}%`,
              away: `${detailed.awayTeamStats.possessionPercentage}%`,
            },
            {
              label: 'Clean sheets',
              home: detailed.homeTeamStats.cleanSheets,
              away: detailed.awayTeamStats.cleanSheets,
            },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 1,
                fontSize: '0.875rem',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'semibold', color: 'grey.800' }}>
                {stat.label}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'grey.700' }}>
                {stat.home}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'grey.700' }}>
                {stat.away}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Top Scorers */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
            Top scorers
          </Typography>
          <Star sx={{ fontSize: 20, color: 'text.disabled' }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'grey.100' }}>
            <Box sx={{ textAlign: 'center', mb: 1.5 }}>
              <Avatar
                src={`/api/placeholder/80/80`}
                alt={detailed.homeTopScorer.name}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
                {detailed.homeTopScorer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detailed.homeTopScorer.position}
              </Typography>
              <Chip
                label={detailed.homeTopScorer.rating}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  fontWeight: 'semibold',
                }}
              />
            </Box>
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Age:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.homeTopScorer.age}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Height:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.homeTopScorer.height}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Weight:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.homeTopScorer.weight}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Matches:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.homeTopScorer.matches}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Goals:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.homeTopScorer.goals}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Assists:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.homeTopScorer.assists}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Yellow cards:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.homeTopScorer.yellowCards}</Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'grey.100' }}>
            <Box sx={{ textAlign: 'center', mb: 1.5 }}>
              <Avatar
                src={`/api/placeholder/80/80`}
                alt={detailed.awayTopScorer.name}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
                {detailed.awayTopScorer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detailed.awayTopScorer.position}
              </Typography>
              <Chip
                label={detailed.awayTopScorer.rating}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  fontWeight: 'semibold',
                }}
              />
            </Box>
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Age:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.awayTopScorer.age}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Height:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.awayTopScorer.height}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Weight:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.awayTopScorer.weight}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Matches:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.awayTopScorer.matches}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Goals:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.awayTopScorer.goals}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Assists:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.awayTopScorer.assists}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Yellow cards:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{detailed.awayTopScorer.yellowCards}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Paper>
    </Stack>
  );
};

export default OverviewTab;
