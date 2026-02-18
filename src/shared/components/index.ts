/**
 * Shared Components Exports
 *
 * Central export point for all shared components and theme utilities
 */

export * from './shared';

// Re-export new design system components for easy access
export * from './ui';

// Re-export theme utilities for easy access
export {
  theme,
  useTheme,
  useBreakpoint,
  useMediaQuery,
  getCategoryColorClass,
  themeColors,
  textColors,
  backgroundColors,
  borderColors,
  statusColors,
  buttonColors,
  statColors,
  breakpoints,
  spacing,
  typography,
} from '../../providers/theme-provider';
