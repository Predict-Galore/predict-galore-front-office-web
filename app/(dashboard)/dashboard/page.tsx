/**
 * Dashboard Page
 * Main dashboard showing predictions and live matches
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Box } from '@mui/material';
import { SportTabs } from '@/shared/components/shared';
import { useSports, usePredictions } from '@/features/predictions/api/hooks';
import { useLiveScoresQuery, useDetailedLiveMatchQuery } from '@/features/live-matches/api/hooks';
import ContentTabs from '@/features/dashboard/components/ContentTabs';
import PredictionsSection from '@/features/predictions/components/PredictionsList';
import SelectedPredictionView from '@/features/predictions/components/SelectedPredictionView';
import LiveLeagueSection from '@/features/dashboard/components/LiveLeagueSection';
import SelectedLiveMatchView from '@/features/live-matches/components/SelectedLiveMatchView';
import MatchListSkeleton from '@/features/dashboard/components/MatchListSkeleton';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/shared';
import PremiumModal from '@/features/dashboard/components/PremiumModal';
import withAuth from '../../hoc/withAuth';
import type { Sport, Prediction } from '@/features/predictions/model/types';
import type { Match } from '@/features/live-matches/model/types';

type TabType = 'predictions' | 'live-matches';

/**
 * Main Dashboard Page Component
 */
