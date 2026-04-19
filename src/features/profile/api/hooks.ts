/**
 * Profile API Hooks
 * TanStack Query hooks for profile
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from './service';
import type { UpdateProfileRequest, ChangePasswordRequest, FollowTeamRequest } from './types';

// Get profile hook
export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['profile', 'user'],
    queryFn: () => ProfileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

// Update profile hook
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => ProfileService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', 'user'], updatedProfile);
    },
  });
}

// Get current subscription hook — calls GET /api/v1/subscriptions/me/current
export function useCurrentSubscription() {
  return useQuery({
    queryKey: ['profile', 'subscription'],
    queryFn: () => ProfileService.getCurrentSubscription(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (no subscription) or 204 (no content)
      if (error instanceof Error && 'status' in error) {
        const status = (error as { status?: number }).status;
        if (status === 404 || status === 204) return false;
      }
      return failureCount < 2;
    },
  });
}

// Get subscription plans hook
export function useSubscriptionPlans(onlyActive: boolean = true) {
  return useQuery({
    queryKey: ['profile', 'subscription-plans', onlyActive],
    queryFn: () => ProfileService.getSubscriptionPlans(onlyActive),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get subscription plan by id hook
export function useSubscriptionPlanById(planId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['profile', 'subscription-plan', planId],
    queryFn: () => ProfileService.getSubscriptionPlanById(planId as number),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: (options?.enabled ?? true) && planId !== null,
  });
}

// Get transaction history hook
export function useTransactionHistory() {
  return useQuery({
    queryKey: ['profile', 'transactions'],
    queryFn: () => ProfileService.getTransactionHistory(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Cancel subscription hook
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ProfileService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'subscription'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'transactions'] });
    },
  });
}

// Get followings hook
export function useFollowings() {
  return useQuery({
    queryKey: ['profile', 'followings'],
    queryFn: () => ProfileService.getFollowings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get all teams hook
export function useAllTeams() {
  return useQuery({
    queryKey: ['profile', 'all-teams'],
    queryFn: () => ProfileService.getAllTeams(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Follow team hook
export function useFollowTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FollowTeamRequest) => ProfileService.followTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'followings'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'all-teams'] });
    },
  });
}

// Unfollow team hook
export function useUnfollowTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: number) => ProfileService.unfollowTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'followings'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'all-teams'] });
    },
  });
}

// Update team notifications hook
export function useUpdateTeamNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, enabled }: { teamId: number; enabled: boolean }) =>
      ProfileService.updateTeamNotifications(teamId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'followings'] });
    },
  });
}

// Change password hook
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => ProfileService.changePassword(data),
  });
}

// Toggle two-factor auth hook
export function useToggleTwoFactorAuth() {
  return useMutation({
    mutationFn: (enable: boolean) => ProfileService.toggleTwoFactorAuth(enable),
  });
}

// Delete account hook
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ProfileService.deleteAccount(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['profile'] });
    },
  });
}
