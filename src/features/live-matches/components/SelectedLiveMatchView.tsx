/**
 * Selected Live Match View Component
 * Displays detailed information about a selected live match
 * 
 * This component shows:
 * - Match header with teams, score, and status
 * - Goal scorers for both teams
 * - Match details (date, time, venue, competition)
 * - Predicted outcome
 * - Player of the match
 * - Match statistics comparison
 */

'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  NotificationsNone,
  CalendarTodayOutlined,
  AccessTimeOutlined,
  LocationOnOutlined,
  StadiumOutlined,
  SportsSoccer,
  PlayCircleOutline,
  AssignmentOutlined,
  BarChartOutlined,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { Match, DetailedLiveMatch } from '../model/types';

// ==================== TYPES ====================

interface SelectedLiveMatchViewProps {
  match: Match;
  detailedLiveMatch: DetailedLiveMatch;
  onBack: () => void;
}

interface GoalScorer {
  player: string;
  minute: number;
  team: 'home' | 'away';
  isPenalty: boolean;
  extraTime?: number;
}

// ==================== HELPER COMPONENTS ====================

/**
 * Section Icon Component
 * Green circular icon container for section headers
 */
interface SectionIconProps {
  children: React.ReactNode;
}

const SectionIcon: React.FC<SectionIconProps> = ({ children }) => (
  <Box
    sx={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      bgcolor: 'success.50',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </Box>
);

/**
 * Section Header Component
 * Reusable header for content sections
 */
interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ mb: 3 }}
  >
    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
      {title}
    </Typography>
    <SectionIcon>{icon}</SectionIcon>
  </Stack>
);

/**
 * Info Row Component
 * Displays icon and text information
 */
interface InfoRowProps {
  icon: React.ReactNode;
  text: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
      {text}
    </Typography>
  </Stack>
);

/**
 * Stat Row Component
 * Displays a statistic comparison between home and away teams
 */
interface StatRowProps {
  label: string;
  homeValue: string | number;
  awayValue: string | number;
}

const StatRow: React.FC<StatRowProps> = ({ label, homeValue, awayValue }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      py: 1.5,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        color: 'text.primary',
        textAlign: 'left',
        fontSize: '0.875rem',
      }}
    >
      {homeValue}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        color: 'text.secondary',
        textAlign: 'center',
        fontSize: '0.8125rem',
        px: 2,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        color: 'text.primary',
        textAlign: 'right',
        fontSize: '0.875rem',
      }}
    >
      {awayValue}
    </Typography>
  </Box>
);

// ==================== MAIN COMPONENT ====================

