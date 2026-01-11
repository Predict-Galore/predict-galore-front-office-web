/**
 * NEWS STORE
 *
 * Client state management for news UI
 */

import { create } from 'zustand';
import type { NewsFilter } from './types';

interface NewsState {
  // Filters
  filters: NewsFilter;
  selectedCategory: string;
  selectedSport: string;
  bookmarkedNews: Set<number>;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setFilters: (filters: Partial<NewsFilter>) => void;
  clearFilters: () => void;
  setSelectedCategory: (category: string) => void;
  setSelectedSport: (sport: string) => void;
  toggleBookmark: (newsId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
}

const defaultFilters: NewsFilter = {
  page: 1,
  pageSize: 10,
};

export const useNewsStore = create<NewsState>((set) => ({
  // Initial state
  filters: defaultFilters,
  selectedCategory: 'all',
  selectedSport: 'all',
  bookmarkedNews: new Set(),
  isLoading: false,
  error: null,

  // Actions
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    set((state) => ({
      filters: { ...state.filters, category, page: 1 },
    }));
  },

  setSelectedSport: (sport) => {
    set({ selectedSport: sport });
    set((state) => ({
      filters: { ...state.filters, sport, page: 1 },
    }));
  },

  toggleBookmark: (newsId) =>
    set((state) => {
      const newBookmarks = new Set(state.bookmarkedNews);

      if (newBookmarks.has(newsId)) {
        newBookmarks.delete(newsId);
      } else {
        newBookmarks.add(newsId);
      }

      return { bookmarkedNews: newBookmarks };
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearState: () =>
    set({
      filters: defaultFilters,
      selectedCategory: 'all',
      selectedSport: 'all',
      bookmarkedNews: new Set(),
      isLoading: false,
      error: null,
    }),
}));
