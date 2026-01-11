/**
 * Notification Button Component
 * Matches Figma UI - Green bell icon with white outline
 */

'use client';

import React, { memo } from 'react';
import { Notifications } from '@mui/icons-material';
import { cn } from '@/shared/lib/utils';
import { useUnreadCount } from '@/features/notifications/api/hooks';

interface NotificationButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = memo(({ isOpen, onToggle }) => {
  const { data } = useUnreadCount();
  const unreadCount = data?.unreadCount || 0;

  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative w-10 h-10 rounded-full',
        'bg-gray-100 border border-gray-200',
        'flex items-center justify-center',
        'transition-colors duration-200',
        'hover:bg-gray-200',
        isOpen && 'bg-gray-200'
      )}
      aria-label="notifications"
    >
      <Notifications className="text-gray-700" sx={{ fontSize: 20 }} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
});

NotificationButton.displayName = 'NotificationButton';

export default NotificationButton;
