/**
 * COMMON VALIDATION SCHEMAS
 *
 * Shared Zod schemas used across multiple features
 */

import { z } from 'zod';

/**
 * Common validation patterns
 */
export const commonPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .toLowerCase()
  .trim();

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Phone number validation schema
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(commonPatterns.phone, 'Invalid phone number format');

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .min(1, 'URL is required')
  .regex(commonPatterns.url, 'Invalid URL format');

/**
 * Slug validation schema
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(commonPatterns.slug, 'Invalid slug format')
  .max(100, 'Slug must be less than 100 characters');

/**
 * Pagination query schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

/**
 * ID parameter schema
 */
export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Search query schema
 */
export const searchSchema = z.object({
  search: z.string().min(2, 'Search term must be at least 2 characters').max(100).optional(),
});

/**
 * Date range schema
 */
export const dateRangeSchema = z
  .object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.fromDate && data.toDate) {
        return data.fromDate <= data.toDate;
      }
      return true;
    },
    {
      message: 'Start date must be before end date',
      path: ['toDate'],
    }
  );

/**
 * Common field schemas
 */
export const commonFields = {
  name: z.string().min(1, 'Name is required').max(100),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  content: z.string().min(1, 'Content is required'),
} as const;
