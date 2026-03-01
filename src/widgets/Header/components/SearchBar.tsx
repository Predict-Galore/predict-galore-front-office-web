'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import {
  Search,
  Close,
  SentimentVeryDissatisfied,
  Person,
  Groups,
  EmojiEvents,
  SportsSoccer,
  ArrowBack,
  OpenInNew,
  CalendarToday,
  LocationOn,
} from '@mui/icons-material';
import {
  Box,
  InputBase,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Typography,
  Avatar,
  CircularProgress,
  Stack,
  Button,
  Chip,
} from '@mui/material';
import { getSafeImageUrl } from '@/shared/utils/imageUtils';
import { useSearchQuery } from '@/features/search/api/hooks';
import { useAllTeams, useFollowTeam, useUnfollowTeam } from '@/features/profile/api/hooks';

type SearchType = 'all' | 'teams' | 'leagues' | 'players' | 'matches';

export interface SearchResult {
  id: string | number;
  type: SearchType;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
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

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  variant?: 'default' | 'header';
  className?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  onSearch,
  onResultClick,
  placeholder = 'Search for a player, team, club, league',
  variant = 'default',
  className,
}, ref) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchType>('all');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasQuery = query.trim().length >= 2;

  const { data: searchData, isLoading, error: searchError } = useSearchQuery(query, {
    enabled: hasQuery,
    limit: 5,
  });
  const { data: allTeams = [] } = useAllTeams();
  const followTeamMutation = useFollowTeam();
  const unfollowTeamMutation = useUnfollowTeam();
  const [pendingTeamId, setPendingTeamId] = useState<number | null>(null);

  const filteredResults = useMemo(() => {
    const all = (searchData?.results ?? []) as SearchResult[];
    if (activeTab === 'all') return all;
    return all.filter((item) => item.type === activeTab);
  }, [activeTab, searchData?.results]);

  const followedTeamMap = useMemo(() => {
    return allTeams.reduce<Record<string, boolean>>((acc, team) => {
      const idKey = String(team.id ?? '').trim();
      const nameKey = String(team.name ?? '').trim().toLowerCase();

      if (idKey) acc[idKey] = Boolean(team.isFollowing);
      if (nameKey) acc[nameKey] = Boolean(team.isFollowing);

      return acc;
    }, {});
  }, [allTeams]);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setIsOpen(true);
      setSelectedResult(null);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
    onSearch?.('');
  }, [onSearch]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleTabChange = useCallback((_: React.SyntheticEvent, value: SearchType) => {
    setActiveTab(value);
  }, []);

  const handleShowDetail = useCallback((result: SearchResult) => {
    setSelectedResult(result);
  }, []);

  const getTeamIdFromResult = useCallback((result: SearchResult): number | null => {
    if (result.type !== 'teams') return null;

    const metadata = result.metadata ?? {};
    const metaTeamId = metadata.providerTeamId;

    if (typeof metaTeamId === 'number' && Number.isFinite(metaTeamId)) {
      return metaTeamId;
    }

    if (typeof metaTeamId === 'string' && metaTeamId.trim() !== '') {
      const parsedTeamId = Number(metaTeamId);
      if (Number.isFinite(parsedTeamId)) return parsedTeamId;
    }

    if (typeof result.id === 'number' && Number.isFinite(result.id)) {
      return result.id;
    }

    if (typeof result.id === 'string' && result.id.trim() !== '') {
      const parsedResultId = Number(result.id);
      if (Number.isFinite(parsedResultId)) return parsedResultId;
    }

    return null;
  }, []);

  const isTeamFollowed = useCallback((result: SearchResult): boolean => {
    if (result.type !== 'teams') return false;

    const teamId = getTeamIdFromResult(result);
    if (teamId !== null) {
      const byIdStatus = followedTeamMap[String(teamId)];
      if (typeof byIdStatus === 'boolean') return byIdStatus;
    }

    const byNameStatus = followedTeamMap[result.title.trim().toLowerCase()];
    return Boolean(byNameStatus);
  }, [followedTeamMap, getTeamIdFromResult]);

  const handleTeamFollowToggle = useCallback(
    async (event: React.MouseEvent, result: SearchResult) => {
      event.stopPropagation();
      if (result.type !== 'teams') return;

      const teamId = getTeamIdFromResult(result);
      if (teamId === null) return;

      try {
        setPendingTeamId(teamId);
        if (isTeamFollowed(result)) {
          await unfollowTeamMutation.mutateAsync(teamId);
        } else {
          await followTeamMutation.mutateAsync({
            teamId,
            notificationsEnabled: true,
          });
        }
      } finally {
        setPendingTeamId((current) => (current === teamId ? null : current));
      }
    },
    [followTeamMutation, getTeamIdFromResult, isTeamFollowed, unfollowTeamMutation]
  );

  const handleBackToResults = useCallback(() => {
    setSelectedResult(null);
  }, []);

  const handleViewFullDetails = useCallback(() => {
    if (!selectedResult) return;
    onResultClick?.(selectedResult);
    setIsOpen(false);
  }, [onResultClick, selectedResult]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedResult(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSelectedResult(null);
        inputRef.current?.blur();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

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

  const renderLoading = () => (
    <Stack alignItems="center" sx={{ py: 5 }}>
      <CircularProgress size={32} sx={{ color: 'success.main' }} />
    </Stack>
  );

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
            onClick={() => handleShowDetail(result)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              <Avatar src={getSafeImageUrl(result.imageUrl)} sx={{ width: 32, height: 32, bgcolor: 'grey.200' }}>
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
            </Stack>

            {result.type === 'teams' && (() => {
              const teamId = getTeamIdFromResult(result);
              const followed = isTeamFollowed(result);
              const isPending = teamId !== null && pendingTeamId === teamId;

              return (
                <Button
                  size="small"
                  variant={followed ? 'outlined' : 'contained'}
                  disabled={teamId === null || isPending}
                  onClick={(event) => { void handleTeamFollowToggle(event, result); }}
                  sx={{
                    minWidth: 86,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    ...(followed
                      ? {
                          borderColor: 'grey.300',
                          color: 'text.primary',
                          '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.100' },
                        }
                      : {
                          bgcolor: 'success.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'success.dark' },
                        }),
                  }}
                >
                  {isPending ? '...' : followed ? 'Unfollow' : 'Follow'}
                </Button>
              );
            })()}
          </Box>
        ))}
      </Stack>
    </Box>
  );

  const renderDetail = () => {
    if (!selectedResult) return null;
    const meta = selectedResult.metadata ?? {};
    const homeLogo = typeof meta.homeLogo === 'string' ? meta.homeLogo : '';
    const awayLogo = typeof meta.awayLogo === 'string' ? meta.awayLogo : '';
    const homeTeam = typeof meta.homeTeam === 'string' ? meta.homeTeam : '';
    const awayTeam = typeof meta.awayTeam === 'string' ? meta.awayTeam : '';
    const homeScore = meta.homeScore ?? '-';
    const awayScore = meta.awayScore ?? '-';
    const league = typeof meta.league === 'string' ? meta.league : '';
    const kickoffUtc = typeof meta.kickoffUtc === 'string' ? meta.kickoffUtc : '';
    const status = typeof meta.status === 'string' ? meta.status : '';
    const providerTeamId = typeof meta.providerTeamId === 'string' || typeof meta.providerTeamId === 'number'
      ? String(meta.providerTeamId)
      : '';
    const position = typeof meta.position === 'string' ? meta.position : '';
    const team = typeof meta.team === 'string' ? meta.team : '';
    const country = typeof meta.country === 'string' ? meta.country : '';

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={handleBackToResults}
            size="small"
            sx={{ color: 'grey.600', '&:hover': { color: 'grey.900', bgcolor: 'grey.100' } }}
          >
            <ArrowBack sx={{ fontSize: 20, mr: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Back to results
            </Typography>
          </IconButton>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Avatar src={getSafeImageUrl(selectedResult.imageUrl)} sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}>
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

        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {selectedResult.type === 'matches' && (
            <>
              <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={homeLogo} sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {homeTeam}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {String(homeScore)} : {String(awayScore)}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {awayTeam}
                    </Typography>
                    <Avatar src={awayLogo} sx={{ width: 32, height: 32 }} />
                  </Stack>
                </Stack>
                {league && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'grey.600' }}>
                    <EmojiEvents sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{league}</Typography>
                  </Stack>
                )}
              </Box>
              {kickoffUtc && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'grey.600' }}>
                  <CalendarToday sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{new Date(kickoffUtc).toLocaleString()}</Typography>
                </Stack>
              )}
              {status && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Status:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{status}</Typography>
                </Stack>
              )}
            </>
          )}

          {selectedResult.type === 'teams' && providerTeamId && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Team ID:
              </Typography>
              <Typography variant="body2" color="text.secondary">{providerTeamId}</Typography>
            </Stack>
          )}

          {selectedResult.type === 'players' && (
            <>
              {position && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Position:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{position}</Typography>
                </Stack>
              )}
              {team && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Team:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{team}</Typography>
                </Stack>
              )}
            </>
          )}

          {selectedResult.type === 'leagues' && country && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'grey.600' }}>
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography variant="body2">{country}</Typography>
            </Stack>
          )}
        </Stack>

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

  const renderDropdownContent = () => {
    if (selectedResult) return renderDetail();
    if (!hasQuery) return renderEmptyState();
    if (isLoading) return renderLoading();
    if (searchError) return renderError();
    if (filteredResults.length === 0) return renderNoResults();
    return renderResults();
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }} className={className}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <InputBase
          inputRef={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Search sx={{ color: 'grey.400', fontSize: 20 }} />
            </InputAdornment>
          }
          endAdornment={
            query && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  aria-label="Clear search"
                  sx={{
                    '&:hover': { bgcolor: 'grey.200' },
                  }}
                >
                  <Close sx={{ fontSize: 16, color: 'grey.400' }} />
                </IconButton>
              </InputAdornment>
            )
          }
          sx={{
            width: '100%',
            px: 1.5,
            py: 1.25,
            borderRadius: variant === 'default' ? 2 : '9999px',
            bgcolor: variant === 'default' ? 'white' : 'grey.100',
            border: '1px solid',
            borderColor: variant === 'default' ? 'grey.300' : 'grey.100',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: variant === 'default' ? 'grey.400' : 'grey.200',
            },
            '&.Mui-focused': {
              borderColor: variant === 'default' ? 'success.main' : 'grey.200',
              boxShadow: variant === 'default'
                ? '0 0 0 3px rgba(34, 197, 94, 0.1)'
                : '0 0 0 3px rgba(0, 0, 0, 0.05)',
            },
            '& input': {
              color: 'grey.900',
              '&::placeholder': {
                color: 'grey.400',
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {isOpen && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '100%',
            mt: 1,
            zIndex: 50,
            width: 620,
            maxWidth: '90vw',
            animation: 'fadeIn 0.2s ease-in-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateX(-50%) translateY(-8px)' },
              to: { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
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
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'grey.200',
                overflow: 'hidden',
              }}
            >
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
                  {(Object.keys(TAB_LABELS) as SearchType[]).map((tabKey) => (
                    <Tab key={tabKey} value={tabKey} label={TAB_LABELS[tabKey]} />
                  ))}
                </Tabs>
              </Box>

              <Box
                sx={{
                  maxHeight: { xs: '60vh', md: 400 },
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {renderDropdownContent()}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
