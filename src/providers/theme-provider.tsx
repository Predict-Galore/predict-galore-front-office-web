/**
 * COMPREHENSIVE THEME PROVIDER
 *
 * Consolidated theme system with colors, tokens, and utilities
 * Provides theme via CSS custom properties (SSR-safe) and utility functions
 */

'use client';

import React, { ReactNode, createContext, useContext } from 'react';

// Core theme colors - Exact Figma palette
export const themeColors = {
  primary: {
    main: '#36b15e', // green-500 from Figma
    light: '#5ccc80', // green-400
    dark: '#22733d', // green-700
    contrastText: '#fff',
  },
  secondary: {
    main: '#ec4751', // coolRed-500 from Figma
    light: '#f5777b', // coolRed-400
    dark: '#b61a2e', // coolRed-700
    contrastText: '#fff',
  },
  // Exact Figma neutral/grayscale palette
  neutral: {
    0: '#ffffff',
    50: '#f7f7f8',
    100: '#eeeef0',
    200: '#d9d9de',
    300: '#b8b9c1',
    400: '#91939f',
    500: '#737584',
    600: '#5d5e6c',
    700: '#4c4d58',
    800: '#41414b',
    900: '#393941',
    950: '#101012',
  },
  // Warm Red/Orange palette from Figma
  warmRed: {
    50: '#fefde8',
    100: '#fffcc2',
    200: '#fff687',
    300: '#ffe943',
    400: '#ffd60a',
    500: '#efbe03',
    600: '#ce9300',
    700: '#a46804',
    800: '#88510b',
    900: '#734210',
    950: '#432205',
  },
  // Cool Red/Pink palette from Figma
  coolRed: {
    50: '#fef2f2',
    100: '#fee6e5',
    200: '#fccfd0',
    300: '#f9a8a8',
    400: '#f5777b',
    500: '#ec4751',
    600: '#d72638',
    700: '#b61a2e',
    800: '#98192d',
    900: '#83182c',
    950: '#490812',
  },
  // Green palette from Figma
  green: {
    50: '#f2fbf5',
    100: '#e0f8e7',
    200: '#c2f0d0',
    300: '#93e2ad',
    400: '#5ccc80',
    500: '#36b15e',
    600: '#28914b',
    700: '#22733d',
    800: '#1e5631',
    900: '#1c4b2d',
    950: '#0a2916',
  },
};

// Text color tokens - Using Figma neutral palette
export const textColors = {
  primary: themeColors.neutral[900], // #393941
  secondary: themeColors.neutral[600], // #5d5e6c
  tertiary: themeColors.neutral[500], // #737584
  muted: themeColors.neutral[400], // #91939f
  inverse: '#ffffff', // white
} as const;

// Background color tokens - Using Figma neutral palette
export const backgroundColors = {
  primary: themeColors.neutral[0], // #ffffff
  secondary: themeColors.neutral[50], // #f7f7f8
  tertiary: themeColors.neutral[100], // #eeeef0
  elevated: themeColors.neutral[0], // #ffffff
  inverse: themeColors.neutral[950], // #101012
} as const;

// Border color tokens - Using Figma neutral palette
export const borderColors = {
  light: themeColors.neutral[200], // #d9d9de
  medium: themeColors.neutral[300], // #b8b9c1
  strong: `${themeColors.neutral[900]}1a`, // #393941 with 10% opacity
} as const;

// Status color tokens - Using exact Figma colors
export const statusColors = {
  info: {
    bg: themeColors.neutral[600], // #5d5e6c
    bgLight: themeColors.neutral[100], // #eeeef0
    text: themeColors.neutral[700], // #4c4d58
    textDark: themeColors.neutral[800], // #41414b
    border: themeColors.neutral[200], // #d9d9de
  },
  success: {
    bg: themeColors.green[500], // #36b15e
    bgLight: themeColors.green[100], // #e0f8e7
    text: themeColors.green[700], // #22733d
    textDark: themeColors.green[800], // #1e5631
    border: themeColors.green[200], // #c2f0d0
  },
  warning: {
    bg: themeColors.warmRed[500], // #efbe03
    bgLight: themeColors.warmRed[100], // #fffcc2
    text: themeColors.warmRed[700], // #a46804
    textDark: themeColors.warmRed[800], // #88510b
    border: themeColors.warmRed[200], // #fff687
  },
  danger: {
    bg: themeColors.coolRed[500], // #ec4751
    bgLight: themeColors.coolRed[100], // #fee6e5
    text: themeColors.coolRed[700], // #b61a2e
    textDark: themeColors.coolRed[800], // #98192d
    border: themeColors.coolRed[200], // #fccfd0
  },
  neutral: {
    bg: themeColors.neutral[700], // #4c4d58
    bgLight: themeColors.neutral[100], // #eeeef0
    text: themeColors.neutral[700], // #4c4d58
    textDark: themeColors.neutral[900], // #393941
    border: themeColors.neutral[200], // #d9d9de
  },
} as const;

