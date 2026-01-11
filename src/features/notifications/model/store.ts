/**
 * Notifications Store
 * Client state management for notifications UI
 */

import { create } from 'zustand';
import type { NotificationFilter } from './types';

interface NotificationState {
  filters: NotificationFilter;
  selectedIds: number[];
  setFilters: (filters: Partial<NotificationFilter>) => void;
  clearFilters: () => void;
  toggleSelection: (id: number) => void;
  selectAll: (ids: number[]) => void;
  clearSelection: () => void;
}

const defaultFilters: NotificationFilter = {
  page: 1,
  pageSize: 20,
};

export const useNotificationStore = create<NotificationState>((set) => ({
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
