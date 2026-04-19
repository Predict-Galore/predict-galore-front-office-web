'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, API_ENDPOINTS } from '@/shared/api';

interface Quote {
  id: number;
  text: string;
  quoteDate: string;
  generatedAt: string;
}

interface QuoteResponse {
  success: boolean;
  data: Quote | null;
}

// How often to auto-refresh the quote (5 minutes)
const QUOTE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Fetch today's quote of the day.
 * GET /api/v1/quotes/today
 *
 * Also automatically calls POST /api/v1/quotes/today/refresh every 5 minutes
 * to rotate the quote dynamically without any user interaction.
 */
export function useQuoteOfTheDay() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['quotes', 'today'],
    queryFn: async () => {
      const res = await api.get<QuoteResponse>(API_ENDPOINTS.QUOTES.TODAY);
      return res?.data ?? null;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 1,
  });

  // Auto-refresh: POST the refresh endpoint on an interval, then update the cache
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.post<QuoteResponse>(API_ENDPOINTS.QUOTES.REFRESH);
        const newQuote = res?.data ?? null;
        if (newQuote) {
          queryClient.setQueryData(['quotes', 'today'], newQuote);
        }
      } catch {
        // Silently ignore — the existing quote stays visible
      }
    };

    const intervalId = setInterval(refresh, QUOTE_REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [queryClient]);

  return query;
}
