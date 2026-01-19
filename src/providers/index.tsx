/**
 * PROVIDERS
 *
 * Combined provider component
 */

'use client';

import { ReactNode } from 'react';
import QueryProvider from './query-provider';
import ToastProvider from './toast-provider';
import ThemeProvider from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </ToastProvider>
    </QueryProvider>
  );
}