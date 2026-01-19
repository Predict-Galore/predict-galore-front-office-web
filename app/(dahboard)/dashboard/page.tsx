// app/(dashboard)/dashboard/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Container, Stack, Box, Paper } from '@mui/material';
import { SportTabs } from '@/features/predictions';
import { useSports, usePredictions } from '@/features/predictions';
import { useLiveScoresQuery } from '@/features/live-matches';
import { useNews, useFeaturedNews } from '@/features/news';
import {
  ContentTabs,
  LeagueSection,
  LiveLeagueSection,
  MatchListSkeleton,
} from '@/features/dashboard/components';
import { DashboardNewsSidebar } from '@/shared/components/shared';
import { PREDICTIONS_CONSTANTS } from '@/features/predictions/lib/constants';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';
import { EmptyState, ErrorState } from '@/shared/components/shared';
import type { Sport } from '@/features/predictions/model/types';
import type { Prediction } from '@/features/predictions/model/types';
import type { Match } from '@/features/live-matches/model/types';
import withAuth from '@/app/hoc/withAuth';

// Lazy load heavy components for code splitting
const Banner = dynamic(
  () => import('@/features/dashboard/components').then((mod) => ({ default: mod.Banner })),
  {
    ssr: false,
    loading: () => <div className="h-[180px] bg-gray-100 animate-pulse rounded-xl" />,
  }
);


const PremiumModal = dynamic(
  () => import('@/features/dashboard/components').then((mod) => ({ default: mod.PremiumModal })),
  { ssr: false }
);

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

  // UI sports list (stable + matches design screenshot). We map it to real API sports by name when possible.
  const uiSports = useMemo<Sport[]>(() => {
    return Array.from(PREDICTIONS_CONSTANTS.DEFAULT_SPORTS)
      .filter((s) => s.name !== 'All Sports')
      .map((s, idx) => ({ id: idx + 1, name: s.name }) as Sport);
  }, []);

  const realSportsByName = useMemo(() => {
    const map = new Map<string, Sport>();
    for (const s of sports) {
      map.set(String(s.name || '').toLowerCase(), s);
    }
    return map;
  }, [sports]);

  const activeRealSportId = useMemo(() => {
    const key = String(activeSport?.name || '').toLowerCase();
    return realSportsByName.get(key)?.id ?? sports[0]?.id;
  }, [activeSport?.name, realSportsByName, sports]);

  // Fetch predictions
  const {
    data: predictionsData,
    isLoading: isPredictionsLoading,
    isError: isPredictionsError,
    error: predictionsError,
    refetch: refetchPredictions,
  } = usePredictions(
    {
      sportId: activeRealSportId,
      pageSize: 20,
    },
    { enabled: !!activeRealSportId }
  );

  // Fetch live scores
  const {
    data: liveScoresData,
    isLoading: isLiveScoresLoading,
    isError: isLiveScoresError,
    error: liveScoresError,
    refetch: refetchLiveScores,
  } = useLiveScoresQuery();

  // Fetch featured news
  const {
    featuredNews,
    isError: isFeaturedNewsError,
    error: featuredNewsError,
  } = useFeaturedNews(1);

  // Fetch news
  const {
    data: newsData,
    isLoading: isNewsLoading,
    isError: isNewsError,
    error: newsError,
  } = useNews({ pageSize: 5 });

  // Set default sport
  useEffect(() => {
    if (!activeSport && uiSports.length > 0) {
      setActiveSport(uiSports[0]);
    }
  }, [activeSport, uiSports]);

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

  const newsErrorMessage = useMemo(
    () =>
      isNewsError || isFeaturedNewsError
        ? getFriendlyErrorMessage(newsError || featuredNewsError, 'Unable to load news right now.')
        : '',
    [isNewsError, isFeaturedNewsError, newsError, featuredNewsError]
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
  }, [isLiveScoresError, liveScoresData]);

  const hasLiveMatches = Object.keys(liveScoresByCompetition).length > 0;
  const showLiveError = isLiveScoresError && !hasLiveMatches;

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

  if (isSportsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper sx={{ height: 180, bgcolor: 'grey.100' }} />
          <Paper sx={{ height: 40, bgcolor: 'grey.100' }} />
          <Paper sx={{ height: 40, bgcolor: 'grey.100' }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
              gap: 2,
            }}
          >
            <Box>
              <MatchListSkeleton sections={2} rowsPerSection={5} />
            </Box>
            <Paper sx={{ height: 520, bgcolor: 'grey.100' }} />
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
          description="We could not load sports. Switch to mock data or retry."
        />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Banner className="h-[150px] sm:h-[170px] md:h-[190px]" />

        <SportTabs
          sports={uiSports}
          selectedSport={activeSport}
          onSelectSport={handleSportChange}
          isLoading={isSportsLoading}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
            gap: 3,
            alignItems: 'flex-start',
          }}
        >
          <Paper elevation={0} sx={{ p: { xs: 1, md: 0 } }}>
            <Stack spacing={2}>
              <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {activeTab === 'predictions' ? (
                isPredictionsLoading ? (
                  <MatchListSkeleton sections={2} rowsPerSection={5} />
                ) : showPredictionsError ? (
                  <ErrorState
                    title="Predictions temporarily unavailable"
                    error={predictionsErrorMessage}
                    onRetry={() => refetchPredictions()}
                  />
                ) : Object.keys(predictionsByLeague).length > 0 ? (
                  Object.entries(predictionsByLeague).map(([leagueName, predictions]) => (
                    <LeagueSection
                      key={leagueName}
                      leagueName={leagueName}
                      matches={predictions}
                      onMatchClick={handlePredictionSelect}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No predictions available"
                    description="We could not load predictions for this sport yet. Please try again later."
                  />
                )
              ) : isLiveScoresLoading ? (
                <MatchListSkeleton sections={2} rowsPerSection={5} />
              ) : showLiveError ? (
                <ErrorState
                  title="Live matches unavailable"
                  error={liveScoresErrorMessage}
                  onRetry={() => refetchLiveScores()}
                />
              ) : Object.keys(liveScoresByCompetition).length > 0 ? (
                Object.entries(liveScoresByCompetition).map(([competitionName, matches]) => (
                  <LiveLeagueSection
                    key={competitionName}
                    leagueName={competitionName}
                    matches={matches}
                    onMatchClick={(m) => router.push(`/dashboard/live-matches/${m.id}`)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No live matches available"
                  description="Live matches are currently unavailable. We will refresh automatically when data is back."
                />
              )}
            </Stack>
          </Paper>

          <Stack spacing={1.5}>
            <DashboardNewsSidebar
              topNews={featuredNews || []}
              laligaNews={newsData?.items?.slice(0, 5) || []}
              isLoading={isNewsLoading}
              onUnlockPersonalized={() => router.push('/dashboard/profile')}
            />
            {newsErrorMessage && (
              <Box sx={{ color: 'text.secondary', fontSize: 12 }}>
                {newsErrorMessage} Showing fallback highlights.
              </Box>
            )}
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
