/**
 * Selected Live Match View Component
 * Matches Figma UI design - Shows detailed match information
 */

'use client';

import React from 'react';
import {
  ArrowBack,
  Share,
  Notifications,
  CalendarToday,
  AccessTime,
  EmojiEvents,
  LocationOn,
  PlayArrow,
  Assignment,
} from '@mui/icons-material';
import {
  Box,
  Stack,
  Paper,
  Typography,
  Button,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import { Match, DetailedLiveMatch } from '../model/types';
import dayjs from 'dayjs';

interface SelectedLiveMatchViewProps {
  match: Match;
  detailedLiveMatch: DetailedLiveMatch;
  onBack: () => void;
}

const SelectedLiveMatchView: React.FC<SelectedLiveMatchViewProps> = ({
  match,
  detailedLiveMatch,
  onBack,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = dayjs(dateString);
    return {
      date: date.format('dddd, DD MMMM YYYY'),
      time: date.format('HH:mm [EST]'),
    };
  };

  const dateTime = formatDateTime(match.dateTime);

  // Get goal scorers from events
  const goalScorers = detailedLiveMatch.events
    .filter((event) => event.type === 'goal')
    .map((event) => ({
      player: event.playerName,
      minute: event.minute,
      team: event.team,
      isPenalty: event.description?.toLowerCase().includes('penalty') || false,
    }));

  const homeGoals = goalScorers.filter((g) => g.team === 'home');
  const awayGoals = goalScorers.filter((g) => g.team === 'away');

  return (
    <Stack spacing={2}>
      {/* Match Header - Dark Green */}
      <Paper
        elevation={1}
        sx={{
          bgcolor: 'success.main',
          borderRadius: 3,
          color: 'white',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <IconButton
            onClick={onBack}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'success.dark',
              },
            }}
            aria-label="Back"
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'success.dark',
                },
              }}
              aria-label="Share"
            >
              <Share />
            </IconButton>
            <IconButton
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'success.dark',
                },
              }}
              aria-label="Notifications"
            >
              <Notifications />
            </IconButton>
          </Box>
        </Box>

        {/* Teams and Score */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            {/* Home Team */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={match.homeTeam.logoUrl}
                alt={match.homeTeam.name}
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'semibold', textTransform: 'uppercase', textAlign: 'center' }}>
                {match.homeTeam.shortName || match.homeTeam.name}
              </Typography>
              {/* Goal Scorers */}
              {homeGoals.length > 0 && (
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                  {homeGoals.map((goal, idx) => (
                    <Typography key={idx} variant="caption" sx={{ display: 'block', lineHeight: 1.2 }}>
                      {goal.player} {goal.minute}&apos;
                      {goal.isPenalty && ' (P)'}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            {/* Score */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  mb: 0.5,
                  lineHeight: 0.8,
                }}
              >
                {match.result}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
                {match.status}
              </Typography>
            </Box>

            {/* Away Team */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={match.awayTeam.logoUrl}
                alt={match.awayTeam.name}
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'semibold', textTransform: 'uppercase', textAlign: 'center' }}>
                {match.awayTeam.shortName || match.awayTeam.name}
              </Typography>
              {/* Goal Scorers */}
              {awayGoals.length > 0 && (
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                  {awayGoals.map((goal, idx) => (
                    <Typography key={idx} variant="caption" sx={{ display: 'block', lineHeight: 1.2 }}>
                      {goal.player} {goal.minute}&apos;
                      {goal.isPenalty && ' (P)'}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Match Details */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2 }}>
          Match Details
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2">{dateTime.date}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2">{dateTime.time}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2">{match.competition || 'N/A'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="body2">{match.stadium || 'TBD'}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Predicted Outcome */}
      {match.predictedScore && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
              Predicted outcome
            </Typography>
            <Button
              endIcon={<PlayArrow sx={{ fontSize: 16 }} />}
              sx={{
                color: 'success.main',
                '&:hover': {
                  color: 'success.dark',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                View all predictions
              </Typography>
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={match.homeTeam.logoUrl}
              alt={match.homeTeam.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
                {match.homeTeam.shortName || match.homeTeam.name} wins
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {match.predictedScore}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Player of the Match */}
      {detailedLiveMatch.stats.homeTopScorer && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
              Player of the match
            </Typography>
            <Assignment sx={{ fontSize: 20, color: 'text.disabled' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={`/api/placeholder/80/80`}
              alt={detailedLiveMatch.stats.homeTopScorer.name}
              sx={{ width: 80, height: 80 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
                {detailedLiveMatch.stats.homeTopScorer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detailedLiveMatch.stats.homeTopScorer.position}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={detailedLiveMatch.stats.homeTopScorer.rating}
                  sx={{
                    bgcolor: 'success.light',
                    color: 'success.dark',
                    fontWeight: 'semibold',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Match Stats */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
            Match stats
          </Typography>
          <Assignment sx={{ fontSize: 20, color: 'text.disabled' }} />
        </Box>
        <Stack spacing={1.5}>
          {[
            [
              'Shots',
              detailedLiveMatch.stats.homeTotalShots,
              detailedLiveMatch.stats.awayTotalShots,
            ],
            [
              'Shots on target',
              detailedLiveMatch.stats.homeShotsOnTarget,
              detailedLiveMatch.stats.awayShotsOnTarget,
            ],
            [
              'Possession',
              `${detailedLiveMatch.stats.homePossession}%`,
              `${detailedLiveMatch.stats.awayPossession}%`,
            ],
            [
              'Pass accuracy',
              `${detailedLiveMatch.stats.homeTeam.winPercentage}%`,
              `${detailedLiveMatch.stats.awayTeam.winPercentage}%`,
            ],
            ['Fouls', detailedLiveMatch.stats.homeFouls, detailedLiveMatch.stats.awayFouls],
            [
              'Yellow cards',
              detailedLiveMatch.stats.homeYellowCards,
              detailedLiveMatch.stats.awayYellowCards,
            ],
            [
              'Red cards',
              detailedLiveMatch.stats.homeRedCards,
              detailedLiveMatch.stats.awayRedCards,
            ],
            [
              'Offsides',
              detailedLiveMatch.stats.homeOffsides,
              detailedLiveMatch.stats.awayOffsides,
            ],
            ['Corners', detailedLiveMatch.stats.homeCorners, detailedLiveMatch.stats.awayCorners],
          ].map(([label, home, away]) => (
            <Box key={label} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'semibold', color: 'text.secondary' }}>
                {label}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.primary' }}>
                {home as string}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.primary' }}>
                {away as string}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SelectedLiveMatchView;
