// app/(dashboard)/dashboard/profile/page.tsx
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, Tab, Box, IconButton, Container, Stack, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import withAuth from '@/app/hoc/withAuth';
import ProfileDetailsTab from '@/features/profile/components/ProfileDetailsTab';
import FollowingsTab from '@/features/profile/components/FollowingsTab';
import SubscriptionsTab from '@/features/profile/components/SubscriptionsTab';
import SettingsTab from '@/features/profile/components/SettingsTab';

type ProfileTab = 'profile-details' | 'followings' | 'subscriptions' | 'settings';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab from URL params
  const tabFromUrl = useMemo((): ProfileTab => {
    const tab = searchParams.get('tab');
    if (tab === 'followings' || tab === 'subscriptions' || tab === 'settings') {
      return tab as ProfileTab;
    }
    return 'profile-details';
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<ProfileTab>(tabFromUrl);

  // Sync state with URL params when they change
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: ProfileTab) => {
      setActiveTab(newValue);
      router.replace(`/dashboard/profile?tab=${newValue}`, { scroll: false });
    },
    [router]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack} color="default">
            <ArrowBack />
          </IconButton>
          <Box component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>
            Back
          </Box>
        </Stack>

        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#b91c1c',
                  fontWeight: 700,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#b91c1c',
                height: 3,
              },
            }}
          >
            <Tab label="Profile Details" value="profile-details" />
            <Tab label="Followings" value="followings" />
            <Tab label="Subscriptions" value="subscriptions" />
            <Tab label="Settings" value="settings" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {activeTab === 'profile-details' && <ProfileDetailsTab />}
            {activeTab === 'followings' && <FollowingsTab />}
            {activeTab === 'subscriptions' && <SubscriptionsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default withAuth(ProfilePage);
