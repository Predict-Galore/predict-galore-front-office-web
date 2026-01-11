/**
 * News Page
 * Matches Figma UI design - Hero section, Recent News, League Table, Sports Articles
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Box, Paper, Typography, Chip } from '@mui/material';
import { SportTabs, useLeagues, useSports } from '@/features/predictions';
import { useNews, useFeaturedNews } from '@/features/news';
import {
  RecentNewsSection,
  SportsArticleSection,
  LeagueTableSection,
} from '@/features/news/components';
import { LoadingState, ErrorState, EmptyState } from '@/shared/components/shared';
import { PREDICTIONS_CONSTANTS } from '@/features/predictions/lib/constants';
import type { Sport } from '@/features/predictions/model/types';
import withAuth from '@/app/hoc/withAuth';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';
import { mockNewsItems } from '@/features/news/lib/mock-data';
import SafeImage from '@/shared/components/shared/SafeImage';

const NewsPage: React.FC = () => {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  // Get sports and leagues to find Premier League ID
  const { data: sportsData = [] } = useSports();
  const soccerSport = sportsData.find(
    (s) => s.name.toLowerCase() === 'soccer' || s.name.toLowerCase() === 'football'
  );
  const { data: leaguesData = [] } = useLeagues(soccerSport?.id, { enabled: !!soccerSport?.id });
  const premierLeague = leaguesData.find((l) => l.name === 'Premier League');

  // Get featured news for hero section
  const {
    featuredNews,
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedNews(1);

  // Get recent news (first 4)
  const {
    data: recentNewsData,
    isLoading: isRecentLoading,
    isError: isRecentError,
    error: recentError,
    refetch: refetchRecent,
  } = useNews({
    page: 1,
    pageSize: 4,
    sport: selectedSport?.name === 'All Sports' ? undefined : selectedSport?.name?.toLowerCase(),
  });

  // Get sports articles (for Sports Article section)
  const {
    data: articlesData,
    isLoading: isArticlesLoading,
    isError: isArticlesError,
    error: articlesError,
    refetch: refetchArticles,
  } = useNews({
    page: 1,
    pageSize: 6,
    sport: selectedSport?.name === 'All Sports' ? undefined : selectedSport?.name?.toLowerCase(),
  });

  // Create sports array for tabs
  const sportsForTabs = useMemo((): Sport[] => {
    return PREDICTIONS_CONSTANTS.DEFAULT_SPORTS.map((sport, index) => ({
      ...sport,
      id: index + 1,
    }));
  }, []);

  const handleSportChange = (sport: Sport) => {
    setSelectedSport(sport);
  };

  const handleViewMore = () => {
    router.push('/dashboard/news?page=2');
  };

  const featuredArticle = featuredNews?.[0] || mockNewsItems[0];
  const recentNews = recentNewsData?.items?.length
    ? recentNewsData.items
    : mockNewsItems.slice(0, 4);
  const articles = articlesData?.items?.length ? articlesData.items : mockNewsItems.slice(0, 6);

  const isLoading = isFeaturedLoading || isRecentLoading || isArticlesLoading;
  const isError = isFeaturedError || isRecentError || isArticlesError;
  const friendlyError = isError
    ? getFriendlyErrorMessage(
        featuredError || recentError || articlesError,
        'Unable to load news right now.'
      )
    : '';

  const handleRetry = () => {
    refetchFeatured();
    refetchRecent();
    refetchArticles();
  };

  if (isLoading && !featuredArticle) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <LoadingState variant="skeleton" />
      </Container>
    );
  }

  if (isError && !recentNews.length && !articles.length) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <ErrorState
          title="News temporarily unavailable"
          error={friendlyError}
          onRetry={handleRetry}
        />
      </Container>
    );
  }

  if (!recentNews.length && !articles.length) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <EmptyState
          title="No news available"
          description="We could not find any news articles right now. Please check back soon."
        />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <SportTabs
            sports={sportsForTabs}
            selectedSport={selectedSport || sportsForTabs[0]}
            onSelectSport={handleSportChange}
            isLoading={false}
          />
        </Box>

        {/* Hero */}
        {featuredArticle && (
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              minHeight: { xs: 340, md: 460 },
            }}
          >
            <SafeImage
              src={featuredArticle.imageUrl || ''}
              alt={featuredArticle.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 80%)',
                p: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <Chip
                label={featuredArticle.category || featuredArticle.sport || 'Highlight'}
                size="small"
                sx={{
                  bgcolor: 'rgba(0,0,0,0.65)',
                  color: 'white',
                  mb: 1.5,
                  alignSelf: 'flex-start',
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  mb: 1,
                  lineHeight: 1.1,
                }}
              >
                {featuredArticle.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', maxWidth: 780 }}>
                {featuredArticle.summary || featuredArticle.content?.slice(0, 160)}
              </Typography>
            </Box>
          </Paper>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              Recent News
            </Typography>
            <RecentNewsSection news={recentNews} />
          </Stack>
          {premierLeague && (
            <Paper
              elevation={0}
              sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
            >
              <LeagueTableSection leagueId={premierLeague.id} title="Premier League Table" />
            </Paper>
          )}
        </Box>

        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            Sports Article
          </Typography>
          <SportsArticleSection
            articles={articles}
            showViewMore={true}
            onViewMore={handleViewMore}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default withAuth(NewsPage);
