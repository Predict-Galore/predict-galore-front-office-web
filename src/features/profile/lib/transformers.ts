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
  /**
   * Transform API response to domain model
   */
  static transformProfileUser(
    user: ProfileUser | (Partial<ProfileUser> & Record<string, unknown>)
  ): ProfileUser {
    return {
      id: String(user.id ?? ''),
      email: String(user.email ?? ''),
      firstName: String(user.firstName ?? ''),
      lastName: String(user.lastName ?? ''),
      role: (user.role as ProfileUser['role']) ?? 'user',
      isEmailVerified: Boolean(user.isEmailVerified),
      phoneNumber: user.phoneNumber ? String(user.phoneNumber) : undefined,
      countryCode: user.countryCode ? String(user.countryCode) : undefined,
      avatar: user.avatar ? String(user.avatar) : undefined,
      userTypeId: user.userTypeId ? Number(user.userTypeId) : undefined,
      createdAt: String(user.createdAt ?? ''),
      updatedAt: String(user.updatedAt ?? ''),
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
