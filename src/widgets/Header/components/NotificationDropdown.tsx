/**
 * Notification Dropdown Component
 * Professional read-state handling with unread-first ordering.
 */

'use client';

import React, { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotificationsQuery,
  type NotificationItem,
} from '@/features/notifications/api/hooks';

interface NotificationDropdownProps {
  onNotificationClick?: (notification: NotificationItem) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNotificationClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useNotificationsQuery({
    page: 1,
    pageSize: 20,
  });
  const { mutate: markNotificationAsRead, isPending: isMarkingOne } = useMarkNotificationAsRead();
  const { mutate: markAllNotificationsAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  const isOpen = Boolean(anchorEl);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }),
    [notifications]
  );

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
    setExpandedIds([]);
  };

  const handleShowDetail = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      setSelectedNotification({ ...notification, isRead: true });
      return;
    }

    setSelectedNotification(notification);
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  const handleToggleExpand = (notificationId: string) => {
    setExpandedIds((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    if (selectedNotification) {
      setSelectedNotification({ ...selectedNotification, isRead: true });
    }
  };

  const handleViewFullDetails = () => {
    if (selectedNotification && onNotificationClick) {
      onNotificationClick(selectedNotification);
      handleClose();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getIcon = (type: NotificationItem['type']) => {
    const iconProps = { sx: { fontSize: isMobile ? 32 : 48 } };

    switch (type) {
      case 'success':
        return <CheckCircleIcon {...iconProps} color="success" />;
      case 'warning':
        return <WarningIcon {...iconProps} color="warning" />;
      case 'error':
        return <ErrorIcon {...iconProps} color="error" />;
      default:
        return <InfoIcon {...iconProps} color="info" />;
    }
  };

  const renderNotificationItem = (notification: NotificationItem) => {
    const isExpanded = expandedIds.includes(notification.id);
    const isLongMessage = notification.message.length > 100;

    return (
      <Box key={notification.id}>
        <ListItem
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            '&:hover': { bgcolor: 'grey.50' },
          }}
        >
          <Box
            onClick={() => handleShowDetail(notification)}
            sx={{ width: '100%', cursor: 'pointer', display: 'flex', gap: { xs: 1, sm: 2 } }}
          >
            <Box
              sx={{
                width: { xs: 12, sm: 16 },
                height: { xs: 12, sm: 16 },
                borderRadius: '50%',
                bgcolor: notification.isRead ? 'grey.300' : 'success.main',
                flexShrink: 0,
                mt: 0.5,
              }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  mb: 0.5,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  {notification.title}
                </Typography>
                <Chip
                  label={notification.isRead ? 'Read' : 'Unread'}
                  size="small"
                  color={notification.isRead ? 'default' : 'error'}
                  sx={{
                    height: { xs: 20, sm: 22 },
                    fontSize: { xs: '0.625rem', sm: '0.6875rem' },
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mb: 0.5,
                  display: 'block',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                }}
              >
                {formatTime(notification.timestamp)}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                {notification.message}
              </Typography>
            </Box>
          </Box>

          {isLongMessage && (
            <Button
              size="small"
              onClick={() => handleToggleExpand(notification.id)}
              sx={{
                ml: { xs: 3, sm: 4 },
                mt: 1,
                textTransform: 'none',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                fontWeight: 600,
                color: 'success.main',
                '&:hover': { bgcolor: 'success.50' },
              }}
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </Button>
          )}
        </ListItem>
        <Divider />
      </Box>
    );
  };

  const renderDetailView = () => {
    if (!selectedNotification) return null;

    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '100%' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToList}
          size={isMobile ? 'small' : 'medium'}
          sx={{ mb: { xs: 2, sm: 3 }, textTransform: 'none' }}
        >
          Back to notifications
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {getIcon(selectedNotification.type)}
        </Box>

        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          {selectedNotification.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
        >
          {selectedNotification.message}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <AccessTimeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {formatTime(selectedNotification.timestamp)}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip
            label={selectedNotification.isRead ? 'Read' : 'Unread'}
            size="small"
            color={selectedNotification.isRead ? 'default' : 'error'}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Stack spacing={1.5}>
          {selectedNotification.actionUrl && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleViewFullDetails}
              size={isMobile ? 'small' : 'medium'}
            >
              View Full Details
            </Button>
          )}

          <Button
            variant="outlined"
            fullWidth
            onClick={handleBackToList}
            size={isMobile ? 'small' : 'medium'}
          >
            Close
          </Button>
        </Stack>
      </Box>
    );
  };

  const renderNotificationList = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, sm: 8 } }}>
          <CircularProgress size={isMobile ? 32 : 40} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 } }}>
          <NotificationsNoneIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'grey.400', mb: 2 }} />
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Failed to Load
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unable to load notifications
          </Typography>
        </Box>
      );
    }

    if (sortedNotifications.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 } }}>
          <NotificationsNoneIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'grey.400', mb: 2 }} />
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            No Notifications Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for updates
          </Typography>
        </Box>
      );
    }

    return (
      <List
        sx={{
          p: 0,
          maxHeight: { xs: 350, sm: 420 },
          overflow: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {sortedNotifications.map(renderNotificationItem)}
      </List>
    );
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit" size={isMobile ? 'small' : 'medium'}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: isMobile ? '0.6rem' : '0.75rem',
              height: isMobile ? 16 : 20,
              minWidth: isMobile ? 16 : 20,
            },
          }}
        >
          {unreadCount > 0 ? (
            <NotificationsIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          ) : (
            <NotificationsNoneIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          )}
        </Badge>
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'center' : 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: isMobile ? '100%' : 620,
              maxWidth: isMobile ? 'calc(100vw - 32px)' : '90vw',
              maxHeight: '80vh',
              borderRadius: isMobile ? 3 : 2,
              mx: isMobile ? 2 : 0,
            },
          },
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            fontWeight={700}
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Notifications
          </Typography>
          {!selectedNotification && (
            <Button
              size={isMobile ? 'small' : 'small'}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isMarkingAll || isMarkingOne}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: 'success.main',
                '&:disabled': { color: 'text.disabled' },
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        {selectedNotification ? renderDetailView() : renderNotificationList()}
      </Popover>
    </>
  );
};

export default NotificationDropdown;
