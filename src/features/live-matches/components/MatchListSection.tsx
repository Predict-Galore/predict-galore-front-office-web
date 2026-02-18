/**
 * Match List Section Component
 * Matches Figma UI design - Shows matches grouped by competition
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Box, Typography, IconButton, Paper, Avatar, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Match, CompetitionGroup } from '../model/types';

interface MatchListSectionProps {
  competition: CompetitionGroup;
  onSelectMatch?: (match: Match) => void;
}

const MatchListSection: React.FC<MatchListSectionProps> = ({ competition, onSelectMatch }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  // Competition logos from local assets
  const competitionLogos = useMemo(
    () => ({
      'Premier League': '/leagues/premier-league.svg',
      'La Liga': '/leagues/la-liga.svg',
      'Serie A': '/leagues/serie-a.svg',
      Bundesliga: '/leagues/bundesliga.svg',
      'UEFA Champions League': '/leagues/champions-league.svg',
      'Italian Serie A': '/leagues/serie-a.svg',
    }),
    []
  );

  const competitionLogo = competitionLogos[competition.name as keyof typeof competitionLogos];

  const handleMatchClick = useCallback(
    (match: Match) => {
      if (onSelectMatch) {
        onSelectMatch(match);
      } else {
        // Navigate to match detail page
        router.push(`/dashboard/live-matches/${match.id}`);
      }
    },
    [onSelectMatch, router]
  );

  // Helper to get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; bgcolor: string; color: string }> = {
      'FT': { label: 'FT', bgcolor: '#dcfce7', color: '#166534' },
      'HT': { label: 'HT', bgcolor: '#f3f4f6', color: '#4b5563' },
      'ET': { label: 'ET', bgcolor: '#fee2e2', color: '#991b1b' },
      'Live': { label: 'Live', bgcolor: '#fee2e2', color: '#991b1b' },
      'Prediction': { label: 'Vs', bgcolor: 'transparent', color: '#000' },
    };
    return statusMap[status] || { label: 'Vs', bgcolor: 'transparent', color: '#000' };
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 2, 
        overflow: 'hidden', 
        borderRadius: 3, 
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
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {competitionLogo ? (
            <Avatar
              src={competitionLogo}
              alt={competition.name}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'grey.700' }}>
                {competition.name.substring(0, 2).toUpperCase()}
              </Typography>
            </Box>
          )}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'grey.900',
            }}
          >
            {competition.name}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          sx={{
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
        >
          {isCollapsed ? (
            <KeyboardArrowDown sx={{ fontSize: 24, color: 'grey.600' }} />
          ) : (
            <KeyboardArrowUp sx={{ fontSize: 24, color: 'grey.600' }} />
          )}
        </IconButton>
      </Box>

      {/* Matches List */}
      {!isCollapsed && (
        <Box>
          {competition.matches.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No matches in this competition
              </Typography>
            </Box>
          ) : (
            competition.matches.map((match, index) => {
              const statusBadge = getStatusBadge(match.status);
              const showScore = match.result && (match.status === 'FT' || match.status === 'HT' || match.status === 'ET' || match.status === 'Live');

              return (
                <Box
                  key={match.id}
                  sx={{
                    px: 3,
                    py: 2.5,
                    cursor: 'pointer',
                    borderTop: index === 0 ? '1px solid' : 'none',
                    borderBottom: index < competition.matches.length - 1 ? '1px solid' : 'none',
                    borderColor: 'grey.100',
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
                      <Chip
                        label={statusBadge.label}
                        sx={{
                          height: 32,
                          minWidth: 44,
                          bgcolor: statusBadge.bgcolor,
                          color: statusBadge.color,
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          borderRadius: 2,
                          '& .MuiChip-label': {
                            px: 1.5,
                          },
                        }}
                      />
                    </Box>

                    {/* Home Team */}
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        justifyContent: 'flex-end',
                      }}
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
                    </Box>

                    {/* Score */}
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
                            fontWeight: 'bold',
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
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
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
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      )}
    </Paper>
  );
};

export default MatchListSection;
