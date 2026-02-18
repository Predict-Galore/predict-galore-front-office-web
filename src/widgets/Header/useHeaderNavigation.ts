'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchResult } from '@/features/search/model/types';

export function useHeaderNavigation() {
  const router = useRouter();

  return useCallback(
    (result: SearchResult) => {
      switch (result.type) {
        case 'teams':
          router.push(`/teams/${result.id}`);
          break;
        case 'players':
          router.push(`/players/${result.id}`);
          break;
        case 'leagues':
          router.push(`/leagues/${result.id}`);
          break;
        case 'matches':
          router.push(`/matches/${result.id}`);
          break;
        default:
          break;
      }
    },
    [router]
  );
}
