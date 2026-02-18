/**
 * Sport Tabs Component
 * Shared component for sport selection across the application
 */

'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Sport } from '@/features/predictions/model/types';
import { cn } from '@/shared/lib/utils';
import { textColors } from '@/shared/components';

interface SportTabsProps {
  sports: Sport[] | undefined | null;
  selectedSport: Sport | null;
  onSelectSport: (sport: Sport) => void;
  isLoading?: boolean;
}

const SportTabs: React.FC<SportTabsProps> = ({
  sports,
  selectedSport,
  onSelectSport,
  isLoading = false,
}) => {
  // Safely handle sports data
  const safeSports = React.useMemo(() => {
    if (!sports) return [];
    if (Array.isArray(sports)) return sports;

    // Handle case where sports might be in a different format
    // Sports data validation - handled by error state
    return [];
  }, [sports]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 1, borderBottom: '1px solid', borderColor: 'grey.300' }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ height: 24, width: 80, bgcolor: 'grey.200', borderRadius: 1, animation: 'pulse 2s infinite' }} />
        ))}
      </Box>
    );
  }

  if (!safeSports || safeSports.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
        No sports available
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 3, sm: 5 },
        overflowX: 'auto',
        width: '100%',
        pb: 1,
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        mx: -1,
        px: 1,
      }}
      role="tablist"
      aria-label="Sport selection tabs"
    >
      {safeSports.map((sport) => (
        <button
          key={sport.id}
          onClick={() => onSelectSport(sport)}
          aria-label={`Select ${sport.name} sport`}
          role="tab"
          className={cn(
            'relative pb-3',
            'text-xs sm:text-sm font-medium whitespace-nowrap',
            'transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2',
            'shrink-0',
            selectedSport?.id === sport.id
              ? 'text-red-600'
              : cn(textColors.tertiary, 'hover:text-gray-900')
          )}
        >
          {sport.name}
          {selectedSport?.id === sport.id && (
            <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-red-600 rounded-full" />
          )}
        </button>
      ))}
    </Box>
  );
};

export default React.memo(SportTabs);