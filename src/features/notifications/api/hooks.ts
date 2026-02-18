/**
 * Notifications API Hooks
 * Mock implementation for development
 */

import { useQuery } from '@tanstack/react-query';

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
}

interface NotificationsQueryParams {
  page: number;
  pageSize: number;
}

// Mock notifications data
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Prediction Successful',
    message: 'Your prediction for Arsenal vs Chelsea was successful! You earned 50 points.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    isRead: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'Match Starting Soon',
    message: 'Manchester United vs Liverpool starts in 30 minutes. Don\'t forget to place your predictions!',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    isRead: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Subscription Expiring',
    message: 'Your premium subscription expires in 3 days. Renew now to continue enjoying premium features.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'Weekly Report Ready',
    message: 'Your weekly prediction report is now available. Check your performance stats.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
  },
];

export const useNotificationsQuery = (params: NotificationsQueryParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return paginated results
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      return mockNotifications.slice(start, end);
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      return { unreadCount };
    },
    staleTime: 30000, // 30 seconds
  });
};