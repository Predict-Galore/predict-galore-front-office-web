/**
 * Sports Article Section Component
 * Displays sports articles in a grid layout
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { NewsItem } from '../model/types';
import dayjs from 'dayjs';

interface SportsArticleSectionProps {
  articles: NewsItem[];
  title?: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
}

const SportsArticleSection: React.FC<SportsArticleSectionProps> = ({
  articles,
  title = 'Sports Article',
  showViewMore = true,
  onViewMore,
}) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  const handleClick = (articleId: number) => {
    router.push(`/dashboard/news/${articleId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {articles.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Paper
              elevation={1}
              sx={{
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                },
                transition: 'box-shadow 0.2s',
              }}
              onClick={() => handleClick(article.id)}
            >
              {/* Image with Sport Tag */}
              <Box sx={{ position: 'relative', width: '100%', height: 192, bgcolor: 'grey.100' }}>
                <Box
                  component="img"
                  src={article.imageUrl || ''}
                  alt={article.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {article.sport && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Chip
                      label={article.sport}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        color: 'grey.900',
                        fontWeight: 'semibold',
                        textTransform: 'uppercase',
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {formatDate(article.publishedAt)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.title}
                </Typography>
                {article.author && (
                  <Typography variant="body2" color="text.secondary">
                    This article was written by {article.author}
                    {article.summary && ` ${article.summary.substring(0, 100)}...`}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {showViewMore && articles.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={onViewMore}
            sx={{
              px: 3,
              py: 1.5,
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark',
              },
              fontWeight: 'semibold',
            }}
          >
            View More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SportsArticleSection;
