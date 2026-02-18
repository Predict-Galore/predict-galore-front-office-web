/**
 * LIVE MATCHES STORE
 *
 * Client state management for live matches UI
 */

import { create } from 'zustand';
import type { Match, DetailedLiveMatch, LiveSection, LiveTab } from './types';

interface LiveMatchesState {
  // State
  activeSport: string;
  activeTab: LiveTab;
  sections: LiveSection[];
  liveViewers: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  expandedSections: Record<string, boolean>;
  selectedLiveMatch: Match | null;
  detailedLiveMatch: DetailedLiveMatch | null;

  // Actions
  setActiveSport: (sport: string) => void;
  setActiveTab: (tab: LiveTab) => void;
  setSections: (sections: LiveSection[]) => void;
  setLiveViewers: (viewers: number) => void;
  setLastUpdated: (date: Date) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSection: (sectionId: string) => void;
  updateLiveDashboard: (data: {
    sections?: LiveSection[];
    liveViewers?: number;
    lastUpdated?: Date;
  }) => void;
  clearError: () => void;
  refreshLiveData: () => void;
  selectLiveMatch: (match: Match) => void;
  setDetailedLiveMatch: (match: DetailedLiveMatch | null) => void;
  clearSelectedLiveMatch: () => void;
}

export const useLiveMatchesStore = create<LiveMatchesState>((set) => ({
  // Initial state (use 'all' until API/sports are loaded)
  activeSport: 'all',
  activeTab: 'live-matches',
  sections: [],
  liveViewers: 0,
  lastUpdated: null,
  isLoading: false,
  error: null,
  expandedSections: {
    'live-now': true,
    'in-play': true,
    'full-time': false,
  },
  selectedLiveMatch: null,
  detailedLiveMatch: null,

  // Actions
  setActiveSport: (sport) => set({ activeSport: sport }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSections: (sections) => set({ sections }),
  setLiveViewers: (viewers) => set({ liveViewers: viewers }),
  setLastUpdated: (date) => set({ lastUpdated: date }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  toggleSection: (sectionId) =>
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [sectionId]: !state.expandedSections[sectionId],
      },
    })),

  updateLiveDashboard: (data) =>
    set((state) => ({
      sections: data.sections !== undefined ? data.sections : state.sections,
      liveViewers: data.liveViewers !== undefined ? data.liveViewers : state.liveViewers,
      lastUpdated: data.lastUpdated !== undefined ? data.lastUpdated : state.lastUpdated,
    })),

  clearError: () => set({ error: null }),

  refreshLiveData: () => set({ lastUpdated: new Date() }),

  selectLiveMatch: (match) =>
    set({
      selectedLiveMatch: match,
      detailedLiveMatch: match.detailedLiveMatch || null,
    }),

  setDetailedLiveMatch: (match) => set({ detailedLiveMatch: match }),

  clearSelectedLiveMatch: () =>
    set({
      selectedLiveMatch: null,
      detailedLiveMatch: null,
    }),
}));

// Export selectors
export const useSelectedLiveMatch = () => useLiveMatchesStore((state) => state.selectedLiveMatch);
export const useDetailedLiveMatch = () => useLiveMatchesStore((state) => state.detailedLiveMatch);
