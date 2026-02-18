/**
 * Notification Dropdown Component
 * Matches the design system: clean white card, green dot icons, dividers
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { cn } from '@/shared/lib/utils';
import { useNotificationsQuery, type NotificationItem } from '@/features/notifications/api/hooks';

interface NotificationDropdownProps {
  onNotificationClick?: (notification: NotificationItem) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onNotificationClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useNotificationsQuery({ page: 1, pageSize: 20 });

  const notifications: NotificationItem[] = notificationsData || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleNotificationClick = useCallback(
    (notification: NotificationItem) => {
      // Show detail view in dropdown instead of navigating
      setSelectedNotification(notification);
    },
    []
  );

  const handleBackToList = useCallback(() => {
    setSelectedNotification(null);
  }, []);

  const handleViewFullDetails = useCallback(() => {
    if (selectedNotification) {
      onNotificationClick?.(selectedNotification);
      setIsOpen(false);
    }
  }, [selectedNotification, onNotificationClick]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // ==================== RENDER HELPERS ====================

  const renderLoading = () => (
    <div className="flex justify-center py-10">
      <CircularProgress size={28} sx={{ color: 'grey.400' }} />
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center py-10 px-6">
      <NotificationsNoneIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1.5 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Failed to Load
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Unable to load notifications
      </Typography>
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center py-10 px-6">
      <NotificationsNoneIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1.5 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        No Notifications Yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Check back later for the latest updates
      </Typography>
    </div>
  );

  const renderNotifications = () => (
    <div>
      {notifications.map((notification: NotificationItem, index: number) => (
        <div key={notification.id}>
          <div
            onClick={() => handleNotificationClick(notification)}
            className="flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {/* Green circle icon */}
            <div className="shrink-0 mt-1.5">
              <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                <NotificationsNoneIcon sx={{ fontSize: 10, color: 'common.white' }} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, lineHeight: 1.4, mb: 0.25 }}
              >
                {notification.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                }}
              >
                {notification.message}
              </Typography>
            </div>
          </div>

          {/* Divider (not after last item) */}
          {index < notifications.length - 1 && (
            <div className="mx-5 border-b border-gray-100" />
          )}
        </div>
      ))}
    </div>
  );

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 48, color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />;
      default:
        return <InfoIcon sx={{ fontSize: 48, color: 'info.main' }} />;
    }
  };

  const getNotificationColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return { bg: 'success.50', border: 'success.200', text: 'success.dark' };
      case 'warning':
        return { bg: 'warning.50', border: 'warning.200', text: 'warning.dark' };
      case 'error':
        return { bg: 'error.50', border: 'error.200', text: 'error.dark' };
      default:
        return { bg: 'info.50', border: 'info.200', text: 'info.dark' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const renderDetailView = () => {
    if (!selectedNotification) return null;

    const colors = getNotificationColor(selectedNotification.type);

    return (
      <div className="p-5">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Back to notifications
            </Typography>
          </button>
        </div>

        {/* Icon and Type Badge */}
        <div className="flex flex-col items-center mb-4">
          {getNotificationIcon(selectedNotification.type)}
          <Box
            sx={{
              mt: 2,
              px: 2,
              py: 0.5,
              borderRadius: 1,
              bgcolor: colors.bg,
              border: '1px solid',
              borderColor: colors.border,
            }}
          >
            <Typography variant="caption" sx={{ color: colors.text, fontWeight: 600, textTransform: 'capitalize' }}>
              {selectedNotification.type}
            </Typography>
          </Box>
        </div>

        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
          {selectedNotification.title}
        </Typography>

        {/* Message */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          {selectedNotification.message}
        </Typography>

        {/* Timestamp */}
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-500">
          <AccessTimeIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">
            {formatTimestamp(selectedNotification.timestamp)}
          </Typography>
        </div>

        {/* Read Status */}
        {!selectedNotification.isRead && (
          <div className="flex items-center justify-center mb-4">
            <Chip
              label="Unread"
              size="small"
              sx={{
                bgcolor: 'error.50',
                color: 'error.dark',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {selectedNotification.actionUrl && (
            <button
              onClick={handleViewFullDetails}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                View Full Details
              </Typography>
              <OpenInNewIcon sx={{ fontSize: 18 }} />
            </button>
          )}
          
          <button
            onClick={handleBackToList}
            className="w-full px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Close
            </Typography>
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // Show detail view if a notification is selected
    if (selectedNotification) return renderDetailView();
    
    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (notifications.length === 0) return renderEmpty();
    return renderNotifications();
  };

  // ==================== MAIN RENDER ====================

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          'relative flex items-center justify-center p-2 rounded-full',
          'hover:bg-gray-100 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-green-500/20'
        )}
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <NotificationsIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <NotificationsNoneIcon className="w-6 h-6 text-gray-700" />
        )}

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200',
            isMobile
              ? 'fixed left-4 right-4 top-[72px] w-auto'
              : 'absolute right-0 w-[380px]'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={cn(
              'bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden',
              isMobile && 'max-h-[85vh]'
            )}
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3">
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                Notifications
              </Typography>
            </div>

            {/* Scrollable content */}
            <Box
              sx={{
                maxHeight: isMobile ? '65vh' : 420,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {renderContent()}
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
