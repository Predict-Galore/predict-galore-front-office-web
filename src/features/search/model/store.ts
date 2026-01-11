/**
 * SEARCH STORE
 *
 * Zustand store for search state management
 */

import { create } from 'zustand';
import type { SearchState, SearchType, SearchResult, PopularItem } from './types';

interface SearchStore extends SearchState {
  setQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setResults: (results: SearchResult[]) => void;
  setPopularItems: (items: PopularItem[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsOpen: (open: boolean) => void;
  clearSearch: () => void;
}

const initialState: SearchState = {
  query: '',
  searchType: 'all',
  results: [],
  popularItems: [],
  isLoading: false,
  isOpen: false,
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initialState,

  setQuery: (query: string) => set({ query }),

  setSearchType: (type: SearchType) => set({ searchType: type }),

  setResults: (results: SearchResult[]) => set({ results }),

  setPopularItems: (items: PopularItem[]) => set({ popularItems: items }),

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  setIsOpen: (open: boolean) => set({ isOpen: open }),

  clearSearch: () =>
    set({
      query: '',
      results: [],
      searchType: 'all',
    }),
}));
