/**
 * Notification Panel Component
 * Renders fully when open (like Profile Details): no spinners. Shows a
 * complete loading/empty/error/data layout at all times.
 */

'use client';

import React, { useMemo, useState } from 'react';
import { Notifications } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { useNotificationsQuery, type NotificationItem } from '@/features/notifications/api/hooks';

interface NotificationPanelProps {
  anchorEl: null | HTMLElement;
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


// Main Notification Panel Component
const NotificationPanel: React.FC<NotificationPanelProps> = ({ anchorEl, onClose }) => {
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch: refetchNotifications,
  } = useNotificationsQuery({
    page: 1,
    pageSize: 50,
  });

  const notifications: NotificationItem[] = useMemo(
    () => notificationsData || [],
    [notificationsData]
  );

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{ sx: { minWidth: 340, maxHeight: 400 } }}
      >
        {isLoading ? (
          <MenuItem disabled>
            <ListItemIcon><Notifications /></ListItemIcon>
            <ListItemText primary="Loading notifications..." />
          </MenuItem>
        ) : isError ? (
          <MenuItem disabled>
            <ListItemIcon><Notifications /></ListItemIcon>
            <ListItemText primary="Error loading notifications" />
            <Button
              size="small"
              onClick={() => refetchNotifications()}
              sx={{ ml: 2 }}
            >
              Retry
            </Button>
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemIcon><Notifications /></ListItemIcon>
            <ListItemText primary="No notifications yet" />
          </MenuItem>
        ) : (
          notifications.map((notification: NotificationItem) => (
            <MenuItem key={notification.id} onClick={() => setSelectedNotification(notification)}>
              <ListItemIcon><NotificationIcon /></ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
              />
            </MenuItem>
          ))
        )}
      </Menu>
      {/* Notification Detail Overlay */}
      {selectedNotification && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedNotification(null)}
        >
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 6,
              minWidth: 340,
              maxWidth: 420,
              p: 3,
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {selectedNotification.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedNotification.message}
            </Typography>
            {selectedNotification.actionUrl && (
              <Button
                variant="contained"
                color="primary"
                href={selectedNotification.actionUrl}
                target="_blank"
                sx={{ mt: 1 }}
              >
                Read More
              </Button>
            )}
            <Button
              variant="text"
              color="secondary"
              onClick={() => setSelectedNotification(null)}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

NotificationPanel.displayName = 'NotificationPanel';

export default NotificationPanel;
