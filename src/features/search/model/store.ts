/**
 * SEARCH STORE
 * Simplified Zustand store for search state management
 */

import { create } from 'zustand';
import type { SearchType } from './types';

interface SearchStore {
  query: string;
  searchType: SearchType;
  isOpen: boolean;
  isLoading: boolean;
  setQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  searchType: 'all',
  isOpen: false,
  isLoading: false,

  setQuery: (query: string) => set({ query }),

  setSearchType: (type: SearchType) => set({ searchType: type }),

  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  clearSearch: () => set({ query: '', searchType: 'all' }),
}));