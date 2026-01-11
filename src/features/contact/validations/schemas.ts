/**
 * Contact Validation Schemas
 * Zod schemas for form validation
 */

import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .max(100, {
      message: 'Name must not exceed 100 characters',
    })
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Name is required',
    }),

  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Email is required',
    }),

  subject: z
    .string()
    .min(1, {
      message: 'Subject is required',
    })
    .max(200, {
      message: 'Subject must not exceed 200 characters',
    })
    .trim(),

  message: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters',
    })
    .max(5000, {
      message: 'Message must not exceed 5000 characters',
    })
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Message is required',
    }),

  phoneNumber: z
    .string()
    .min(1, {
      message: 'Phone number is required',
    })
    .max(20, {
      message: 'Phone number must not exceed 20 characters',
    })
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Phone number is required',
    }),
});

// ContactFormData is defined in model/types.ts to avoid duplicate exports
// This schema matches the model type
export type ContactFormDataFromSchema = z.infer<typeof contactFormSchema>;
