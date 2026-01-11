/**
 * Profile Domain Types
 * Domain layer - Core business entities for profile feature
 */

import type { User } from '@/shared/types';

export type ProfileUser = Partial<User> & {
  id: string;
  email: string;
};

export interface Subscription {
  id: string;
  planName: string;
  planCode: string;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  renewalDate: string;
  amount: number;
  currency: string;
}

export interface Transaction {
  id: string;
  date: string;
  status: 'successful' | 'failed' | 'pending';
  amount: number;
  description?: string;
}

export interface Following {
  id: string;
  type: 'team' | 'player' | 'club' | 'league';
  name: string;
  sport: 'soccer' | 'basketball' | 'volleyball' | 'all';
  league?: string;
  imageUrl?: string;
  isFollowing: boolean;
  notificationsEnabled?: boolean;
}

export interface NotificationSettings {
  predictionInsights: {
    inApp: boolean;
    push: boolean;
  };
  matchUpdates: {
    inApp: boolean;
    push: boolean;
  };
  newsAlerts: {
    inApp: boolean;
    push: boolean;
  };
}

export interface ProfileFilter {
  page?: number;
  pageSize?: number;
}
