/**
 * Dashboard Page
 * Main dashboard showing predictions and live matches
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Box } from '@mui/material';
import { SportTabs } from '@/shared/components/shared';
import { useSports, usePredictions } from '@/features/predictions/api/hooks';
import { useLiveScoresQuery, useDetailedLiveMatchQuery } from '@/features/live-matches/api/hooks';
import Banner from '@/features/dashboard/components/Banner';
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
  const { 
    data: sports = [], 
    isLoading: loadingSports, 
    isError: sportsError 
  } = useSports();

  // Get selected sport ID
  const sportId = selectedSport?.id || sports[0]?.id;

  // Fetch predictions for selected sport
  const {
    data: predictionsData,
    isLoading: loadingPredictions,
    isFetching: isFetchingPredictions,
    isError: predictionsError,
    refetch: refetchPredictions,
  } = usePredictions(
    { sportId, pageSize: 20 },
    { enabled: !!sportId }
  );

  // Get sport name for live matches API (convert 'football' to 'soccer')
  const liveSportName = selectedSport?.name?.toLowerCase() === 'football' 
    ? 'soccer' 
    : selectedSport?.name?.toLowerCase();

  // Fetch live matches for selected sport
  const {
    data: liveMatchesData,
    isLoading: loadingLiveMatches,
    isFetching: isFetchingLiveMatches,
    isError: liveMatchesError,
    refetch: refetchLiveMatches,
  } = useLiveScoresQuery(
    liveSportName ? { sport: liveSportName } : undefined,
    { enabled: activeTab === 'live-matches' && !!liveSportName }
  );
  const {
    data: detailedLiveMatch,
    isLoading: isDetailedLiveMatchLoading,
    isError: isDetailedLiveMatchError,
    refetch: refetchDetailedLiveMatch,
  } = useDetailedLiveMatchQuery(
    selectedLiveMatch ? String(selectedLiveMatch.id) : null,
    { enabled: !!selectedLiveMatch }
  );

  // Set default sport when sports load
  useEffect(() => {
    if (!selectedSport && sports.length > 0) {
      setSelectedSport(sports[0]);
    }
  }, [selectedSport, sports]);

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
  const sportName = selectedSport?.name || 'this sport';

  /**
   * Render predictions tab content
   */
  const renderPredictions = () => {
    if (isTabSwitching) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    if (selectedPredictionId) {
      return <SelectedPredictionView predictionId={selectedPredictionId} onBack={() => setSelectedPredictionId(null)} />;
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
      <Container maxWidth={false} sx={{ py: 4 }}>
        <ErrorState
          title="Unable to load sports"
          error="Failed to load sports data"
          onRetry={() => window.location.reload()}
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
          selectedSport={selectedSport}
          onSelectSport={handleSportChange}
          isLoading={loadingSports}
        />

        {/* Content Area */}
        <Box>
          <Stack spacing={2}>
            {/* Content Tabs (Predictions / Live Matches) */}
            <ContentTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />

            {/* Tab Content */}
            {activeTab === 'predictions' ? renderPredictions() : renderLiveMatches()}
          </Stack>
        </Box>
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

export default withAuth(DashboardPage);
