/**
 * Table Tab Component
 * Shows league standings table
 */

'use client';

import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { LeagueTableEntry } from '../model/types';
import { LoadingState } from '@/shared/components/shared';

interface TableTabProps {
  leagueId?: number;
  tableData: LeagueTableEntry[];
  isLoading: boolean;
}

const TableTab: React.FC<TableTabProps> = ({ tableData, isLoading }) => {
  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (tableData.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body1" color="text.secondary">
          League table data is not available.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid', borderColor: 'grey.200' }}>
              <TableCell sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>#</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>Team</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>Pl</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>W</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>D</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>L</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>+/-</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>GD</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'semibold', color: 'text.secondary' }}>Pts</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((entry, index) => (
              <TableRow
                key={entry.team.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                  bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
                }}
              >
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {entry.position}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={entry.team.logoUrl}
                      alt={entry.team.name}
                      sx={{ width: 24, height: 24, objectFit: 'contain' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {entry.team.shortName || entry.team.name}
                    </Typography>
                    {entry.qualification && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: entry.qualification === 'champions-league' ? 'success.main' :
                                   entry.qualification === 'europa-league' ? 'primary.main' :
                                   entry.qualification === 'relegation' ? 'error.main' : 'transparent',
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem' }}>{entry.played}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem' }}>{entry.wins}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem' }}>{entry.draws}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem' }}>{entry.losses}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                  {entry.goalsFor}-{entry.goalsAgainst}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {entry.goalDifference > 0 ? '+' : ''}
                  {entry.goalDifference}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{entry.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="caption" color="text.secondary">Champions League</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
          <Typography variant="caption" color="text.secondary">Europa League</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
          <Typography variant="caption" color="text.secondary">Relegation</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TableTab;
