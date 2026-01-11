/**
 * Notifications Transformers
 * Business logic for data transformation
 */

import type { Notification, NotificationResponse, UnreadCountResponse } from '../api/types';

export class NotificationTransformer {
  /**
   * Transform API response to domain model
   */
  static transformNotificationResponse(response: NotificationResponse): NotificationResponse {
    return {
      items: response.items.map(this.transformNotification),
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    };
  }

  /**
   * Transform single notification
   */
  static transformNotification(notification: Notification): Notification {
    return {
      ...notification,
      createdAt: new Date(notification.createdAt).toISOString(),
      updatedAt: new Date(notification.updatedAt).toISOString(),
    };
  }

  /**
   * Transform unread count response
   */
  static transformUnreadCountResponse(response: UnreadCountResponse): UnreadCountResponse {
    return response;
  }
}
