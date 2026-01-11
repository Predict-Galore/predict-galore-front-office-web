// app/(dashboard)/dashboard/predictions/page.tsx
'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import { Container, Stack, Paper, Box } from '@mui/material';
import { SportTabs, PredictionsSection } from '@/features/predictions';
import { usePredictionStore } from '@/features/predictions/model/store';
import { useSports, usePredictions, useRefreshAllData } from '@/features/predictions';
import { useNews, useFeaturedNews } from '@/features/news';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';

import { DashboardNewsSidebar } from '@/shared/components/shared';

const PredictionPage: React.FC = () => {
  const { selectedSport, setSelectedSport } = usePredictionStore();

  // React Query hooks
  const { data: sportsData = [], isLoading: sportsLoading, error: sportsError } = useSports();

  const {
    data: predictionsData,
    isLoading: predictionsLoading,
    error: predictionsError,
  } = usePredictions({
    sportId: selectedSport?.id,
  });

  const { mutate: refreshAllData, isPending: isRefreshing } = useRefreshAllData();

  const { featuredNews = [] } = useFeaturedNews(1);
  const { data: newsData, isLoading: isNewsLoading } = useNews({ pageSize: 5 });

  // Auto-select first sport if none selected
  useEffect(() => {
    if (sportsData && !selectedSport && sportsData.length > 0) {
      setSelectedSport(sportsData[0]);
    }
  }, [sportsData, selectedSport, setSelectedSport]);

  // Handle sport selection
  const handleSportSelect = useCallback(
    (sport: typeof selectedSport) => {
      setSelectedSport(sport);
    },
    [setSelectedSport]
  );

  // Handle retry/refresh
  const handleRefresh = useCallback(() => {
    refreshAllData({ sportId: selectedSport?.id });
  }, [refreshAllData, selectedSport?.id]);

  // Get predictions array from data
  const predictions = useMemo(() => {
    return predictionsData?.predictions || [];
  }, [predictionsData]);

  // Combined loading state
  const isLoading = sportsLoading || predictionsLoading || isRefreshing;

  // Combined error state
  const error = useMemo(() => {
    if (sportsError) {
      return getFriendlyErrorMessage(sportsError, 'Unable to load sports right now.');
    }
    if (predictionsError) {
      return getFriendlyErrorMessage(predictionsError, 'Unable to load predictions right now.');
    }
    return null;
  }, [predictionsError, sportsError]);

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <SportTabs
            sports={sportsData}
            selectedSport={selectedSport}
            onSelectSport={handleSportSelect}
            isLoading={sportsLoading}
          />
        </Box>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
          <Box flex={1} width="100%">
            <Paper elevation={0} sx={{ p: { xs: 1, md: 0 } }}>
              <PredictionsSection
                predictions={predictions}
                isLoading={isLoading}
                error={error || undefined}
                selectedSport={selectedSport?.name || 'Select a sport'}
                onRetry={handleRefresh}
              />
            </Paper>
          </Box>

          <Box width={{ xs: '100%', lg: 340 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <DashboardNewsSidebar
              topNews={featuredNews || []}
              laligaNews={newsData?.items?.slice(0, 6) || []}
              isLoading={isNewsLoading}
            />
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default PredictionPage;
