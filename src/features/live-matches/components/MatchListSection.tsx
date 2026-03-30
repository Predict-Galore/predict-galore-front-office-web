/**
 * Match List Section Component
 * Displays matches grouped by competition with collapsible sections
 *
 * This component shows:
 * - Competition header with logo and name
 * - List of matches with team logos, names, and scores
 * - Match status badges (FT, HT, ET, Live, Vs)
 * - Collapsible/expandable competition sections
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Chip,
  Stack,
  Collapse,
  Divider,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown, SportsSoccer } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Match, CompetitionGroup } from '../model/types';

// ==================== TYPES ====================

interface MatchListSectionProps {
  competition: CompetitionGroup;
  onSelectMatch?: (match: Match) => void;
}

// ==================== CONSTANTS ====================

/**
 * Competition logo mapping
 * Maps competition names to their logo paths
 */
const COMPETITION_LOGOS: Record<string, string> = {
  'Premier League': '/leagues/premier-league.svg',
  'La Liga': '/leagues/la-liga.svg',
  'Serie A': '/leagues/serie-a.svg',
  Bundesliga: '/leagues/bundesliga.svg',
  'UEFA Champions League': '/leagues/champions-league.svg',
  'Italian Serie A': '/leagues/serie-a.svg',
};

/**
 * Status badge configuration
 * Defines styling for different match statuses
 */
const STATUS_CONFIG: Record<string, { label: string; bgcolor: string; color: string }> = {
  FT: { label: 'FT', bgcolor: 'success.50', color: 'success.dark' },
  HT: { label: 'HT', bgcolor: 'grey.100', color: 'grey.700' },
  ET: { label: 'ET', bgcolor: 'error.50', color: 'error.dark' },
  Live: { label: 'Live', bgcolor: 'error.50', color: 'error.dark' },
  Prediction: { label: 'Vs', bgcolor: 'transparent', color: 'text.primary' },
};

// ==================== HELPER COMPONENTS ====================

/**
 * Competition Logo Component
 * Displays competition logo or fallback initials
 */
interface CompetitionLogoProps {
  name: string;
  logoUrl?: string;
}

const CompetitionLogo: React.FC<CompetitionLogoProps> = ({ name, logoUrl }) => {
  if (logoUrl) {
    return <Avatar src={logoUrl} alt={name} sx={{ width: 32, height: 32 }} />;
  }

  // Fallback: Show initials
  const initials = name.substring(0, 2).toUpperCase();
  return (
    <Avatar
      sx={{
        width: 32,
        height: 32,
        bgcolor: 'grey.100',
        color: 'grey.700',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}
    >
      {initials}
    </Avatar>
  );
};

/**
 * Match Status Badge Component
 * Displays match status with appropriate styling
 */
interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Prediction;

  return (
    <Chip
      label={config.label}
      sx={{
        height: 32,
        minWidth: 44,
        bgcolor: config.bgcolor,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.8125rem',
        borderRadius: 2,
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
};

/**
 * Empty State Component
 * Shown when no matches are available
 */
const EmptyState: React.FC = () => (
  <Box sx={{ py: 6, textAlign: 'center' }}>
    <SportsSoccer sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
    <Typography variant="body2" color="text.secondary">
      No matches in this competition
    </Typography>
  </Box>
);

// ==================== MAIN COMPONENT ====================

const MatchListSection: React.FC<MatchListSectionProps> = ({ competition, onSelectMatch }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  // ==================== COMPUTED VALUES ====================

  /**
   * Get competition logo URL
   */
  const competitionLogo = useMemo(() => COMPETITION_LOGOS[competition.name], [competition.name]);

  /**
   * Check if match should show score
   */
  const shouldShowScore = useCallback((match: Match): boolean => {
    const scoreStatuses = ['FT', 'HT', 'ET', 'Live'];
    return Boolean(match.result && scoreStatuses.includes(match.status));
  }, []);

  // ==================== EVENT HANDLERS ====================

  /**
   * Handle match click
   * Either calls onSelectMatch callback or navigates to match detail page
   */
  const handleMatchClick = useCallback(
    (match: Match) => {
      if (onSelectMatch) {
        onSelectMatch(match);
      } else {
        router.push(`/dashboard/live-matches/${match.id}`);
      }
    },
    [onSelectMatch, router]
  );

  /**
   * Toggle competition section expansion
   */
  const toggleExpansion = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // ==================== RENDER ====================

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        overflow: 'hidden',
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'grey.200',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      {/* Competition Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'grey.50',
          },
          transition: 'background-color 0.2s',
        }}
        onClick={toggleExpansion}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CompetitionLogo name={competition.name} logoUrl={competitionLogo} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'grey.900',
            }}
          >
            {competition.name}
          </Typography>
        </Stack>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpansion();
          }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          sx={{
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
        >
          {isExpanded ? (
            <KeyboardArrowUp sx={{ fontSize: 24, color: 'grey.600' }} />
          ) : (
            <KeyboardArrowDown sx={{ fontSize: 24, color: 'grey.600' }} />
          )}
        </IconButton>
      </Box>

      {/* Matches List */}
      <Collapse in={isExpanded} timeout="auto">
        {competition.matches.length === 0 ? (
          <EmptyState />
        ) : (
          <Box>
            {competition.matches.map((match, index) => {
              const showScore = shouldShowScore(match);

              return (
                <React.Fragment key={match.id}>
                  {index > 0 && <Divider />}

                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'grey.50',
                      },
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleMatchClick(match)}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr auto 1fr',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {/* Status Badge */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <StatusBadge status={match.status} />
                      </Box>

                      {/* Home Team */}
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: '0.875rem',
                            textAlign: 'right',
                          }}
                        >
                          {match.homeTeam.shortName || match.homeTeam.name}
                        </Typography>
                        <Avatar
                          src={match.homeTeam.logoUrl}
                          alt={match.homeTeam.name}
                          sx={{ width: 32, height: 32 }}
                        />
                      </Stack>

                      {/* Score or Vs */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 60,
                        }}
                      >
                        {showScore ? (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: '1.25rem',
                              color: 'grey.900',
                            }}
                          >
                            {match.result}
                          </Typography>
                        ) : (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: '1rem',
                              color: 'grey.900',
                            }}
                          >
                            Vs
                          </Typography>
                        )}
                      </Box>

                      {/* Away Team */}
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          src={match.awayTeam.logoUrl}
                          alt={match.awayTeam.name}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: '0.875rem',
                          }}
                        >
                          {match.awayTeam.shortName || match.awayTeam.name}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}
          </Box>
        )}
      </Collapse>
    </Paper>
  );
};

export default MatchListSection;
