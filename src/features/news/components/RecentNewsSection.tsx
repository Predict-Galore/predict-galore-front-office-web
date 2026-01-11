/**
 * Recent News Section Component
 * Displays recent news in a grid layout
 */

'use client';

import React from 'react';
import SafeImage from '@/shared/components/shared/SafeImage';
import { useRouter } from 'next/navigation';
import { NewsItem } from '../model/types';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface RecentNewsSectionProps {
  news: NewsItem[];
  title?: string;
}

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ news, title = 'Recent News' }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  const handleClick = (articleId: number) => {
    router.push(`/dashboard/news/${articleId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
        {news.slice(0, 4).map((item) => (
          <Box
            key={item.id}
            sx={{
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 3,
              },
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
            onClick={() => handleClick(item.id)}
          >
            <Box sx={{ position: 'relative', width: '100%', height: 192, bgcolor: 'grey.100' }}>
              <SafeImage
                src={item.imageUrl || ''}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {formatDate(item.publishedAt)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}>
                {item.title}
              </Typography>
              {item.summary && (
                <Typography variant="body2" sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.summary}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecentNewsSection;
