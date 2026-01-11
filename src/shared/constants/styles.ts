/**
 * Shared Style Tokens
 *
 * NOTE: These are Tailwind class tokens used by several dashboard feature components.
 * Keep them small and stable; prefer using MUI theme tokens for new code.
 */

export const spacing = {
  section: {
    base: 'py-6 sm:py-8 md:py-10',
    marginBottom: 'mb-4 sm:mb-5 md:mb-6',
  },
} as const;

export const borderRadius = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  pill: 'rounded-full',
} as const;

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
} as const;

export const card = {
  base: `bg-white border border-gray-200 ${borderRadius.md} ${shadows.sm}`,
  padded: `bg-white border border-gray-200 ${borderRadius.md} p-4 sm:p-5 md:p-6 ${shadows.md}`,
} as const;

export const text = {
  heading: {
    h2: 'text-2xl sm:text-3xl font-bold text-gray-900',
    h3: 'text-xl sm:text-2xl font-bold text-gray-900',
    h4: 'text-lg sm:text-xl font-semibold text-gray-900',
    h5: 'text-base sm:text-lg font-semibold text-gray-900',
    h6: 'text-sm sm:text-base font-semibold text-gray-900',
  },
  body: {
    large: 'text-base text-gray-800',
    medium: 'text-sm sm:text-base text-gray-700',
    small: 'text-xs sm:text-sm text-gray-600',
  },
} as const;

export const layout = {
  container: 'mx-auto w-full',
} as const;
