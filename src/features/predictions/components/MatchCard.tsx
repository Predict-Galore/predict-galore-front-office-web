/**
 * Match Card Component
 * Migrated to feature architecture
 */

import React, { memo, useCallback } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { Box, Typography, Chip, Avatar, Divider } from '@mui/material';
import { Prediction, MatchVariant } from '../model/types';

export interface MatchCardProps {
  match: Prediction;
  variant: MatchVariant;
  isHighlighted?: boolean;
  onNotifyClick?: (matchId: number) => void;
  showNotificationBadge?: boolean;
  className?: string;
  onSelect?: (match: Prediction) => void;
}

const MatchCard: React.FC<MatchCardProps> = memo(
  ({ match, variant, isHighlighted = false, className = '', onSelect }) => {
    // Use centralized date formatting utility
    const formatDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }, []);

    const handleClick = useCallback(() => {
      if (onSelect) {
        onSelect(match);
      }
    }, [onSelect, match]);

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: isHighlighted ? '2px solid' : '1px solid',
          borderColor: isHighlighted ? 'primary.main' : 'grey.300',
          bgcolor: 'background.paper',
          boxShadow: 1,
          cursor: onSelect ? 'pointer' : 'default',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: 2,
          },
        }}
        onClick={handleClick}
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        data-variant={variant}
        className={className}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarDays style={{ fontSize: 16, color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(match.startTime)}
            </Typography>
          </Box>
          <Chip
            label={match.competition}
            size="small"
            sx={{
              bgcolor: 'grey.100',
              color: 'text.secondary',
              fontWeight: 500,
            }}
          />
        </Box>

        {match.stadium && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MapPin style={{ fontSize: 16, color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              {match.stadium}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Home Team */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Avatar
              src={match.homeTeam.logoUrl}
              alt={match.homeTeam.name}
              sx={{ width: 48, height: 48, mb: 1 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 'semibold', color: 'text.primary', textAlign: 'center' }}>
              {match.homeTeam.shortName || match.homeTeam.name}
            </Typography>
          </Box>

          {/* Match Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.primary' }}>
              {match.predictedScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Predicted
            </Typography>

            {match.confidence && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Confidence:
                </Typography>
                <Chip
                  label={`${match.confidence}%`}
                  size="small"
                  sx={{
                    bgcolor: 'info.light',
                    color: 'info.dark',
                    fontWeight: 'bold',
                    height: 'auto',
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Away Team */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Avatar
              src={match.awayTeam.logoUrl}
              alt={match.awayTeam.name}
              sx={{ width: 48, height: 48, mb: 1 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 'semibold', color: 'text.primary', textAlign: 'center' }}>
              {match.awayTeam.shortName || match.awayTeam.name}
            </Typography>
          </Box>
        </Box>

        {match.odds && (
          <>
            <Divider sx={{ mt: 2, mb: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Home
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {match.odds.home.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Draw
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  {match.odds.draw.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Away
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {match.odds.away.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    );
  }
);

MatchCard.displayName = 'MatchCard';

export default MatchCard;
