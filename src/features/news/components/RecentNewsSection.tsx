/**
 * Recent News Section Component
 * Displays recent news in a grid layout with expandable cards
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsItem } from '../model/types';
import { Box, Typography, Link } from '@mui/material';
import dayjs from 'dayjs';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';

interface RecentNewsSectionProps {
  news: NewsItem[];
  title?: string;
}

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ news, title = 'Recent News' }) => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  const handleToggleExpand = (e: React.MouseEvent, articleId: number) => {
    e.stopPropagation();
    setExpandedId(expandedId === articleId ? null : articleId);
  };

  const isExpanded = (articleId: number) => expandedId === articleId;

  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          md: 'repeat(4, 1fr)' 
        }, 
        gap: 2,
        alignItems: 'start'
      }}
    >
      {news.slice(0, 4).map((item, index) => {
        const expanded = isExpanded(item.id);
        
        // Calculate grid column span based on position and expansion
        let gridColumn = 'span 1';
        if (expanded) {
          // Desktop: expanded card takes remaining space in row
          if (index === 0) gridColumn = { xs: 'span 1', md: 'span 4' }; // First card: full row
          else if (index === 1) gridColumn = { xs: 'span 1', md: 'span 3' }; // Second card: 3 columns
          else if (index === 2) gridColumn = { xs: 'span 1', md: 'span 2' }; // Third card: 2 columns
          else gridColumn = { xs: 'span 1', md: 'span 4' }; // Fourth card: full next row
        }

        return (
          <Box
            key={item.id}
            sx={{
              gridColumn,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              height: expanded ? 'auto' : { xs: 'auto', md: '480px' }, // Fixed height for consistency
            }}
          >
            {/* Image */}
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: expanded ? { xs: 240, md: 400 } : { xs: 200, md: 220 }, // Consistent image height
              bgcolor: 'grey.100',
              transition: 'height 0.3s ease-in-out',
              flexShrink: 0
            }}>
              {item.imageUrl ? (
                <Box
                  component="img"
                  src={getSafeNewsImageUrl(item.imageUrl)}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.disabled'
                }}>
                  <Typography variant="body2">No Image</Typography>
                </Box>
              )}
            </Box>

            {/* Content */}
            <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {formatDate(item.publishedAt)}
                </Typography>
                {item.category && (
                  <Typography variant="caption" sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}>
                    {item.category}
                  </Typography>
                )}
              </Box>

              <Typography 
                variant={expanded ? 'h5' : 'h6'} 
                sx={{ 
                  fontWeight: 600, 
                  display: expanded ? 'block' : '-webkit-box', 
                  WebkitLineClamp: expanded ? 'unset' : 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden', 
                  mb: 1,
                  transition: 'font-size 0.3s ease-in-out',
                  fontSize: expanded ? '1.5rem' : '1rem',
                  lineHeight: 1.3,
                  minHeight: expanded ? 'auto' : '2.6rem' // Consistent title height
                }}
              >
                {item.title}
              </Typography>

              {item.summary && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    display: expanded ? 'block' : '-webkit-box', 
                    WebkitLineClamp: expanded ? 'unset' : 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden', 
                    mb: 1,
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    minHeight: expanded ? 'auto' : '3.9rem', // Consistent summary height (3 lines)
                    flex: expanded ? 0 : 1
                  }}
                >
                  {item.summary}
                </Typography>
              )}

              {expanded && item.content && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.primary', 
                    mb: 2,
                    lineHeight: 1.7,
                    fontSize: '1rem'
                  }}
                >
                  {item.content}
                </Typography>
              )}

              {expanded && item.tags && item.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {item.tags.map((tag, idx) => (
                    <Typography 
                      key={idx}
                      variant="caption" 
                      sx={{ 
                        bgcolor: 'grey.100', 
                        color: 'text.secondary', 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: 1,
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    >
                      #{tag}
                    </Typography>
                  ))}
                </Box>
              )}

              <Box sx={{ mt: 'auto' }}>
                {(item.author || item.source) && (
                  <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontSize: '0.75rem' }}>
                    {item.author && <span>By {item.author}</span>}
                    {item.author && item.source && <span>•</span>}
                    {item.source && <span>{item.source}</span>}
                  </Typography>
                )}

                {/* Read More / Read Less Link */}
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => handleToggleExpand(e, item.id)}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {expanded ? 'Read less' : 'Read more'}
                </Link>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default RecentNewsSection;
