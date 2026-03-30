/**
 * Live Matches Page
 * Shows all live matches for selected sport
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Container, Stack, Box, Typography } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { SportTabs } from '@/shared/components/shared';
import MatchListSection from '@/features/live-matches/components/MatchListSection';
import SelectedLiveMatchView from '@/features/live-matches/components/SelectedLiveMatchView';
import { ErrorState, LoadingState } from '@/shared/components/shared';
import Banner from '@/features/dashboard/components/Banner';
import MatchListSkeleton from '@/features/dashboard/components/MatchListSkeleton';
import { useLiveScoresQuery, useDetailedLiveMatchQuery } from '@/features/live-matches/api/hooks';
import { useSports } from '@/features/predictions/api/hooks';
import { useLiveMatchesStore, useSelectedLiveMatch } from '@/features/live-matches/model/store';
import withAuth from '../../../hoc/withAuth';
import type { Match } from '@/features/live-matches/model/types';
import type { Sport } from '@/features/predictions/model/types';

/**
 * Live Matches Page Component
 */
const LiveMatchesPage: React.FC = () => {
  // UI State
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Store actions and state
  const { selectLiveMatch, clearSelectedLiveMatch } = useLiveMatchesStore();
  const selectedMatch = useSelectedLiveMatch();

  // Fetch sports list
  const { data: sports = [], isLoading: loadingSports, isError: sportsError } = useSports();

  const activeSport = selectedSport ?? sports[0] ?? null;

  // Get sport name for live matches API (convert 'football' to 'soccer')
  const liveSportName =
    activeSport?.name?.toLowerCase() === 'football' ? 'soccer' : activeSport?.name?.toLowerCase();

  // Fetch live matches for selected sport
  const {
    data: liveMatchesData,
    isLoading: loadingMatches,
    isFetching: isFetchingMatches,
    isError: matchesError,
    refetch: refetchMatches,
  } = useLiveScoresQuery(liveSportName ? { sport: liveSportName } : undefined, {
    enabled: !!liveSportName,
  });

  // Fetch detailed match data when a match is selected
  const {
    data: detailedMatchData,
    isLoading: isDetailedLoading,
    isError: detailedError,
    refetch: refetchDetailed,
  } = useDetailedLiveMatchQuery(selectedMatch?.id || null);

  /**
   * Handle sport selection
   */
  const handleSportChange = (sport: Sport) => {
    setIsTabSwitching(true);
    setSelectedSport(sport);
    clearSelectedLiveMatch(); // Clear selected match when changing sports
  };

  useEffect(() => {
    if (!isTabSwitching) return;
    if (loadingMatches || isFetchingMatches) return;

    const timeoutId = window.setTimeout(() => {
      setIsTabSwitching(false);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isFetchingMatches, isTabSwitching, loadingMatches]);

  /**
   * Handle match selection
   */
  const handleMatchClick = (match: Match) => {
    selectLiveMatch(match);
  };

  /**
   * Handle back from match detail
   */
  const handleBack = () => {
    clearSelectedLiveMatch();
  };

  /**
   * Group live matches by competition
   */
  const groupMatchesByCompetition = () => {
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

  const matchesByCompetition = groupMatchesByCompetition();
  const hasMatches = Object.keys(matchesByCompetition).length > 0;
  const sportName = activeSport?.name || 'this sport';

  /**
   * Render match detail view
   */
  const renderMatchDetail = () => {
    if (!selectedMatch) return null;

    // Error loading detailed match
    if (detailedError) {
      return (
        <ErrorState
          title="Unable to load match details"
          error="Failed to load detailed match information"
          onRetry={refetchDetailed}
          onBack={handleBack}
        />
      );
    }

    // Loading detailed match
    if (isDetailedLoading || !detailedMatchData) {
      return <LoadingState variant="skeleton" />;
    }

    // Show detailed match view
    return (
      <SelectedLiveMatchView
        match={selectedMatch}
        detailedLiveMatch={detailedMatchData}
        onBack={handleBack}
      />
    );
  };

  /**
   * Render live matches list
   */
  const renderMatchesList = () => {
    if (isTabSwitching) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    // Loading state
    if (loadingMatches && !hasMatches) {
      return <MatchListSkeleton sections={2} rowsPerSection={5} />;
    }

    // Error state
    if (matchesError && !hasMatches) {
      return (
        <ErrorState
          title={`Unable to load live matches for ${sportName}`}
          error="Live matches are temporarily unavailable"
          onRetry={refetchMatches}
        />
      );
    }

    // Empty state
    if (!hasMatches) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
          }}
        >
          <SportsSoccerIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            No live matches for {sportName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back when matches are in progress
          </Typography>
        </Box>
      );
    }

    // Render matches grouped by competition
    return (
      <Stack spacing={2}>
        {Object.entries(matchesByCompetition).map(([competition, matches]) => (
          <MatchListSection
            key={competition}
            competition={{ id: competition, name: competition, matches }}
            onSelectMatch={handleMatchClick}
          />
        ))}
      </Stack>
    );
  };

  // Show error if sports failed to load
  if (sportsError) {
    return (
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2.5 } }}>
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
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2.5 } }}>
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
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2.5 } }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
          }}
        >
          <SportsSoccerIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            No sports available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sports data is not available at the moment
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2.5 } }}>
      <Stack spacing={3}>
        {/* Banner */}
        <Banner className="h-37.5 sm:h-47.5 md:h-47.5" />

        {/* Sport Tabs */}
        <SportTabs
          sports={sports}
          selectedSport={activeSport}
          onSelectSport={handleSportChange}
          isLoading={loadingSports}
        />

        {/* Matches Content */}
        <Box>{selectedMatch ? renderMatchDetail() : renderMatchesList()}</Box>
      </Stack>
    </Container>
  );
};

export default withAuth(LiveMatchesPage);
