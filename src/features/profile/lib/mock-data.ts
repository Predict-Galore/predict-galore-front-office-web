import type {
  Following,
  NotificationSettings,
  ProfileUser,
  Subscription,
  Transaction,
} from '../model/types';
import type { UpdateProfileRequest } from '../api/types';

export const mockProfileUser: ProfileUser = {
  id: 'user-1',
  email: 'mock.user@predictgalore.com',
  firstName: 'Alex',
  lastName: 'Morgan',
  phoneNumber: '+1 555-0110',
  countryCode: '+1',
  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
};

export const mockSubscription: Subscription = {
  id: 'sub-1',
  planName: 'Predict Pro',
  planCode: 'PRO-MONTHLY',
  status: 'active',
  renewalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  amount: 14.99,
  currency: 'USD',
};

export const mockPlans = [
  {
    id: 1,
    name: 'Predict Pro',
    planCode: 'PRO-MONTHLY',
    amount: 14.99,
    duration: 30,
    isActive: true,
  },
  {
    id: 2,
    name: 'Predict Pro Annual',
    planCode: 'PRO-ANNUAL',
    amount: 119.99,
    duration: 365,
    isActive: true,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    date: new Date().toISOString(),
    status: 'successful',
    amount: 14.99,
    description: 'Monthly subscription',
  },
  {
    id: 'tx-2',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'successful',
    amount: 14.99,
  },
];

export const mockFollowings: Following[] = [
  {
    id: '42',
    type: 'team',
    name: 'Arsenal',
    sport: 'soccer',
    league: 'Premier League',
    imageUrl: 'https://media.api-sports.io/football/teams/42.png',
    isFollowing: true,
    notificationsEnabled: true,
  },
  {
    id: '529',
    type: 'team',
    name: 'Barcelona',
    sport: 'soccer',
    league: 'La Liga',
    imageUrl: 'https://media.api-sports.io/football/teams/529.png',
    isFollowing: false,
    notificationsEnabled: false,
  },
];

export const mockNotificationSettings: NotificationSettings = {
  predictionInsights: { inApp: true, push: true },
  matchUpdates: { inApp: true, push: false },
  newsAlerts: { inApp: true, push: true },
};

export const updateMockProfile = (data: UpdateProfileRequest): ProfileUser => ({
  ...mockProfileUser,
  ...data,
});
