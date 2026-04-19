/**
 * SelectedNewsView Component
 *
 * Full-page article detail view rendered inline inside the news page.
 *
 * Accepts a full NewsItem object directly — no extra API call needed since
 * the list endpoint already returns all fields (title, content, summary,
 * imageUrl, author, source, tags, etc.).
 *
 * If a numeric `articleId` is passed instead (e.g. from the /news/:id URL
 * route), it will fetch the article from the API as a fallback.
 *
 * Design:
 *   - Hero image with back (←) and share (⤴) icon buttons
 *   - Category chip
 *   - Title (bold)
 *   - Date
 *   - Like / Dislike buttons
 *   - Summary (italic lead)
 *   - Full article body
 *   - Tags + source
 */

'use client';

import React, { useState } from 'react';
import {
  Stack,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Skeleton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import dayjs from 'dayjs';
import { useNewsItem } from '@/features/news/api/hooks';
import { ErrorState } from '@/shared/components/shared';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';
import type { NewsItem } from '../model/types';

// ==================== PROP TYPES ====================

/**
 * Two usage modes:
 *  1. Pass `article` directly — used by the news list page (no extra fetch).
 *  2. Pass `articleId` — used by the /news/:id URL route (fetches from API).
 */
type SelectedNewsViewProps =
  | { article: NewsItem; articleId?: never; onBack: () => void }
  | { articleId: number; article?: never; onBack: () => void };

// ==================== LOADING SKELETON ====================

const ArticleSkeleton: React.FC = () => (
  <Stack spacing={2}>
    <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} />
    <Skeleton variant="text" width="80%" height={40} />
    <Skeleton variant="text" width="30%" height={20} />
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
    </Box>
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} variant="text" width={i % 4 === 0 ? '60%' : '100%'} height={20} />
    ))}
  </Stack>
);

// ==================== CONTENT RENDERER ====================

/**
 * Renders article body text.
 * - Blocks separated by double newlines become paragraphs.
 * - Short blocks without a trailing period are rendered as bold section headings.
 */
const ArticleBody: React.FC<{ content: string }> = ({ content }) => {
  const blocks = content.split(/\n{2,}/);

  return (
    <Box>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Treat short lines without a trailing period as section headings
        const isHeading = trimmed.length <= 60 && !trimmed.endsWith('.');

        if (isHeading) {
          return (
            <Typography
              key={index}
              variant="h6"
              fontWeight={700}
              sx={{ mt: index === 0 ? 0 : 3, mb: 1, lineHeight: 1.3 }}
            >
              {trimmed}
            </Typography>
          );
        }

        return (
          <Typography
            key={index}
            variant="body1"
            sx={{ lineHeight: 1.8, mb: 2, color: 'text.primary' }}
          >
            {trimmed}
          </Typography>
        );
      })}
    </Box>
  );
};

// ==================== INNER VIEW (receives a resolved NewsItem) ====================

interface ArticleViewProps {
  article: NewsItem;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const [likes, setLikes] = useState(article.likeCount ?? 24);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const imageUrl = getSafeNewsImageUrl(article.imageUrl ?? article.thumbnailUrl);

  // ── Engagement handlers ──

  const handleLike = () => {
    if (hasLiked) {
      setLikes((n) => n - 1);
      setHasLiked(false);
    } else {
      setLikes((n) => n + 1);
      setHasLiked(true);
      if (hasDisliked) setHasDisliked(false);
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setHasDisliked(false);
    } else {
      setHasDisliked(true);
      if (hasLiked) {
        setLikes((n) => n - 1);
        setHasLiked(false);
      }
    }
  };

  const handleShare = async () => {
    const shareData = { title: article.title, text: article.summary ?? '', url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Stack spacing={0}>
      {/* ── Hero image with back / share buttons ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          // Fixed height so the image always fills the space
          height: { xs: 240, sm: 320, md: 420 },
          bgcolor: 'grey.900',
          mb: 3,
          flexShrink: 0,
        }}
      >
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={article.title}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Back and Share icon buttons sit on top of the image */}
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
            aria-label="Go back to news list"
            sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: 'grey.100' } }}
          >
            <ArrowBackIcon />
          </IconButton>

          <IconButton
            onClick={handleShare}
            aria-label="Share this article"
            sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: 'grey.100' } }}
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* ── Article body ── */}
      <Box>
        {/* Category chip */}
        {article.category && (
          <Chip
            label={article.category}
            size="small"
            sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 700, mb: 2 }}
          />
        )}

        {/* Title */}
        <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.25, mb: 1.5 }}>
          {article.title}
        </Typography>

        {/* Date */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {dayjs(article.publishedAt ?? new Date().toISOString()).format('DD MMMM YYYY')}
        </Typography>

        {/* Like / Dislike row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Button
            onClick={handleLike}
            startIcon={hasLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            variant={hasLiked ? 'contained' : 'outlined'}
            color={hasLiked ? 'success' : 'inherit'}
            size="small"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {likes}
          </Button>

          <Button
            onClick={handleDislike}
            startIcon={hasDisliked ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
            variant={hasDisliked ? 'contained' : 'outlined'}
            color={hasDisliked ? 'error' : 'inherit'}
            size="small"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {/* dislike count not tracked server-side */}
          </Button>
        </Box>

        {/* Summary — italic lead paragraph */}
        {article.summary && (
          <>
            <Typography
              variant="body1"
              sx={{ fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.75, mb: 2 }}
            >
              {article.summary}
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </>
        )}

        {/* Full article body */}
        {article.content && <ArticleBody content={article.content} />}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 3 }}>
            {article.tags.map((tag, i) => (
              <Chip key={i} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
            ))}
          </Box>
        )}

        {/* Source */}
        {article.source && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Source: {article.source}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

// ==================== FETCH-BY-ID WRAPPER ====================
// Used only when navigating directly to /dashboard/news/:id

interface FetchByIdProps {
  articleId: number;
  onBack: () => void;
}

const FetchByIdView: React.FC<FetchByIdProps> = ({ articleId, onBack }) => {
  const { data: article, isLoading, error, refetch } = useNewsItem(articleId, { enabled: !!articleId });

  if (isLoading) return <ArticleSkeleton />;

  if (error || !article) {
    return (
      <ErrorState
        title="Error loading article"
        error={error?.message ?? 'Failed to load article'}
        onRetry={refetch}
        onBack={onBack}
      />
    );
  }

  return <ArticleView article={article} onBack={onBack} />;
};

// ==================== PUBLIC COMPONENT ====================

const SelectedNewsView: React.FC<SelectedNewsViewProps> = (props) => {
  // If a full article object was passed, render it directly (no fetch needed)
  if (props.article) {
    return <ArticleView article={props.article} onBack={props.onBack} />;
  }

  // Otherwise fetch by ID (used by the /news/:id URL route)
  return <FetchByIdView articleId={props.articleId} onBack={props.onBack} />;
};

export default SelectedNewsView;
