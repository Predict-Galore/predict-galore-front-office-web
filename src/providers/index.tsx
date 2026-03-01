'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import QueryProvider from './query-provider';
import ToastProvider from './toast-provider';
import ThemeProvider from './theme-provider';
import { AuthInitializer } from '@/features/auth/components';
import muiTheme from '../../theme';

interface ProvidersProps {
  children: ReactNode;
}

const PUBLIC_ROUTES = new Set([
  '/',
  '/landing-page',
  '/contact-us',
  '/terms',
  '/coming-soon',
  '/design-system',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-otp',
]);

export default function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const skipAuthInitialization = pathname ? PUBLIC_ROUTES.has(pathname) : false;

  return (
    <QueryProvider>
      <ToastProvider>
        {/* Custom design-system ThemeProvider for CSS variables & tokens */}
        <ThemeProvider>
          {/* MUI ThemeProvider for component-level theming (buttons, inputs, etc.) */}
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            {skipAuthInitialization ? children : <AuthInitializer>{children}</AuthInitializer>}
          </MuiThemeProvider>
        </ThemeProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
