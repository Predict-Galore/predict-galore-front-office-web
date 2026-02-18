/**
 * News Page
 * Matches Figma UI design - Banner, Sport Tabs, News Content with proper states
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Box, Paper, Typography, Chip } from '@mui/material';
import { Article } from '@mui/icons-material';
import { SportTabs } from '@/shared/components/shared';
import { useLeagues, useSports } from '@/features/predictions';
import { useNews, useFeaturedNews } from '@/features/news';
import {
  RecentNewsSection,
  SportsArticleSection,
  LeagueTableSection,
} from '@/features/news/components';
import { LoadingState, ErrorState, EmptyState } from '@/shared/components/shared';
import Banner from '@/features/dashboard/components/Banner';
import type { Sport } from '@/features/predictions/model/types';
import withAuth from '../../../hoc/withAuth';
import { getFriendlyErrorMessage } from '@/shared/lib/errors';

const NewsPage: React.FC = () => {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  // Get sports data
  const { 
    data: sportsData = [], 
    isLoading: sportsLoading,
    isError: sportsError,
    error: sportsErrorData,
    refetch: refetchSports
  } = useSports();

  // Set default sport
  React.useEffect(() => {
    if (!selectedSport && sportsData.length > 0) {
      setSelectedSport(sportsData[0]);
    }
  }, [selectedSport, sportsData]);

  const selectedSportName = useMemo(
    () => selectedSport?.name || sportsData?.[0]?.name || 'this sport',
    [selectedSport?.name, sportsData]
  );

  // Get sports and leagues to find Premier League ID
  const soccerSport = sportsData.find(
    (s) => s.name.toLowerCase() === 'soccer' || s.name.toLowerCase() === 'football'
  );
  const { data: leaguesData = [] } = useLeagues(soccerSport?.id, { enabled: !!soccerSport?.id });
  const premierLeague = leaguesData.find((l) => l.name === 'Premier League');

  // Get featured news (fetch more to have options for filtering)
  const {
    featuredNews: allFeaturedNews,
    isLoading: isFeaturedLoading,
    isFetching: isFeaturedFetching,
    isError: isFeaturedError,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedNews(10); // Fetch more featured news for filtering

  // Get recent news (fetch more for filtering)
  const {
    data: recentNewsData,
    isLoading: isRecentLoading,
    isFetching: isRecentFetching,
    isError: isRecentError,
    error: recentError,
    refetch: refetchRecent,
  } = useNews({
    page: 1,
    pageSize: 20, // Fetch more news for filtering
  });

  // Get sports articles (fetch more for filtering)
  const {
    data: articlesData,
    isLoading: isArticlesLoading,
    isFetching: isArticlesFetching,
    isError: isArticlesError,
    error: articlesError,
    refetch: refetchArticles,
  } = useNews({
    page: 1,
    pageSize: 30, // Fetch more articles for filtering
  });

  // Helper function to map sport names to categories
  const mapSportToCategory = useCallback((sportName: string): string[] => {
    const name = sportName?.toLowerCase();
    switch (name) {
      case 'football':
      case 'soccer':
        return ['soccer', 'football'];
      case 'basketball':
        return ['basketball'];
      case 'tennis':
        return ['tennis'];
      case 'cricket':
        return ['cricket'];
      case 'hockey':
        return ['hockey'];
      case 'all sports':
        return []; // Return empty array to show all
      default:
        return [name];
    }
  }, []);

  // Filter news based on selected sport
  const filteredFeaturedNews = useMemo(() => {
    if (!selectedSport || selectedSport.name === 'All Sports') {
      return allFeaturedNews || [];
    }
    const categories = mapSportToCategory(selectedSport.name);
    return (allFeaturedNews || []).filter(item => 
      categories.some(cat => item.category?.toLowerCase().includes(cat))
    );
  }, [allFeaturedNews, selectedSport, mapSportToCategory]);

  const filteredRecentNews = useMemo(() => {
    const allRecentNews = recentNewsData?.items || [];
    if (!selectedSport || selectedSport.name === 'All Sports') {
      return allRecentNews.slice(0, 4);
    }
    const categories = mapSportToCategory(selectedSport.name);
    return allRecentNews
      .filter(item => categories.some(cat => item.category?.toLowerCase().includes(cat)))
      .slice(0, 4);
  }, [recentNewsData?.items, selectedSport, mapSportToCategory]);

  const filteredArticles = useMemo(() => {
    const allArticles = articlesData?.items || [];
    if (!selectedSport || selectedSport.name === 'All Sports') {
      return allArticles.slice(0, 6);
    }
    const categories = mapSportToCategory(selectedSport.name);
    return allArticles
      .filter(item => categories.some(cat => item.category?.toLowerCase().includes(cat)))
      .slice(0, 6);
  }, [articlesData?.items, selectedSport, mapSportToCategory]);

  // Combine all filtered news into a single array
  const allFilteredNews = useMemo(() => {
    const combined = [...filteredRecentNews, ...filteredArticles];
    // Remove duplicates by id
    const uniqueNews = combined.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
    return uniqueNews;
  }, [filteredRecentNews, filteredArticles]);

  // Build sports for tabs from API
  const sportsForTabs = useMemo((): Sport[] => {
    return sportsData;
  }, [sportsData]);

  const handleSportChange = useCallback((sport: Sport) => {
    setSelectedSport(sport);
  }, []);

  const handleRetry = useCallback(() => {
    refetchFeatured();
    refetchRecent();
    refetchArticles();
  }, [refetchFeatured, refetchRecent, refetchArticles]);

  const featuredArticle = filteredFeaturedNews?.[0];

  const isLoading = isFeaturedLoading || isRecentLoading || isArticlesLoading;
  const isFetching = isFeaturedFetching || isRecentFetching || isArticlesFetching;
  const isError = isFeaturedError || isRecentError || isArticlesError;
  const hasContent = featuredArticle || allFilteredNews.length > 0;
  
  const friendlyError = isError
    ? getFriendlyErrorMessage(
        featuredError || recentError || articlesError,
        'Unable to load news right now.'
      )
    : '';

  const sportsErrorMessage = useMemo(
    () => (sportsError ? getFriendlyErrorMessage(sportsErrorData) : ''),
    [sportsError, sportsErrorData]
  );

  // Loading state
  if (sportsError) {
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
  if (sportsLoading && sportsData.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper sx={{ height: { xs: 120, sm: 150, md: 180 }, bgcolor: 'grey.100' }} />
          <Paper sx={{ height: 40, bgcolor: 'grey.100' }} />
          <Paper sx={{ height: { xs: 300, sm: 350, md: 400 }, bgcolor: 'grey.100' }} />
        </Stack>
      </Container>
    );
  }

  if (!sportsData.length) {
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
        {/* Banner */}
        <Banner className="h-[150px] sm:h-[170px] md:h-[190px]" />

        {/* Sport Tabs */}
        <SportTabs
          sports={sportsForTabs}
          selectedSport={selectedSport}
          onSelectSport={handleSportChange}
          isLoading={sportsLoading}
        />

        {/* News Content */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
          {isLoading && !hasContent ? (
            <Stack spacing={3}>
              {/* Hero Section Skeleton */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ height: { xs: 240, sm: 300, md: 460 }, bgcolor: 'grey.100' }} />
              </Paper>
              
              {/* Recent News Section Skeleton */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
                <Stack spacing={2}>
                  <Box sx={{ height: 32, width: '30%', bgcolor: 'grey.200', borderRadius: 1 }} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <Paper key={i} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                        <Box sx={{ height: { xs: 150, sm: 180, md: 192 }, bgcolor: 'grey.100' }} />
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ height: 16, width: '40%', bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                          <Box sx={{ height: 24, width: '90%', bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                          <Box sx={{ height: 16, width: '70%', bgcolor: 'grey.200', borderRadius: 1 }} />
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Stack>
                <Paper sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 2, display: { xs: 'none', lg: 'block' } }}>
                  <Box sx={{ height: 24, width: '60%', bgcolor: 'grey.200', borderRadius: 1, mb: 2 }} />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Box key={i} sx={{ height: 32, bgcolor: 'grey.100', borderRadius: 1, mb: 1 }} />
                  ))}
                </Paper>
              </Box>
              
              {/* Sports Articles Section Skeleton */}
              <Stack spacing={2}>
                <Box sx={{ height: 32, width: '30%', bgcolor: 'grey.200', borderRadius: 1 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Paper key={i} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                      <Box sx={{ height: { xs: 150, sm: 180, md: 192 }, bgcolor: 'grey.100' }} />
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ height: 16, width: '40%', bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                        <Box sx={{ height: 24, width: '90%', bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                        <Box sx={{ height: 16, width: '70%', bgcolor: 'grey.200', borderRadius: 1 }} />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Stack>
            </Stack>
          ) : isError && !hasContent ? (
            <ErrorState
              title={`News temporarily unavailable for ${selectedSportName}`}
              error={friendlyError}
              onRetry={handleRetry}
            />
          ) : !hasContent ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Article sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                No news available for {selectedSportName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We could not find any news articles for {selectedSportName} right now. Please check back soon.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ position: 'relative' }}>
              {/* Loading overlay when switching sports */}
              {isFetching && hasContent && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(2px)',
                  zIndex: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                }}>
                  <LoadingState 
                    variant="spinner" 
                    message={`Loading ${selectedSportName} news...`}
                  />
                </Box>
              )}
              
              <Stack spacing={6}>
              {/* Loading indicator when switching sports */}
              {isFetching && hasContent && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  py: 6,
                  mb: 4,
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  <LoadingState 
                    variant="spinner" 
                    message={`Loading ${selectedSportName} news...`}
                  />
                </Box>
              )}

              {/* Hero Section */}
              {featuredArticle && featuredArticle.imageUrl && (
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    minHeight: { xs: 340, md: 460 },
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={featuredArticle.category || featuredArticle.sport || 'Highlight'}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.65)',
                        color: 'white',
                      }}
                    />
                    {(featuredArticle.author || featuredArticle.source) && (
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {featuredArticle.author && `By ${featuredArticle.author}`}
                        {featuredArticle.author && featuredArticle.source && ' • '}
                        {featuredArticle.source}
                      </Typography>
                    )}
                  </Box>
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

              {/* All News Grid - Combined without section headers */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                  gap: 4,
                  alignItems: 'stretch',
                }}
              >
                <Box>
                  {allFilteredNews.length > 0 ? (
                    <SportsArticleSection
                      articles={allFilteredNews}
                      showViewMore={false}
                    />
                  ) : (
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No news available for {selectedSportName}
                      </Typography>
                    </Paper>
                  )}
                </Box>
                {premierLeague && (
                  <Paper
                    elevation={0}
                    sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                  >
                    <LeagueTableSection leagueId={premierLeague.id} title="Premier League Table" />
                  </Paper>
                )}
              </Box>
              </Stack>
            </Box>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default withAuth(NewsPage);
