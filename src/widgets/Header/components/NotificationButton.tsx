/**
 * Notification Button Component
 * Professional implementation using the new NotificationDropdown
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import NotificationDropdown from './NotificationDropdown';
import type { NotificationItem } from '@/features/notifications/api/hooks';

const NotificationButton: React.FC = () => {
  const router = useRouter();

  const handleNotificationClick = (notification: NotificationItem) => {
    // Store notification for instant display on detail page, then navigate
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`notification-${notification.id}`, JSON.stringify(notification));
    }
    router.push(`/dashboard/notifications/${notification.id}`);
  };

  return <NotificationDropdown onNotificationClick={handleNotificationClick} />;
};

export default NotificationButton;
