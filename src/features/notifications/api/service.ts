/**
 * Notifications Service
 * Application layer - Business logic and API calls for notifications
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { NotificationTransformer } from '../lib/transformers';
import type { NotificationResponse, UnreadCountResponse, NotificationFilter } from './types';

const logger = createLogger('NotificationService');

/**
 * Notifications Service Class
 * Handles all notification-related API calls
 */
export class NotificationService {
  /**
   * Get notifications list
   */
  static async getNotifications(filters?: NotificationFilter): Promise<NotificationResponse> {
    logger.info('Get notifications request', { filters });

    const params: Record<string, string | number> = {};
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.pageSize = filters.pageSize;
    if (filters?.isRead !== undefined) params.isRead = filters.isRead ? 1 : 0;
    if (filters?.notificationType) params.notificationType = filters.notificationType;

    const response = await api.get<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS.LIST, params);

    return NotificationTransformer.transformNotificationResponse(response);
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(): Promise<UnreadCountResponse> {
    logger.info('Get unread count request');

    const response = await api.get<UnreadCountResponse>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);

    return NotificationTransformer.transformUnreadCountResponse(response);
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: number): Promise<void> {
    logger.info('Mark notification as read', { id });

    await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<void> {
    logger.info('Mark all notifications as read');

    await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: number): Promise<void> {
    logger.info('Delete notification', { id });

    await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  }
}
