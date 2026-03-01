/**
 * Match Header Component
 * Displays match information with tabs (Overview, Predictions, Table)
 * 
 * This component shows:
 * - Match teams with logos and names
 * - Predicted score
 * - Match date and time
 * - Navigation tabs for different views
 * - Action buttons (back, share, notifications)
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Notifications,
} from '@mui/icons-material';
import { Prediction } from '../model/types';

// ==================== TYPES ====================

interface MatchHeaderProps {
  prediction: Prediction;
  activeTab: 'overview' | 'predictions' | 'table';
  onTabChange: (tab: 'overview' | 'predictions' | 'table') => void;
  onBack: () => void;
}

// Tab configuration for better maintainability
const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'predictions', label: 'Predictions' },
  { value: 'table', label: 'Table' },
] as const;

// ==================== COMPONENT ====================

const MatchHeader: React.FC<MatchHeaderProps> = ({ 
  prediction, 
  activeTab, 
  onTabChange, 
  onBack 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ==================== HELPERS ====================

  /**
   * Get team data with fallbacks
   */
  const homeTeam = prediction.homeTeam || { 
    id: 0, 
    name: 'Home Team', 
    logoUrl: '', 
    shortName: 'HOME' 
  };
  
  const awayTeam = prediction.awayTeam || { 
    id: 0, 
    name: 'Away Team', 
    logoUrl: '', 
    shortName: 'AWAY' 
  };

  // ==================== RENDER ====================

  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(135deg, #1a4d2e 0%, #2d6a4f 100%)',
        borderRadius: 0,
        overflow: 'hidden',
        border: '0px solid',
        borderColor: 'rgba(26, 77, 46, 0.2)',
        boxShadow: 3,
      }}
    >
      {/* Top Action Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
        }}
      >
        <IconButton
          onClick={onBack}
          aria-label="Go back"
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>

        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="Share match"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Share />
          </IconButton>
          <IconButton
            aria-label="Notifications"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Notifications />
          </IconButton>
        </Stack>
      </Box>

      {/* Date/Time Chip */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
        <Chip
          label={prediction.startTime ? formatDateTime(prediction.startTime) : 'Date TBD'}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 28,
          }}
        />
      </Box> */}

      {/* Teams and Score Section */}
      <Box sx={{ px: 2, pb: 4 }}>
        <Stack
          direction="row"
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
          justifyContent="center"
        >
          {/* Home Team */}
          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={homeTeam.logoUrl}
              alt={homeTeam.name}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'white',
                p: 0.5,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                textTransform: 'uppercase',
                textAlign: 'center',
                fontSize: '0.75rem',
                maxWidth: 80,
              }}
            >
              {homeTeam.shortName || homeTeam.name}
            </Typography>
          </Stack>

          {/* Score Display */}
          <Stack alignItems="center" spacing={0.5}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 900,
                fontSize: { xs: '3rem', md: '3.5rem' },
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {prediction.predictedScore || '0-0'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                textTransform: 'capitalize',
                fontSize: '0.75rem',
              }}
            >
              Prediction
            </Typography>
          </Stack>

          {/* Away Team */}
          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={awayTeam.logoUrl}
              alt={awayTeam.name}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'white',
                p: 0.5,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                textTransform: 'uppercase',
                textAlign: 'center',
                fontSize: '0.75rem',
                maxWidth: 80,
              }}
            >
              {awayTeam.shortName || awayTeam.name}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Navigation Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        variant={isMobile ? 'fullWidth' : 'standard'}
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          '& .MuiTabs-indicator': {
            bgcolor: 'white',
            height: 2,
          },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'none',
              py: 1.5,
              '&.Mui-selected': {
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default MatchHeader;
