/**
 * News Article Detail Page
 * Matches Figma UI design - Large hero image, article content, engagement buttons
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container, Stack, Paper, Box, Typography, Button } from '@mui/material';
import { ArrowBack, Share, ThumbUp, ThumbDown } from '@mui/icons-material';
import { useNewsItem } from '@/features/news';
import { LoadingState, ErrorState } from '@/shared/components/shared';
import dayjs from 'dayjs';

const NewsArticlePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const articleId = params?.id ? Number(params.id) : null;
  const [likes, setLikes] = useState(24);
  const [dislikes, setDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const {
    data: article,
    isLoading,
    error,
  } = useNewsItem(articleId ?? undefined, { enabled: !!articleId });

  const fallbackArticle = null;

  const handleBack = () => {
    router.push('/dashboard/news');
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      if (hasDisliked) {
        setDislikes((prev) => prev - 1);
        setHasDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setDislikes((prev) => prev - 1);
      setHasDisliked(false);
    } else {
      setDislikes((prev) => prev + 1);
      setHasDisliked(true);
      if (hasLiked) {
        setLikes((prev) => prev - 1);
        setHasLiked(false);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.summary || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const resolvedArticle = article || fallbackArticle;

  if (!articleId) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <ErrorState error="Invalid article ID" title="Article not found" />
      </Container>
    );
  }

  if (isLoading && !resolvedArticle) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <LoadingState variant="skeleton" />
      </Container>
    );
  }

  if ((error || !resolvedArticle) && !fallbackArticle) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <ErrorState
          error={error?.message || 'Failed to load article'}
          title="Error loading article"
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        {/* Hero Image */}
        {resolvedArticle?.imageUrl && (
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              minHeight: { xs: 320, md: 440 },
            }}
          >
            <Image
              src={resolvedArticle.imageUrl}
              alt={resolvedArticle.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
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
              <Button
                onClick={handleBack}
                variant="contained"
                sx={{
                  minWidth: 'auto',
                  bgcolor: 'white',
                  color: 'black',
                  '&:hover': { bgcolor: 'white' },
                  borderRadius: '50%',
                  p: 1,
                }}
              >
                <ArrowBack />
              </Button>
              <Button
                onClick={handleShare}
                variant="contained"
                sx={{
                  minWidth: 'auto',
                  bgcolor: 'white',
                  color: 'black',
                  '&:hover': { bgcolor: 'white' },
                  borderRadius: '50%',
                  p: 1,
                }}
              >
                <Share />
              </Button>
            </Box>
          </Paper>
        )}

        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
              {resolvedArticle?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(resolvedArticle?.publishedAt || new Date().toISOString())}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1.5,
                width: 'fit-content',
              }}
            >
              <Button
                onClick={handleLike}
                startIcon={<ThumbUp />}
                sx={{
                  minWidth: 0,
                  px: 2,
                  bgcolor: hasLiked ? 'green.100' : 'white',
                  color: hasLiked ? 'green.700' : 'grey.700',
                  '&:hover': { bgcolor: hasLiked ? 'green.100' : 'grey.50' },
                  borderRadius: 1.5,
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {likes}
              </Button>
              <Button
                onClick={handleDislike}
                startIcon={<ThumbDown />}
                sx={{
                  minWidth: 0,
                  px: 2,
                  bgcolor: hasDisliked ? 'red.100' : 'white',
                  color: hasDisliked ? 'red.700' : 'grey.700',
                  '&:hover': { bgcolor: hasDisliked ? 'red.100' : 'grey.50' },
                  borderRadius: 1.5,
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {dislikes}
              </Button>
            </Box>

            <Box sx={{ fontSize: 16, lineHeight: 1.7, color: '#374151' }}>
              {(resolvedArticle?.content || '')
                .split('\n\n')
                .map((paragraph: string, index: number) => (
                  <Typography key={index} component="p" sx={{ mb: 2 }}>
                    {paragraph}
                  </Typography>
                ))}
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default NewsArticlePage;
