/**
 * League Standings Tab Component
 * Shows league table with team standings, form, and qualification indicators
 *
 * This component displays:
 * - League table with team positions
 * - Team statistics (played, wins, draws, losses, goals, points)
 * - Recent form indicators (W/D/L)
 * - Qualification indicators (Champions League, Europa League, Relegation)
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { TableChart } from '@mui/icons-material';
import { LeagueTableEntry } from '../model/types';
import { useLeagueTable } from '../api/hooks';

// ==================== TYPES ====================

interface TableTabProps {
  leagueId?: number;
  tableData?: LeagueTableEntry[];
  isLoading?: boolean;
}

// Qualification type configuration
const QUALIFICATION_CONFIG = {
  'champions-league': {
    color: '#16a34a', // green
    label: 'Champions League',
  },
  'europa-league': {
    color: '#2563eb', // blue
    label: 'Europa League',
  },
  relegation: {
    color: '#dc2626', // red
    label: 'Relegation',
  },
} as const;

// ==================== HELPER COMPONENTS ====================

/**
 * Form indicator component showing recent match results
 */
interface FormIndicatorProps {
  form?: string[];
}

const FormIndicator: React.FC<FormIndicatorProps> = ({ form }) => {
  if (!form || form.length === 0) return null;

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W':
        return { bgcolor: 'success.main', color: 'white' };
      case 'D':
        return { bgcolor: 'grey.500', color: 'white' };
      case 'L':
        return { bgcolor: 'error.main', color: 'white' };
      default:
        return { bgcolor: 'grey.300', color: 'grey.700' };
    }
  };

  return (
    <Stack direction="row" spacing={0.5}>
      {form.slice(0, 5).map((result, idx) => (
        <Chip
          key={idx}
          label={result}
          size="small"
          sx={{
            ...getFormColor(result),
            width: 24,
            height: 24,
            fontSize: '0.625rem',
            fontWeight: 700,
            '& .MuiChip-label': {
              px: 0,
            },
          }}
        />
      ))}
    </Stack>
  );
};

/**
 * Loading skeleton for table
 */
const TableSkeleton: React.FC = () => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: '#000',
      borderRadius: 0,
      p: 3,
    }}
  >
    <Stack spacing={2} alignItems="center">
      <CircularProgress sx={{ color: 'grey.600' }} />
      <Typography variant="body2" color="grey.500">
        Loading league table...
      </Typography>
    </Stack>
  </Paper>
);

/**
 * Empty state when no data available
 */
const EmptyState: React.FC<{ leagueId?: number }> = ({ leagueId }) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: '#000',
      borderRadius: 0,
      p: 6,
      textAlign: 'center',
    }}
  >
    <TableChart sx={{ fontSize: 64, color: 'grey.700', mb: 2 }} />
    <Typography variant="h6" color="grey.500" gutterBottom>
      No Table Data Available
    </Typography>
    <Typography variant="body2" color="grey.600">
      League table data is not available at this time.
    </Typography>
    {leagueId && (
      <Typography variant="caption" color="grey.700" sx={{ mt: 1, display: 'block' }}>
        League ID: {leagueId}
      </Typography>
    )}
  </Paper>
);

// ==================== MAIN COMPONENT ====================

