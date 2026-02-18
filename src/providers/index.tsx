'use client';

import { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import QueryProvider from './query-provider';
import ToastProvider from './toast-provider';
import ThemeProvider from './theme-provider';
import { AuthInitializer } from '@/features/auth/components';
import muiTheme from '../../theme';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider>
        {/* Custom design-system ThemeProvider for CSS variables & tokens */}
        <ThemeProvider>
          {/* MUI ThemeProvider for component-level theming (buttons, inputs, etc.) */}
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <AuthInitializer>
              {children}
            </AuthInitializer>
          </MuiThemeProvider>
        </ThemeProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
