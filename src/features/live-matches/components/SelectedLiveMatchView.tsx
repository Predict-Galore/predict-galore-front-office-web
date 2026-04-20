/**
 * SelectedLiveMatchView
 *
 * Renders the detail view for a selected live match.
 * Only displays data that is actually returned by the backend:
 *
 *   GET /api/v1/livescores/match/{providerFixtureId}
 *   {
 *     providerFixtureId, league,
 *     homeTeam, awayTeam, homeTeamLogo, awayTeamLogo,
 *     homeScore, awayScore, status, elapsed, kickoffUtc,
 *     events: { goals[], homeYellowCards, awayYellowCards, homeRedCards, awayRedCards }
 *   }
 */

'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  CalendarTodayOutlined,
  AccessTimeOutlined,
  EmojiEvents,
  SportsSoccer,
  Square,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import type { Match, DetailedLiveMatch } from '../model/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SelectedLiveMatchViewProps {
  match: Match;
  detailedLiveMatch: DetailedLiveMatch;
  onBack: () => void;
}

// ─── Status label helper ──────────────────────────────────────────────────────

function statusLabel(status: string, elapsed: number): string {
  switch (status) {
    case '1H': return `${elapsed}'`;
    case '2H': return `${elapsed}'`;
    case 'HT': return 'Half Time';
    case 'ET': return `ET ${elapsed}'`;
    case 'FT': return 'Full Time';
    case 'POSTPONED': return 'Postponed';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
}

// ─── Card icon ────────────────────────────────────────────────────────────────

const YellowCard: React.FC = () => (
  <Square sx={{ fontSize: 14, color: '#f5c518', borderRadius: '2px' }} />
);

const RedCard: React.FC = () => (
  <Square sx={{ fontSize: 14, color: 'error.main', borderRadius: '2px' }} />
);

// ─── Main component ───────────────────────────────────────────────────────────

const SelectedLiveMatchView: React.FC<SelectedLiveMatchViewProps> = ({
  match,
  detailedLiveMatch,
  onBack,
}) => {
  const { events } = detailedLiveMatch;

  // Separate goals by team
  const homeGoals = events.filter((e) => e.type === 'goal' && e.team === 'home');
  const awayGoals = events.filter((e) => e.type === 'goal' && e.team === 'away');

  // Card counts come from stats (mapped from backend events object)
  const { homeYellowCards, awayYellowCards, homeRedCards, awayRedCards } =
    detailedLiveMatch.stats;

  const kickoff = dayjs(match.dateTime);

  return (
    <Box>
      {/* ── Header (dark green gradient) ── */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a4d2e 0%, #1e5a35 50%, #22673d 100%)',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
        }}
      >
        {/* Back button */}
        <Box sx={{ px: 2, pt: 2 }}>
          <IconButton onClick={onBack} aria-label="Go back" sx={{ color: 'white' }}>
            <ArrowBack />
          </IconButton>
        </Box>

        {/* League name */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 600,
            letterSpacing: 0.5,
            mb: 2,
            px: 2,
          }}
        >
          {match.competition}
        </Typography>

        {/* Teams + Score */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ px: 3, pb: 1 }}
        >
          {/* Home team */}
          <Stack alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Avatar
              src={match.homeTeam.logoUrl}
              alt={match.homeTeam.name}
              sx={{ width: 60, height: 60, bgcolor: 'white', p: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                fontSize: '0.75rem',
                letterSpacing: 0.3,
              }}
            >
              {match.homeTeam.name}
            </Typography>
          </Stack>

          {/* Score + status */}
          <Stack alignItems="center" spacing={0.75}>
            <Typography
              sx={{
                color: 'white',
                fontSize: { xs: '2.75rem', sm: '3.25rem' },
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: 4,
              }}
            >
              {match.result}
            </Typography>
            <Chip
              label={statusLabel(match.status, detailedLiveMatch.currentMinute)}
              size="small"
              sx={{
                bgcolor: match.status === 'FT' ? 'rgba(255,255,255,0.15)' : 'success.main',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
                px: 1,
              }}
            />
          </Stack>

          {/* Away team */}
          <Stack alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Avatar
              src={match.awayTeam.logoUrl}
              alt={match.awayTeam.name}
              sx={{ width: 60, height: 60, bgcolor: 'white', p: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                fontSize: '0.75rem',
                letterSpacing: 0.3,
              }}
            >
              {match.awayTeam.name}
            </Typography>
          </Stack>
        </Stack>

        {/* Goal scorers under the score */}
        {(homeGoals.length > 0 || awayGoals.length > 0) && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: 4, pb: 3, pt: 1 }}
          >
            {/* Home goals */}
            <Stack spacing={0.25} sx={{ flex: 1 }}>
              {homeGoals.map((g) => (
                <Stack key={g.id} direction="row" alignItems="center" spacing={0.5}>
                  <SportsSoccer sx={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
                    {g.playerName ? `${g.playerName} ${g.minute}'` : `${g.minute}'`}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Away goals */}
            <Stack spacing={0.25} alignItems="flex-end" sx={{ flex: 1 }}>
              {awayGoals.map((g) => (
                <Stack key={g.id} direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
                    {g.playerName ? `${g.playerName} ${g.minute}'` : `${g.minute}'`}
                  </Typography>
                  <SportsSoccer sx={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}

        {!homeGoals.length && !awayGoals.length && <Box sx={{ pb: 3 }} />}
      </Paper>

      {/* ── Body ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '0 0 16px 16px',
          border: '1px solid',
          borderTop: 'none',
          borderColor: 'grey.200',
        }}
      >
        {/* Match info */}
        <Box sx={{ px: 3, py: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <EmojiEvents sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Match Info
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CalendarTodayOutlined sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">
                {kickoff.format('dddd, DD MMMM YYYY')}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5}>
              <AccessTimeOutlined sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">
                {kickoff.format('HH:mm')} UTC
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ mx: 3 }} />

        {/* Cards summary */}
        <Box sx={{ px: 3, py: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Square sx={{ fontSize: 18, color: '#f5c518' }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Cards
            </Typography>
          </Stack>

          {/* Header row */}
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {match.homeTeam.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {match.awayTeam.name}
            </Typography>
          </Stack>

          {/* Yellow cards */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {Array.from({ length: homeYellowCards }).map((_, i) => (
                <YellowCard key={i} />
              ))}
              <Typography variant="body2" fontWeight={700} sx={{ ml: 0.5 }}>
                {homeYellowCards}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Yellow
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" fontWeight={700} sx={{ mr: 0.5 }}>
                {awayYellowCards}
              </Typography>
              {Array.from({ length: awayYellowCards }).map((_, i) => (
                <YellowCard key={i} />
              ))}
            </Stack>
          </Stack>

          {/* Red cards */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {Array.from({ length: homeRedCards }).map((_, i) => (
                <RedCard key={i} />
              ))}
              <Typography variant="body2" fontWeight={700} sx={{ ml: 0.5 }}>
                {homeRedCards}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Red
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" fontWeight={700} sx={{ mr: 0.5 }}>
                {awayRedCards}
              </Typography>
              {Array.from({ length: awayRedCards }).map((_, i) => (
                <RedCard key={i} />
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Goal events timeline — only shown when there are goals */}
        {events.filter((e) => e.type === 'goal').length > 0 && (
          <>
            <Divider sx={{ mx: 3 }} />

            <Box sx={{ px: 3, py: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <SportsSoccer sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography variant="subtitle2" fontWeight={700}>
                  Goals
                </Typography>
              </Stack>

              <Stack spacing={1.25}>
                {events
                  .filter((e) => e.type === 'goal')
                  .sort((a, b) => a.minute - b.minute)
                  .map((goal) => {
                    const isHome = goal.team === 'home';
                    return (
                      <Stack
                        key={goal.id}
                        direction="row"
                        alignItems="center"
                        justifyContent={isHome ? 'flex-start' : 'flex-end'}
                        spacing={1}
                      >
                        {isHome && (
                          <Avatar
                            src={match.homeTeam.logoUrl}
                            alt={match.homeTeam.name}
                            sx={{ width: 22, height: 22 }}
                          />
                        )}
                        <SportsSoccer sx={{ fontSize: 14, color: 'success.main' }} />
                        <Typography variant="body2" fontWeight={600}>
                          {goal.playerName || (isHome ? match.homeTeam.name : match.awayTeam.name)}
                        </Typography>
                        <Chip
                          label={`${goal.minute}'`}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                        />
                        {!isHome && (
                          <Avatar
                            src={match.awayTeam.logoUrl}
                            alt={match.awayTeam.name}
                            sx={{ width: 22, height: 22 }}
                          />
                        )}
                      </Stack>
                    );
                  })}
              </Stack>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SelectedLiveMatchView;
