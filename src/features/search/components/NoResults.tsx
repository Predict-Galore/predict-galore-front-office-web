/**
 * No Results Component
 * Empty state matching Figma UI
 */

'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface NoResultsProps {
  query?: string;
  className?: string;
}

const NoResults: React.FC<NoResultsProps> = ({ query, className }) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      {/* Sad Emoji */}
      <Box sx={{ fontSize: '4rem', mb: 2 }}>😔</Box>

      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
        No Results Found
      </Typography>

      {/* Description */}
      <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 400 }}>
        We couldn&apos;t find any matches to your search
        {query && <Typography component="span" sx={{ fontWeight: 500 }}> &quot;{query}&quot;</Typography>}
      </Typography>
    </Box>
  );
};

export default NoResults;
