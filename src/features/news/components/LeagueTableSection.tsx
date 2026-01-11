/**
 * League Table Section Component
 * Displays Premier League table (reuses predictions table component)
 */

'use client';

import React from 'react';
import { useLeagueTable } from '@/features/predictions';
import { LoadingState } from '@/shared/components/shared';
import SafeImage from '@/shared/components/shared/SafeImage';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { LeagueTableEntry } from '@/features/predictions';

interface LeagueTableSectionProps {
  leagueId?: number;
  title?: string;
}

const LeagueTableSection: React.FC<LeagueTableSectionProps> = ({
  leagueId,
  title = 'Premier League Table',
}) => {
  const { data: tableData = [], isLoading } = useLeagueTable(leagueId ?? null, {
    enabled: !!leagueId,
  });

  if (!leagueId) {
    return null;
  }


  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        p: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'semibold', mb: 2 }}>
        {title}
      </Typography>
      {isLoading ? (
        <LoadingState variant="skeleton" />
      ) : tableData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            League table data is not available.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid', borderBottomColor: 'grey.200' }}>
                <TableCell sx={{ fontWeight: 'semibold', color: 'grey.600' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'semibold', color: 'grey.600' }}>Team</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'semibold', color: 'grey.600' }}>W</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'semibold', color: 'grey.600' }}>D</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'semibold', color: 'grey.600' }}>L</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'semibold', color: 'grey.600' }}>F</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'semibold', color: 'grey.600' }}>A</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'semibold', color: 'grey.600' }}>GD</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.slice(0, 5).map((entry: LeagueTableEntry, index: number) => (
                <TableRow
                  key={entry.team.id}
                  sx={{
                    borderBottom: '1px solid',
                    borderBottomColor: 'grey.100',
                    bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{entry.position}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ position: 'relative', width: 20, height: 20 }}>
                        <SafeImage
                          src={entry.team.logoUrl}
                          alt={entry.team.name}
                          fill
                          className="object-contain"
                          sizes="20px"
                          fallbackVariant="thumb"
                        />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {entry.team.shortName || entry.team.name}
                      </Typography>
                      {entry.qualification && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor:
                              entry.qualification === 'champions-league' ? 'success.main' :
                              entry.qualification === 'europa-league' ? 'primary.main' :
                              entry.qualification === 'relegation' ? 'error.main' : 'transparent',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{entry.wins}</TableCell>
                  <TableCell align="center">{entry.draws}</TableCell>
                  <TableCell align="center">{entry.losses}</TableCell>
                  <TableCell align="center">{entry.goalsFor}</TableCell>
                  <TableCell align="center">{entry.goalsAgainst}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'semibold' }}>
                    {entry.goalDifference > 0 ? '+' : ''}
                    {entry.goalDifference}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default LeagueTableSection;
