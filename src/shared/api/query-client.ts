/**
 * REACT QUERY CLIENT CONFIGURATION
 *
 * Centralized React Query client setup with optimized default options
 * Optimized for performance with aggressive caching and minimal refetches
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create a new QueryClient with optimized default options
 *
 * Performance optimizations:
 * - Longer staleTime to reduce unnecessary refetches
 * - Longer gcTime (garbage collection time) to keep data in cache
 * - Disabled refetchOnWindowFocus to reduce API calls
 * - Reduced retries to fail fast
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes (reduces refetches)
        staleTime: 5 * 60 * 1000, // 5 minutes (increased from 1 minute)

        // Keep data in cache for 30 minutes (reduces re-fetching)
        gcTime: 30 * 60 * 1000, // 30 minutes (increased from 5 minutes)

        // Retry only once to fail fast
        retry: 1,

        // Disable refetch on window focus to reduce API calls
        refetchOnWindowFocus: false,

        // Only refetch on mount if data is stale
        refetchOnMount: 'always',

        // Refetch on reconnect for live data
        refetchOnReconnect: true,

        // Use stale data while refetching for better UX
        placeholderData: (previousData: unknown) => previousData,
      },
      mutations: {
        // Don't retry mutations
        retry: 0,

        // Optimistic updates disabled by default (can be enabled per mutation)
        onError: (error) => {
          console.error('Mutation error:', error);
        },
      },
    },
  });
}

/**
 * Default query client instance
 */
export const queryClient = createQueryClient();
