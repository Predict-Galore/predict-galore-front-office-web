/**
 * IMAGE UTILITIES
 *
 * Utility functions for handling images throughout the application
 */

import { IMAGES } from '@/shared/constants/images';

/**
 * Validates if an image URL is from an allowed source (local assets only)
 * @param url - The image URL to validate
 * @returns boolean - true if URL is valid (local), false otherwise
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;

  // Only allow local assets (starting with /)
  return url.startsWith('/');
};

/**
 * Gets a safe image URL, falling back to placeholder if invalid
 * @param url - The image URL to validate
 * @param fallback - Optional fallback image path
 * @returns string - Safe image URL
 */
export const getSafeImageUrl = (
  url: string | null | undefined,
  fallback: string = IMAGES.PLACEHOLDERS.NEWS_ARTICLE
): string => {
  if (isValidImageUrl(url)) {
    return url!;
  }
  return fallback;
};

/**
 * Gets a safe news image URL - uses backend URL directly without fallback
 * @param imageUrl - The news image URL from backend
 * @returns string - The image URL or empty string if not provided
 */
export const getSafeNewsImageUrl = (imageUrl: string | null | undefined): string => {
  return imageUrl || '';
};

/**
 * Checks if an image URL is external (not from our configured domains)
 * @param url - The image URL to check
 * @returns boolean - true if external, false if from configured domains
 */
export const isExternalImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;

  // Local images (relative paths)
  if (url.startsWith('/')) return false;

  // Check if it's localhost
  if (url.includes('localhost') || url.includes('127.0.0.1')) return false;

  // Check if it's from our API hostname
  if (url.includes('apidev.predictgalore.com') || url.includes('predictgalore.com')) return false;

  // Check if it starts with http:// or https:// (external URL)
  if (url.startsWith('http://') || url.startsWith('https://')) return true;

  // Default to false for safety
  return false;
};

/**
 * Gets a safe player avatar URL
 * @param avatarUrl - The player avatar URL
 * @returns string - Safe player avatar URL
 */
export const getSafePlayerAvatarUrl = (avatarUrl: string | null | undefined): string => {
  return getSafeImageUrl(avatarUrl, IMAGES.PLACEHOLDERS.PLAYER_AVATAR);
};

/**
 * Gets a safe league logo URL
 * @param logoUrl - The league logo URL
 * @returns string - Safe league logo URL
 */
export const getSafeLeagueLogoUrl = (logoUrl: string | null | undefined): string => {
  return getSafeImageUrl(logoUrl, IMAGES.PLACEHOLDERS.LEAGUE_LOGO);
};
