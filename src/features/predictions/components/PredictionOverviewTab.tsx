'use client';

import React from 'react';
import { Box, Typography, Stack, Divider, Paper } from '@mui/material';
import { SportsSoccer, EmojiEvents, AccessTime, Article } from '@mui/icons-material';

interface OverviewTabProps {
  raw: Record<string, unknown>;
}

function formatKickoff(utcString: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(utcString));
  } catch {
    return utcString;
  }
}

const Row: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({
  icon,
  label,
  children,
}) => (
  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.5 }}>
    <Box sx={{ color: 'text.secondary', mt: 0.3, flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}
      >
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  </Stack>
);

const OverviewTab: React.FC<OverviewTabProps> = ({ raw }) => {
  const sport = raw.sport as string | null | undefined;
  const league = raw.league as string | null | undefined;
  const matchLabel = raw.matchLabel as string | null | undefined;
  const kickoffUtc = raw.kickoffUtc as string | null | undefined;
  const title = raw.title as string | null | undefined;
  const expertAnalysis = raw.expertAnalysis as string | null | undefined;

  return (
    <Stack spacing={0} divider={<Divider />}>
      {/* Match Info */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Match Info
        </Typography>
        <Stack divider={<Divider sx={{ opacity: 0.4 }} />}>
          <Row icon={<SportsSoccer fontSize="small" />} label="Sport">
            <Typography variant="body2" fontWeight={600}>
              {sport ?? '—'}
            </Typography>
          </Row>

          <Row icon={<EmojiEvents fontSize="small" />} label="League">
            <Typography variant="body2" fontWeight={600}>
              {league ?? '—'}
            </Typography>
          </Row>

          <Row icon={<SportsSoccer fontSize="small" />} label="Match">
            <Typography variant="body1" fontWeight={700}>
              {matchLabel ?? '—'}
            </Typography>
          </Row>

          <Row icon={<AccessTime fontSize="small" />} label="Kick-off">
            <Typography variant="body2" fontWeight={600}>
              {kickoffUtc ? formatKickoff(kickoffUtc) : '—'}
            </Typography>
          </Row>
        </Stack>
      </Paper>

      {/* Prediction Title */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Prediction Title
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {title ?? '—'}
        </Typography>
      </Paper>

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
          sx={{ color: 'text.primary', lineHeight: 1.8 }}
        >
          {expertAnalysis ?? '—'}
        </Typography>
      </Paper>
    </Stack>
  );
};

export default OverviewTab;
