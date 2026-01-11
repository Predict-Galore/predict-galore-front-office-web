/**
 * Fallback remote images for when external assets are missing or 404.
 * These come from Unsplash (free) and are stable IDs.
 */
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

export const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80';

export const getFallbackImage = (size: 'full' | 'thumb' = 'full') =>
  size === 'thumb' ? FALLBACK_THUMB : FALLBACK_IMAGE;
