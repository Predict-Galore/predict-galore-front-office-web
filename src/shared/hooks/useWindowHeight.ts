/**
 * WINDOW HEIGHT HOOK
 *
 * Hook to get the current window height
 * Updates on window resize
 */
'use client';

import { useState, useEffect } from 'react';

export function useWindowHeight(): number {
  const [height, setHeight] = useState<number>(() =>
    typeof window === 'undefined' ? 0 : window.innerHeight
  );

  useEffect(() => {
    // Update height on resize
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
}
