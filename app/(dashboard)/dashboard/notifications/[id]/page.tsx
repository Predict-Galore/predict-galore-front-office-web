/**
 * Notification Detail Page
 * Displays full notification content, similar to news article detail
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Stack, Paper, Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { LoadingState, ErrorState } from '@/shared/components/shared';
import type { NotificationItem } from '@/features/notifications/api/hooks';
import { useQuery } from '@tanstack/react-query';
import { NotificationService } from '@/features/notifications/api/service';
import dayjs from 'dayjs';

const mapApiNotificationToItem = (item: {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  notificationType?: string;
}): NotificationItem => ({
  id: String(item.id),
  type: (item.notificationType?.toLowerCase() as NotificationItem['type']) || 'info',
  title: item.title,
  message: item.content,
  timestamp: item.createdAt,
  isRead: item.isRead,
});

const NotificationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const notificationId = params?.id as string | null;
  const [cached, setCached] = useState<NotificationItem | null>(null);

  // Check sessionStorage first (when coming from dropdown click)
  useEffect(() => {
    if (!notificationId || typeof window === 'undefined') return;
    const stored = sessionStorage.getItem(`notification-${notificationId}`);
    if (stored) {
      try {
        setCached(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, [notificationId]);

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['notifications', 'detail', notificationId],
    queryFn: async () => {
      const res = await NotificationService.getNotifications({ page: 1, pageSize: 100 });
      const found = res.items?.find(
        (n) => String(n.id) === notificationId || n.id === Number(notificationId)
      );
      if (!found) throw new Error('Notification not found');
      return mapApiNotificationToItem(found);
    },
    enabled: !!notificationId && !cached,
    staleTime: 60000,
  });

  const notification = cached ?? apiData ?? null;

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (!notificationId) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <ErrorState error="Invalid notification ID" title="Notification not found" />
      </Container>
    );
  }

  if (!notification && isLoading) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <LoadingState variant="skeleton" />
      </Container>
    );
  }

  if (error || !notification) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
        <ErrorState
          error={error?.message || 'Failed to load notification'}
          title="Error loading notification"
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMMM YYYY [at] HH:mm');
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: 800, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handleBack}
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{ textTransform: 'none' }}
          >
            Back
          </Button>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Typography variant="overline" color="text.secondary">
              Notification
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {notification.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(notification.timestamp)}
            </Typography>

            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                {notification.message}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default NotificationDetailPage;
