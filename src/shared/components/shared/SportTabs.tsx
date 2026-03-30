/**
 * Sport Tabs Component
 * Shared component for sport selection across the application
 *
 * @component
 * @description Displays a horizontal list of sport tabs for filtering content by sport.
 * Supports keyboard navigation and accessibility features.
 */

'use client';

import React from 'react';
import { Box, Button, Skeleton, Typography, Stack } from '@mui/material';
import { Sport } from '@/features/predictions/model/types';

/**
 * Props for the SportTabs component
 */
interface SportTabsProps {
  /** Array of available sports */
  sports: Sport[] | undefined | null;
  /** Currently selected sport */
  selectedSport: Sport | null;
  /** Callback when a sport is selected */
  onSelectSport: (sport: Sport) => void;
  /** Whether sports data is loading */
  isLoading?: boolean;
}

/**
 * SportTabs Component
 *
 * Displays a horizontal scrollable list of sport tabs.
 * The selected sport is highlighted with an underline indicator.
 *
 * @example
 * ```tsx
 * <SportTabs
 *   sports={availableSports}
 *   selectedSport={currentSport}
 *   onSelectSport={(sport) => setCurrentSport(sport)}
 *   isLoading={isLoadingSports}
 * />
 * ```
 */
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

  // Loading state
  if (isLoading) {
    return (
      <Stack
        direction="row"
        spacing={3}
        sx={{
          overflowX: 'auto',
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
        ))}
      </Stack>
    );
  }

  // Empty state
  if (!safeSports || safeSports.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No sports available
        </Typography>
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
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
      role="tablist"
      aria-label="Sport selection tabs"
    >
      {safeSports.map((sport) => (
        <Button
          key={sport.id}
          onClick={() => onSelectSport(sport)}
          aria-label={`Select ${sport.name} sport`}
          role="tab"
          aria-selected={selectedSport?.id === sport.id}
          sx={{
            position: 'relative',
            pb: 1.5,
            px: 0,
            minWidth: 'auto',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 500,
            whiteSpace: 'nowrap',
            textTransform: 'none',
            color: selectedSport?.id === sport.id ? 'error.main' : 'text.secondary',
            transition: 'color 0.2s',
            flexShrink: 0,
            '&:hover': {
              bgcolor: 'transparent',
              color: selectedSport?.id === sport.id ? 'error.main' : 'grey.900',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'error.main',
              outlineOffset: 2,
              borderRadius: 1,
            },
            '&::after':
              selectedSport?.id === sport.id
                ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -1,
                    height: 2,
                    bgcolor: 'error.main',
                    borderRadius: '9999px',
                  }
                : {},
          }}
        >
          {sport.name}
        </Button>
      ))}
    </Box>
  );
};

export default React.memo(SportTabs);
