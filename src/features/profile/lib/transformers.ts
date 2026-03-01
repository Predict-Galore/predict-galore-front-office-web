/**
 * Profile Transformers
 * Business logic for data transformation
 */

import type {
  ProfileUser,
  Subscription,
  Transaction,
  Following,
  NotificationSettings,
} from '../model/types';

export class ProfileTransformer {
  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private static getProfilePayload(input: unknown): Record<string, unknown> {
    if (!this.isRecord(input)) return {};

    const root = this.isRecord(input.data) ? input.data : input;
    const userNode = this.isRecord(root.user) ? root.user : root;
    const basicDetails = this.isRecord(userNode.basicDetails) ? userNode.basicDetails : null;

    return basicDetails ? { ...userNode, ...basicDetails } : userNode;
  }

  private static normalizeRole(role: unknown): ProfileUser['role'] {
    if (typeof role !== 'string') return 'user';

    const normalized = role.toLowerCase();
    if (normalized === 'admin' || normalized === 'user' || normalized === 'guest') {
      return normalized;
    }

    return 'user';
  }

  /**
   * Transform API response to domain model
   */
  static transformProfileUser(user: unknown): ProfileUser {
    const payload = this.getProfilePayload(user);
    const roleFromRoles = Array.isArray(payload.roles) ? payload.roles[0] : undefined;

    return {
      id: String(payload.id ?? ''),
      email: String(payload.email ?? ''),
      firstName: String(payload.firstName ?? ''),
      lastName: String(payload.lastName ?? ''),
      role: this.normalizeRole(payload.role ?? roleFromRoles),
      isEmailVerified: Boolean(payload.isEmailVerified),
      phoneNumber: payload.phoneNumber ? String(payload.phoneNumber) : undefined,
      countryCode: payload.countryCode ? String(payload.countryCode) : undefined,
      avatar: payload.avatar ? String(payload.avatar) : undefined,
      userTypeId: payload.userTypeId ? Number(payload.userTypeId) : undefined,
      createdAt: String(payload.createdAt ?? ''),
      updatedAt: String(payload.updatedAt ?? ''),
    };
  }

  /**
   * Transform subscription
   */
  static transformSubscription(
    subscription: Subscription | (Partial<Subscription> & Record<string, unknown>)
  ): Subscription {
    return {
      id: String(subscription.id ?? ''),
      planName: String(subscription.planName ?? ''),
      planCode: String(subscription.planCode ?? ''),
      status: (subscription.status as Subscription['status']) ?? 'pending',
      renewalDate: String(subscription.renewalDate ?? ''),
      amount: Number(subscription.amount ?? 0),
      currency: String(subscription.currency ?? 'USD'),
    };
  }

  /**
   * Transform transaction
   */
  static transformTransaction(
    transaction: Transaction | (Partial<Transaction> & Record<string, unknown>)
  ): Transaction {
    return {
      id: String(transaction.id ?? ''),
      date: String(transaction.date ?? ''),
      status: (transaction.status as Transaction['status']) ?? 'pending',
      amount: Number(transaction.amount ?? 0),
      description: String(transaction.description ?? ''),
    };
  }

  /**
   * Transform following
   */
  static transformFollowing(
    following: Following | (Partial<Following> & Record<string, unknown>)
  ): Following {
    return {
      id: String(following.id ?? ''),
      type: (following.type as Following['type']) ?? 'team',
      name: String(following.name ?? ''),
      sport: (following.sport as Following['sport']) ?? 'all',
      league: following.league ? String(following.league) : undefined,
      imageUrl: following.imageUrl ? String(following.imageUrl) : undefined,
      isFollowing: following.isFollowing ?? true,
      notificationsEnabled: following.notificationsEnabled,
    };
  }

  /**
   * Transform notification settings
   */
  static transformNotificationSettings(
    settings: NotificationSettings | (Partial<NotificationSettings> & Record<string, unknown>)
  ): NotificationSettings {
    return {
      predictionInsights: {
        inApp: settings.predictionInsights?.inApp ?? false,
        push: settings.predictionInsights?.push ?? false,
      },
      matchUpdates: {
        inApp: settings.matchUpdates?.inApp ?? false,
        push: settings.matchUpdates?.push ?? false,
      },
      newsAlerts: {
        inApp: settings.newsAlerts?.inApp ?? false,
        push: settings.newsAlerts?.push ?? false,
      },
    };
  }
}
