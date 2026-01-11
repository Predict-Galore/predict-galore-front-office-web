/**
 * UTILITY FUNCTIONS
 *
 * Centralized utility functions for the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('bg-red-500', isActive && 'bg-blue-500') // => 'bg-blue-500' if isActive
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * DATE FORMATTING UTILITIES
 */

/**
 * Format a date string to a readable date-time format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'en-GB')
 * @returns Formatted date string
 */
export function formatDateTime(dateString: string | Date, locale: string = 'en-GB'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date string to a readable date format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, locale: string = 'en-US'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date string to a readable time format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted time string
 */
export function formatTime(dateString: string | Date, locale: string = 'en-US'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * STRING MANIPULATION UTILITIES
 */

/**
 * Get initials from a full name
 * @param name - Full name string
 * @returns Initials string (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Capitalize first letter of each word
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert string to slug format
 * @param str - String to slugify
 * @returns Slug string
 */
export function slugify(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
}

/**
 * Format sport name from slug (e.g., "american-football" -> "American Football")
 * @param sportSlug - Sport slug string
 * @returns Formatted sport name
 */
export function formatSportName(sportSlug: string): string {
  if (!sportSlug || typeof sportSlug !== 'string') return '';
  return sportSlug.charAt(0).toUpperCase() + sportSlug.slice(1).replace(/-/g, ' ');
}
