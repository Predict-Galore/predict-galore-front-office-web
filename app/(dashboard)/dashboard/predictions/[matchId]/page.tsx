/**
 * Match Detail Page
 * Shows detailed prediction information for a specific match
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MatchHeader from '@/features/predictions/components/PredictionMatchHeader';
import OverviewTab from '@/features/predictions/components/PredictionOverviewTab';
import PredictionsTab from '@/features/predictions/components/PredictionPicksTab';
import TableTab from '@/features/predictions/components/LeagueStandingsTab';
import { usePredictionById } from '@/features/predictions/api/hooks';

type TabType = 'overview' | 'predictions' | 'table';

/**
 * Match Detail Page Component
 */
const MatchDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get match ID from URL
  const matchId = params?.matchId ? Number(params.matchId) : null;

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Fetch match data
  const {
    data: matchData,
    isLoading,
    error,
  } = usePredictionById(matchId, { enabled: !!matchId });

  // Log for debugging when table tab is active
  React.useEffect(() => {
    if (activeTab === 'table' && matchData) {
      console.log('=== TABLE TAB DEBUG ===');
      console.log('Active Tab:', activeTab);
      console.log('Match Data:', matchData);
      console.log('Prediction:', matchData.prediction);
      console.log('League ID:', matchData.prediction?.leagueId);
    }
  }, [activeTab, matchData]);

  /**
   * Navigate back to predictions list
   */
  const handleBack = () => {
    router.push('/dashboard/predictions');
  };

  /**
   * Render loading skeleton
   */
  const renderLoading = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header skeleton */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 40, height: 40, bgcolor: 'grey.200', borderRadius: '50%' }} />
            <Box sx={{ width: 200, height: 24, bgcolor: 'grey.200', borderRadius: 1 }} />
          </Stack>
        </Paper>

        {/* Match header skeleton */}
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

        {/* Content skeleton */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ height: 100, bgcolor: 'grey.200', borderRadius: 1 }} />
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );

  /**
   * Render error state
   */
  const renderError = (message: string, showRetry = true) => (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Error Loading Match
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        {showRetry && (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={handleBack}>
              Go Back
            </Button>
            <Button variant="contained" color="error" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );

  // Invalid match ID
  if (!matchId) {
    return renderError('Invalid match ID', false);
  }

  // Loading state
  if (isLoading) {
    return renderLoading();
  }

  // Error state
  if (error) {
    return renderError(error?.message || 'Failed to load match details');
  }

  // No data
  if (!matchData?.prediction) {
    return renderError('Match data unavailable');
  }

  const prediction = matchData.prediction;
  const leagueId = prediction.leagueId;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Top Navigation Bar */}
 

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, pb: isMobile ? 10 : 3 }}>
        <Stack spacing={3}>
          {/* Match Header */}
          <Paper elevation={1} sx={{ p: { xs: 0, md: 2 }, borderRadius: 2 }}>
            <MatchHeader
              prediction={prediction}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onBack={handleBack}
            />
          </Paper>

          {/* Tab Content */}
          <Paper
            elevation={1}
            sx={{
              p: activeTab === 'table' ? 0 : { xs: 0, md: 2 },
              borderRadius: 0,
            }}
          >
            {activeTab === 'overview' && (
              <OverviewTab
                prediction={prediction}
                detailed={matchData.detailed}
              />
            )}

            {activeTab === 'predictions' && (
              <PredictionsTab
                picks={matchData.picks as Array<Record<string, unknown>>}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'table' && <TableTab leagueId={leagueId} />}
          </Paper>
        </Stack>
      </Container>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Stack direction="row">
            <Button
              fullWidth
              sx={{
                flexDirection: 'column',
                py: 1,
                color: 'text.secondary',
                '&:hover': { color: 'error.main' },
              }}
              onClick={() => router.push('/dashboard')}
            >
              <Typography variant="caption">Home</Typography>
            </Button>

            <Button
              fullWidth
              sx={{
                flexDirection: 'column',
                py: 1,
                color: 'success.main',
                fontWeight: 600,
              }}
            >
              <Typography variant="caption" fontWeight={600}>
                Predictions
              </Typography>
            </Button>

            <Button
              fullWidth
              sx={{
                flexDirection: 'column',
                py: 1,
                color: 'text.secondary',
                '&:hover': { color: 'error.main' },
              }}
              onClick={() => router.push('/dashboard/live-matches')}
            >
              <Typography variant="caption">Live Matches</Typography>
            </Button>

            <Button
              fullWidth
              sx={{
                flexDirection: 'column',
                py: 1,
                color: 'text.secondary',
                '&:hover': { color: 'error.main' },
              }}
              onClick={() => router.push('/dashboard/news')}
            >
              <Typography variant="caption">News</Typography>
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default MatchDetailPage;
