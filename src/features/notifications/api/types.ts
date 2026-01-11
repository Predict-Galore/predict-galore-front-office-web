/**
 * Notifications API Types
 * API layer - Types for API requests and responses
 */

import type { Notification, NotificationFilter } from '../model/types';

export type { Notification, NotificationFilter };

export interface NotificationResponse {
  items: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  content: string;
  notificationType: Notification['notificationType'];
  predictionId?: number;
  fixtureId?: number;
  subscriptionId?: number;
  actionUrl?: string;
}
