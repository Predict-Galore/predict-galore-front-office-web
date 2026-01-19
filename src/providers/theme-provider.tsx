/**
 * THEME PROVIDER
 *
 * Provides Material-UI theme to the application
 */

'use client';

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';
import theme from '../../theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Memoize theme to prevent unnecessary re-renders
  const memoizedTheme = useMemo(() => theme, []);

  return (
    <MUIThemeProvider theme={memoizedTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
