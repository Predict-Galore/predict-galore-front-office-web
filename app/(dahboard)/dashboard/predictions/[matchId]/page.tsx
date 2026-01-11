/**
 * Match Detail Page
 * Shows detailed prediction information for a specific match
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Stack, Box, Paper } from '@mui/material';
import {
  MatchHeader,
  OverviewTab,
  PredictionsTab,
  TableTab,
} from '@/features/predictions/components';
import { useDetailedMatch, useMatchOdds, useLeagueTable } from '@/features/predictions';
import { useNews, useFeaturedNews } from '@/features/news';
import { LoadingState, ErrorState } from '@/shared/components/shared';
import { getFallbackDetailedMatch } from '@/features/predictions/lib/mock-data';

type TabType = 'overview' | 'predictions' | 'table';

import { DashboardNewsSidebar } from '@/shared/components/shared';

const MatchDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.matchId ? Number(params.matchId) : null;
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [predictionSubTab, setPredictionSubTab] = useState<
    'all' | 'hf-ft' | 'scorers' | 'goals' | 'corners'
  >('all');

  const {
    data: matchData,
    isLoading: matchLoading,
    error: matchError,
  } = useDetailedMatch(matchId, { enabled: !!matchId });

  const { data: oddsData = [], isLoading: oddsLoading } = useMatchOdds(matchId, {
    enabled: !!matchId && activeTab === 'predictions',
  });

  const leagueId = matchData?.prediction?.leagueId;
  const { data: tableData = [], isLoading: tableLoading } = useLeagueTable(leagueId ?? null, {
    enabled: !!leagueId && activeTab === 'table',
  });

  const { featuredNews = [] } = useFeaturedNews(1);
  const { data: newsData, isLoading: isNewsLoading } = useNews({ pageSize: 6 });

  const handleBack = () => {
    router.push('/dashboard/predictions');
  };

  if (!matchId) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState error="Invalid match ID" title="Match not found" />
      </Container>
    );
  }

  if (matchLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingState variant="skeleton" />
      </Container>
    );
  }

  const effectiveMatch = matchData || (matchId ? getFallbackDetailedMatch(matchId) : null);

  if (matchError && !effectiveMatch) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState
          error={matchError?.message || 'Failed to load match details'}
          title="Error loading match"
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) 340px' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 1.5, md: 2 } }}>
          <Stack spacing={2}>
            {effectiveMatch && (
              <MatchHeader
                prediction={effectiveMatch.prediction}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onBack={handleBack}
              />
            )}

            {activeTab === 'overview' && effectiveMatch && (
              <OverviewTab
                prediction={effectiveMatch.prediction}
                detailed={effectiveMatch.detailed}
              />
            )}

            {activeTab === 'predictions' && effectiveMatch && (
              <PredictionsTab
                odds={oddsData}
                isLoading={oddsLoading}
                activeSubTab={predictionSubTab}
                onSubTabChange={setPredictionSubTab}
              />
            )}

            {activeTab === 'table' && (
              <TableTab leagueId={leagueId} tableData={tableData} isLoading={tableLoading} />
            )}
          </Stack>
        </Paper>

        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <DashboardNewsSidebar
            topNews={featuredNews || []}
            laligaNews={newsData?.items?.slice(0, 6) || []}
            isLoading={isNewsLoading}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default MatchDetailPage;
