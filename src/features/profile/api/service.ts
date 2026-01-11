/**
 * Profile Service
 * Application layer - Business logic and API calls for profile
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { USE_MOCK_DATA, USE_MOCK_ON_ERROR } from '@/shared/constants/data-source';
import { ProfileTransformer } from '../lib/transformers';
import {
  mockFollowings,
  mockNotificationSettings,
  mockPlans,
  mockProfileUser,
  mockSubscription,
  mockTransactions,
  updateMockProfile,
} from '../lib/mock-data';
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

    if (USE_MOCK_DATA) {
      logger.debug('Returning mock profile (mock mode enabled)');
      return mockProfileUser;
    }

    try {
      const response = await api.get<ProfileUser>(API_ENDPOINTS.PROFILE.DETAILS);
      return ProfileTransformer.transformProfileUser(response);
    } catch (error) {
      logger.error('Failed to fetch profile', { error });
      if (USE_MOCK_ON_ERROR) {
        logger.warn('Falling back to mock profile after error');
        return mockProfileUser;
      }
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<ProfileUser> {
    logger.info('Update profile request');

    if (USE_MOCK_DATA) {
      return updateMockProfile(data);
    }

    try {
      const response = await api.put<ProfileUser>(API_ENDPOINTS.PROFILE.UPDATE, data);

      return ProfileTransformer.transformProfileUser(response);
    } catch (error) {
      logger.error('Failed to update profile', { error });
      if (USE_MOCK_ON_ERROR) {
        logger.warn('Returning mock profile after update error');
        return updateMockProfile(data);
      }
      throw error;
    }
  }

  /**
   * Get current subscription
   */
  static async getCurrentSubscription(): Promise<Subscription> {
    logger.info('Get current subscription request');

    if (USE_MOCK_DATA) {
      return mockSubscription;
    }

    try {
      const response = await api.get<Subscription>(API_ENDPOINTS.PROFILE.SUBSCRIPTIONS);

      return ProfileTransformer.transformSubscription(response);
    } catch (error) {
      logger.error('Failed to fetch subscription', { error });
      if (USE_MOCK_ON_ERROR) {
        return mockSubscription;
      }
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

    if (USE_MOCK_DATA) {
      return mockPlans.filter((plan) => (onlyActive ? plan.isActive : true));
    }

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
      if (USE_MOCK_ON_ERROR) {
        return mockPlans.filter((plan) => (onlyActive ? plan.isActive : true));
      }
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactionHistory(): Promise<Transaction[]> {
    logger.info('Get transaction history request');

    if (USE_MOCK_DATA) {
      return mockTransactions;
    }

    try {
      const response = await api.get<Transaction[]>(API_ENDPOINTS.PROFILE.TRANSACTIONS);

      return Array.isArray(response) ? response.map(ProfileTransformer.transformTransaction) : [];
    } catch (error) {
      logger.error('Failed to fetch transactions', { error });
      if (USE_MOCK_ON_ERROR) {
        return mockTransactions;
      }
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(): Promise<void> {
    logger.info('Cancel subscription request');

    if (USE_MOCK_DATA) {
      return;
    }

    await api.post(API_ENDPOINTS.PROFILE.CANCEL_SUBSCRIPTION, {});
  }

  /**
   * Get followings
   */
  static async getFollowings(): Promise<Following[]> {
    logger.info('Get followings request');

    if (USE_MOCK_DATA) {
      return mockFollowings;
    }

    try {
      const response = await api.get<Following[]>(API_ENDPOINTS.PROFILE.FOLLOWINGS);

      return Array.isArray(response) ? response.map(ProfileTransformer.transformFollowing) : [];
    } catch (error) {
      logger.error('Failed to fetch followings', { error });
      if (USE_MOCK_ON_ERROR) {
        return mockFollowings;
      }
      throw error;
    }
  }

  /**
   * Get all teams with status
   */
  static async getAllTeams(): Promise<Following[]> {
    logger.info('Get all teams request');

    if (USE_MOCK_DATA) {
      return mockFollowings.map((f) => ({ ...f, isFollowing: false }));
    }

    try {
      const response = await api.get<Following[]>(API_ENDPOINTS.PROFILE.TEAMS_ALL);

      return Array.isArray(response) ? response.map(ProfileTransformer.transformFollowing) : [];
    } catch (error) {
      logger.error('Failed to fetch all teams', { error });
      if (USE_MOCK_ON_ERROR) {
        return mockFollowings.map((f) => ({ ...f, isFollowing: false }));
      }
      throw error;
    }
  }

  /**
   * Follow team
   */
  static async followTeam(data: FollowTeamRequest): Promise<void> {
    logger.info('Follow team request', { teamId: data.teamId });

    if (USE_MOCK_DATA) {
      return;
    }

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

    if (USE_MOCK_DATA) {
      return;
    }

    await api.post(API_ENDPOINTS.PROFILE.UNFOLLOW_TEAM(teamId), {});
  }

  /**
   * Update team notifications
   */
  static async updateTeamNotifications(teamId: number, enabled: boolean): Promise<void> {
    logger.info('Update team notifications request', { teamId, enabled });

    if (USE_MOCK_DATA) {
      return;
    }

    await api.put(API_ENDPOINTS.PROFILE.UPDATE_NOTIFICATIONS(teamId), enabled);
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    logger.info('Change password request');

    if (USE_MOCK_DATA) {
      return;
    }

    await api.post(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
  }

  /**
   * Toggle two-factor authentication
   */
  static async toggleTwoFactorAuth(enable: boolean): Promise<void> {
    logger.info('Toggle two-factor auth request', { enable });

    if (USE_MOCK_DATA) {
      return;
    }

    await api.post(API_ENDPOINTS.PROFILE.TOGGLE_2FA, { enable });
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(): Promise<NotificationSettings> {
    logger.info('Get notification settings request');

    if (USE_MOCK_DATA) {
      return mockNotificationSettings;
    }

    try {
      const response = await api.get<NotificationSettings>(
        API_ENDPOINTS.PROFILE.NOTIFICATION_SETTINGS
      );

      return ProfileTransformer.transformNotificationSettings(response);
    } catch (error) {
      logger.error('Failed to fetch notification settings', { error });
      if (USE_MOCK_ON_ERROR) {
        return mockNotificationSettings;
      }
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

    if (USE_MOCK_DATA) {
      return { ...mockNotificationSettings, ...settings };
    }

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

    if (USE_MOCK_DATA) {
      return;
    }

    await api.delete(API_ENDPOINTS.PROFILE.DELETE_ACCOUNT);
  }
}
