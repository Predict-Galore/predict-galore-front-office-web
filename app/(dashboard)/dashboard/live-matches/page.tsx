// app/(dashboard)/dashboard/live-matches/page.tsx
'use client';

import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { Typography, Box, Container, Stack, Paper } from '@mui/material';
import { SportsSoccer } from '@mui/icons-material';

// Components - Using migrated feature components
import { SportTabs } from '@/shared/components/shared';
import { MatchListSection, SelectedLiveMatchView } from '@/features/live-matches';
import { LoadingState, ErrorState, ErrorBoundary, DashboardNewsSidebar } from '@/shared/components/shared';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';
import Banner from '@/features/dashboard/components/Banner';
import MatchListSkeleton from '@/features/dashboard/components/MatchListSkeleton';

// Hooks - Using feature hooks
import { useAuth } from '@/features/auth';
import { useLiveScoresQuery, useDetailedLiveMatchQuery } from '@/features/live-matches';
import { useNews, useFeaturedNews } from '@/features/news';
import { useSports } from '@/features/predictions';
import { createLogger } from '@/shared/api/logger';

const logger = createLogger('LiveMatchesPage');

// Store - Using feature stores
import {
  useLiveMatchesStore,
  useSelectedLiveMatch,
  useDetailedLiveMatch,
} from '@/features/live-matches';

// Types - Using migrated feature types
import type { Match } from '@/features/live-matches/model/types';
import type { Sport } from '@/features/predictions/model/types';
import withAuth from '../../../hoc/withAuth';

