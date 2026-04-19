'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

/**
 * Fetch today's quote of the day.
 * GET /api/v1/quotes/today
 */
export function useQuoteOfTheDay() {
  return useQuery({
    queryKey: ['quotes', 'today'],
    queryFn: async () => {
      const res = await api.get<QuoteResponse>(API_ENDPOINTS.QUOTES.TODAY);
      return res?.data ?? null;
    },
    staleTime: 60 * 60 * 1000, // 1 hour — quote only changes daily
    gcTime: 2 * 60 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Refresh today's quote.
 * POST /api/v1/quotes/today/refresh
 * On success the cached quote is replaced with the new one.
 */
export function useRefreshQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post<QuoteResponse>(API_ENDPOINTS.QUOTES.REFRESH);
      return res?.data ?? null;
    },
    onSuccess: (newQuote) => {
      // Update the cache so the banner re-renders immediately with the new quote
      queryClient.setQueryData(['quotes', 'today'], newQuote);
    },
  });
}
