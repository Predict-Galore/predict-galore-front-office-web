/**
 * Profile API Types
 * API layer - Types for API requests and responses
 */

import type {
  ProfileUser,
  Subscription,
  UserSubscription,
  SubscriptionPlan,
  Transaction,
  Following,
  NotificationSettings,
} from '../model/types';

export type {
  ProfileUser,
  Subscription,
  UserSubscription,
  SubscriptionPlan,
  Transaction,
  Following,
  NotificationSettings,
};

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface FollowTeamRequest {
  teamId: number;
  notificationsEnabled?: boolean;
}
