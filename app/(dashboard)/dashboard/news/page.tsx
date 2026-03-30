/**
 * News Page
 * Shows news articles for selected sport
 */

'use client';

import React, { useState } from 'react';
import { Container, Stack, Box, Paper, Typography, Chip } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { SportTabs } from '@/shared/components/shared';
import { useLeagues, useSports } from '@/features/predictions/api/hooks';
import { useFeaturedNews, useNews } from '@/features/news/api/hooks';
import SportsArticleSection from '@/features/news/components/SportsArticleSection';
import LeagueTableSection from '@/features/news/components/LeagueTableSection';
import SelectedNewsView from '@/features/news/components/SelectedNewsView';
import { ErrorState, EmptyState } from '@/shared/components/shared';
import Banner from '@/features/dashboard/components/Banner';
import withAuth from '../../../hoc/withAuth';
import type { Sport } from '@/features/predictions/model/types';
import type { NewsItem } from '@/features/news/model/types';

/**
 * News Page Component
 */
const NewsPage: React.FC = () => {
  // UI State
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

  // Fetch sports list
  const {
    data: sports = [],
    isLoading: loadingSports,
    isError: sportsError,
    refetch: refetchSports,
  } = useSports();

  // Fetch featured news
  const {
    featuredNews = [],
    isLoading: loadingFeatured,
    isError: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedNews(10);

  // Fetch recent news
  const {
    data: newsData,
    isLoading: loadingNews,
    isError: newsError,
    refetch: refetchNews,
  } = useNews({ page: 1, pageSize: 20 });

  const activeSport = selectedSport ?? sports[0] ?? null;

  // Get soccer sport for Premier League table
  const soccerSport = sports.find(
    (s) => s.name.toLowerCase() === 'soccer' || s.name.toLowerCase() === 'football'
  );

  // Fetch leagues for Premier League table
  const { data: leagues = [] } = useLeagues(soccerSport?.id, {
    enabled: !!soccerSport?.id,
  });

  const premierLeague = leagues.find((l) => l.name === 'Premier League');

  /**
   * Handle sport selection
   */
  const handleSportChange = (sport: Sport) => {
    setSelectedSport(sport);
    setSelectedNewsId(null);
  };

  /**
   * Map sport name to category for filtering
   */
  const getSportCategories = (sportName: string): string[] => {
    const name = sportName?.toLowerCase();

    if (name === 'all sports') return []; // Show all

    // Map sport names to their category equivalents
    const categoryMap: Record<string, string[]> = {
      football: ['soccer', 'football'],
      soccer: ['soccer', 'football'],
      basketball: ['basketball'],
      tennis: ['tennis'],
      cricket: ['cricket'],
      hockey: ['hockey'],
    };

    return categoryMap[name] || [name];
  };

  /**
   * Filter news by selected sport
   */
  const filterNewsBySport = (newsItems: NewsItem[]): NewsItem[] => {
    if (!activeSport || activeSport.name === 'All Sports') {
      return newsItems;
    }

    const categories = getSportCategories(activeSport.name);
    return newsItems.filter((item) =>
      categories.some((cat) => item.category?.toLowerCase().includes(cat))
    );
  };

  // Get filtered news
  const filteredFeaturedNews = filterNewsBySport(featuredNews);
  const filteredRecentNews = filterNewsBySport(newsData?.items || []);

  // Get featured article (first featured news item)
  const featuredArticle = filteredFeaturedNews[0];

  // Combine all news (remove duplicates)
  const allNews = [...filteredRecentNews]
    .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
    .slice(0, 12);

  // Check states
  const isLoading = loadingFeatured || loadingNews;
  const isError = featuredError || newsError;
  const hasContent = featuredArticle || allNews.length > 0;
  const sportName = activeSport?.name || 'this sport';

  /**
   * Render loading skeleton
   */
  const renderLoading = () => (
    <Stack spacing={3}>
      {/* Hero skeleton */}
      <Box sx={{ height: 460, bgcolor: 'grey.100', borderRadius: 2 }} />

      {/* News grid skeleton */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Paper key={i} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ height: 192, bgcolor: 'grey.100' }} />
            <Box sx={{ p: 2 }}>
              <Box sx={{ height: 16, width: '40%', bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
              <Box sx={{ height: 24, width: '90%', bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
              <Box sx={{ height: 16, width: '70%', bgcolor: 'grey.200', borderRadius: 1 }} />
            </Box>
          </Paper>
        ))}
      </Box>
    </Stack>
  );

  /**
   * Render featured article hero section
   */
  const renderFeaturedArticle = () => {
    if (!featuredArticle?.imageUrl) return null;

    return (
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          minHeight: { xs: 340, md: 460 },
          border: 1,
          borderColor: 'divider',
        }}
      >
        {/* Background image */}
        <Box
          component="img"
          src={featuredArticle.imageUrl}
          alt={featuredArticle.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
          }}
        />

        {/* Overlay with content */}
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
          {/* Category and author */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Chip
              label={featuredArticle.category || featuredArticle.sport || 'Highlight'}
              size="small"
              sx={{ bgcolor: 'rgba(0,0,0,0.65)', color: 'white' }}
            />
            {(featuredArticle.author || featuredArticle.source) && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {featuredArticle.author && `By ${featuredArticle.author}`}
                {featuredArticle.author && featuredArticle.source && ' • '}
                {featuredArticle.source}
              </Typography>
            )}
          </Box>

          {/* Title */}
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

          {/* Summary */}
          <Typography variant="body2" sx={{ color: 'white', maxWidth: 780 }}>
            {featuredArticle.summary || featuredArticle.content?.slice(0, 160)}
          </Typography>
        </Box>
      </Paper>
    );
  };

  // Show error if sports failed to load
  if (sportsError) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <ErrorState
          title="Unable to load sports"
          error="Failed to load sports data"
          onRetry={refetchSports}
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
          <Box sx={{ height: 400, bgcolor: 'grey.100', borderRadius: 2 }} />
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
          selectedSport={activeSport}
          onSelectSport={handleSportChange}
          isLoading={loadingSports}
        />

        {/* News Content */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
          {selectedNewsId ? (
            <SelectedNewsView articleId={selectedNewsId} onBack={() => setSelectedNewsId(null)} />
          ) : (
            <>
              {/* Loading state */}
              {isLoading && !hasContent ? (
                renderLoading()
              ) : /* Error state */
              isError && !hasContent ? (
                <ErrorState
                  title={`Unable to load news for ${sportName}`}
                  error="News is temporarily unavailable"
                  onRetry={() => {
                    refetchFeatured();
                    refetchNews();
                  }}
                />
              ) : /* Empty state */
              !hasContent ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <ArticleIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    No news available for {sportName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for new articles
                  </Typography>
                </Box>
              ) : (
                /* Content */
                <Stack spacing={6}>
                  {/* Featured Article Hero */}
                  {renderFeaturedArticle()}

                  {/* News Grid with League Table */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                      gap: 4,
                    }}
                  >
                    {/* News Articles */}
                    <Box>
                      {allNews.length > 0 ? (
                        <SportsArticleSection
                          articles={allNews}
                          showViewMore={false}
                          onReadMore={(article: NewsItem) => setSelectedNewsId(article.id)}
                        />
                      ) : (
                        <Paper
                          sx={{ p: 3, textAlign: 'center', border: 1, borderColor: 'divider' }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No news available for {sportName}
                          </Typography>
                        </Paper>
                      )}
                    </Box>

                    {/* Premier League Table */}
                    {premierLeague && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          border: 1,
                          borderColor: 'divider',
                          display: { xs: 'none', lg: 'block' },
                        }}
                      >
                        <LeagueTableSection
                          leagueId={premierLeague.id}
                          title="Premier League Table"
                        />
                      </Paper>
                    )}
                  </Box>
                </Stack>
              )}
            </>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default withAuth(NewsPage);
