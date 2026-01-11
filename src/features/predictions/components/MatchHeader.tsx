/**
 * Match Header Component
 * Displays match information with tabs (Overview, Predictions, Table)
 */

'use client';

import React from 'react';
import { ArrowBack, Share, Notifications } from '@mui/icons-material';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { Prediction } from '../model/types';
import dayjs from 'dayjs';

interface MatchHeaderProps {
  prediction: Prediction;
  activeTab: 'overview' | 'predictions' | 'table';
  onTabChange: (tab: 'overview' | 'predictions' | 'table') => void;
  onBack: () => void;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  prediction,
  activeTab,
  onTabChange,
  onBack,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = dayjs(dateString);
    return date.format('DD.MM.YYYY • HH:mm');
  };

  return (
    <Paper
      elevation={2}
      sx={{
        bgcolor: '#0f2f0d',
        color: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(15, 47, 13, 0.2)',
      }}
    >
      {/* Top Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 2.5 }, py: 1.5 }}>
        <IconButton
          onClick={onBack}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          aria-label="Back"
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            aria-label="Share"
          >
            <Share />
          </IconButton>
          <IconButton
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            aria-label="Notifications"
          >
            <Notifications />
          </IconButton>
        </Box>
      </Box>

      {/* Date/Time Pill */}
      <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 1.5 }}>
        <Chip
          label={formatDateTime(prediction.startTime)}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontWeight: 500,
            '& .MuiChip-label': {
              px: 2,
            },
          }}
        />
      </Box>

      {/* Teams and Score */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 3, sm: 5 } }}>
          {/* Home Team */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={prediction.homeTeam.logoUrl}
              alt={prediction.homeTeam.name}
              sx={{ width: { xs: 56, sm: 64 }, height: { xs: 56, sm: 64 }, mb: 1 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 'semibold', textTransform: 'uppercase', textAlign: 'center' }}>
              {prediction.homeTeam.shortName || prediction.homeTeam.name}
            </Typography>
          </Box>

          {/* Score */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', sm: '4rem' },
                fontWeight: 'black',
                mb: 0.5,
                lineHeight: 0.8,
                letterSpacing: -1,
              }}
            >
              {prediction.predictedScore}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
              Prediction
            </Typography>
          </Box>

          {/* Away Team */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={prediction.awayTeam.logoUrl}
              alt={prediction.awayTeam.name}
              sx={{ width: { xs: 56, sm: 64 }, height: { xs: 56, sm: 64 }, mb: 1 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 'semibold', textTransform: 'uppercase', textAlign: 'center' }}>
              {prediction.awayTeam.shortName || prediction.awayTeam.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          onClick={() => onTabChange('overview')}
          sx={{
            flex: 1,
            py: { xs: 1.5, sm: 2 },
            px: 2,
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderBottom: '2px solid',
            borderColor: activeTab === 'overview' ? 'error.main' : 'transparent',
            borderRadius: 0,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
            },
          }}
        >
          Overview
        </Button>
        <Button
          onClick={() => onTabChange('predictions')}
          sx={{
            flex: 1,
            py: { xs: 1.5, sm: 2 },
            px: 2,
            color: activeTab === 'predictions' ? 'white' : 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderBottom: '2px solid',
            borderColor: activeTab === 'predictions' ? 'error.main' : 'transparent',
            borderRadius: 0,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
            },
          }}
        >
          Predictions
        </Button>
        <Button
          onClick={() => onTabChange('table')}
          sx={{
            flex: 1,
            py: { xs: 1.5, sm: 2 },
            px: 2,
            color: activeTab === 'table' ? 'white' : 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderBottom: '2px solid',
            borderColor: activeTab === 'table' ? 'error.main' : 'transparent',
            borderRadius: 0,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
            },
          }}
        >
          Table
        </Button>
      </Box>
    </Paper>
  );
};

export default MatchHeader;