const LiveMatchesPage: React.FC = () => {
  // Get auth state using feature hooks
  const { user, isAuthenticated } = useAuth();
  const [activeSport, setActiveSport] = useState<Sport | null>(null);

  // Get sports data from API
  const { data: sportsData = [], isLoading: sportsLoading } = useSports();

  // Log auth info for debugging
  useEffect(() => {
    logger.debug('Live matches page auth info', {
      userEmail: user?.email,
      userRole: user?.role,
      isAuthenticated,
    });
  }, [user, isAuthenticated]);

  // ==================== STORE STATE ====================
  const {
    selectLiveMatch,
    clearSelectedLiveMatch,
  } = useLiveMatchesStore();

  const selectedLiveMatch = useSelectedLiveMatch();
  const detailedLiveMatch = useDetailedLiveMatch();

  const activeSportName = useMemo(
    () => activeSport?.name || sportsData?.[0]?.name || 'this sport',
    [activeSport?.name, sportsData]
  );

  // Get the active sport ID from the API sports data
  // Set default sport
  useEffect(() => {
    if (!activeSport && sportsData.length > 0) {
      setActiveSport(sportsData[0]);
    }
  }, [activeSport, sportsData]);

  // ==================== QUERIES ====================
  // Live scores query with sport filter
  const liveSportFilter = useMemo(() => {
    const name = activeSport?.name?.trim().toLowerCase();
    if (!name) return undefined;
    // Backend transformer currently tags live matches as `soccer`
    if (name === 'football') return 'soccer';
    return name;
  }, [activeSport?.name]);

  const {
    data: liveScoresData,
    isLoading: isLiveScoresLoading,
    isFetching: isLiveScoresFetching,
    isError: isLiveScoresError,
    error: liveScoresError,
    refetch: refetchLiveScores,
  } = useLiveScoresQuery(
    liveSportFilter ? { sport: liveSportFilter } : undefined,
    { enabled: !!liveSportFilter }
  );

  // Detailed live match query
  const {
    data: detailedLiveMatchData,
    isError: isDetailedMatchError,
    error: detailedMatchError,
    refetch: refetchDetailedMatch,
  } = useDetailedLiveMatchQuery(selectedLiveMatch?.id || null);

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

  // ==================== SPORTS FOR TABS ====================
  // Handle sport change
  const handleSportChange = useCallback((sport: Sport) => {
    setActiveSport(sport);
    clearSelectedLiveMatch(); // Clear selection when changing sports
  }, [clearSelectedLiveMatch]);

  // ==================== EVENT HANDLERS ====================
  const handleSelectMatch = useCallback(
    (match: Match) => {
      selectLiveMatch(match);
    },
    [selectLiveMatch]
  );

  const handleBack = useCallback(() => {
    clearSelectedLiveMatch();
  }, [clearSelectedLiveMatch]);

  const handleRetry = useCallback(() => {
    if (selectedLiveMatch) {
      refetchDetailedMatch();
    } else {
      refetchLiveScores();
    }
  }, [selectedLiveMatch, refetchDetailedMatch, refetchLiveScores]);

  const handleNewsRetry = useCallback(() => {
    refetchFeaturedNews();
    refetchNews();
  }, [refetchFeaturedNews, refetchNews]);

  // ==================== EFFECTS ====================
  // Sync detailed live match data
  useEffect(() => {
    if (detailedLiveMatchData && selectedLiveMatch) {
      // setDetailedLiveMatch(detailedLiveMatchData);
    }
  }, [detailedLiveMatchData, selectedLiveMatch]);

  // Handle detailed match fetch error
  useEffect(() => {
    if (selectedLiveMatch && isDetailedMatchError) {
      const errorMessage = detailedMatchError instanceof Error ? detailedMatchError.message : 'Unknown error';
      
      // Don't log expected "not implemented" errors as errors, just as debug info
      if (errorMessage.includes('not yet implemented') || errorMessage.includes('not implemented')) {
        logger.debug('Detailed match endpoint not available', {
          matchId: selectedLiveMatch.id,
          error: errorMessage,
        });
      } else {
        logger.error('Failed to load detailed match', {
          error: errorMessage,
        });
      }
    }
  }, [selectedLiveMatch, isDetailedMatchError, detailedMatchError]);

  // ==================== DATA TRANSFORMATIONS ====================
  // Safely extract news items
  const newsItems = useMemo(() => {
    if (!newsData) return [];
    if (Array.isArray(newsData.items)) return newsData.items;
    // Handle different possible data structures
    const dataAsRecord = newsData as Record<string, unknown>;
    if (Array.isArray(dataAsRecord.data)) return dataAsRecord.data as typeof newsData.items;
    return [];
  }, [newsData]);

  // Group live scores by competition
  const liveScoresByCompetition = useMemo(() => {
    const source = liveScoresData;

    if (!source?.sections) return {};

    const grouped: Record<string, Match[]> = {};
    source.sections.forEach((section) => {
      section.matches.forEach((match) => {
        const competitionName = match.competition || section.title || 'Other';
        if (!grouped[competitionName]) {
          grouped[competitionName] = [];
        }
        grouped[competitionName].push(match);
      });
    });

    return grouped;
  }, [liveScoresData]);

  const hasLiveMatches = Object.keys(liveScoresByCompetition).length > 0;
  const showLiveError = isLiveScoresError && !hasLiveMatches;

  // ==================== STATE MANAGEMENT ====================
  const sportsErrorMessage = useMemo(
    () => (isLiveScoresError ? getFriendlyErrorMessage(liveScoresError) : ''),
    [isLiveScoresError, liveScoresError]
  );

  const liveMatchesErrorMessage = useMemo(
    () =>
      isLiveScoresError
        ? getFriendlyErrorMessage(liveScoresError, 'Unable to load live matches right now.')
        : '',
    [isLiveScoresError, liveScoresError]
  );

  // ==================== RENDER LOGIC ====================
  // Loading state
  if (isLiveScoresError && !sportsData.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState
          title="Unable to load sports"
          error={sportsErrorMessage}
          onRetry={() => refetchLiveScores()}
        />
      </Container>
    );
  }

  // Initial load only: keep it page-level; afterwards we use per-section loading
  if (sportsLoading && sportsData.length === 0) {
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
              <MatchListSkeleton sections={2} rowsPerSection={5} />
            </Box>
            <Paper sx={{ height: { xs: 300, sm: 400, md: 520 }, bgcolor: 'grey.100' }} />
          </Box>
        </Stack>
      </Container>
    );
  }

  if (!sportsData.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <SportsSoccer color="disabled" sx={{ fontSize: { xs: 40, sm: 56 }, mb: 1.5 }} />
          <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 600 }}>
            No sports available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We could not load sports from the server. Please try again later.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show detailed live match view if a match is selected
  if (selectedLiveMatch) {
    if (isDetailedMatchError) {
      const errorMessage = detailedMatchError instanceof Error ? detailedMatchError.message : 'Unknown error';
      
      // Handle "not implemented" errors more gracefully
      if (errorMessage.includes('not yet implemented') || errorMessage.includes('not implemented')) {
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <ErrorState
              title="Match details coming soon"
              error="Detailed match information is not available yet. This feature is currently under development."
              onBack={handleBack}
            />
          </Container>
        );
      }
      
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <ErrorState
            error="Failed to load match details"
            onRetry={handleRetry}
            onBack={handleBack}
          />
        </Container>
      );
    }

    if (!detailedLiveMatch) {
      return (
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1400, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
        >
          <LoadingState
            message="Loading match details..."
            subMessage="Please wait while we fetch the match information"
          />
        </Container>
      );
    }

    return (
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1400, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <SelectedLiveMatchView
          match={selectedLiveMatch}
          detailedLiveMatch={detailedLiveMatch}
          onBack={handleBack}
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
          sports={sportsData}
          selectedSport={activeSport}
          onSelectSport={handleSportChange}
          isLoading={sportsLoading}
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
          {/* Live Matches Content */}
          <Paper elevation={0} sx={{ p: { xs: 1, md: 0 } }}>
            <Stack spacing={2}>
              {/* Live Matches Section */}
              {isLiveScoresLoading && !hasLiveMatches ? (
                <MatchListSkeleton sections={2} rowsPerSection={5} />
              ) : showLiveError ? (
                <ErrorState
                  title={`Unable to load live matches for ${activeSportName}`}
                  error={liveMatchesErrorMessage || `Live matches for ${activeSportName} are temporarily unavailable.`}
                  onRetry={() => refetchLiveScores()}
                />
              ) : hasLiveMatches ? (
                <>
                  {/* While switching sports or refetching, show loading indicator */}
                  {isLiveScoresFetching && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'neutral.200',
                        bgcolor: 'neutral.50',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      Updating live matches for {activeSportName}…
                    </Paper>
                  )}

                  {Object.entries(liveScoresByCompetition).map(([competitionName, matches]) => (
                    <MatchListSection
                      key={competitionName}
                      competition={{ id: competitionName, name: competitionName, matches }}
                      onSelectMatch={handleSelectMatch}
                    />
                  ))}
                </>
              ) : (
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <SportsSoccer color="disabled" sx={{ fontSize: { xs: 40, sm: 56 }, mb: 1.5 }} />
                  <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 600 }}>
                    No live matches available for {activeSportName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Live matches for {activeSportName} are currently unavailable. Please try again later.
                  </Typography>
                </Box>
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
    </Container>
  );
};

export default withAuth(() => (
  <ErrorBoundary
    resetKeys={[]}
    onError={(error, errorInfo) => {
      logger.error('Live matches page error', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }}
  >
    <LiveMatchesPage />
  </ErrorBoundary>
));
