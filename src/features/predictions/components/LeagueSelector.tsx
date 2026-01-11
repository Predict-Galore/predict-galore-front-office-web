/**
 * League Selector Component
 * Migrated to feature architecture
 */

'use client';

import React from 'react';
import { League } from '../model/types';
import { Box, Typography, FormControl, Select, MenuItem, Skeleton } from '@mui/material';

interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: League | null;
  onSelectLeague: (league: League | null) => void;
  isLoading?: boolean;
}

export const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  leagues,
  selectedLeague,
  onSelectLeague,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="rounded" width={128} height={40} />
      </Box>
    );
  }

  if (leagues.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        League:
      </Typography>
      <FormControl size="small">
        <Select
          value={selectedLeague?.id || ''}
          onChange={(e) => {
            if (e.target.value === '') {
              onSelectLeague(null);
            } else {
              const league = leagues.find((l) => l.id === parseInt(e.target.value as string));
              if (league) onSelectLeague(league);
            }
          }}
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="">
            <em>All Leagues</em>
          </MenuItem>
          {leagues.map((league) => (
            <MenuItem key={league.id} value={league.id}>
              {league.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default React.memo(LeagueSelector);
