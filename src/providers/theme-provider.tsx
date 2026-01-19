/**
 * THEME PROVIDER
 *
 * Provides Material-UI theme to the application with proper SSR support
 */

'use client';

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { useMemo } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';
import type { EmotionCache } from '@emotion/cache';
import theme from '../../theme';

// Create emotion cache for SSR
function createEmotionCache(): EmotionCache {
  return createCache({ key: 'mui' });
}

// Client-side cache, shared across the whole session
const clientSideEmotionCache = createEmotionCache();

interface ThemeProviderProps {
  children: React.ReactNode;
  emotionCache?: EmotionCache;
}

export default function ThemeProvider({
  children,
  emotionCache = clientSideEmotionCache
}: ThemeProviderProps) {
  // Memoize theme to prevent unnecessary re-renders
  const memoizedTheme = useMemo(() => theme, []);

  return (
    <CacheProvider value={emotionCache}>
      <MUIThemeProvider theme={memoizedTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </CacheProvider>
  );
}

// Hook to create emotion cache for SSR
export function useEmotionCache() {
  const cache = useMemo(() => {
    const cache = createEmotionCache();
    cache.compat = true;
    return cache;
  }, []);

  useServerInsertedHTML(() => {
    const names = cache.inserted;
    cache.inserted.clear();
    if (names.size === 0) return null;

    const styles = [];
    for (const name of names) {
      styles.push(cache.inserted[name]);
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${Array.from(names).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles.join(' '),
        }}
      />
    );
  });

  return cache;
}
