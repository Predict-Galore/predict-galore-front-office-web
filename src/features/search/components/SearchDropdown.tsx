/**
 * Search Dropdown Component
 * Displays search results in a dropdown below the search bar
 * 
 * @component
 * @description Renders search results with tabs for filtering by type.
 * Shows loading, error, empty, and results states.
 * Supports detailed view for individual results.
 */

'use client';

import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import {
  Tabs,
  Tab,
  Typography,
  Avatar,
  CircularProgress,
  Box,
  Stack,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import {
  SentimentVeryDissatisfied,
  Person,
  Groups,
  EmojiEvents,
  SportsSoccer,
  Search,
  ArrowBack,
  OpenInNew,
  CalendarToday,
  LocationOn,
} from '@mui/icons-material';
import { getSafeImageUrl } from '@/shared/utils/imageUtils';
import { useSearchQuery } from '../api/hooks';
import type { SearchType, SearchResult } from '../model/types';

/**
 * Props for the SearchDropdown component
 */
interface SearchDropdownProps {
  /** Current search query */
  query: string;
  /** Callback to close the dropdown */
  onClose: () => void;
  /** Callback when a result is clicked */
  onResultClick?: (result: SearchResult) => void;
}

/** Tab labels for each search type */
const TAB_LABELS: Record<SearchType, string> = {
  all: 'All',
  teams: 'Teams',
  leagues: 'Leagues',
  players: 'Players',
  matches: 'Matches',
};

/** Icons for each search type */
const TAB_ICONS: Record<SearchType, React.ReactNode> = {
  all: <SportsSoccer fontSize="small" />,
  teams: <Groups fontSize="small" />,
  leagues: <EmojiEvents fontSize="small" />,
  players: <Person fontSize="small" />,
  matches: <SportsSoccer fontSize="small" />,
};

/**
 * SearchDropdown Component
 * 
 * Displays search results in a dropdown with tab filtering.
 * Shows different states: empty, loading, error, no results, and results list.
 * Supports detailed view for individual results.
 * 
 * @example
 * ```tsx
 * <SearchDropdown
 *   query="Manchester"
 *   onClose={() => setIsOpen(false)}
 *   onResultClick={(result) => navigate(result.url)}
 * />
 * ```
 */
const SearchDropdown = forwardRef<HTMLDivElement, SearchDropdownProps>(
  ({ query, onClose, onResultClick }, ref) => {
    const [activeTab, setActiveTab] = useState<SearchType>('all');
    const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

    const hasQuery = query.trim().length >= 2; // Require at least 2 characters

    // Call the real search endpoint
    const {
      data: searchData,
      isLoading,
      error: searchError,
    } = useSearchQuery(query, {
      enabled: hasQuery,
      limit: 5,
    });

    // Client-side tab filtering
    const filteredResults = useMemo(() => {
      const all = searchData?.results ?? [];
      if (activeTab === 'all') return all;
      return all.filter((r) => r.type === activeTab);
    }, [searchData?.results, activeTab]);

    /**
     * Handles tab change
     */
    const handleTabChange = useCallback((_: React.SyntheticEvent, v: SearchType) => {
      setActiveTab(v);
    }, []);

    /**
     * Handles result click to show detail view
     */
    const handleResultClick = useCallback(
      (result: SearchResult) => {
        // Show detail view in dropdown instead of navigating
        setSelectedResult(result);
      },
      []
    );

    /**
     * Returns to results list from detail view
     */
    const handleBackToResults = useCallback(() => {
      setSelectedResult(null);
    }, []);

    /**
     * Navigates to full details page
     */
    const handleViewFullDetails = useCallback(() => {
      if (selectedResult) {
        onResultClick?.(selectedResult);
        onClose();
      }
    }, [selectedResult, onResultClick, onClose]);

    // ==================== RENDER HELPERS ====================

    /**
     * Renders empty state when no query is entered
     */
    const renderEmptyState = () => (
      <Stack spacing={2} alignItems="center" sx={{ py: 6, px: 2, textAlign: 'center' }}>
        <Search sx={{ fontSize: 48, color: 'grey.300' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Start Searching
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type at least 2 characters to search for players, teams, leagues, or matches
        </Typography>
      </Stack>
    );

    /**
     * Renders loading state
     */
    const renderLoading = () => (
      <Stack alignItems="center" sx={{ py: 5 }}>
        <CircularProgress size={32} sx={{ color: 'success.main' }} />
      </Stack>
    );

    /**
     * Renders error state
     */
    const renderError = () => (
      <Stack spacing={1.5} alignItems="center" sx={{ py: 5, px: 2, textAlign: 'center' }}>
        <SentimentVeryDissatisfied sx={{ fontSize: 48, color: 'grey.400' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Search Error
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Something went wrong. Please try again.
        </Typography>
      </Stack>
    );

    /**
     * Renders no results state
     */
    const renderNoResults = () => (
      <Stack spacing={1.5} alignItems="center" sx={{ py: 5, px: 2, textAlign: 'center' }}>
        <SentimentVeryDissatisfied sx={{ fontSize: 48, color: 'grey.400' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          No Results Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We couldn&apos;t find any matches for &quot;{query}&quot;
        </Typography>
      </Stack>
    );

    /**
     * Renders results list
     */
    const renderResults = () => (
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Results
          </Typography>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
            {filteredResults.length} Result{filteredResults.length !== 1 ? 's' : ''}
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          {filteredResults.map((result) => (
            <Box
              key={result.id}
              onClick={() => handleResultClick(result)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'grey.50' },
              }}
            >
              <Avatar
                src={getSafeImageUrl(result.imageUrl)}
                sx={{ width: 32, height: 32, bgcolor: 'grey.200' }}
              >
                {TAB_ICONS[result.type] ?? TAB_ICONS.all}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {result.title}
                </Typography>
                {result.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {result.subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    );

    /**
     * Renders detailed view of a selected result
     */
    const renderDetailView = () => {
      if (!selectedResult) return null;

      const meta = selectedResult.metadata as Record<string, unknown> | undefined;

      return (
        <Box sx={{ p: 2 }}>
          {/* Back Button */}
          <Box sx={{ mb: 2 }}>
            <IconButton
              onClick={handleBackToResults}
              size="small"
              sx={{
                color: 'grey.600',
                '&:hover': { color: 'grey.900', bgcolor: 'grey.100' },
              }}
            >
              <ArrowBack sx={{ fontSize: 20, mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Back to results
              </Typography>
            </IconButton>
          </Box>

          {/* Header with Image */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              src={getSafeImageUrl(selectedResult.imageUrl)}
              sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}
            >
              {TAB_ICONS[selectedResult.type] ?? TAB_ICONS.all}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {selectedResult.title}
              </Typography>
              {selectedResult.subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {selectedResult.subtitle}
                </Typography>
              )}
              <Chip
                label={selectedResult.type.charAt(0).toUpperCase() + selectedResult.type.slice(1)}
                size="small"
                sx={{
                  bgcolor: 'success.50',
                  border: '1px solid',
                  borderColor: 'success.200',
                  color: 'success.dark',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Stack>

          {/* Details based on type */}
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            {/* Match Details */}
            {selectedResult.type === 'matches' && meta && (
              <>
                <Box
                  sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={String(meta.homeLogo || '')} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {String(meta.homeTeam || '')}
                      </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      {String(meta.homeScore ?? '-')} : {String(meta.awayScore ?? '-')}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {String(meta.awayTeam || '')}
                      </Typography>
                      <Avatar src={String(meta.awayLogo || '')} sx={{ width: 32, height: 32 }} />
                    </Stack>
                  </Stack>
                  {typeof meta.league === 'string' && meta.league && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'grey.600' }}>
                      <EmojiEvents sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{meta.league}</Typography>
                    </Stack>
                  )}
                </Box>
                {meta.kickoffUtc && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'grey.600' }}>
                    <CalendarToday sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {new Date(String(meta.kickoffUtc)).toLocaleString()}
                    </Typography>
                  </Stack>
                )}
                {meta.status && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Status:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {String(meta.status)}
                    </Typography>
                  </Stack>
                )}
              </>
            )}

            {/* Team Details */}
            {selectedResult.type === 'teams' && meta && (
              <>
                {meta.providerTeamId && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Team ID:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {String(meta.providerTeamId)}
                    </Typography>
                  </Stack>
                )}
              </>
            )}

            {/* Player Details */}
            {selectedResult.type === 'players' && meta && (
              <>
                {meta.position && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Position:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {String(meta.position)}
                    </Typography>
                  </Stack>
                )}
                {meta.team && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Team:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {String(meta.team)}
                    </Typography>
                  </Stack>
                )}
              </>
            )}

            {/* League Details */}
            {selectedResult.type === 'leagues' && meta && (
              <>
                {meta.country && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'grey.600' }}>
                    <LocationOn sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {String(meta.country)}
                    </Typography>
                  </Stack>
                )}
              </>
            )}
          </Stack>

          {/* View Full Details Button */}
          <Button
            onClick={handleViewFullDetails}
            variant="contained"
            fullWidth
            endIcon={<OpenInNew sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              bgcolor: 'success.main',
              color: 'white',
              py: 1.25,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            View Full Details
          </Button>
        </Box>
      );
    };

    /**
     * Renders appropriate content based on current state
     */
    const renderContent = () => {
      // Show detail view if a result is selected
      if (selectedResult) return renderDetailView();
      
      if (!hasQuery) return renderEmptyState();
      if (isLoading) return renderLoading();
      if (searchError) return renderError();
      if (filteredResults.length === 0) return renderNoResults();
      return renderResults();
    };

    // ==================== MAIN RENDER ====================

    return (
      <Box
        ref={ref}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '100%',
          mt: 1,
          zIndex: 50,
          animation: 'fadeIn 0.2s ease-in-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(-8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer frame */}
        <Box
          sx={{
            bgcolor: 'grey.100',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'success.200',
            p: 1,
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
        >
          {/* White inner card */}
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'grey.200',
              overflow: 'hidden',
            }}
          >
            {/* Tabs */}
            <Box sx={{ borderBottom: '1px solid', borderColor: 'grey.200' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 44,
                  '& .MuiTab-root': {
                    minHeight: 44,
                    textTransform: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'text.secondary',
                    '&.Mui-selected': { color: 'success.main', fontWeight: 600 },
                  },
                  '& .MuiTabs-indicator': { bgcolor: 'success.main', height: 3 },
                }}
              >
                {(Object.keys(TAB_LABELS) as SearchType[]).map((t) => (
                  <Tab key={t} value={t} label={TAB_LABELS[t]} />
                ))}
              </Tabs>
            </Box>

            {/* Content */}
            <Box
              sx={{
                maxHeight: { xs: '60vh', md: 400 },
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {renderContent()}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);

SearchDropdown.displayName = 'SearchDropdown';

export default SearchDropdown;