// Button color tokens
export const buttonColors = {
  primary: {
    bg: '#dc2626', // red-600
    text: '#ffffff', // white
    bgHover: '#b91c1c', // red-700
    ring: '#ef4444', // red-500
  },
  secondary: {
    bg: '#111827', // gray-900
    text: '#ffffff', // white
    bgHover: '#1f2937', // gray-800
    ring: '#6b7280', // gray-500
  },
  outline: {
    bg: 'transparent', // transparent
    text: '#111827', // gray-900
    bgHover: '#f9fafb', // gray-50
    ring: '#6b7280', // gray-500
  },
} as const;

// Stat color tokens
export const statColors = {
  primary: {
    bg: '#f9fafb', // gray-50
    textLarge: '#111827', // gray-900
  },
  success: {
    bg: '#ecfdf5', // emerald-50
    textLarge: '#047857', // emerald-700
  },
  accent: {
    bg: '#eff6ff', // blue-50
    textLarge: '#1d4ed8', // blue-700
  },
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Spacing scale
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

// Typography scale
export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// Complete theme object
export const theme = {
  colors: themeColors,
  textColors,
  backgroundColors,
  borderColors,
  statusColors,
  buttonColors,
  statColors,
  breakpoints,
  spacing,
  typography,
} as const;

// Theme context
const ThemeContext = createContext(theme);

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility function for category colors (from color-tokens.ts)
export function getCategoryColorClass(category: string): string {
  const key = (category || '').trim().toLowerCase();

  if (key.includes('breaking')) return 'bg-red-100 text-red-800 border border-red-200';
  if (key.includes('transfer')) return 'bg-amber-100 text-amber-800 border border-amber-200';
  if (key.includes('injury')) return 'bg-purple-100 text-purple-800 border border-purple-200';
  if (key.includes('match')) return 'bg-blue-100 text-blue-800 border border-blue-200';
  if (key.includes('analysis')) return 'bg-green-100 text-green-800 border border-green-200';
  if (key.includes('prediction')) return 'bg-green-100 text-green-800 border border-green-200';

  return 'bg-gray-100 text-gray-800 border border-gray-200';
}

// Media query hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Responsive breakpoint hooks
export const useBreakpoint = () => {
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const is2Xl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
  };
};

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Inject CSS custom properties for theme colors - SSR safe
  const cssVariables = {
    '--theme-primary-main': themeColors.primary.main,
    '--theme-primary-light': themeColors.primary.light,
    '--theme-primary-dark': themeColors.primary.dark,
    '--theme-secondary-main': themeColors.secondary.main,
    '--theme-secondary-light': themeColors.secondary.light,
    '--theme-secondary-dark': themeColors.secondary.dark,
    '--theme-neutral-0': themeColors.neutral[0],
    '--theme-neutral-50': themeColors.neutral[50],
    '--theme-neutral-100': themeColors.neutral[100],
    '--theme-neutral-200': themeColors.neutral[200],
    '--theme-neutral-300': themeColors.neutral[300],
    '--theme-neutral-400': themeColors.neutral[400],
    '--theme-neutral-500': themeColors.neutral[500],
    '--theme-neutral-600': themeColors.neutral[600],
    '--theme-neutral-700': themeColors.neutral[700],
    '--theme-neutral-800': themeColors.neutral[800],
    '--theme-neutral-900': themeColors.neutral[900],
    '--theme-neutral-950': themeColors.neutral[950],
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider value={theme}>
      <div style={cssVariables}>{children}</div>
    </ThemeContext.Provider>
  );
}