const SelectedLiveMatchView: React.FC<SelectedLiveMatchViewProps> = ({
  match,
  detailedLiveMatch,
  onBack,
}) => {
  // ==================== COMPUTED VALUES ====================

  /**
   * Format date and time for display
   */
  const dateTime = useMemo(() => {
    const date = dayjs(match.dateTime);
    return {
      date: date.format('dddd, DD MMMM YYYY'),
      time: date.format('HH:mm [EST]'),
    };
  }, [match.dateTime]);

  /**
   * Extract and format goal scorers from match events
   */
  const goalScorers = useMemo(() => {
    const goals = detailedLiveMatch.events
      .filter((event) => event.type === 'goal')
      .map((event): GoalScorer => ({
        player: event.playerName || 'Unknown',
        minute: event.minute,
        team: event.team,
        isPenalty: event.description?.toLowerCase().includes('penalty') || false,
        extraTime: event.extraTime,
      }));

    return {
      home: goals.filter((g) => g.team === 'home'),
      away: goals.filter((g) => g.team === 'away'),
    };
  }, [detailedLiveMatch.events]);

  /**
   * Format goal scorer text
   */
  const formatGoal = (goal: GoalScorer): string => {
    let text = goal.player;
    text += ` ${goal.minute}'`;
    if (goal.extraTime) {
      text = `${goal.player} ${goal.minute}+${goal.extraTime}'`;
    }
    if (goal.isPenalty) {
      text += ' (P)';
    }
    return text;
  };

  /**
   * Match statistics for comparison
   */
  const matchStats = useMemo(
    () => [
      {
        label: 'Shots',
        home: detailedLiveMatch.stats.homeTotalShots,
        away: detailedLiveMatch.stats.awayTotalShots,
      },
      {
        label: 'Shots on target',
        home: detailedLiveMatch.stats.homeShotsOnTarget,
        away: detailedLiveMatch.stats.awayShotsOnTarget,
      },
      {
        label: 'Possession',
        home: detailedLiveMatch.stats.homePossession,
        away: detailedLiveMatch.stats.awayPossession,
      },
      {
        label: 'Passes',
        home: detailedLiveMatch.stats.homeTeam.goalsPerGame,
        away: detailedLiveMatch.stats.awayTeam.goalsPerGame,
      },
      {
        label: 'Pass accuracy',
        home: `${detailedLiveMatch.stats.homeTeam.winPercentage}%`,
        away: `${detailedLiveMatch.stats.awayTeam.winPercentage}%`,
      },
      {
        label: 'Fouls',
        home: `${detailedLiveMatch.stats.homeFouls}%`,
        away: `${detailedLiveMatch.stats.awayFouls}%`,
      },
      {
        label: 'Yellow cards',
        home: detailedLiveMatch.stats.homeYellowCards,
        away: detailedLiveMatch.stats.awayYellowCards,
      },
      {
        label: 'Red cards',
        home: detailedLiveMatch.stats.homeRedCards,
        away: detailedLiveMatch.stats.awayRedCards,
      },
      {
        label: 'Offsides',
        home: detailedLiveMatch.stats.homeOffsides,
        away: detailedLiveMatch.stats.awayOffsides,
      },
      {
        label: 'Corners',
        home: detailedLiveMatch.stats.homeCorners,
        away: detailedLiveMatch.stats.awayCorners,
      },
    ],
    [detailedLiveMatch.stats]
  );

  // ==================== RENDER ====================

  return (
    <Box>
      {/* Match Header (Dark Green Gradient) */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a4d2e 0%, #1e5a35 50%, #22673d 100%)',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
        }}
      >
        {/* Top Action Bar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, pt: 2, pb: 1 }}
        >
          <IconButton
            onClick={onBack}
            aria-label="Go back"
            sx={{ color: 'white' }}
          >
            <ArrowBack />
          </IconButton>

          <Stack direction="row" spacing={0.5}>
            <IconButton aria-label="Share match" sx={{ color: 'white' }}>
              <Share sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton aria-label="Notifications" sx={{ color: 'white' }}>
              <NotificationsNone sx={{ fontSize: 22 }} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Teams and Score */}
        <Box sx={{ px: 2, pb: 4 }}>
          <Stack
            direction="row"
            spacing={{ xs: 3, sm: 5 }}
            alignItems="flex-start"
            justifyContent="center"
          >
            {/* Home Team */}
            <Stack alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Avatar
                src={match.homeTeam.logoUrl}
                alt={match.homeTeam.name}
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'white',
                  p: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  letterSpacing: 0.5,
                }}
              >
                {match.homeTeam.shortName || match.homeTeam.name}
              </Typography>
            </Stack>

            {/* Score and Status */}
            <Stack alignItems="center" spacing={1} sx={{ pt: 0.5 }}>
              <Typography
                sx={{
                  color: 'white',
                  fontSize: { xs: '3rem', sm: '3.5rem' },
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: 3,
                }}
              >
                {match.result}
              </Typography>
              <Chip
                label={match.status}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  height: 28,
                }}
              />
            </Stack>

            {/* Away Team */}
            <Stack alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Avatar
                src={match.awayTeam.logoUrl}
                alt={match.awayTeam.name}
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'white',
                  p: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  letterSpacing: 0.5,
                }}
              >
                {match.awayTeam.shortName || match.awayTeam.name}
              </Typography>
            </Stack>
          </Stack>

          {/* Goal Scorers */}
          {(goalScorers.home.length > 0 || goalScorers.away.length > 0) && (
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
              justifyContent="center"
              sx={{ mt: 3, px: 1 }}
            >
              {/* Home Scorers */}
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                {goalScorers.home.map((goal, i) => (
                  <Typography
                    key={i}
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.75rem',
                      lineHeight: 1.8,
                    }}
                  >
                    {formatGoal(goal)}
                  </Typography>
                ))}
              </Box>

              {/* Ball Icon */}
              <Box sx={{ pt: 0.5 }}>
                <SportsSoccer sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
              </Box>

              {/* Away Scorers */}
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                {goalScorers.away.map((goal, i) => (
                  <Typography
                    key={i}
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.75rem',
                      lineHeight: 1.8,
                    }}
                  >
                    {formatGoal(goal)}
                  </Typography>
                ))}
              </Box>
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Content Sections (White Background) */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '0 0 16px 16px',
          border: '1px solid',
          borderTop: 'none',
          borderColor: 'grey.200',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {/* Match Details Section */}
        <Box sx={{ px: 3, py: 3 }}>
          <SectionHeader
            title="Match Details"
            icon={<SportsSoccer sx={{ fontSize: 16, color: 'success.main' }} />}
          />

          <Stack spacing={2}>
            <InfoRow
              icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
              text={dateTime.date}
            />
            <InfoRow
              icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />}
              text={dateTime.time}
            />
            <InfoRow
              icon={<LocationOnOutlined sx={{ fontSize: 18 }} />}
              text={match.competition || 'N/A'}
            />
            <InfoRow
              icon={<StadiumOutlined sx={{ fontSize: 18 }} />}
              text={match.stadium || 'TBD'}
            />
          </Stack>
        </Box>

        <Divider sx={{ mx: 3 }} />

        {/* Predicted Outcome Section */}
        {match.predictedScore && (
          <>
            <Box sx={{ px: 3, py: 3 }}>
              <SectionHeader
                title="Predicted outcome"
                icon={<PlayCircleOutline sx={{ fontSize: 16, color: 'success.main' }} />}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={match.homeTeam.logoUrl}
                  alt={match.homeTeam.name}
                  sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {match.homeTeam.shortName || match.homeTeam.name} wins
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.8125rem' }}
                  >
                    {match.predictedScore}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  View all predictions
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ mx: 3 }} />
          </>
        )}

        {/* Player of the Match Section */}
        {detailedLiveMatch.stats.homeTopScorer && (
          <>
            <Box sx={{ px: 3, py: 3 }}>
              <SectionHeader
                title="Player of the match"
                icon={<AssignmentOutlined sx={{ fontSize: 16, color: 'success.main' }} />}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                {/* Player Avatar with Team Badge */}
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={
                      (detailedLiveMatch.stats.homeTopScorer as { imageUrl?: string })
                        ?.imageUrl
                    }
                    alt={detailedLiveMatch.stats.homeTopScorer.name}
                    sx={{ width: 48, height: 48, bgcolor: 'grey.200' }}
                  >
                    {detailedLiveMatch.stats.homeTopScorer.name?.[0]?.toUpperCase() ?? '?'}
                  </Avatar>
                  <Avatar
                    src={match.homeTeam.logoUrl}
                    alt={match.homeTeam.name}
                    sx={{
                      width: 18,
                      height: 18,
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      border: '2px solid white',
                      bgcolor: 'grey.100',
                    }}
                  />
                </Box>

                {/* Player Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                    {detailedLiveMatch.stats.homeTopScorer.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.8125rem' }}
                  >
                    {detailedLiveMatch.stats.homeTopScorer.position}
                  </Typography>
                </Box>

                {/* Rating Badge */}
                <Chip
                  label={detailedLiveMatch.stats.homeTopScorer.rating}
                  sx={{
                    bgcolor: 'grey.100',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ mx: 3 }} />
          </>
        )}

        {/* Match Stats Section */}
        <Box sx={{ px: 3, py: 3 }}>
          <SectionHeader
            title="Match stats"
            icon={<BarChartOutlined sx={{ fontSize: 16, color: 'success.main' }} />}
          />

          {/* Team Logos */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 3, px: 0.5 }}
          >
            <Avatar
              src={match.homeTeam.logoUrl}
              alt={match.homeTeam.name}
              sx={{ width: 36, height: 36 }}
            />
            <Avatar
              src={match.awayTeam.logoUrl}
              alt={match.awayTeam.name}
              sx={{ width: 36, height: 36 }}
            />
          </Stack>

          {/* Stats Rows */}
          <Stack spacing={0.5}>
            {matchStats.map((stat) => (
              <StatRow
                key={stat.label}
                label={stat.label}
                homeValue={stat.home}
                awayValue={stat.away}
              />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default SelectedLiveMatchView;
