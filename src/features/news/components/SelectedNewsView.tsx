'use client';

import React, { useState } from 'react';
import { Stack, Paper, Box, Typography, IconButton, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import dayjs from 'dayjs';
import { useNewsItem } from '@/features/news/api/hooks';
import { ErrorState, LoadingState } from '@/shared/components/shared';

interface SelectedNewsViewProps {
  articleId: number;
  onBack: () => void;
}

const SelectedNewsView: React.FC<SelectedNewsViewProps> = ({ articleId, onBack }) => {
  const [likes, setLikes] = useState(24);
  const [dislikes, setDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const {
    data: article,
    isLoading,
    error,
    refetch,
  } = useNewsItem(articleId, {
    enabled: !!articleId,
  });

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      return;
    }

    setLikes((prev) => prev + 1);
    setHasLiked(true);
    if (hasDisliked) {
      setDislikes((prev) => prev - 1);
      setHasDisliked(false);
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setDislikes((prev) => prev - 1);
      setHasDisliked(false);
      return;
    }

    setDislikes((prev) => prev + 1);
    setHasDisliked(true);
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = async () => {
    if (!article) return;

    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.summary || '',
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  };

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (error || !article) {
    return (
      <ErrorState
        title="Error loading article"
        error={error?.message || 'Failed to load article'}
        onRetry={refetch}
        onBack={onBack}
      />
    );
  }

  return (
    <Stack spacing={3}>
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
            <IconButton
              onClick={onBack}
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

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

      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          {!article.imageUrl && (
            <Button
              startIcon={<ArrowBackIcon />}
              variant="text"
              onClick={onBack}
              sx={{ textTransform: 'none', width: 'fit-content', px: 0, fontWeight: 700 }}
            >
              Back to list
            </Button>
          )}

          {article.category && (
            <Box>
              <Chip label={article.category} color="primary" size="small" />
            </Box>
          )}

          <Typography variant="h4" fontWeight={800}>
            {article.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {dayjs(article.publishedAt || new Date().toISOString()).format('DD MMMM YYYY')}
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
            <Button
              onClick={handleLike}
              startIcon={<ThumbUpIcon />}
              variant={hasLiked ? 'contained' : 'outlined'}
              color={hasLiked ? 'success' : 'inherit'}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {likes}
            </Button>

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

          <Box sx={{ fontSize: 16, lineHeight: 1.7, color: 'text.primary' }}>
            {article.content?.split('\n\n').map((paragraph, index) => (
              <Typography key={index} paragraph>
                {paragraph}
              </Typography>
            ))}
          </Box>

          {article.source && (
            <Typography variant="caption" color="text.secondary">
              Source: {article.source}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SelectedNewsView;
