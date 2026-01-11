/**
 * Profile Store
 * Client state management for profile UI
 */

import { create } from 'zustand';
import type { ProfileFilter } from './types';

interface ProfileState {
  filters: ProfileFilter;
  selectedIds: string[];
  setFilters: (filters: Partial<ProfileFilter>) => void;
  clearFilters: () => void;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

const defaultFilters: ProfileFilter = {
  page: 1,
  pageSize: 10,
};

export const useProfileStore = create<ProfileState>((set) => ({
  filters: defaultFilters,
  selectedIds: [],

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  toggleSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    })),

  selectAll: (ids) => set({ selectedIds: ids }),

  clearSelection: () => set({ selectedIds: [] }),
}));
