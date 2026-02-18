/**
 * Content Tabs Component
 * Toggle between Predictions and Live Matches
 */

'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Button } from '@/shared/components/ui';

export type ContentTabType = 'predictions' | 'live-matches';

interface ContentTabsProps {
  activeTab: ContentTabType;
  onTabChange: (tab: ContentTabType) => void;
  className?: string;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, onTabChange, className }) => {
  return (
    <Box sx={{ width: '100%' }} className={className}>
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'neutral.300',
          // borderRadius: 2,
          p: 0.5,
          display: 'flex',
          gap: 0.5,
        }}
      >
        <Button
          onClick={() => onTabChange('predictions')}
          variant="ghost"
          size="sm"
          sx={{
            flex: 1,
            // borderRadius: 1.5,
            fontWeight: 600,
            ...(activeTab === 'predictions'
              ? {
                  bgcolor: 'green.50',
                  color: 'green.700',
                  border: '1px solid',
                  borderColor: 'green.500',
                }
              : {
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  border: '1px solid transparent',
                  '&:hover': { bgcolor: 'neutral.50' },
                }),
          }}
        >
          Predictions
        </Button>
        <Button
          onClick={() => onTabChange('live-matches')}
          variant="ghost"
          size="sm"
          sx={{
            flex: 1,
            // borderRadius: 1.5,
            fontWeight: 600,
            ...(activeTab === 'live-matches'
              ? {
                  bgcolor: 'green.50',
                  color: 'green.700',
                  border: '1px solid',
                  borderColor: 'green.500',
                }
              : {
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  border: '1px solid transparent',
                  '&:hover': { bgcolor: 'neutral.50' },
                }),
          }}
        >
          Live Matches
        </Button>
      </Box>
    </Box>
  );
};

export default ContentTabs;
