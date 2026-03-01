/**
 * Live Match Detail Page
 * Shows detailed information for a specific live match
 */

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import SelectedLiveMatchView from '@/features/live-matches/components/SelectedLiveMatchView';
import { useDetailedLiveMatchQuery, useLiveScoresQuery } from '@/features/live-matches/api/hooks';
import { LoadingState, ErrorState } from '@/shared/components/shared';
import { Container } from '@mui/material';

const LiveMatchDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.matchId as string | null;

  const { data: liveScoresData, isLoading: scoresLoading } = useLiveScoresQuery();

  const {
    data: detailedMatch,
    isLoading: detailLoading,
    error: detailError,
  } = useDetailedLiveMatchQuery(matchId, { enabled: !!matchId });

  // Find the match from live scores
  const match = React.useMemo(() => {
    if (!liveScoresData?.sections || !matchId) return null;

    for (const section of liveScoresData.sections) {
      const found = section.matches.find((m) => m.id === matchId);
      if (found) return found;
    }
    return null;
  }, [liveScoresData, matchId]);

  const handleBack = () => {
    router.push('/dashboard/live-matches');
  };

  if (!matchId) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <ErrorState error="Invalid match ID" title="Match not found" />
      </Container>
    );
  }

  if (scoresLoading || detailLoading) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <LoadingState variant="skeleton" />
      </Container>
    );
  }

  if (detailError || !match || !detailedMatch) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <ErrorState
          error={detailError?.message || 'Failed to load match details'}
          title="Error loading match"
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <SelectedLiveMatchView match={match} detailedLiveMatch={detailedMatch} onBack={handleBack} />
    </Container>
  );
};

export default LiveMatchDetailPage;
