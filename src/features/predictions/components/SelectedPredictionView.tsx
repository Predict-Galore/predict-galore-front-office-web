'use client';

import React, { useState } from 'react';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import MatchHeader from './PredictionMatchHeader';
import OverviewTab from './PredictionOverviewTab';
import PredictionsTab from './PredictionPicksTab';
import TableTab from './LeagueStandingsTab';
import { usePredictionById } from '@/features/predictions/api/hooks';

type TabType = 'overview' | 'predictions' | 'table';

interface SelectedPredictionViewProps {
  predictionId: number;
  onBack: () => void;
}

const SelectedPredictionView: React.FC<SelectedPredictionViewProps> = ({
  predictionId,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const {
    data: matchData,
    isLoading,
    error,
  } = usePredictionById(predictionId, {
    enabled: !!predictionId,
  });

  if (isLoading) {
    return (
      <Container maxWidth={false} sx={{ px: 0, py: 0 }}>
        <Stack spacing={3}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, bgcolor: 'grey.200', borderRadius: '50%' }} />
              <Box sx={{ width: 200, height: 24, bgcolor: 'grey.200', borderRadius: 1 }} />
            </Stack>
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ width: 150, height: 20, bgcolor: 'grey.200', borderRadius: 1 }} />
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Box sx={{ width: 60, height: 60, bgcolor: 'grey.200', borderRadius: '50%' }} />
                <Box sx={{ width: 80, height: 40, bgcolor: 'grey.200', borderRadius: 1 }} />
                <Box sx={{ width: 60, height: 60, bgcolor: 'grey.200', borderRadius: '50%' }} />
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  }

  if (error || !matchData?.prediction) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Error Loading Match
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error?.message || 'Match data unavailable'}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={onBack}>
            Back to list
          </Button>
        </Stack>
      </Paper>
    );
  }

  const prediction = matchData.prediction;
  const raw = matchData.raw;
  const tableLeagueId = (raw.leagueId as number) || (raw.fixtureId as number) || 0;

  return (
    <Stack spacing={3}>
      <Paper elevation={1} sx={{ p: { xs: 0, md: 4 }, borderRadius: 0 }}>
        <MatchHeader
          prediction={prediction}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBack={onBack}
        />
      </Paper>

      <Paper
        elevation={1}
        sx={{
          p: activeTab === 'table' ? 0 : { xs: 0, md: 4 },
          borderRadius: 0,
        }}
      >
        {activeTab === 'overview' && (
          <OverviewTab raw={raw} />
        )}

        {activeTab === 'predictions' && (
          <PredictionsTab
            picks={matchData.picks as Array<Record<string, unknown>>}
            raw={raw}
            isLoading={isLoading}
          />
        )}
        {activeTab === 'table' && <TableTab leagueId={tableLeagueId} />}
      </Paper>
    </Stack>
  );
};

export default SelectedPredictionView;
