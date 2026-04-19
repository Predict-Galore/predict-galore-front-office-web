/**
 * News Page
 *
 * Displays sports news filtered by the selected sport tab.
 * Layout (matches design):
 *   1. Sport tabs (All, Soccer, Basketball, Tennis, Volleyball, Golf…)
 *   2. Featured hero article (full-width banner)
 *   3. Two-column row: Recent News (left) + Premier League Table (right, desktop only)
 *   4. Sports Articles grid (3 columns desktop / 1 column mobile)
 *   5. "View More" button
 *
 * When a user clicks an article the inline SelectedNewsView replaces the list.
 */

'use client';

import React, { useState } from 'react';
import { Stack, Box, Typography, Button, Paper, Skeleton } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

import { SportTabs } from '@/shared/components/shared';
import { useSports } from '@/features/predictions/api/hooks';
import { useNews } from '@/features/news/api/hooks';
import { ErrorState, EmptyState } from '@/shared/components/shared';
import withAuth from '../../../hoc/withAuth';

import FeaturedHero from '@/features/news/components/FeaturedHero';
import RecentNewsSection from '@/features/news/components/RecentNewsSection';
import SportsArticleSection from '@/features/news/components/SportsArticleSection';
import SelectedNewsView from '@/features/news/components/SelectedNewsView';

import type { Sport } from '@/features/predictions/model/types';
import type { NewsItem } from '@/features/news/model/types';

// How many articles to show before the "View More" button
const INITIAL_ARTICLE_COUNT = 6;

// ==================== LOADING SKELETON ====================

const NewsPageSkeleton: React.FC = () => (
  <Stack spacing={3}>
    {/* Hero skeleton */}
    <Skeleton variant="rectangular" height={460} sx={{ borderRadius: 2 }} />

    {/* Recent news + table skeleton */}
    {/* Recent news skeleton */}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
      <Stack spacing={1.5}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
            <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 1, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={14} />
              <Skeleton variant="text" width="90%" height={16} />
              <Skeleton variant="text" width="70%" height={16} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>

    {/* Articles grid skeleton */}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
      {[1, 2, 3].map((i) => (
        <Box key={i}>
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2, mb: 1 }} />
          <Skeleton variant="text" width="40%" height={14} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={16} />
        </Box>
      ))}
    </Box>
  </Stack>
);

// ==================== MAIN PAGE ====================

const NewsPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  // Store the full article object so SelectedNewsView doesn't need to re-fetch
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  // ── Sports list ──
  const {
    data: sports = [],
    isLoading: loadingSports,
    isError: sportsError,
    refetch: refetchSports,
  } = useSports();

  const activeSport = selectedSport ?? sports[0] ?? null;

  // ── News for the selected sport ──
  // The API accepts sportId as a query param: GET /api/v1/news?sportId=1
  const {
    data: newsData,
    isLoading: loadingNews,
    isError: newsError,
    refetch: refetchNews,
  } = useNews(
    {
      page: 1,
      pageSize: 20,
      ...(activeSport?.id ? { sportId: activeSport.id } : {}),
    },
    { enabled: !!activeSport }
  );

  // ── Derived data ──
  const allNews: NewsItem[] = newsData?.items ?? [];

  // First featured article → hero banner
  const featuredArticle = allNews.find((n) => n.isFeatured) ?? allNews[0] ?? null;

  // Next 4 articles → Recent News section
  const recentArticles = allNews.filter((n) => n !== featuredArticle).slice(0, 4);

  // Remaining articles → Sports Articles grid
  const remainingArticles = allNews.filter(
    (n) => n !== featuredArticle && !recentArticles.includes(n)
  );
  const visibleArticles = showAll
    ? remainingArticles
    : remainingArticles.slice(0, INITIAL_ARTICLE_COUNT);

  const isLoading = loadingSports || loadingNews;
  const hasContent = allNews.length > 0;
  const sportName = activeSport?.name ?? 'this sport';

  // ── Handlers ──
  const handleSportChange = (sport: Sport) => {
    setSelectedSport(sport);
    setSelectedArticle(null);
    setShowAll(false);
  };

  const handleArticleClick = (article: NewsItem) => {
    setSelectedArticle(article);
  };

  const handleBackFromArticle = () => {
    setSelectedArticle(null);
  };

  // ==================== RENDER ====================

  // Sports failed to load
  if (sportsError) {
    return (
      <Box sx={{ py: 2 }}>
        <ErrorState
          title="Unable to load sports"
          error="Failed to load sports data"
          onRetry={refetchSports}
        />
      </Box>
    );
  }

  // Initial sports loading
  if (loadingSports && sports.length === 0) {
    return (
      <Stack spacing={3} sx={{ py: 2 }}>
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
      </Stack>
    );
  }

  // No sports available
  if (sports.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <EmptyState title="No sports available" description="Sports data is not available at the moment" />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* ── Sport tabs ── */}
      <SportTabs
        sports={sports}
        selectedSport={activeSport}
        onSelectSport={handleSportChange}
        isLoading={loadingSports}
      />

      {/* ── Article detail view (replaces list when an article is selected) ── */}
      {selectedArticle ? (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <SelectedNewsView
            article={selectedArticle}
            onBack={handleBackFromArticle}
          />
        </Paper>
      ) : (
        /* ── News list view ── */
        <>
          {/* Loading state */}
          {isLoading && !hasContent && <NewsPageSkeleton />}

          {/* Error state */}
          {newsError && !hasContent && !isLoading && (
            <ErrorState
              title={`Unable to load news for ${sportName}`}
              error="News is temporarily unavailable"
              onRetry={refetchNews}
            />
          )}

          {/* Empty state */}
          {!isLoading && !newsError && !hasContent && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ArticleIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                No news available for {sportName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back later for new articles
              </Typography>
            </Box>
          )}

          {/* ── Main content ── */}
          {hasContent && (
            <Stack spacing={4}>
              {/* 1. Featured hero */}
              {featuredArticle && (
                <FeaturedHero
                  article={featuredArticle}
                  onClick={handleArticleClick}
                />
              )}

              {/* 2. Recent News */}
              {recentArticles.length > 0 && (
                <RecentNewsSection
                  articles={recentArticles}
                  onArticleClick={handleArticleClick}
                />
              )}

              {/* 3. Sports Articles grid */}
              {visibleArticles.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Sports Article
                  </Typography>

                  <SportsArticleSection
                    articles={visibleArticles}
                    onReadMore={handleArticleClick}
                  />

                  {/* View More button */}
                  {!showAll && remainingArticles.length > INITIAL_ARTICLE_COUNT && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Button
                        variant="contained"
                        onClick={() => setShowAll(true)}
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          fontWeight: 700,
                          px: 5,
                          py: 1.25,
                          borderRadius: 1,
                          textTransform: 'none',
                          fontSize: '1rem',
                          '&:hover': { bgcolor: 'success.dark' },
                        }}
                      >
                        View More
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};

export default withAuth(NewsPage);
