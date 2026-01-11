/**
 * PREDICTIONS STORE
 *
 * Client state management for predictions UI
 */

import { create } from 'zustand';
import type { Sport, League, PredictionFilter } from './types';

interface PredictionState {
  // Selected filters
  filters: PredictionFilter;
  selectedSport: Sport | null;
  selectedLeague: League | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setFilters: (filters: Partial<PredictionFilter>) => void;
  clearFilters: () => void;
  setSelectedSport: (sport: Sport | null) => void;
  setSelectedLeague: (league: League | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
}

const defaultFilters: PredictionFilter = {
  page: 1,
  pageSize: 20,
  status: 'Prediction',
};

export const usePredictionStore = create<PredictionState>((set) => ({
  // Initial state
  filters: defaultFilters,
  selectedSport: null,
  selectedLeague: null,
  isLoading: false,
  error: null,

  // Actions
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  setSelectedSport: (selectedSport) => {
    set({ selectedSport, selectedLeague: null }); // Clear league when sport changes
    set((state) => ({
      filters: { ...state.filters, sportId: selectedSport?.id, leagueId: undefined, page: 1 },
    }));
  },

  setSelectedLeague: (selectedLeague) => {
    set({ selectedLeague });
    set((state) => ({
      filters: { ...state.filters, leagueId: selectedLeague?.id, page: 1 },
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearState: () =>
    set({
      filters: defaultFilters,
      selectedSport: null,
      selectedLeague: null,
      isLoading: false,
      error: null,
    }),
}));
