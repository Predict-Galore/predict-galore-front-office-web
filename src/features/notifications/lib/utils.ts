/**
 * Notifications Utilities
 * Feature-specific utility functions
 */

import type { Notification, NotificationType } from '../model/types';

/**
 * Filter notifications by type
 */
export function filterNotificationsByType(
  notifications: Notification[],
  type: NotificationType
): Notification[] {
  return notifications.filter((n) => n.notificationType === type);
}

/**
 * Get unread notifications
 */
export function getUnreadNotifications(notifications: Notification[]): Notification[] {
  return notifications.filter((n) => !n.isRead);
}

/**
 * Sort notifications by date (newest first)
 */
export function sortNotificationsByDate(notifications: Notification[]): Notification[] {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
