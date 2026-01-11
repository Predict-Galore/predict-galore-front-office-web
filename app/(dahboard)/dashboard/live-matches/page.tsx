// app/(dashboard)/dashboard/live-matches/page.tsx
'use client';

import React, { useMemo, useEffect, useCallback } from 'react';
import { Typography, Box, Container, Stack, Paper } from '@mui/material';
import { SportsSoccer } from '@mui/icons-material';
import { formatSportName, slugify } from '@/shared/lib/utils';

// Components - Using migrated feature components
import { SportTabs } from '@/features/predictions';
import { MatchListSection, SelectedLiveMatchView } from '@/features/live-matches';
import { LoadingState, ErrorState, ErrorBoundary, DashboardNewsSidebar } from '@/shared/components/shared';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';

// Hooks - Using feature hooks
import { useAuth } from '@/features/auth';
import { useLiveScoresQuery, useDetailedLiveMatchQuery } from '@/features/live-matches';
import { useNews } from '@/features/news';
import { createLogger } from '@/shared/api/logger';

const logger = createLogger('LiveMatchesPage');

// Store - Using feature stores
import {
  useLiveMatchesStore,
  useSelectedLiveMatch,
  useDetailedLiveMatch,
} from '@/features/live-matches';

// Types - Using migrated feature types
import type { CompetitionGroup, Match } from '@/features/live-matches/model/types';
import type { Sport } from '@/features/predictions/model/types';
import { PREDICTIONS_CONSTANTS } from '@/features/predictions/lib/constants';
import withAuth from '@/app/hoc/withAuth';

