/**
 * Content Tabs Component
 * Toggle between Predictions and Live Matches
 */

'use client';

import React from 'react';
import { Button, Box } from '@mui/material';
import { cn } from '@/shared/lib/utils';
import { textColors } from '@/shared/constants/color-tokens';

export type ContentTabType = 'predictions' | 'live-matches';

interface ContentTabsProps {
  activeTab: ContentTabType;
  onTabChange: (tab: ContentTabType) => void;
  className?: string;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, onTabChange, className }) => {
  return (
    <Box sx={{ width: '100%', ...className }}>
      <Box sx={{ width: '100%', bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', borderRadius: 2, p: 0.5, display: 'flex' }}>
        <Button
          onClick={() => onTabChange('predictions')}
          className={cn(
            'flex-1 px-6 py-2 rounded-md font-semibold text-sm transition-colors normal-case',
            activeTab === 'predictions'
              ? 'bg-green-50 text-green-700 border border-green-500 shadow-sm'
              : cn('bg-transparent', textColors.tertiary, 'hover:bg-gray-50')
          )}
        >
          Predictions
        </Button>
        <Button
          onClick={() => onTabChange('live-matches')}
          className={cn(
            'flex-1 px-6 py-2 rounded-md font-semibold text-sm transition-colors normal-case',
            activeTab === 'live-matches'
              ? 'bg-green-50 text-green-700 border border-green-500 shadow-sm'
              : cn('bg-transparent', textColors.tertiary, 'hover:bg-gray-50')
          )}
        >
          Live Matches
        </Button>
      </Box>
    </Box>
  );
};

export default ContentTabs;