const TableTab: React.FC<TableTabProps> = ({
  leagueId,
  tableData: propTableData,
  isLoading: propIsLoading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Log for debugging
  React.useEffect(() => {
    console.log('=== TABLE TAB COMPONENT ===');
    console.log('League ID:', leagueId);
    console.log('Prop Table Data:', propTableData);
    console.log('Prop Is Loading:', propIsLoading);
  }, [leagueId, propTableData, propIsLoading]);

  // Fetch league table data if not provided as props
  const { data: hookTableData = [], isLoading: hookIsLoading } = useLeagueTable(leagueId ?? null, {
    enabled: !!leagueId && !propTableData,
  });

  // Log hook data
  React.useEffect(() => {
    console.log('=== TABLE TAB HOOK DATA ===');
    console.log('Hook Table Data:', hookTableData);
    console.log('Hook Is Loading:', hookIsLoading);
  }, [hookTableData, hookIsLoading]);

  // Use prop data if available, otherwise use hook data
  const tableData = propTableData || hookTableData;
  const isLoading = propIsLoading ?? hookIsLoading;

  // ==================== LOADING STATE ====================

  if (isLoading) {
    return <TableSkeleton />;
  }

  // ==================== EMPTY STATE ====================

  if (tableData.length === 0) {
    return <EmptyState leagueId={leagueId} />;
  }

  // ==================== RENDER TABLE ====================

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#000',
        borderRadius: 0,
        overflow: 'hidden',
      }}
    >
      {/* League Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'grey.900',
        }}
      >
        <Avatar
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'black',
          }}
        >
          PL
        </Avatar>
        <Typography variant="body1" color="white" fontWeight={500}>
          Premier League
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small" sx={{ minWidth: isMobile ? 600 : 'auto' }}>
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid', borderColor: 'grey.900' }}>
              <TableCell sx={{ color: 'grey.500', fontWeight: 500, py: 1.5 }}>#</TableCell>
              <TableCell sx={{ color: 'grey.500', fontWeight: 500 }}>Team</TableCell>
              <TableCell align="center" sx={{ color: 'grey.500', fontWeight: 500 }}>
                Pl
              </TableCell>
              <TableCell align="center" sx={{ color: 'grey.500', fontWeight: 500 }}>
                W
              </TableCell>
              <TableCell align="center" sx={{ color: 'grey.500', fontWeight: 500 }}>
                D
              </TableCell>
              <TableCell align="center" sx={{ color: 'grey.500', fontWeight: 500 }}>
                L
              </TableCell>
              <TableCell align="center" sx={{ color: 'grey.500', fontWeight: 500 }}>
                +/-
              </TableCell>
              <TableCell align="center" sx={{ color: 'grey.500', fontWeight: 500 }}>
                GD
              </TableCell>
              <TableCell align="center" sx={{ color: 'grey.500', fontWeight: 500 }}>
                Pts
              </TableCell>
              <TableCell sx={{ color: 'grey.500', fontWeight: 500 }}>Form</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((entry) => {
              // Get qualification indicator color
              const qualificationColor =
                entry.qualification && QUALIFICATION_CONFIG[entry.qualification]
                  ? QUALIFICATION_CONFIG[entry.qualification].color
                  : 'transparent';

              return (
                <TableRow
                  key={entry.team.id}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'grey.900',
                    borderLeft: `4px solid ${qualificationColor}`,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  {/* Position */}
                  <TableCell sx={{ color: 'grey.400', fontWeight: 500, py: 2 }}>
                    {entry.position}
                  </TableCell>

                  {/* Team */}
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={entry.team.logoUrl}
                        alt={entry.team.name}
                        sx={{ width: 20, height: 20 }}
                      />
                      <Typography
                        variant="body2"
                        color="white"
                        fontWeight={500}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {entry.team.shortName || entry.team.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Played */}
                  <TableCell align="center" sx={{ color: 'grey.300' }}>
                    {entry.played}
                  </TableCell>

                  {/* Wins */}
                  <TableCell align="center" sx={{ color: 'grey.300' }}>
                    {entry.wins}
                  </TableCell>

                  {/* Draws */}
                  <TableCell align="center" sx={{ color: 'grey.300' }}>
                    {entry.draws}
                  </TableCell>

                  {/* Losses */}
                  <TableCell align="center" sx={{ color: 'grey.300' }}>
                    {entry.losses}
                  </TableCell>

                  {/* Goals For/Against */}
                  <TableCell align="center" sx={{ color: 'grey.300' }}>
                    {entry.goalsFor}-{entry.goalsAgainst}
                  </TableCell>

                  {/* Goal Difference */}
                  <TableCell align="center" sx={{ color: 'grey.300', fontWeight: 600 }}>
                    {entry.goalDifference > 0 ? '+' : ''}
                    {entry.goalDifference}
                  </TableCell>

                  {/* Points */}
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                    {entry.points}
                  </TableCell>

                  {/* Form */}
                  <TableCell>
                    <FormIndicator form={entry.form} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
          borderTop: '1px solid',
          borderColor: 'grey.900',
          px: 3,
          py: 2,
        }}
      >
        {Object.entries(QUALIFICATION_CONFIG).map(([key, config]) => (
          <Stack key={key} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: config.color,
              }}
            />
            <Typography variant="caption" color="grey.500" sx={{ fontSize: '0.75rem' }}>
              {config.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Paper>
  );
};

export default TableTab;
