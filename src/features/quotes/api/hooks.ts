'use client';

import { useQuery } from '@tanstack/react-query';
import { api, API_ENDPOINTS } from '@/shared/api';

interface QuoteResponse {
  success: boolean;
  data: {
    id: number;
    text: string;
    quoteDate: string;
    generatedAt: string;
  } | null;
}

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
