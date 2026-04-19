/**
 * News Article Detail Page  (/dashboard/news/:id)
 *
 * Standalone page for a single news article.
 * Uses the same SelectedNewsView component as the inline view,
 * so the design is consistent across both entry points.
 */

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@mui/material';
import { ErrorState } from '@/shared/components/shared';
import SelectedNewsView from '@/features/news/components/SelectedNewsView';

const NewsArticlePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  // Parse article ID from the URL segment
  const articleId = params?.id ? Number(params.id) : null;

  const handleBack = () => {
    router.push('/dashboard/news');
  };

  // Guard: invalid or missing ID
  if (!articleId || isNaN(articleId)) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <ErrorState title="Article not found" error="Invalid article ID" onRetry={handleBack} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <SelectedNewsView articleId={articleId} onBack={handleBack} />
    </Container>
  );
};

export default NewsArticlePage;
