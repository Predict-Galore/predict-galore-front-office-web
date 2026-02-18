// app/(dashboard)/dashboard/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Box, Paper } from '@mui/material';
import { SportTabs } from '@/shared/components/shared';
import { useSports, usePredictions } from '@/features/predictions';
import { useLiveScoresQuery } from '@/features/live-matches';
import { useNews, useFeaturedNews } from '@/features/news';
import Banner from '@/features/dashboard/components/Banner';
import ContentTabs from '@/features/dashboard/components/ContentTabs';
import LeagueSection from '@/features/dashboard/components/LeagueSection';
import LiveLeagueSection from '@/features/dashboard/components/LiveLeagueSection';
import MatchListSkeleton from '@/features/dashboard/components/MatchListSkeleton';
import { DashboardNewsSidebar } from '@/shared/components/shared';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';
import { EmptyState, ErrorState } from '@/shared/components/shared';
import type { Sport } from '@/features/predictions/model/types';
import type { Prediction } from '@/features/predictions/model/types';
import type { NewsItem } from '@/features/news/model/types';
import type { Match } from '@/features/live-matches/model/types';
import withAuth from '../../hoc/withAuth';
import PremiumModal from '@/features/dashboard/components/PremiumModal';

type ContentTabType = 'predictions' | 'live-matches';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentTabType>('predictions');
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

  // Fetch live scores
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
    { enabled: activeTab === 'live-matches' && !!liveSportFilter }
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

  // Handle prediction selection
  const handlePredictionSelect = useCallback(
    (prediction: Prediction) => {
      // Locked predictions should trigger premium modal
      if (prediction.status === 'Locked') {
        setIsPremiumModalOpen(true);
        return;
      }
      router.push(`/dashboard/predictions/${prediction.id}`);
    },
    [router]
  );

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

  const liveScoresErrorMessage = useMemo(
    () =>
      isLiveScoresError
        ? getFriendlyErrorMessage(liveScoresError, 'Unable to load live matches right now.')
        : '',
    [isLiveScoresError, liveScoresError]
  );

  const predictionsSource = useMemo<Prediction[]>(() => {
    return predictionsData?.predictions || [];
  }, [predictionsData]);

  // Group predictions by league
  const predictionsByLeague = useMemo(() => {
    if (!predictionsSource.length) return {};
    const grouped: Record<string, Prediction[]> = {};
    predictionsSource.forEach((prediction) => {
      const leagueName = prediction.competition || 'Other';
      if (!grouped[leagueName]) {
        grouped[leagueName] = [];
      }
      grouped[leagueName].push(prediction);
    });

    return grouped;
  }, [predictionsSource]);

  const hasPredictions = predictionsSource.length > 0;
  const showPredictionsError = isPredictionsError && !hasPredictions;

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

  const handleNewsRetry = useCallback(() => {
    refetchFeaturedNews();
    refetchNews();
  }, [refetchFeaturedNews, refetchNews]);

  const newsItems: NewsItem[] =
    (newsData as { items: NewsItem[] } | undefined)?.items ?? [];

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
        <Banner className="h-[150px] sm:h-[170px] md:h-[190px]" />

        <SportTabs
          sports={sports}
          selectedSport={activeSport}
          onSelectSport={handleSportChange}
          isLoading={isSportsLoading}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
            gap: 3,
            alignItems: 'flex-start',
          }}
        >
          <Paper elevation={0} sx={{ p: { xs: 1, md: 0 } }}>
            <Stack spacing={2}>
              <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {activeTab === 'predictions' ? (
                // Show skeleton when initially loading or when switching sports with no cached data
                isPredictionsLoading && !hasPredictions ? (
                  <MatchListSkeleton sections={2} rowsPerSection={5} />
                ) : showPredictionsError ? (
                  <ErrorState
                    title={`Unable to load predictions for ${activeSportName}`}
                    error={predictionsErrorMessage || `Predictions for ${activeSportName} are temporarily unavailable.`}
                    onRetry={() => refetchPredictions()}
                  />
                ) : Object.keys(predictionsByLeague).length > 0 ? (
                  <>
                    {Object.entries(predictionsByLeague).map(([leagueName, predictions]) => (
                      <LeagueSection
                        key={leagueName}
                        leagueName={leagueName}
                        matches={predictions}
                        onMatchClick={handlePredictionSelect}
                      />
                    ))}
                  </>
                ) : isPredictionsFetching ? (
                  // Show skeleton while fetching new sport data
                  <MatchListSkeleton sections={2} rowsPerSection={5} />
                ) : (
                  <EmptyState
                    title={`No predictions available for ${activeSportName}`}
                    description={`We don't have predictions for ${activeSportName} right now. Please try again later.`}
                  />
                )
              ) : isLiveScoresLoading && !hasLiveMatches ? (
                <MatchListSkeleton sections={2} rowsPerSection={5} />
              ) : showLiveError ? (
                <ErrorState
                  title={`Unable to load live matches for ${activeSportName}`}
                  error={liveScoresErrorMessage || `Live matches for ${activeSportName} are temporarily unavailable.`}
                  onRetry={() => refetchLiveScores()}
                />
              ) : Object.keys(liveScoresByCompetition).length > 0 ? (
                <>
                  {isLiveScoresFetching ? (
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
                  ) : null}

                  {Object.entries(liveScoresByCompetition).map(([competitionName, matches]) => (
                    <LiveLeagueSection
                      key={competitionName}
                      leagueName={competitionName}
                      matches={matches}
                      onMatchClick={(m) => router.push(`/dashboard/live-matches/${m.id}`)}
                    />
                  ))}
                </>
              ) : (
                <EmptyState
                  title={`No live matches available for ${activeSportName}`}
                  description={`Live matches for ${activeSportName} are currently unavailable. Please try again later.`}
                />
              )}
            </Stack>
          </Paper>

          <Stack spacing={1.5}>
            <DashboardNewsSidebar
              topNews={featuredNews}
              laligaNews={newsItems.slice(0, 8)}
              isLoading={
                (isNewsLoading && !newsItems.length) ||
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

export default withAuth(DashboardPage);
