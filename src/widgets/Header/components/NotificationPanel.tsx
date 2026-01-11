/**
 * Notification Panel Component
 * Matches Figma UI design exactly
 */

'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Notifications, Close } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Backdrop,
  Fade,
} from '@mui/material';
import { useNotifications, useMarkAsRead } from '@/features/notifications/api/hooks';
import type { Notification } from '@/features/notifications/model/types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Notification Icon Component (light green square with white outline)
const NotificationIcon: React.FC = () => {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        bgcolor: 'success.light',
        border: '2px solid white',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* Document/checklist icon (three horizontal lines) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ width: 16, height: 2, bgcolor: 'success.main', borderRadius: 1 }} />
        <Box sx={{ width: 16, height: 2, bgcolor: 'success.main', borderRadius: 1 }} />
        <Box sx={{ width: 16, height: 2, bgcolor: 'success.main', borderRadius: 1 }} />
      </Box>
    </Box>
  );
};

// Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}> = React.memo(({ notification, onMarkAsRead }) => {
  const handleClick = useCallback(() => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  }, [notification, onMarkAsRead]);

  return (
    <Button
      onClick={handleClick}
      sx={{
        width: '100%',
        textAlign: 'left',
        px: 2,
        py: 1.5,
        '&:hover': {
          bgcolor: 'grey.50',
        },
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        bgcolor: !notification.isRead ? 'primary.50' : 'transparent',
      }}
    >
      {/* Icon */}
      <NotificationIcon />

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'semibold', color: 'grey.900', mb: 0.5 }}>
          {notification.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          {notification.content}
        </Typography>
      </Box>
    </Button>
  );
});

NotificationItem.displayName = 'NotificationItem';

// Empty State Component
const NotificationEmptyState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      {/* Large bell icon */}
      <Notifications sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />

      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'grey.900', mb: 1 }}>
        No Notifications Yet
      </Typography>

      {/* Sub-text */}
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Check back later for the latest updates
      </Typography>
    </Box>
  );
};

// Main Notification Panel Component
const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const {
    data: notificationsData,
    isLoading,
    refetch: refetchNotifications,
  } = useNotifications({
    page: 1,
    pageSize: 50,
  });

  const markAsReadMutation = useMarkAsRead();

  const notifications = useMemo(() => notificationsData?.items || [], [notificationsData]);

  const handleMarkAsRead = useCallback(
    (id: number) => {
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation]
  );

  // Refetch when panel opens
  useEffect(() => {
    if (isOpen) {
      refetchNotifications();
    }
  }, [isOpen, refetchNotifications]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const panelContent = (
    <>
      {/* Backdrop */}
      <Backdrop
        open={isOpen}
        onClick={onClose}
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />

      {/* Panel */}
      <Fade in={isOpen}>
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            pt: 10,
            px: 2,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
            {/* Green bell icon in top right (overlapping) */}
            <Box sx={{ position: 'absolute', top: -16, right: -16, zIndex: 10 }}>
              <Box sx={{ position: 'relative', width: 40, height: 40 }}>
                {/* Green background circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                  }}
                />

                {/* White outline ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid white',
                    borderRadius: '50%',
                  }}
                />

                {/* Bell icon */}
                <Notifications
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    color: 'white',
                    p: 1,
                    fontSize: '20px',
                  }}
                />
              </Box>
            </Box>

            {/* White card with green border glow */}
            <Paper
              elevation={24}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 2,
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  pointerEvents: 'none',
                },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
                  Notifications
                </Typography>
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  aria-label="Close"
                >
                  <Close sx={{ fontSize: 20, color: 'grey.500' }} />
                </IconButton>
              </Box>

              {/* Content */}
              <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={32} sx={{ color: 'success.main' }} />
                  </Box>
                ) : notifications.length === 0 ? (
                  <NotificationEmptyState />
                ) : (
                  <Box>
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <NotificationItem
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                        />
                        {index < notifications.length - 1 && (
                          <Divider />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Fade>
    </>
  );

  if (typeof window !== 'undefined') {
    return createPortal(panelContent, document.body);
  }

  return null;
};

NotificationPanel.displayName = 'NotificationPanel';

export default NotificationPanel;
