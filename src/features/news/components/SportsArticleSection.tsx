/**
 * Sports Article Section Component
 * Displays sports articles in a grid layout with expandable cards
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Link,
} from '@mui/material';
import { NewsItem } from '../model/types';
import { getSafeNewsImageUrl } from '@/shared/utils/imageUtils';
import dayjs from 'dayjs';

interface SportsArticleSectionProps {
  articles: NewsItem[];
  title?: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
}

const SportsArticleSection: React.FC<SportsArticleSectionProps> = ({
  articles,
  title = 'Sports Articles',
  showViewMore = false,
  onViewMore,
}) => {
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
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
        alignItems: 'start'
      }}
    >
      {articles.map((article, index) => {
        const expanded = isExpanded(article.id);
        
        // Calculate grid column span based on position and expansion
        let gridColumn = 'span 1';
        if (expanded) {
          // Desktop: expanded card takes remaining space in row
          const positionInRow = index % 4;
          if (positionInRow === 0) gridColumn = { xs: 'span 1', md: 'span 4' }; // First in row: full row
          else if (positionInRow === 1) gridColumn = { xs: 'span 1', md: 'span 3' }; // Second in row: 3 columns
          else if (positionInRow === 2) gridColumn = { xs: 'span 1', md: 'span 2' }; // Third in row: 2 columns
          else gridColumn = { xs: 'span 1', md: 'span 4' }; // Fourth in row: full next row
        }

        return (
          <Box
            key={article.id}
            sx={{
              gridColumn,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              height: expanded ? 'auto' : { xs: 'auto', md: '480px' }, // Fixed height for consistency
              '&:hover': {
                boxShadow: expanded ? 1 : 3,
              },
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
              {article.imageUrl ? (
                <Box
                  component="img"
                  src={getSafeNewsImageUrl(article.imageUrl)}
                  alt={article.title}
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
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {formatDate(article.publishedAt)}
                </Typography>
                {article.category && (
                  <Typography variant="caption" sx={{ 
                    bgcolor: 'success.main', 
                    color: 'white', 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}>
                    {article.category}
                  </Typography>
                )}
              </Box>

              <Typography 
                variant={expanded ? 'h5' : 'h6'} 
                sx={{ 
                  fontWeight: 'semibold', 
                  mb: 1, 
                  display: expanded ? 'block' : '-webkit-box', 
                  WebkitLineClamp: expanded ? 'unset' : 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden',
                  transition: 'font-size 0.3s ease-in-out',
                  fontSize: expanded ? '1.5rem' : '1rem',
                  lineHeight: 1.3,
                  minHeight: expanded ? 'auto' : '2.6rem' // Consistent title height
                }}
              >
                {article.title}
              </Typography>

              {article.summary && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
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
                  {article.summary}
                </Typography>
              )}

              {expanded && article.content && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.primary', 
                    mb: 2,
                    lineHeight: 1.7,
                    fontSize: '1rem'
                  }}
                >
                  {article.content}
                </Typography>
              )}

              {expanded && article.tags && article.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {article.tags.map((tag, idx) => (
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
                {(article.author || article.source) && (
                  <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontSize: '0.75rem' }}>
                    {article.author && <span>By {article.author}</span>}
                    {article.author && article.source && <span>•</span>}
                    {article.source && <span>{article.source}</span>}
                  </Typography>
                )}

                {/* Read More / Read Less Link */}
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => handleToggleExpand(e, article.id)}
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

export default SportsArticleSection;
