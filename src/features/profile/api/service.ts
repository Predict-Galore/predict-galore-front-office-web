/**
 * Profile Service
 * Application layer - Business logic and API calls for profile
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { ProfileTransformer } from '../lib/transformers';
import type {
  ProfileUser,
  Subscription,
  Transaction,
  Following,
  NotificationSettings,
  UpdateProfileRequest,
  ChangePasswordRequest,
  FollowTeamRequest,
} from './types';

const logger = createLogger('ProfileService');

/**
 * Profile Service Class
 * Handles all profile-related API calls
 */
export class ProfileService {
  /**
   * Get user profile
   */
  static async getProfile(): Promise<ProfileUser> {
    logger.info('Get profile request');

    try {
      const response = await api.get<ProfileUser>(API_ENDPOINTS.PROFILE.DETAILS);
      return ProfileTransformer.transformProfileUser(response);
    } catch (error) {
      logger.error('Failed to fetch profile', { error });
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<ProfileUser> {
    logger.info('Update profile request');

    try {
      const response = await api.put<ProfileUser>(API_ENDPOINTS.PROFILE.UPDATE, data);

      return ProfileTransformer.transformProfileUser(response);
    } catch (error) {
      logger.error('Failed to update profile', { error });
      throw error;
    }
  }

  /**
   * Get current subscription
   */
  static async getCurrentSubscription(): Promise<Subscription> {
    logger.info('Get current subscription request');

    try {
      const response = await api.get<Subscription>(API_ENDPOINTS.PROFILE.SUBSCRIPTIONS);

      return ProfileTransformer.transformSubscription(response);
    } catch (error) {
      logger.error('Failed to fetch subscription', { error });
      throw error;
    }
  }

  /**
   * Get subscription plans
   */
  static async getSubscriptionPlans(onlyActive: boolean = true): Promise<
    Array<{
      id: number;
      name: string;
      planCode: string;
      amount: number;
      duration: number;
      isActive: boolean;
    }>
  > {
    logger.info('Get subscription plans request', { onlyActive });

    try {
      const url = `${API_ENDPOINTS.PROFILE.SUBSCRIPTION_PLANS}?onlyActive=${onlyActive}`;
      const response = await api.get<
        Array<{
          id: number;
          name: string;
          planCode: string;
          amount: number;
          duration: number;
          isActive: boolean;
        }>
      >(url);

      return response;
    } catch (error) {
      logger.error('Failed to fetch plans', { error });
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactionHistory(): Promise<Transaction[]> {
    logger.info('Get transaction history request');

    try {
      const response = await api.get<Transaction[]>(API_ENDPOINTS.PROFILE.TRANSACTIONS);

      return Array.isArray(response) ? response.map(ProfileTransformer.transformTransaction) : [];
    } catch (error) {
      logger.error('Failed to fetch transactions', { error });
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(): Promise<void> {
    logger.info('Cancel subscription request');

    await api.post(API_ENDPOINTS.PROFILE.CANCEL_SUBSCRIPTION, {});
  }

  /**
   * Get followings
   */
  static async getFollowings(): Promise<Following[]> {
    logger.info('Get followings request');

    try {
      const response = await api.get<Following[]>(API_ENDPOINTS.PROFILE.FOLLOWINGS);

      return Array.isArray(response) ? response.map(ProfileTransformer.transformFollowing) : [];
    } catch (error) {
      logger.error('Failed to fetch followings', { error });
      throw error;
    }
  }

  /**
   * Get all teams with status
   */
  static async getAllTeams(): Promise<Following[]> {
    logger.info('Get all teams request');

    try {
      const response = await api.get<Following[]>(API_ENDPOINTS.PROFILE.TEAMS_ALL);

      return Array.isArray(response) ? response.map(ProfileTransformer.transformFollowing) : [];
    } catch (error) {
      logger.error('Failed to fetch all teams', { error });
      throw error;
    }
  }

  /**
   * Follow team
   */
  static async followTeam(data: FollowTeamRequest): Promise<void> {
    logger.info('Follow team request', { teamId: data.teamId });

    await api.post(API_ENDPOINTS.PROFILE.FOLLOW_TEAM, {
      teamId: data.teamId,
      notificationsEnabled: data.notificationsEnabled ?? true,
    });
  }

  /**
   * Unfollow team
   */
  static async unfollowTeam(teamId: number): Promise<void> {
    logger.info('Unfollow team request', { teamId });

    await api.post(API_ENDPOINTS.PROFILE.UNFOLLOW_TEAM(teamId), {});
  }

  /**
   * Update team notifications
   */
  static async updateTeamNotifications(teamId: number, enabled: boolean): Promise<void> {
    logger.info('Update team notifications request', { teamId, enabled });

    await api.put(API_ENDPOINTS.PROFILE.UPDATE_NOTIFICATIONS(teamId), enabled);
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    logger.info('Change password request');

    await api.post(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
  }

  /**
   * Toggle two-factor authentication
   */
  static async toggleTwoFactorAuth(enable: boolean): Promise<void> {
    logger.info('Toggle two-factor auth request', { enable });

    await api.post(API_ENDPOINTS.PROFILE.TOGGLE_2FA, { enable });
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(): Promise<NotificationSettings> {
    logger.info('Get notification settings request');

    try {
      const response = await api.get<NotificationSettings>(
        API_ENDPOINTS.PROFILE.NOTIFICATION_SETTINGS
      );

      return ProfileTransformer.transformNotificationSettings(response);
    } catch (error) {
      logger.error('Failed to fetch notification settings', { error });
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    logger.info('Update notification settings request');

    const response = await api.put<NotificationSettings>(
      API_ENDPOINTS.PROFILE.NOTIFICATION_SETTINGS,
      settings
    );

    return ProfileTransformer.transformNotificationSettings(response);
  }

  /**
   * Delete account
   */
  static async deleteAccount(): Promise<void> {
    logger.info('Delete account request');

    await api.delete(API_ENDPOINTS.PROFILE.DELETE_ACCOUNT);
  }
}
