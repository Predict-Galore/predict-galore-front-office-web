/**
 * Selected Live Match View Component
 * Pixel-perfect match detail UI
 */

'use client';

import React from 'react';
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
import {
  Typography,
  Avatar,
  IconButton,
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

  // Goal scorers from events
  const goalScorers = detailedLiveMatch.events
    .filter((event) => event.type === 'goal')
    .map((event) => ({
      player: event.playerName,
      minute: event.minute,
      team: event.team,
      isPenalty: event.description?.toLowerCase().includes('penalty') || false,
      extraTime: event.extraTime,
    }));

  const homeGoals = goalScorers.filter((g) => g.team === 'home');
  const awayGoals = goalScorers.filter((g) => g.team === 'away');

  const formatGoal = (g: (typeof goalScorers)[number]) => {
    let text = g.player || 'Unknown';
    text += ` ${g.minute}'`;
    if (g.extraTime) text = `${g.player} ${g.minute}+${g.extraTime}'`;
    if (g.isPenalty) text += ' (P)';
    return text;
  };

  // ==================== GREEN CIRCLE ICON ====================
  const SectionIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
      {children}
    </div>
  );

  // ==================== RENDER ====================
  return (
    <div className="space-y-0">
      {/* ===== MATCH HEADER (dark green) ===== */}
      <div
        className="rounded-t-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a4d2e 0%, #1e5a35 50%, #22673d 100%)',
        }}
      >
        {/* Top bar: back + actions */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <IconButton onClick={onBack} sx={{ color: 'white' }} aria-label="Back">
            <ArrowBack />
          </IconButton>
          <div className="flex items-center gap-1">
            <IconButton sx={{ color: 'white' }} aria-label="Share">
              <Share sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton sx={{ color: 'white' }} aria-label="Notifications">
              <NotificationsNone sx={{ fontSize: 22 }} />
            </IconButton>
          </div>
        </div>

        {/* Teams + Score */}
        <div className="px-4 pb-6">
          <div className="flex items-start justify-center gap-6 sm:gap-10">
            {/* Home team */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <Avatar
                src={match.homeTeam.logoUrl}
                alt={match.homeTeam.name}
                sx={{ width: 64, height: 64, mb: 1, bgcolor: 'white', p: 0.5 }}
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
            </div>

            {/* Score */}
            <div className="flex flex-col items-center pt-1">
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
              <div className="mt-2 px-4 py-1 rounded-full bg-white/20">
                <Typography
                  variant="caption"
                  sx={{ color: 'white', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}
                >
                  {match.status}
                </Typography>
              </div>
            </div>

            {/* Away team */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <Avatar
                src={match.awayTeam.logoUrl}
                alt={match.awayTeam.name}
                sx={{ width: 64, height: 64, mb: 1, bgcolor: 'white', p: 0.5 }}
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
            </div>
          </div>

          {/* Goal scorers row */}
          {(homeGoals.length > 0 || awayGoals.length > 0) && (
            <div className="flex items-start justify-center gap-3 mt-4 px-2">
              {/* Home scorers */}
              <div className="flex-1 text-right">
                {homeGoals.map((g, i) => (
                  <Typography
                    key={i}
                    variant="caption"
                    sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', lineHeight: 1.8 }}
                  >
                    {formatGoal(g)}
                  </Typography>
                ))}
              </div>

              {/* Ball icon */}
              <div className="shrink-0 pt-1">
                <SportsSoccer sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
              </div>

              {/* Away scorers */}
              <div className="flex-1 text-left">
                {awayGoals.map((g, i) => (
                  <Typography
                    key={i}
                    variant="caption"
                    sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', lineHeight: 1.8 }}
                  >
                    {formatGoal(g)}
                  </Typography>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== WHITE CONTENT SECTIONS ===== */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-gray-200 shadow-sm">
        {/* ---------- Match Details ---------- */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Match Details
            </Typography>
            <SectionIcon>
              <SportsSoccer sx={{ fontSize: 16, color: 'success.main' }} />
            </SectionIcon>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <CalendarTodayOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {dateTime.date}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <AccessTimeOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {dateTime.time}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <LocationOnOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {match.competition || 'N/A'}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <StadiumOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {match.stadium || 'TBD'}
              </Typography>
            </div>
          </div>
        </div>

        <div className="mx-5 border-b border-gray-100" />

        {/* ---------- Predicted Outcome ---------- */}
        {match.predictedScore && (
          <>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Predicted outcome
                </Typography>
                <SectionIcon>
                  <PlayCircleOutline sx={{ fontSize: 16, color: 'success.main' }} />
                </SectionIcon>
              </div>

              <div className="flex items-center gap-3">
                <Avatar
                  src={match.homeTeam.logoUrl}
                  alt={match.homeTeam.name}
                  sx={{ width: 32, height: 32 }}
                />
                <div className="flex-1">
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {match.homeTeam.shortName || match.homeTeam.name} wins
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                    {match.predictedScore}
                  </Typography>
                </div>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
                  View all predictions
                </button>
              </div>
            </div>

            <div className="mx-5 border-b border-gray-100" />
          </>
        )}

        {/* ---------- Player of the Match ---------- */}
        {detailedLiveMatch.stats.homeTopScorer && (
          <>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Player of the match
                </Typography>
                <SectionIcon>
                  <AssignmentOutlined sx={{ fontSize: 16, color: 'success.main' }} />
                </SectionIcon>
              </div>

              <div className="flex items-center gap-3">
                {/* Player avatar with team badge overlay */}
                <div className="relative shrink-0">
                  <Avatar
                    src={(detailedLiveMatch.stats.homeTopScorer as { imageUrl?: string })?.imageUrl}
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
                </div>

                <div className="flex-1 min-w-0">
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                    {detailedLiveMatch.stats.homeTopScorer.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                    {detailedLiveMatch.stats.homeTopScorer.position}
                  </Typography>
                </div>

                {/* Rating badge */}
                <div className="shrink-0 px-3 py-1.5 rounded-lg bg-gray-100">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.9375rem' }}
                  >
                    {detailedLiveMatch.stats.homeTopScorer.rating}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="mx-5 border-b border-gray-100" />
          </>
        )}

        {/* ---------- Match Stats ---------- */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Match stats
            </Typography>
            <SectionIcon>
              <BarChartOutlined sx={{ fontSize: 16, color: 'success.main' }} />
            </SectionIcon>
          </div>

          {/* Team logos row */}
          <div className="flex items-center justify-between mb-4 px-1">
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
          </div>

          {/* Stats rows */}
          <div className="space-y-2.5">
            {([
              ['Shots', detailedLiveMatch.stats.homeTotalShots, detailedLiveMatch.stats.awayTotalShots],
              ['Shots on target', detailedLiveMatch.stats.homeShotsOnTarget, detailedLiveMatch.stats.awayShotsOnTarget],
              ['Possession', detailedLiveMatch.stats.homePossession, detailedLiveMatch.stats.awayPossession],
              ['Passes', detailedLiveMatch.stats.homeTeam.goalsPerGame, detailedLiveMatch.stats.awayTeam.goalsPerGame],
              ['Pass accuracy', `${detailedLiveMatch.stats.homeTeam.winPercentage}%`, `${detailedLiveMatch.stats.awayTeam.winPercentage}%`],
              ['Fouls', `${detailedLiveMatch.stats.homeFouls}%`, `${detailedLiveMatch.stats.awayFouls}%`],
              ['Yellow cards', detailedLiveMatch.stats.homeYellowCards, detailedLiveMatch.stats.awayYellowCards],
              ['Red cards', detailedLiveMatch.stats.homeRedCards, detailedLiveMatch.stats.awayRedCards],
              ['Offsides', detailedLiveMatch.stats.homeOffsides, detailedLiveMatch.stats.awayOffsides],
              ['Corners', detailedLiveMatch.stats.homeCorners, detailedLiveMatch.stats.awayCorners],
            ] as [string, string | number, string | number][]).map(([label, home, away]) => (
              <div key={label} className="grid grid-cols-3 items-center py-1.5">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'text.primary', textAlign: 'left', fontSize: '0.875rem' }}
                >
                  {home}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'text.secondary', textAlign: 'center', fontSize: '0.8125rem' }}
                >
                  {label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'text.primary', textAlign: 'right', fontSize: '0.875rem' }}
                >
                  {away}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedLiveMatchView;
