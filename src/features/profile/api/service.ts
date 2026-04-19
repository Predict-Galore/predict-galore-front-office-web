/**
 * Profile Service
 * Application layer - Business logic and API calls for profile
 */

import { api, API_ENDPOINTS, createLogger } from '@/shared/api';
import { ApiError } from '@/shared/lib/errors';
import { ProfileTransformer } from '../lib/transformers';
import type {
  ProfileUser,
  Subscription,
  UserSubscription,
  SubscriptionPlan,
  Transaction,
  Following,
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

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private static normalizeSubscriptionPlan(payload: unknown): SubscriptionPlan {
    const record = this.isRecord(payload) ? payload : {};

    return {
      id: Number(record.id ?? 0),
      name: String(record.name ?? ''),
      planCode: String(record.planCode ?? ''),
      amount: Number(record.amount ?? 0),
      durationDays: Number(record.durationDays ?? record.duration ?? 0),
      autoRenewDefault: Boolean(record.autoRenewDefault),
      isActie: Boolean(record.isActie ?? record.isActive),
      description: typeof record.description === 'string' ? record.description : undefined,
      currency: typeof record.currency === 'string' ? record.currency : undefined,
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : undefined,
      updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : undefined,
    };
  }

  private static extractPlanList(response: unknown): SubscriptionPlan[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.normalizeSubscriptionPlan(item));
    }

    if (!this.isRecord(response)) return [];

    const candidates: unknown[] = [];
    candidates.push(response.data, response.items, response.results, response.plans);

    if (this.isRecord(response.data)) {
      candidates.push(response.data.items, response.data.results, response.data.plans);
    }

    const list = candidates.find((candidate) => Array.isArray(candidate));
    return Array.isArray(list) ? list.map((item) => this.normalizeSubscriptionPlan(item)) : [];
  }

  private static extractPlanDetail(response: unknown): SubscriptionPlan {
    if (Array.isArray(response)) {
      return this.normalizeSubscriptionPlan(response[0]);
    }

    if (!this.isRecord(response)) {
      return this.normalizeSubscriptionPlan({});
    }

    if (this.isRecord(response.data)) {
      return this.normalizeSubscriptionPlan(response.data);
    }

    return this.normalizeSubscriptionPlan(response);
  }

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
   * Get the current user's active subscription
   * GET /api/v1/subscriptions/me/current
   */
  static async getCurrentSubscription(): Promise<UserSubscription | null> {
    logger.info('Get current subscription request');

    try {
      const response = await api.get<unknown>(API_ENDPOINTS.PROFILE.CURRENT_SUBSCRIPTION);

      // Handle envelope: { success, data: {...} } or the object directly
      const raw = this.isRecord(response) && 'data' in response
        ? response.data
        : response;

      if (!raw || !this.isRecord(raw)) return null;

      return {
        id: Number(raw.id ?? 0),
        userId: String(raw.userId ?? ''),
        planId: Number(raw.planId ?? 0),
        planCode: String(raw.planCode ?? ''),
        planName: String(raw.planName ?? raw.name ?? ''),
        amount: Number(raw.amount ?? 0),
        durationDays: Number(raw.durationDays ?? 0),
        startDate: String(raw.startDate ?? raw.createdAt ?? ''),
        endDate: String(raw.endDate ?? raw.expiresAt ?? ''),
        isActive: Boolean(raw.isActive ?? raw.isActie ?? false),
        autoRenew: Boolean(raw.autoRenew ?? raw.autoRenewDefault ?? false),
        status: String(raw.status ?? ''),
      };
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 204)) {
        logger.debug('No active subscription found');
        return null;
      }
      logger.error('Failed to fetch current subscription', { error });
      throw error;
    }
  }

  /**
   * Get subscription plans
   */
  static async getSubscriptionPlans(onlyActive: boolean = true): Promise<SubscriptionPlan[]> {
    logger.info('Get subscription plans request', { onlyActive });

    try {
      const url = `${API_ENDPOINTS.PROFILE.SUBSCRIPTION_PLANS}?onlyActive=${onlyActive}`;
      const response = await api.get<unknown>(url);
      return this.extractPlanList(response);
    } catch (error) {
      logger.error('Failed to fetch plans', { error });
      throw error;
    }
  }

  /**
   * Get a subscription plan by id
   */
  static async getSubscriptionPlanById(id: number): Promise<SubscriptionPlan> {
    logger.info('Get subscription plan by id request', { id });

    try {
      const response = await api.get<unknown>(API_ENDPOINTS.PROFILE.SUBSCRIPTION_PLAN_BY_ID(id));
      return this.extractPlanDetail(response);
    } catch (error) {
      logger.error('Failed to fetch subscription plan by id', { error, id });
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
   * Delete account
   */
  static async deleteAccount(): Promise<void> {
    logger.info('Delete account request');

    await api.delete(API_ENDPOINTS.PROFILE.DELETE_ACCOUNT);
  }
}
