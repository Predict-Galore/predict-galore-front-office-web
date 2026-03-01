/**
 * Overview Tab Component
 * Shows key prediction information from API response
 */

'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Chip, LinearProgress } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoIcon from '@mui/icons-material/Info';

interface OverviewTabProps {
  prediction: Record<string, unknown> | Prediction;
  detailed?: Record<string, unknown> | DetailedPrediction;
}

// Import types
import { Prediction, DetailedPrediction } from '../model/types';

/**
 * Overview Tab Component
 * Displays major prediction information
 */
const OverviewTab: React.FC<OverviewTabProps> = ({ prediction, detailed }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [likes, setLikes] = useState(25);
  const [dislikes, setDislikes] = useState(3);

  /**
   * Handle like button click
   */
  const handleLike = () => {
    if (selectedVote === 'like') {
      setLikes(likes - 1);
      setSelectedVote(null);
    } else {
      setLikes(likes + 1);
      if (selectedVote === 'dislike') {
        setDislikes(dislikes - 1);
      }
      setSelectedVote('like');
    }
  };

  /**
   * Handle dislike button click
   */
  const handleDislike = () => {
    if (selectedVote === 'dislike') {
      setDislikes(dislikes - 1);
      setSelectedVote(null);
    } else {
      setDislikes(dislikes + 1);
      if (selectedVote === 'like') {
        setLikes(likes - 1);
      }
      setSelectedVote('dislike');
    }
  };

  // Helper function to safely get property value
  const getProp = (
    obj: Record<string, unknown> | Prediction | DetailedPrediction | undefined,
    key: string
  ): unknown => {
    if (!obj) return undefined;
    return (obj as Record<string, unknown>)[key];
  };

  // Get data from API response
  const title = (getProp(detailed, 'title') ||
    getProp(prediction, 'title') ||
    'Match Prediction') as string;
  const analysis = (getProp(detailed, 'analysis') ||
    getProp(prediction, 'analysis') ||
    '') as string;
  const expertAnalysis = (getProp(detailed, 'expertAnalysis') ||
    getProp(prediction, 'expertAnalysis') ||
    '') as string;
  const accuracy = (getProp(detailed, 'accuracy') ||
    getProp(prediction, 'accuracy') ||
    0) as number;
  const audience = (getProp(detailed, 'audience') ||
    getProp(prediction, 'audience') ||
    '') as string;
  const isPremium = (getProp(detailed, 'isPremium') ||
    getProp(prediction, 'isPremium') ||
    false) as boolean;
  const isActive =
    getProp(detailed, 'isActive') !== undefined
      ? getProp(detailed, 'isActive')
      : getProp(prediction, 'isActive');

  // Use expert analysis if available, otherwise use regular analysis
  const analysisText = expertAnalysis || analysis;
  const truncatedAnalysis =
    analysisText.length > 300 ? analysisText.substring(0, 300) + '...' : analysisText;

  return (
    <Stack spacing={3}>
      {/* Prediction Title */}
      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <InfoIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Prediction Details
          </Typography>
        </Stack>

        <Typography variant="h5" fontWeight={800} gutterBottom>
          {title}
        </Typography>

        {/* Badges */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" gap={1}>
          {audience && <Chip label={`Audience: ${audience}`} size="small" color="primary" />}
          {isPremium && <Chip label="Premium" size="small" color="warning" />}
          {isActive !== undefined && (
            <Chip
              label={isActive ? 'Active' : 'Inactive'}
              size="small"
              color={isActive ? 'success' : 'default'}
            />
          )}
        </Stack>
      </Paper>

      {/* Accuracy */}
      {accuracy > 0 && (
        <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 0 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Prediction Accuracy
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={accuracy}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      accuracy >= 70
                        ? 'success.main'
                        : accuracy >= 50
                          ? 'warning.main'
                          : 'error.main',
                  },
                }}
              />
            </Box>
            <Typography variant="h6" fontWeight={700} color="success.main">
              {accuracy}%
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Confidence level for this prediction
          </Typography>
        </Paper>
      )}

      {/* Analysis */}
      {analysisText && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: 'grey.900',
            color: 'white',
            borderRadius: 0,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              {expertAnalysis ? 'Expert Analysis' : 'Analysis'}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<ThumbUpIcon />}
                onClick={handleLike}
                sx={{
                  color: selectedVote === 'like' ? 'success.light' : 'grey.400',
                  minWidth: 'auto',
                }}
              >
                {likes}
              </Button>
              <Button
                size="small"
                startIcon={<ThumbDownIcon />}
                onClick={handleDislike}
                sx={{
                  color: selectedVote === 'dislike' ? 'error.light' : 'grey.400',
                  minWidth: 'auto',
                }}
              >
                {dislikes}
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'grey.300' }}>
            {showFullAnalysis ? analysisText : truncatedAnalysis}
          </Typography>

          {analysisText.length > 300 && (
            <Button
              size="small"
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              sx={{
                mt: 2,
                color: 'grey.400',
                textTransform: 'none',
                '&:hover': { color: 'white' },
              }}
            >
              {showFullAnalysis ? 'Show less' : 'Show more'}
            </Button>
          )}
        </Paper>
      )}

      {/* Who will win? - Voting Section */}
      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 0 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Who will win?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Share your prediction by casting your vote with the community.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant={selectedVote === 'home' ? 'contained' : 'outlined'}
            color="success"
            fullWidth
            onClick={() => setSelectedVote(selectedVote === 'home' ? null : 'home')}
            sx={{ py: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Home Win
          </Button>
          <Button
            variant={selectedVote === 'draw' ? 'contained' : 'outlined'}
            color="inherit"
            fullWidth
            onClick={() => setSelectedVote(selectedVote === 'draw' ? null : 'draw')}
            sx={{ py: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Draw
          </Button>
          <Button
            variant={selectedVote === 'away' ? 'contained' : 'outlined'}
            color="success"
            fullWidth
            onClick={() => setSelectedVote(selectedVote === 'away' ? null : 'away')}
            sx={{ py: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Away Win
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default OverviewTab;
