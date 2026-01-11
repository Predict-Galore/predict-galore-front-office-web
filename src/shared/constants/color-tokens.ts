/**
 * Shared Color Tokens
 *
 * Tailwind class tokens used across features/widgets for consistent styling.
 * These are intentionally simple string maps (no runtime theme dependency).
 */

export const textColors = {
  primary: 'text-gray-900',
  secondary: 'text-gray-700',
  tertiary: 'text-gray-600',
  muted: 'text-gray-500',
  inverse: 'text-white',
} as const;

export const backgroundColors = {
  primary: 'bg-white',
  secondary: 'bg-gray-50',
  tertiary: 'bg-gray-100',
  elevated: 'bg-white',
  inverse: 'bg-gray-900',
} as const;

export const borderColors = {
  light: 'border border-gray-200',
  medium: 'border border-gray-300',
  strong: 'border border-gray-900/10',
} as const;

export const statusColors = {
  info: {
    bg: 'bg-blue-600',
    bgLight: 'bg-blue-50',
    text: 'text-blue-700',
    textDark: 'text-blue-800',
    border: 'border border-blue-200',
  },
  success: {
    bg: 'bg-green-600',
    bgLight: 'bg-green-50',
    text: 'text-green-700',
    textDark: 'text-green-800',
    border: 'border border-green-200',
  },
  warning: {
    bg: 'bg-amber-600',
    bgLight: 'bg-amber-50',
    text: 'text-amber-700',
    textDark: 'text-amber-800',
    border: 'border border-amber-200',
  },
  danger: {
    bg: 'bg-red-600',
    bgLight: 'bg-red-50',
    text: 'text-red-700',
    textDark: 'text-red-800',
    border: 'border border-red-200',
  },
  neutral: {
    bg: 'bg-gray-700',
    bgLight: 'bg-gray-100',
    text: 'text-gray-700',
    textDark: 'text-gray-900',
    border: 'border border-gray-200',
  },
} as const;

export const buttonColors = {
  primary: {
    bg: 'bg-red-600',
    text: 'text-white',
    bgHover: 'hover:bg-red-700',
    ring: 'focus-visible:ring-red-500',
  },
  secondary: {
    bg: 'bg-gray-900',
    text: 'text-white',
    bgHover: 'hover:bg-gray-800',
    ring: 'focus-visible:ring-gray-500',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-gray-900',
    bgHover: 'hover:bg-gray-50',
    ring: 'focus-visible:ring-gray-500',
  },
} as const;

// Lightweight stat tiles used on predictions dashboard
export const statColors = {
  primary: {
    bg: 'bg-gray-50',
    textLarge: 'text-gray-900',
  },
  success: {
    bg: 'bg-emerald-50',
    textLarge: 'text-emerald-700',
  },
  accent: {
    bg: 'bg-blue-50',
    textLarge: 'text-blue-700',
  },
} as const;

/**
 * Category -> Tailwind class mapping for News chips.
 * Keep this permissive to handle unknown categories gracefully.
 */
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
