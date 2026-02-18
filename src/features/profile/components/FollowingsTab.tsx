/**
 * Followings Tab Component
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Box, Button, Avatar, Stack, Paper, Typography } from '@mui/material';
import { useFollowings, useFollowTeam, useUnfollowTeam } from '@/features/profile';
import { useSports } from '@/features/predictions';
import { getSafeImageUrl } from '@/shared/utils/imageUtils';
import { SportTabs } from '@/shared/components/shared';
import type { Sport } from '@/features/predictions/model/types';
import type { Following } from '@/features/profile/model/types';
import { LoadingState } from '@/shared/components/shared';

const FollowingsTab: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const { data: followings = [], isLoading } = useFollowings();
  const { data: sportsData = [] } = useSports();
  const { mutate: followTeam } = useFollowTeam();
  const { mutate: unfollowTeam } = useUnfollowTeam();

  // Use API sports data for tabs
  const sportsForTabs: Sport[] = useMemo(() => {
    if (!sportsData || sportsData.length === 0) {
      return [];
    }
    return sportsData;
  }, [sportsData]);

  const selectedSportForTabs = useMemo((): Sport => {
    if (selectedSport?.name === 'All Sports') {
      return sportsForTabs.find((sport) => sport.name === 'All Sports') || sportsForTabs[0];
    }
    return selectedSport || sportsForTabs[0];
  }, [sportsForTabs, selectedSport]);

  const handleSportSelect = useCallback((sport: Sport) => {
    setSelectedSport(sport);
  }, []);

  const handleFollowToggle = useCallback(
    (following: Following) => {
      if (following.isFollowing) {
        unfollowTeam(parseInt(following.id, 10));
      } else {
        followTeam({
          teamId: parseInt(following.id, 10),
          notificationsEnabled: true,
        });
      }
    },
    [followTeam, unfollowTeam]
  );

  // Filter followings by selected sport
  const filteredFollowings = useMemo(() => {
    if (!selectedSport || selectedSport.name === 'All Sports') {
      return followings;
    }
    return followings.filter(
      (f) => f.sport === selectedSport.name.toLowerCase() || f.sport === 'all'
    );
  }, [followings, selectedSport]);

  if (isLoading) {
    return <LoadingState message="Loading followings..." />;
  }

  return (
    <Stack spacing={3}>
      {/* Sport Tabs */}
      <SportTabs
        sports={sportsForTabs}
        selectedSport={selectedSportForTabs}
        onSelectSport={handleSportSelect}
      />

      {/* Followings List */}
      <Stack spacing={1.5}>
        {filteredFollowings.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }} elevation={0}>
            <Typography variant="body1" color="text.secondary">
              No followings found
            </Typography>
          </Paper>
        ) : (
          filteredFollowings.map((following) => (
            <Paper
              key={following.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                border: '1px solid',
                borderColor: 'grey.100',
                '&:hover': { boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
              }}
            >
              <Box sx={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
                {getSafeImageUrl(following.imageUrl) ? (
                  <Image
                    src={getSafeImageUrl(following.imageUrl)}
                    alt={following.name}
                    fill
                    className="object-cover rounded-full"
                    sizes="48px"
                  />
                ) : (
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'grey.200' }}>
                    {following.name[0]?.toUpperCase()}
                  </Avatar>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: '#1f4fa3',
                    mb: 0.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {following.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {following.league || following.sport}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                onClick={() => handleFollowToggle(following)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  borderColor: '#1f2937',
                  color: '#1f2937',
                  '&:hover': { bgcolor: 'grey.50', borderColor: '#111827' },
                }}
              >
                {following.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default FollowingsTab;
