/**
 * Contact Store
 * Client state management for contact UI
 */

import { create } from 'zustand';
import type { ContactFormData } from './types';

interface ContactState {
  formData: ContactFormData;
  selectedIds: string[];
  setFormData: (data: Partial<ContactFormData>) => void;
  clearForm: () => void;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

const defaultFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  phoneNumber: '',
};

export const useContactStore = create<ContactState>((set) => ({
  formData: defaultFormData,
  selectedIds: [],

  setFormData: (newData) =>
    set((state) => ({
      formData: { ...state.formData, ...newData },
    })),

  clearForm: () => set({ formData: defaultFormData }),

  toggleSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    })),

  selectAll: (ids) => set({ selectedIds: ids }),

  clearSelection: () => set({ selectedIds: [] }),
}));