const LiveMatchesPage: React.FC = () => {
  // Get auth state using feature hooks
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

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
    activeSport,
    setActiveSport,
    isLoading: storeLoading,
    error: storeError,
    selectLiveMatch,
    setDetailedLiveMatch,
    clearSelectedLiveMatch,
  } = useLiveMatchesStore();

  const selectedLiveMatch = useSelectedLiveMatch();
  const detailedLiveMatch = useDetailedLiveMatch();

  // ==================== QUERIES ====================
  // Live scores query
  const {
    data: liveScoresData,
    isLoading: isLiveScoresLoading,
    isError: isLiveScoresError,
    error: liveScoresError,
    refetch: refetchLiveScores,
  } = useLiveScoresQuery();

  // Detailed live match query
  const {
    data: detailedLiveMatchData,
    isLoading: isDetailedLiveMatchLoading,
    isError: isDetailedMatchError,
    error: detailedMatchError,
    refetch: refetchDetailedMatch,
  } = useDetailedLiveMatchQuery(selectedLiveMatch?.id || null);

  // News query - fetch news for sidebar
  const {
    data: newsData,
    isLoading: isNewsLoading,
  } = useNews({ page: 1, pageSize: 7 });

  // ==================== SPORTS FOR TABS ====================
  // Create sports array for the SportTabs component with numeric IDs
  const sportsForTabs = useMemo((): Sport[] => {
    const defaultSports: Sport[] = PREDICTIONS_CONSTANTS.DEFAULT_SPORTS.map((sport, index) => ({
      ...sport,
      id: index + 1,
    }));

    // If we have live scores data, extract unique sports
    if (liveScoresData?.sections) {
      const sportsFromMatches = new Set<string>();
      liveScoresData.sections.forEach((section: { matches: Match[] }) => {
        section.matches.forEach((match: Match) => {
          if (match.sport) {
            sportsFromMatches.add(match.sport);
          }
        });
      });

      // Create sport objects with numeric IDs
      let idCounter = 1;
      const sportsArray: Sport[] = Array.from(sportsFromMatches).map((sport) => ({
        id: idCounter++,
        name: formatSportName(sport),
        icon: sport,
        isActive: true,
      }));

      // Add "All Sports" to the beginning
      const allSportsItem = PREDICTIONS_CONSTANTS.DEFAULT_SPORTS[0];
      return [
        {
          id: 0,
          name: allSportsItem.name,
          icon: allSportsItem.icon,
          isActive: allSportsItem.isActive,
        },
        ...sportsArray,
      ];
    }

    return defaultSports;
  }, [liveScoresData]);

  // Get selected sport object for SportTabs based on activeSport string
  const selectedSportForTabs = useMemo((): Sport | null => {
    if (activeSport === 'all') {
      return sportsForTabs.find((sport) => sport.name === 'All Sports') || sportsForTabs[0];
    }

    // Find sport by name (case insensitive)
    const sport = sportsForTabs.find(
      (s) => slugify(s.name) === slugify(activeSport) || s.icon === activeSport
    );

    return sport || sportsForTabs[0];
  }, [sportsForTabs, activeSport]);

  // ==================== EVENT HANDLERS ====================
  const handleSportChange = useCallback(
    (sport: Sport) => {
      // Convert sport ID or name to activeSport string
      const sportKey = sport.name === 'All Sports' ? 'all' : sport.icon || slugify(sport.name);
      setActiveSport(sportKey);
      clearSelectedLiveMatch(); // Clear selection when changing sports
    },
    [setActiveSport, clearSelectedLiveMatch]
  );

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

  // ==================== EFFECTS ====================
  // Sync detailed live match data
  useEffect(() => {
    if (detailedLiveMatchData && selectedLiveMatch) {
      setDetailedLiveMatch(detailedLiveMatchData);
    }
  }, [detailedLiveMatchData, selectedLiveMatch, setDetailedLiveMatch]);

  // Handle detailed match fetch error
  useEffect(() => {
    if (selectedLiveMatch && isDetailedMatchError) {
      logger.error('Failed to load detailed match', {
        error: detailedMatchError instanceof Error ? detailedMatchError.message : 'Unknown error',
      });
    }
  }, [selectedLiveMatch, isDetailedMatchError, detailedMatchError]);

  // ==================== DATA TRANSFORMATIONS ====================
  // Prepare news data for the DashboardNewsSidebar component
  const newsItems = useMemo(() => {
    if (!newsData?.items) return [];

    // Filter news by selected sport if not "all"
    let filteredItems = newsData.items || [];
    if (activeSport !== 'all') {
      filteredItems = filteredItems.filter((item) => item.sport === activeSport);
    }

    return filteredItems;
  }, [newsData, activeSport]);

  // Process matches from backend response
  const allMatches = useMemo(() => {
    if (!liveScoresData?.sections) return [];
    return liveScoresData.sections.flatMap((section) => section.matches);
  }, [liveScoresData]);

  // Group matches by competition for the selected sport
  const competitionGroups = useMemo((): CompetitionGroup[] => {
    if (allMatches.length === 0) return [];

    // Filter matches by active sport
    const filteredMatches =
      activeSport === 'all'
        ? allMatches
        : allMatches.filter((match: Match) => match.sport === activeSport);

    if (filteredMatches.length === 0) return [];

    // Group by competition
    const competitionMap = new Map<string, CompetitionGroup>();

    filteredMatches.forEach((match: Match) => {
      const competition = match.competition || 'Other Competitions';
      const sport = match.sport || 'soccer';
      const id = slugify(`${competition}-${sport}`);

      if (!competitionMap.has(id)) {
        competitionMap.set(id, {
          id,
          name: competition,
          matches: [],
        });
      }

      const group = competitionMap.get(id);
      if (group) {
        group.matches.push(match);
      }
    });

    // Convert to array and sort by sport and competition name
    return Array.from(competitionMap.values()).sort((a, b) => {
      // Get sport from first match in group
      const sportA = a.matches[0]?.sport || '';
      const sportB = b.matches[0]?.sport || '';

      // Sort by sport first (prioritize soccer)
      if (sportA !== sportB) {
        if (sportA === PREDICTIONS_CONSTANTS.SPORTS.SOCCER) return -1;
        if (sportB === PREDICTIONS_CONSTANTS.SPORTS.SOCCER) return 1;
        return sportA.localeCompare(sportB);
      }

      // Then by competition name (prioritize Premier League)
      const premierLeague = PREDICTIONS_CONSTANTS.COMPETITIONS.PREMIER_LEAGUE;
      if (a.name === premierLeague) return -1;
      if (b.name === premierLeague) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [allMatches, activeSport]);

  // ==================== STATE MANAGEMENT ====================
  // Combined loading and error states
  const isLoading = useMemo(
    () =>
      isLiveScoresLoading ||
      storeLoading ||
      authLoading ||
      (selectedLiveMatch && isDetailedLiveMatchLoading),
    [isLiveScoresLoading, storeLoading, authLoading, selectedLiveMatch, isDetailedLiveMatchLoading]
  );

  const isError = useMemo(
    () => isLiveScoresError || (selectedLiveMatch && isDetailedMatchError),
    [isLiveScoresError, selectedLiveMatch, isDetailedMatchError]
  );

  const error = useMemo(
    () =>
      isError
        ? getFriendlyErrorMessage(
            liveScoresError || detailedMatchError || storeError,
            'We could not load live matches right now.'
          )
        : '',
    [isError, liveScoresError, detailedMatchError, storeError]
  );

  // ==================== RENDER LOGIC ====================
  const renderContent = () => {
    if (authLoading) {
      return (
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}
        >
          <LoadingState message="Loading..." />
        </Container>
      );
    }

    if (isLoading && !selectedLiveMatch) {
      return (
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}
        >
          <LoadingState
            message="Loading live scores..."
            subMessage="Please wait while we fetch the latest data"
          />
        </Container>
      );
    }

    if (isError && !selectedLiveMatch) {
      return (
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}
        >
          <ErrorState error={error || 'Failed to load live scores'} onRetry={handleRetry} />
        </Container>
      );
    }

    // Show detailed live match view if a match is selected
    if (selectedLiveMatch) {
      if (isDetailedMatchError) {
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

    // ==================== MAIN RENDER ====================
    return (
      <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          <Box>
            <SportTabs
              sports={sportsForTabs}
              selectedSport={selectedSportForTabs}
              onSelectSport={handleSportChange}
              isLoading={isLiveScoresLoading}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <Paper elevation={0} sx={{ p: { xs: 1, md: 2 } }}>
              {competitionGroups.length > 0 ? (
                <Stack spacing={2}>
                  {competitionGroups.map((competition) => (
                    <MatchListSection
                      key={competition.id}
                      competition={competition}
                      onSelectMatch={handleSelectMatch}
                    />
                  ))}
                </Stack>
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
                    No live matches available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for live scores
                  </Typography>
                </Box>
              )}
            </Paper>

            <DashboardNewsSidebar
              topNews={newsItems.slice(0, 1)}
              laligaNews={newsItems.slice(1, 7)}
              isLoading={isNewsLoading}
            />
          </Box>
        </Stack>
      </Container>
    );
  };

  return (
    <ErrorBoundary
      resetKeys={[activeSport, selectedLiveMatch?.id || '']}
      onError={(error, errorInfo) => {
        logger.error('Live matches page error', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      {renderContent()}
    </ErrorBoundary>
  );
};

export default withAuth(LiveMatchesPage);
