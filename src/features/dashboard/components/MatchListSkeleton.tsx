'use client';

import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Divider,
} from '@mui/material';

interface MatchListSkeletonProps {
  sections?: number;
  rowsPerSection?: number;
  className?: string;
}

const MatchListSkeleton: React.FC<MatchListSkeletonProps> = ({
  sections = 2,
  rowsPerSection = 5,
  className,
}) => {
  return (
    <Stack spacing={2} sx={{ ...className }} aria-label="Loading matches">
      {Array.from({ length: sections }).map((_, sIdx) => (
        <Paper
          key={sIdx}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            overflow: 'hidden',
          }}
        >
          {/* Section header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={160} height={16} />
            </Box>
            <Skeleton variant="circular" width={24} height={24} />
          </Box>

          {/* Rows */}
          <Box>
            {Array.from({ length: rowsPerSection }).map((__, rIdx) => (
              <Box key={rIdx} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Box sx={{ flex: 1, ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Skeleton variant="circular" width={28} height={28} />
                      <Skeleton variant="text" width={96} height={12} />
                    </Box>
                    <Skeleton variant="text" width={64} height={16} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, justifyContent: 'flex-end' }}>
                      <Skeleton variant="text" width={96} height={12} />
                      <Skeleton variant="circular" width={28} height={28} />
                    </Box>
                  </Box>
                </Box>
                {rIdx < rowsPerSection - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default MatchListSkeleton;
