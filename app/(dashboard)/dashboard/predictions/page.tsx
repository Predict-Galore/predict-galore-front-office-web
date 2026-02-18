"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Box, Paper } from '@mui/material';
import { SportTabs } from '@/shared/components/shared';
import { useSports, usePredictions } from '@/features/predictions';
import { useNews, useFeaturedNews } from '@/features/news';
import Banner from '@/features/dashboard/components/Banner';
import { PredictionsSection } from '@/features/predictions/components';
import { DashboardNewsSidebar } from '@/shared/components/shared';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';
import { EmptyState, ErrorState } from '@/shared/components/shared';
import MatchListSkeleton from '@/features/dashboard/components/MatchListSkeleton';
import type { Sport } from '@/features/predictions/model/types';
import type { Prediction } from '@/features/predictions/model/types';
import withAuth from '../../../hoc/withAuth';
import PremiumModal from '@/features/dashboard/components/PremiumModal';

const PredictionPage: React.FC = () => {
  const router = useRouter();
  const [activeSport, setActiveSport] = useState<Sport | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Fetch sports data
  const {
    data: sports = [],
    isLoading: isSportsLoading,
    isError: isSportsError,
    error: sportsError,
    refetch: refetchSports,
  } = useSports();

  const activeSportName = useMemo(
    () => activeSport?.name || sports?.[0]?.name || 'this sport',
    [activeSport?.name, sports]
  );

  // Get the active sport ID from the API sports data
  const activeSportId = useMemo(() => {
    if (!activeSport || !sports || sports.length === 0) {
      return sports[0]?.id;
    }
    // Find the sport in API data that matches the active sport name
    const matchingSport = sports.find(s =>
      s.name?.toLowerCase() === activeSport.name?.toLowerCase()
    );
    return matchingSport?.id || sports[0]?.id;
  }, [activeSport, sports]);

  // Fetch predictions
  const {
    data: predictionsData,
    isLoading: isPredictionsLoading,
    isFetching: isPredictionsFetching,
    isError: isPredictionsError,
    error: predictionsError,
    refetch: refetchPredictions,
  } = usePredictions(
    {
      sportId: activeSportId,
      pageSize: 20,
    },
    { enabled: !!activeSportId }
  );

  // Fetch featured news without sport filter - backend returns by category
  const {
    featuredNews,
    isLoading: isFeaturedNewsLoading,
    isFetching: isFeaturedNewsFetching,
    isError: isFeaturedNewsError,
    refetch: refetchFeaturedNews,
  } = useFeaturedNews(1);

  // Fetch news without sport filter - backend returns by category
  const {
    data: newsData,
    isLoading: isNewsLoading,
    isFetching: isNewsFetching,
    isError: isNewsError,
    refetch: refetchNews,
  } = useNews({ 
    pageSize: 8,
  });

  // Set default sport
  useEffect(() => {
    if (!activeSport && sports.length > 0) {
      setActiveSport(sports[0]);
    }
  }, [activeSport, sports]);

  // Handle sport change
  const handleSportChange = useCallback((sport: Sport) => {
    setActiveSport(sport);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setIsPremiumModalOpen(false);
  }, []);

  const sportsErrorMessage = useMemo(
    () => (isSportsError ? getFriendlyErrorMessage(sportsError) : ''),
    [isSportsError, sportsError]
  );

  const predictionsErrorMessage = useMemo(
    () =>
      isPredictionsError
        ? getFriendlyErrorMessage(predictionsError, 'Unable to load predictions right now.')
        : '',
    [isPredictionsError, predictionsError]
  );

  const predictionsSource = useMemo<Prediction[]>(() => {
    return predictionsData?.predictions || [];
  }, [predictionsData]);

  const hasPredictions = predictionsSource.length > 0;
  const showPredictionsError = isPredictionsError && !hasPredictions;

  // Safely extract news items
  const newsItems = useMemo(() => {
    if (!newsData) return [];
    if (Array.isArray(newsData.items)) return newsData.items;
    // Handle different possible data structures
    const dataAsRecord = newsData as Record<string, unknown>;
    if (Array.isArray(dataAsRecord.data)) return dataAsRecord.data as typeof newsData.items;
    return [];
  }, [newsData]);

  const handleNewsRetry = useCallback(() => {
    refetchFeaturedNews();
    refetchNews();
  }, [refetchFeaturedNews, refetchNews]);

  // Loading state
  if (isSportsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState
          title="Unable to load sports"
          error={sportsErrorMessage}
          onRetry={() => refetchSports()}
        />
      </Container>
    );
  }

  // Initial load only: keep it page-level; afterwards we use per-section loading
  if (isSportsLoading && sports.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper sx={{ height: { xs: 120, sm: 150, md: 180 }, bgcolor: 'grey.100' }} />
          <Paper sx={{ height: 40, bgcolor: 'grey.100' }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
              gap: 2,
            }}
          >
            <Box>
              <Paper sx={{ height: { xs: 300, sm: 350, md: 400 }, bgcolor: 'grey.100' }} />
            </Box>
            <Paper sx={{ height: { xs: 300, sm: 400, md: 520 }, bgcolor: 'grey.100' }} />
          </Box>
        </Stack>
      </Container>
    );
  }

  if (!sports.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmptyState
          title="No sports available"
          description="We could not load sports from the server. Please try again later."
        />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2.5 } }}>
      <Stack spacing={3}>
        {/* Banner */}
        <Banner className="h-[150px] sm:h-[170px] md:h-[190px]" />

        {/* Sport Tabs */}
        <SportTabs
          sports={sports}
          selectedSport={activeSport}
          onSelectSport={handleSportChange}
          isLoading={isSportsLoading}
        />

        {/* Main Content Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
            gap: 3,
            alignItems: 'flex-start',
          }}
        >
          {/* Predictions Content */}
          <Paper elevation={0} sx={{ p: { xs: 1, md: 0 } }}>
            <Stack spacing={2}>
              {/* Predictions Section */}
              {isPredictionsLoading && !hasPredictions ? (
                <MatchListSkeleton sections={2} rowsPerSection={5} />
              ) : showPredictionsError ? (
                <ErrorState
                  title={`Unable to load predictions for ${activeSportName}`}
                  error={predictionsErrorMessage || `Predictions for ${activeSportName} are temporarily unavailable.`}
                  onRetry={() => refetchPredictions()}
                />
              ) : hasPredictions ? (
                <>
                  <PredictionsSection
                    predictions={predictionsSource}
                    isLoading={isPredictionsLoading}
                    error={predictionsErrorMessage}
                    selectedSport={activeSportName}
                    onRetry={() => refetchPredictions()}
                  />
                </>
              ) : isPredictionsFetching ? (
                // Show skeleton while fetching new sport data
                <MatchListSkeleton sections={2} rowsPerSection={5} />
              ) : (
                <EmptyState
                  title={`No predictions available for ${activeSportName}`}
                  description={`We don't have predictions for ${activeSportName} right now. Please try again later.`}
                />
              )}
            </Stack>
          </Paper>

          {/* News Sidebar */}
          <Stack spacing={1.5}>
            <DashboardNewsSidebar
              topNews={featuredNews}
              laligaNews={newsItems.slice(0, 8)}
              isLoading={
                (isNewsLoading && newsItems.length === 0) ||
                (isFeaturedNewsLoading && !featuredNews?.length) ||
                isNewsFetching ||
                isFeaturedNewsFetching
              }
              isError={isNewsError || isFeaturedNewsError}
              onRetry={handleNewsRetry}
            />
          </Stack>
        </Box>
      </Stack>

      {/* Premium Modal */}
      {isPremiumModalOpen && (
        <PremiumModal
          open={isPremiumModalOpen}
          onClose={handleClosePremiumModal}
          onGetPremium={() => router.push('/dashboard/profile?tab=subscriptions')}
          limit={5}
        />
      )}
    </Container>
  );
};

export default withAuth(PredictionPage);