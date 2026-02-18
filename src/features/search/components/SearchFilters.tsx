/**
 * Search Filters Component
 * Filter buttons matching Figma UI
 */

'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useSearchStore } from '../model/store';
import type { SearchType } from '../model/types';

const FILTERS: { label: string; value: SearchType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Teams', value: 'teams' },
  { label: 'Leagues', value: 'leagues' },
  { label: 'Players', value: 'players' },
  { label: 'Matches', value: 'matches' },
];

interface SearchFiltersProps {
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ className }) => {
  const { searchType, setSearchType } = useSearchStore();

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 1,
      }}
    >
      {FILTERS.map((filter) => {
        const isActive = searchType === filter.value;

        return (
          <Box
            key={filter.value}
            component="button"
            type="button"
            onClick={() => setSearchType(filter.value)}
            sx={{
              px: 2,
              py: 1,
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              border: '2px solid',
              ...(isActive
                ? {
                    bgcolor: 'success.main',
                    color: 'white',
                    borderColor: 'success.main',
                  }
                : {
                    bgcolor: 'white',
                    color: 'text.secondary',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'grey.400',
                    },
                  }),
            }}
          >
            {filter.label}
          </Box>
        );
      })}
    </Box>
  );
};

export default SearchFilters;
