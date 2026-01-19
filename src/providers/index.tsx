/**
 * PROVIDERS
 *
 * Combined provider component with proper SSR support
 */

'use client';

import { ReactNode } from 'react';
import QueryProvider from './query-provider';
import ToastProvider from './toast-provider';
import ThemeProvider, { useEmotionCache } from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const emotionCache = useEmotionCache();

  return (
    <QueryProvider>
      <ToastProvider>
        <ThemeProvider emotionCache={emotionCache}>
          {children}
        </ThemeProvider>
      </ToastProvider>
    </QueryProvider>
  );
}