// src/features/auth/model/store.ts
import { create } from 'zustand';
import type { User } from '@/shared/types';
import { clearAuthCookie } from '../lib/utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User, token?: string | null) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user: User, token?: string | null) => {
    void token;
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    clearAuthCookie();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

// Simple selector hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
