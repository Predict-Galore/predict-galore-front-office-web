/**
 * Contact API Hooks
 * TanStack Query hooks for contact
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContactService } from './service';
import type { ContactFormData } from './types';

// Get contact info hook
export function useContactInfo() {
  return useQuery({
    queryKey: ['contact-info'],
    queryFn: () => ContactService.getContactInfo(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Submit contact form hook
export function useSubmitContactForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactFormData) => ContactService.submitContactForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}
