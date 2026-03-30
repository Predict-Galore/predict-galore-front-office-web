/**
 * News Article Detail Page
 * Shows full article with hero image and engagement buttons
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Stack, Paper, Box, Typography, IconButton, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useNewsItem } from '@/features/news/api/hooks';
import { ErrorState } from '@/shared/components/shared';
import dayjs from 'dayjs';

/**
 * News Article Detail Page Component
 */
const NewsArticlePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  // Get article ID from URL
  const articleId = params?.id ? Number(params.id) : null;

  // Engagement state
  const [likes, setLikes] = useState(24);
  const [dislikes, setDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  // Fetch article data
  const {
    data: article,
    isLoading,
    error,
  } = useNewsItem(articleId ?? undefined, {
    enabled: !!articleId,
  });

  /**
   * Navigate back to news list
   */
  const handleBack = () => {
    router.push('/dashboard/news');
  };

  /**
   * Handle like button click
   */
  const handleLike = () => {
    if (hasLiked) {
      // Unlike
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      // Like
      setLikes(likes + 1);
      setHasLiked(true);

      // Remove dislike if exists
      if (hasDisliked) {
        setDislikes(dislikes - 1);
        setHasDisliked(false);
      }
    }
  };

  /**
   * Handle dislike button click
   */
  const handleDislike = () => {
    if (hasDisliked) {
      // Remove dislike
      setDislikes(dislikes - 1);
      setHasDisliked(false);
    } else {
      // Dislike
      setDislikes(dislikes + 1);
      setHasDisliked(true);

      // Remove like if exists
      if (hasLiked) {
        setLikes(likes - 1);
        setHasLiked(false);
      }
    }
  };

  /**
   * Handle share button click
   */
  const handleShare = () => {
    if (navigator.share && article) {
      // Use native share if available
      navigator.share({
        title: article.title,
        text: article.summary || '',
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  /**
   * Format date to readable string
   */
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  /**
   * Render loading skeleton
   */
  const renderLoading = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Hero skeleton */}
        <Box sx={{ height: 440, bgcolor: 'grey.100', borderRadius: 2 }} />

        {/* Content skeleton */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ height: 40, width: '80%', bgcolor: 'grey.200', borderRadius: 1 }} />
            <Box sx={{ height: 20, width: '30%', bgcolor: 'grey.200', borderRadius: 1 }} />
            <Box sx={{ height: 60, width: 200, bgcolor: 'grey.100', borderRadius: 1 }} />
            <Box sx={{ height: 200, bgcolor: 'grey.100', borderRadius: 1 }} />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );

  // Invalid article ID
  if (!articleId) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState title="Article not found" error="Invalid article ID" />
      </Container>
    );
  }

  // Loading state
  if (isLoading) {
    return renderLoading();
  }

  // Error state
  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState
          title="Error loading article"
          error={error?.message || 'Failed to load article'}
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Hero Image with Back and Share buttons */}
        {article.imageUrl && (
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              minHeight: { xs: 320, md: 440 },
            }}
          >
            {/* Background Image */}
            <Box
              component="img"
              src={article.imageUrl}
              alt={article.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
              }}
            />

            {/* Overlay with buttons */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                p: 2,
              }}
            >
              {/* Back button */}
              <IconButton
                onClick={handleBack}
                sx={{
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              {/* Share button */}
              <IconButton
                onClick={handleShare}
                sx={{
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
          </Paper>
        )}

        {/* Article Content */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Stack spacing={3}>
            {/* Category chip */}
            {article.category && (
              <Box>
                <Chip label={article.category} color="primary" size="small" />
              </Box>
            )}

            {/* Title */}
            <Typography variant="h4" fontWeight={800}>
              {article.title}
            </Typography>

            {/* Date and author */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {formatDate(article.publishedAt || new Date().toISOString())}
              </Typography>
              {article.author && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    By {article.author}
                  </Typography>
                </>
              )}
            </Stack>

            {/* Engagement buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 2,
                width: 'fit-content',
              }}
            >
              {/* Like button */}
              <Button
                onClick={handleLike}
                startIcon={<ThumbUpIcon />}
                variant={hasLiked ? 'contained' : 'outlined'}
                color={hasLiked ? 'success' : 'inherit'}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {likes}
              </Button>

              {/* Dislike button */}
              <Button
                onClick={handleDislike}
                startIcon={<ThumbDownIcon />}
                variant={hasDisliked ? 'contained' : 'outlined'}
                color={hasDisliked ? 'error' : 'inherit'}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {dislikes}
              </Button>
            </Box>

            {/* Article content */}
            <Box sx={{ fontSize: 16, lineHeight: 1.7, color: 'text.primary' }}>
              {article.content?.split('\n\n').map((paragraph, index) => (
                <Typography key={index} paragraph>
                  {paragraph}
                </Typography>
              ))}
            </Box>

            {/* Source */}
            {article.source && (
              <Typography variant="caption" color="text.secondary">
                Source: {article.source}
              </Typography>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default NewsArticlePage;
