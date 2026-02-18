/**
 * Search Dropdown Component
 * Renders inline below the search bar on all screen sizes.
 * Shows: tabs → loading | error | no results | results list
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
import { cn } from '@/shared/lib/utils';
import { getSafeImageUrl } from '@/shared/utils/imageUtils';
import { useSearchQuery } from '../api/hooks';
import type { SearchType, SearchResult } from '../model/types';

interface SearchDropdownProps {
  query: string;
  onClose: () => void;
  onResultClick?: (result: SearchResult) => void;
}

const TAB_LABELS: Record<SearchType, string> = {
  all: 'All',
  teams: 'Teams',
  leagues: 'Leagues',
  players: 'Players',
  matches: 'Matches',
};

const TAB_ICONS: Record<SearchType, React.ReactNode> = {
  all: <SportsSoccer fontSize="small" />,
  teams: <Groups fontSize="small" />,
  leagues: <EmojiEvents fontSize="small" />,
  players: <Person fontSize="small" />,
  matches: <SportsSoccer fontSize="small" />,
};

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

    const handleTabChange = useCallback((_: React.SyntheticEvent, v: SearchType) => {
      setActiveTab(v);
    }, []);

    const handleResultClick = useCallback(
      (result: SearchResult) => {
        // Show detail view in dropdown instead of navigating
        setSelectedResult(result);
      },
      []
    );

    const handleBackToResults = useCallback(() => {
      setSelectedResult(null);
    }, []);

    const handleViewFullDetails = useCallback(() => {
      if (selectedResult) {
        onResultClick?.(selectedResult);
        onClose();
      }
    }, [selectedResult, onResultClick, onClose]);

    // ==================== RENDER HELPERS ====================

    const renderEmptyState = () => (
      <div className="text-center py-12 px-4">
        <Search sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
          Start Searching
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type at least 2 characters to search for players, teams, leagues, or matches
        </Typography>
      </div>
    );

    const renderLoading = () => (
      <div className="flex justify-center py-10">
        <CircularProgress size={32} sx={{ color: 'success.main' }} />
      </div>
    );

    const renderError = () => (
      <div className="text-center py-10 px-4">
        <SentimentVeryDissatisfied sx={{ fontSize: 48, color: 'grey.400', mb: 1.5 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Search Error
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Something went wrong. Please try again.
        </Typography>
      </div>
    );

    const renderNoResults = () => (
      <div className="text-center py-10 px-4">
        <SentimentVeryDissatisfied sx={{ fontSize: 48, color: 'grey.400', mb: 1.5 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          No Results Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We couldn&apos;t find any matches for &quot;{query}&quot;
        </Typography>
      </div>
    );

    const renderResults = () => (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Results
          </Typography>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
            {filteredResults.length} Result{filteredResults.length !== 1 ? 's' : ''}
          </Typography>
        </div>

        <div className="space-y-1">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Avatar
                src={getSafeImageUrl(result.imageUrl)}
                sx={{ width: 32, height: 32, bgcolor: 'grey.200' }}
              >
                {TAB_ICONS[result.type] ?? TAB_ICONS.all}
              </Avatar>

              <div className="flex-1 min-w-0">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {result.title}
                </Typography>
                {result.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {result.subtitle}
                  </Typography>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderDetailView = () => {
      if (!selectedResult) return null;

      const meta = selectedResult.metadata as Record<string, unknown> | undefined;

      return (
        <div className="p-4">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={handleBackToResults}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowBack sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Back to results
              </Typography>
            </button>
          </div>

          {/* Header with Image */}
          <div className="mb-4">
            <div className="flex items-start gap-4">
              <Avatar
                src={getSafeImageUrl(selectedResult.imageUrl)}
                sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}
              >
                {TAB_ICONS[selectedResult.type] ?? TAB_ICONS.all}
              </Avatar>
              <div className="flex-1">
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {selectedResult.title}
                </Typography>
                {selectedResult.subtitle && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedResult.subtitle}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'success.50',
                    border: '1px solid',
                    borderColor: 'success.200',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 600 }}>
                    {selectedResult.type.charAt(0).toUpperCase() + selectedResult.type.slice(1)}
                  </Typography>
                </Box>
              </div>
            </div>
          </div>

          {/* Details based on type */}
          <div className="space-y-3 mb-4">
            {/* Match Details */}
            {selectedResult.type === 'matches' && meta && (
              <>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar src={meta.homeLogo} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {meta.homeTeam}
                      </Typography>
                    </div>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      {meta.homeScore ?? '-'} : {meta.awayScore ?? '-'}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {meta.awayTeam}
                      </Typography>
                      <Avatar src={meta.awayLogo} sx={{ width: 32, height: 32 }} />
                    </div>
                  </div>
                  {meta.league && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <EmojiEvents sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{meta.league}</Typography>
                    </div>
                  )}
                </div>
                {meta.kickoffUtc && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarToday sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {new Date(meta.kickoffUtc).toLocaleString()}
                    </Typography>
                  </div>
                )}
                {meta.status && (
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Status:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meta.status}
                    </Typography>
                  </div>
                )}
              </>
            )}

            {/* Team Details */}
            {selectedResult.type === 'teams' && meta && (
              <>
                {meta.providerTeamId && (
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Team ID:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meta.providerTeamId}
                    </Typography>
                  </div>
                )}
              </>
            )}

            {/* Player Details */}
            {selectedResult.type === 'players' && meta && (
              <>
                {meta.position && (
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Position:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meta.position}
                    </Typography>
                  </div>
                )}
                {meta.team && (
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Team:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meta.team}
                    </Typography>
                  </div>
                )}
              </>
            )}

            {/* League Details */}
            {selectedResult.type === 'leagues' && meta && (
              <>
                {meta.country && (
                  <div className="flex items-center gap-2">
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {meta.country}
                    </Typography>
                  </div>
                )}
              </>
            )}
          </div>

          {/* View Full Details Button */}
          <button
            onClick={handleViewFullDetails}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              View Full Details
            </Typography>
            <OpenInNew sx={{ fontSize: 18 }} />
          </button>
        </div>
      );
    };

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
      <div
        ref={ref}
        className="absolute left-0 right-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer frame */}
        <div
          className={cn(
            'bg-gray-100 rounded-lg border border-green-500/30 p-2 w-full shadow-lg'
          )}
        >
          {/* White inner card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
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
            </div>

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
          </div>
        </div>
      </div>
    );
  }
);

SearchDropdown.displayName = 'SearchDropdown';

export default SearchDropdown;