const DashboardPage: React.FC = () => {
  const router = useRouter();

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('predictions');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPredictionId, setSelectedPredictionId] = useState<number | null>(null);
  const [selectedLiveMatch, setSelectedLiveMatch] = useState<Match | null>(null);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Fetch sports list
  const { data: sports = [], isLoading: loadingSports, isError: sportsError } = useSports();

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

  // Get sport name for live matches API (convert 'football' to 'soccer')
  const liveSportName =
    activeSport?.name?.toLowerCase() === 'football' ? 'soccer' : activeSport?.name?.toLowerCase();

  // Fetch live matches for selected sport
  const {
    data: liveMatchesData,
    isLoading: loadingLiveMatches,
    isFetching: isFetchingLiveMatches,
    isError: liveMatchesError,
    refetch: refetchLiveMatches,
  } = useLiveScoresQuery(liveSportName ? { sport: liveSportName } : undefined, {
    enabled: activeTab === 'live-matches' && !!liveSportName,
  });
  const {
    data: detailedLiveMatch,
    isLoading: isDetailedLiveMatchLoading,
    isError: isDetailedLiveMatchError,
    refetch: refetchDetailedLiveMatch,
  } = useDetailedLiveMatchQuery(selectedLiveMatch ? String(selectedLiveMatch.id) : null, {
    enabled: !!selectedLiveMatch,
  });

  /**
   * Handle sport selection
   */
  const handleSportChange = (sport: Sport) => {
    setIsTabSwitching(true);
    setSelectedSport(sport);
    setSelectedPredictionId(null);
    setSelectedLiveMatch(null);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsTabSwitching(true);
    setActiveTab(tab);
    setSelectedPredictionId(null);
    setSelectedLiveMatch(null);
  };

  useEffect(() => {
    if (!isTabSwitching) return;

    const isBusy =
      activeTab === 'predictions'
        ? loadingPredictions || isFetchingPredictions
        : loadingLiveMatches || isFetchingLiveMatches;

    if (isBusy) return;

    const timeoutId = window.setTimeout(() => {
      setIsTabSwitching(false);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeTab,
    isTabSwitching,
    isFetchingLiveMatches,
    isFetchingPredictions,
    loadingLiveMatches,
    loadingPredictions,
  ]);

  /**
   * Handle prediction click
   */
  const handlePredictionClick = (prediction: Prediction) => {
    // Show premium modal for locked predictions
    if (prediction.status === 'Locked') {
      setShowPremiumModal(true);
      return;
    }

    setSelectedPredictionId(prediction.id);
  };

  /**
   * Handle live match click
   */
  const handleLiveMatchClick = (match: Match) => {
    setSelectedLiveMatch(match);
  };

  /**
   * Group live matches by competition
   */
  const groupLiveMatchesByCompetition = () => {
    if (!liveMatchesData?.sections) return {};

    const grouped: Record<string, Match[]> = {};

    liveMatchesData.sections.forEach((section) => {
      section.matches.forEach((match) => {
        const competition = match.competition || section.title || 'Other';
        if (!grouped[competition]) {
          grouped[competition] = [];
        }
        grouped[competition].push(match);
      });
    });

    return grouped;
  };

  // Get predictions list
  const predictions = predictionsData?.predictions || [];

  // Get live matches list
  const liveMatchesByCompetition = groupLiveMatchesByCompetition();

  // Get sport name for display
  const sportName = activeSport?.name || 'this sport';

  /**
   * Render predictions tab content
   */
  const renderPredictions = () => {
    if (isTabSwitching) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    if (selectedPredictionId) {
      return (
        <SelectedPredictionView
          predictionId={selectedPredictionId}
          onBack={() => setSelectedPredictionId(null)}
        />
      );
    }

    // Loading state
    if (loadingPredictions) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    // Error state
    if (predictionsError) {
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

    return (
      <PredictionsSection
        predictions={predictions}
        isLoading={loadingPredictions}
        selectedSport={sportName}
        onPredictionClick={handlePredictionClick}
      />
    );
  };

  /**
   * Render live matches tab content
   */
  const renderLiveMatches = () => {
    if (isTabSwitching) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    if (selectedLiveMatch) {
      if (isDetailedLiveMatchLoading || !detailedLiveMatch) {
        return <LoadingState message="Loading match details..." subMessage="Please wait" />;
      }

      if (isDetailedLiveMatchError) {
        return (
          <ErrorState
            title="Unable to load match details"
            error="Failed to load detailed match information"
            onRetry={refetchDetailedLiveMatch}
            onBack={() => setSelectedLiveMatch(null)}
          />
        );
      }

      return (
        <SelectedLiveMatchView
          match={selectedLiveMatch}
          detailedLiveMatch={detailedLiveMatch}
          onBack={() => setSelectedLiveMatch(null)}
        />
      );
    }

    // Loading state
    if (loadingLiveMatches) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    // Error state
    if (liveMatchesError) {
      return (
        <ErrorState
          title={`Unable to load live matches for ${sportName}`}
          error="Live matches are temporarily unavailable"
          onRetry={refetchLiveMatches}
        />
      );
    }

    // Empty state
    if (Object.keys(liveMatchesByCompetition).length === 0) {
      return (
        <EmptyState
          title={`No live matches for ${sportName}`}
          description="Check back when matches are in progress"
        />
      );
    }

    // Render live matches grouped by competition
    return (
      <>
        {Object.entries(liveMatchesByCompetition).map(([competition, matches]) => (
          <LiveLeagueSection
            key={competition}
            leagueName={competition}
            matches={matches}
            onMatchClick={handleLiveMatchClick}
          />
        ))}
      </>
    );
  };

  // Show error if sports failed to load
  if (sportsError) {
    return (
      <Box sx={{ py: 2 }}>
        <ErrorState
          title="Unable to load sports"
          error="Failed to load sports data"
          onRetry={() => window.location.reload()}
        />
      </Box>
    );
  }

  // Show loading skeleton on initial load
  if (loadingSports && sports.length === 0) {
    return (
      <Stack spacing={3} sx={{ py: 2 }}>
        <Box sx={{ height: 180, bgcolor: 'grey.100', borderRadius: 2 }} />
        <Box sx={{ height: 40, bgcolor: 'grey.100', borderRadius: 2 }} />
        <MatchListSkeleton sections={2} rowsPerSection={5} />
      </Stack>
    );
  }

  // Show empty state if no sports available
  if (sports.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <EmptyState
          title="No sports available"
          description="Sports data is not available at the moment"
        />
      </Box>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <SportTabs
          sports={sports}
          selectedSport={activeSport}
          onSelectSport={handleSportChange}
          isLoading={loadingSports}
        />

        <Box>
          <Stack spacing={2}>
            <ContentTabs activeTab={activeTab} onTabChange={handleTabChange} />
            {activeTab === 'predictions' ? renderPredictions() : renderLiveMatches()}
          </Stack>
        </Box>
      </Stack>

      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onGetPremium={() => router.push('/dashboard/profile?tab=subscriptions')}
        limit={5}
      />
    </>
  );
};

export default withAuth(DashboardPage);
