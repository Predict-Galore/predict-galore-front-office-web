/**
 * Predictions Page
 * Shows all available predictions for selected sport
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Box } from '@mui/material';
import { SportTabs } from '@/shared/components/shared';
import { useSports, usePredictions } from '@/features/predictions/api/hooks';
import Banner from '@/features/dashboard/components/Banner';
import PredictionsSection from '@/features/predictions/components/PredictionsList';
import SelectedPredictionView from '@/features/predictions/components/SelectedPredictionView';
import { EmptyState, ErrorState } from '@/shared/components/shared';
import MatchListSkeleton from '@/features/dashboard/components/MatchListSkeleton';
import PremiumModal from '@/features/dashboard/components/PremiumModal';
import withAuth from '../../../hoc/withAuth';
import type { Sport, Prediction } from '@/features/predictions/model/types';

/**
 * Predictions Page Component
 */
const PredictionsPage: React.FC = () => {
  const router = useRouter();

  // UI State
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPredictionId, setSelectedPredictionId] = useState<number | null>(null);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Fetch sports list
  const {
    data: sports = [],
    isLoading: loadingSports,
    isError: sportsError,
    refetch: refetchSports,
  } = useSports();

  const activeSport = selectedSport ?? sports[0] ?? null;

  // Get selected sport ID
  const sportId = activeSport?.id;

  // Fetch predictions for selected sport
  const {
    data: predictionsData,
    isLoading: loadingPredictions,
    isFetching: isFetchingPredictions,
    isError: predictionsError,
    refetch: refetchPredictions,
  } = usePredictions({ sportId, pageSize: 20 }, { enabled: !!sportId });

  /**
   * Handle sport selection
   */
  const handleSportChange = (sport: Sport) => {
    setIsTabSwitching(true);
    setSelectedSport(sport);
    setSelectedPredictionId(null);
  };

  const handlePredictionClick = (prediction: Prediction) => {
    if (prediction.status === 'Locked') {
      setShowPremiumModal(true);
      return;
    }

    setSelectedPredictionId(prediction.id);
  };

  useEffect(() => {
    if (!isTabSwitching) return;
    if (loadingPredictions || isFetchingPredictions) return;

    const timeoutId = window.setTimeout(() => {
      setIsTabSwitching(false);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isTabSwitching, isFetchingPredictions, loadingPredictions]);

  // Get predictions list
  const predictions = predictionsData?.predictions || [];

  // Get sport name for display
  const sportName = activeSport?.name || 'this sport';

  /**
   * Render predictions content
   */
  const renderContent = () => {
    if (isTabSwitching) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    // Loading state
    if (loadingPredictions && predictions.length === 0) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    // Error state
    if (predictionsError && predictions.length === 0) {
      return (
        <ErrorState
          title={`Unable to load predictions for ${sportName}`}
          error="Predictions are temporarily unavailable"
          onRetry={refetchPredictions}
        />
      );
    }

    // Empty state
    if (predictions.length === 0) {
      return (
        <EmptyState
          title={`No predictions available for ${sportName}`}
          description="Check back later for new predictions"
        />
      );
    }

    // Render predictions
    if (selectedPredictionId) {
      return (
        <SelectedPredictionView
          predictionId={selectedPredictionId}
          onBack={() => setSelectedPredictionId(null)}
        />
      );
    }

    return (
      <PredictionsSection
        predictions={predictions}
        isLoading={loadingPredictions}
        error=""
        selectedSport={sportName}
        onRetry={refetchPredictions}
        onPredictionClick={handlePredictionClick}
      />
    );
  };

  // Show error if sports failed to load
  if (sportsError) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <ErrorState
          title="Unable to load sports"
          error="Failed to load sports data"
          onRetry={refetchSports}
        />
      </Container>
    );
  }

  // Show loading skeleton on initial load
  if (loadingSports && sports.length === 0) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ height: 180, bgcolor: 'grey.100', borderRadius: 2 }} />
          <Box sx={{ height: 40, bgcolor: 'grey.100', borderRadius: 2 }} />
          <MatchListSkeleton sections={2} rowsPerSection={5} />
        </Stack>
      </Container>
    );
  }

  // Show empty state if no sports available
  if (sports.length === 0) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <EmptyState
          title="No sports available"
          description="Sports data is not available at the moment"
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
          isLoading={loadingSports}
        />

        {/* Predictions Content */}
        <Box>{renderContent()}</Box>
      </Stack>

      {/* Premium Modal */}
      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onGetPremium={() => router.push('/dashboard/profile?tab=subscriptions')}
        limit={5}
      />
    </Container>
  );
};

export default withAuth(PredictionsPage);
