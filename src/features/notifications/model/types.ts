/**
 * Notifications Domain Types
 * Domain layer - Core business entities for notifications feature
 */

export type NotificationType = 'PREDICTION' | 'ALERT' | 'SYSTEM' | 'INFO' | 'MATCH' | 'SUCCESS';

export interface Notification {
  id: number;
  userId: string;
  title: string;
  content: string;
  notificationType: NotificationType;
  predictionId?: number;
  fixtureId?: number;
  subscriptionId?: number;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilter {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
  notificationType?: NotificationType;
}
