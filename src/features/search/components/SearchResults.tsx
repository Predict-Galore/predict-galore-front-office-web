/**
 * Search Results Component
 * Displays search results with filters and popular section
 */

'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSearchStore } from '../model/store';
import { useSearchQuery } from '../api/hooks';
import { getSafeImageUrl } from '@/shared/utils/imageUtils';
import SearchFilters from './SearchFilters';
import PopularSection from './PopularSection';
import NoResults from './NoResults';
import type { SearchResult } from '../model/types';

interface SearchResultsProps {
  className?: string;
  onResultClick?: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ className, onResultClick }) => {
  const { query, setIsLoading } = useSearchStore();

  const { data, isLoading, isError } = useSearchQuery(
    query,
    { enabled: !!query && query.trim().length >= 2, limit: 20 }
  );

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const results = data?.results || [];
  const hasQuery = query && query.trim().length >= 2;

  return (
    <Paper
      elevation={3}
      className={className}
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      {/* Filters */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <SearchFilters />
      </Box>

      {/* Results Section */}
      <Box sx={{ maxHeight: 384, overflowY: 'auto' }}>
        {hasQuery ? (
          <>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={24} sx={{ mb: 2 }} />
                <Typography color="text.secondary">Searching...</Typography>
              </Box>
            ) : isError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">An error occurred while searching</Alert>
              </Box>
            ) : results.length > 0 ? (
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
                    Results
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    {data?.total || 0} Results
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {results.map((result) => (
                    <Button
                      key={result.id}
                      onClick={() => onResultClick?.(result)}
                      sx={{
                        width: '100%',
                        textAlign: 'left',
                        p: 1.5,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'grey.50',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      {getSafeImageUrl(result.imageUrl) && (
                        <Avatar
                          src={getSafeImageUrl(result.imageUrl)}
                          alt={result.title}
                          sx={{ width: 40, height: 40 }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'grey.900' }} noWrap>
                          {result.title}
                        </Typography>
                        {result.subtitle && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {result.subtitle}
                          </Typography>
                        )}
                      </Box>
                    </Button>
                  ))}
                </Stack>
              </Box>
            ) : (
              <NoResults query={query} />
            )}
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <PopularSection />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SearchResults;
