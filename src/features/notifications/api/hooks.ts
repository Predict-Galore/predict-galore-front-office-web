/**
 * Notifications API Hooks
 * TanStack Query hooks for notifications
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryClient as useReactQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { NotificationService } from './service';
import type {
  Notification,
  NotificationFilter,
  NotificationResponse,
  UnreadCountResponse,
} from './types';
/**
 * Get auth token helper
 */
function getAuthTokenHelper(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('auth-token');
  } catch {
    return null;
  }
}

/**
 * Socket.IO Manager for notifications
 */
class NotificationSocketManager {
  private socket: Socket | null = null;
  private listeners = new Map<string, ((data: unknown) => void)[]>();
  private isConnected = false;

  connect(): void {
    if (this.socket?.connected || typeof window === 'undefined') return;

    const token = getAuthTokenHelper();
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

    this.socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: token ? { token } : {},
      autoConnect: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('notification:new', (notification: Notification) => {
      this.emit('notification:new', notification);
    });

    this.socket.on('notification:read', (data: { id: number }) => {
      this.emit('notification:read', data);
    });

    this.socket.on('notification:delete', (data: { id: number }) => {
      this.emit('notification:delete', data);
    });
  }

  on(event: string, callback: (data: unknown) => void): void {
    const currentListeners = this.listeners.get(event) || [];
    currentListeners.push(callback);
    this.listeners.set(event, currentListeners);
  }

  off(event: string, callback: (data: unknown) => void): void {
    const currentListeners = this.listeners.get(event) || [];
    const filteredListeners = currentListeners.filter((cb) => cb !== callback);
    this.listeners.set(event, filteredListeners);
  }

  private emit(event: string, data: unknown): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach((callback) => callback(data));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

const socketManager = new NotificationSocketManager();

// Get notifications hook
export function useNotifications(filters?: NotificationFilter) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => NotificationService.getNotifications(filters),
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
    enabled: typeof window !== 'undefined',
  });
}

// Get unread count hook
export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => NotificationService.getUnreadCount(),
    refetchInterval: 30 * 1000, // 30 seconds
    staleTime: 60 * 1000,
    enabled: typeof window !== 'undefined',
  });
}

// Mark as read hook
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => NotificationService.markAsRead(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData<NotificationResponse>([
        'notifications',
      ]);

      if (previousNotifications) {
        queryClient.setQueryData<NotificationResponse | undefined>(['notifications'], (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item: Notification) =>
              item.id === id ? { ...item, isRead: true } : item
            ),
          };
        });
      }

      queryClient.setQueryData<UnreadCountResponse | undefined>(
        ['notifications', 'unread-count'],
        (old) => {
          if (!old) return old;
          return { unreadCount: Math.max(0, old.unreadCount - 1) };
        }
      );

      return { previousNotifications };
    },
    onError: (_error, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Mark all as read hook
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData<NotificationResponse>([
        'notifications',
      ]);

      if (previousNotifications) {
        queryClient.setQueryData<NotificationResponse | undefined>(['notifications'], (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item: Notification) => ({ ...item, isRead: true })),
          };
        });
      }

      queryClient.setQueryData<UnreadCountResponse>(['notifications', 'unread-count'], () => ({
        unreadCount: 0,
      }));

      return { previousNotifications };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Delete notification hook
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => NotificationService.deleteNotification(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData<NotificationResponse>([
        'notifications',
      ]);
      const previousCount = queryClient.getQueryData<UnreadCountResponse>([
        'notifications',
        'unread-count',
      ]);

      if (previousNotifications) {
        const notificationToDelete = previousNotifications.items.find((item) => item.id === id);
        const wasUnread = notificationToDelete?.isRead === false;

        queryClient.setQueryData<NotificationResponse | undefined>(['notifications'], (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.filter((item: Notification) => item.id !== id),
            total: old.total - 1,
          };
        });

        if (wasUnread && previousCount) {
          queryClient.setQueryData<UnreadCountResponse>(['notifications', 'unread-count'], {
            unreadCount: Math.max(0, previousCount.unreadCount - 1),
          });
        }
      }

      return { previousNotifications, previousCount };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Socket.IO hook
export function useNotificationSocket(onNewNotification?: (notification: Notification) => void) {
  const queryClient = useReactQueryClient();

  useEffect(() => {
    socketManager.connect();

    const handleNewNotification = (notification: unknown) => {
      const newNotification = notification as Notification;

      queryClient.setQueryData<NotificationResponse | undefined>(['notifications'], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: [newNotification, ...old.items],
          total: old.total + 1,
        };
      });

      queryClient.setQueryData<UnreadCountResponse | undefined>(
        ['notifications', 'unread-count'],
        (old) => {
          if (!old) return { unreadCount: 1 };
          return { unreadCount: old.unreadCount + 1 };
        }
      );

      onNewNotification?.(newNotification);
    };

    socketManager.on('notification:new', handleNewNotification);

    return () => {
      socketManager.off('notification:new', handleNewNotification);
    };
  }, [queryClient, onNewNotification]);

  return {
    isConnected: socketManager.connected,
    disconnect: () => socketManager.disconnect(),
  };
}
