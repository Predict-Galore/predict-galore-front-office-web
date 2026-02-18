/**
 * Development Authentication Helpers
 * 
 * Utilities for testing authentication flows in development
 */

import { useAuthStore } from '../model/store';

declare global {
  interface Window {
    simulateLogin?: () => void;
    simulateLogout?: () => void;
    checkAuthState?: () => void;
  }
}

/**
 * Mock user data for development testing
 */
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  isEmailVerified: true,
  role: 'user' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Simulate login for development testing
 * Call this function in the browser console or add a button to trigger it
 */
export const simulateLogin = () => {
  if (typeof window === 'undefined') {
    console.warn('simulateLogin can only be called in the browser');
    return;
  }

  const { login } = useAuthStore.getState();
  
  // Update auth store
  login(mockUser, null);
  
  console.log('✅ Simulated login successful', { user: mockUser });
  console.log('🔄 Refresh the page to see the authentication state');
};

/**
 * Simulate logout for development testing
 */
export const simulateLogout = () => {
  if (typeof window === 'undefined') {
    console.warn('simulateLogout can only be called in the browser');
    return;
  }

  const { logout } = useAuthStore.getState();
  
  // Update auth store
  logout();
  
  console.log('✅ Simulated logout successful');
  console.log('🔄 Refresh the page to see the authentication state');
};

/**
 * Check current authentication state
 */
export const checkAuthState = () => {
  if (typeof window === 'undefined') {
    console.warn('checkAuthState can only be called in the browser');
    return;
  }

  const state = useAuthStore.getState();
  
  console.log('🔍 Current Authentication State:', {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  });
  
  return state;
};

// Make functions available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.simulateLogin = simulateLogin;
  window.simulateLogout = simulateLogout;
  window.checkAuthState = checkAuthState;
  
  console.log('🔧 Development auth helpers available:');
  console.log('  - simulateLogin() - Log in with mock user');
  console.log('  - simulateLogout() - Log out current user');
  console.log('  - checkAuthState() - Check current auth state');
}

export {};
