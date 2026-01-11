/**
 * MEDIA QUERY HOOK
 *
 * Custom React hook for responsive design that tracks media query matches.
 * Useful for conditional rendering based on screen size.
 */
import { useState, useEffect } from 'react';

type MediaQuery = string | string[];

export function useMediaQuery(query: MediaQuery): boolean | boolean[] {
  // Convert single query to array for uniform handling
  const queries = Array.isArray(query) ? query : [query];

  // Initialize with current matches
  const getMatches = (): boolean[] => {
    if (typeof window !== 'undefined') {
      return queries.map((q) => window.matchMedia(q).matches);
    }
    return queries.map(() => false);
  };

  const [matches, setMatches] = useState<boolean[]>(getMatches);

  useEffect(() => {
    // Function to update matches
    const updateMatches = () => {
      setMatches(getMatches());
    };

    // Set initial matches
    updateMatches();

    // Create MediaQueryList objects and add listeners
    const mediaQueryLists = queries.map((q) => window.matchMedia(q));
    const listeners = mediaQueryLists.map((mql, index) => {
      const listener = () => {
        setMatches((prev) => {
          const newMatches = [...prev];
          newMatches[index] = mql.matches;
          return newMatches;
        });
      };
      mql.addEventListener('change', listener);
      return listener;
    });

    // Clean up listeners
    return () => {
      mediaQueryLists.forEach((mql, index) => {
        mql.removeEventListener('change', listeners[index]);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries.join()]); // Re-run effect when queries change

  // Return single boolean for single query, array for multiple queries
  return Array.isArray(query) ? matches : matches[0];
}

// Common media query breakpoints
export const BREAKPOINTS = {
  SM: '(min-width: 640px)',
  MD: '(min-width: 768px)',
  LG: '(min-width: 1024px)',
  XL: '(min-width: 1280px)',
  XXL: '(min-width: 1536px)',
} as const;
