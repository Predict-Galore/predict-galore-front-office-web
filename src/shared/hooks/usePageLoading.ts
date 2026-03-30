'use client';

/**
 * Compatibility shim for stale Turbopack HMR graphs.
 * Keep as no-op so route loading relies on app/loading.tsx only.
 */

export function startPageLoading(): void {
  // no-op
}

export function stopPageLoading(): void {
  // no-op
}

export function usePageLoading(): boolean {
  return false;
}
