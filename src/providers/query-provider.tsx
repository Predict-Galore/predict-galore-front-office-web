// src/providers/query-provider.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { createQueryClient } from '@/shared/api/query-client';
import dynamic from 'next/dynamic';

// Fix: Simplify the dynamic import
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((mod) => ({ default: mod.ReactQueryDevtools })),
  { ssr: false }
);

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Ensure this state initialization is clean
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}