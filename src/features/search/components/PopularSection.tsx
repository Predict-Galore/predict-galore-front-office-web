/**
 * Popular Section Component
 * Shows trending/popular items matching Figma UI
 */

'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Box, Typography } from '@mui/material';
import { usePopularItemsQuery } from '../api/hooks';

interface PopularSectionProps {
  country?: string;
  className?: string;
}

const PopularSection: React.FC<PopularSectionProps> = ({ country = 'Nigeria', className }) => {
  const { data: popularItems = [], isLoading } = usePopularItemsQuery(country);

  if (isLoading || popularItems.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, ...className }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
        Popular in {country}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {popularItems.map((item) => (
          <Box
            key={item.id}
            component="button"
            type="button"
            sx={{
              px: 2,
              py: 1,
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 500,
              bgcolor: 'white',
              color: 'text.secondary',
              border: '2px solid',
              borderColor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'grey.400',
              },
            }}
          >
            <span>{item.name}</span>
            <TrendingUp style={{ width: 16, height: 16, color: '#9ca3af' }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PopularSection;
