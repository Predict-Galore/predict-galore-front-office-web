/**
 * LOCAL STORAGE HOOK
 *
 * Custom React hook for managing state that persists to localStorage.
 * Provides synchronization between React state and browser storage.
 */
import { useState, useEffect } from 'react';
import { createLogger } from '@/shared/api/logger';

const logger = createLogger('useLocalStorage');

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Get stored value or use initial value
  const readValue = (): T => {
    // Prevent SSR issues
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      // Handle empty or null values
      if (!item || item.trim() === '') {
        return initialValue;
      }

      return JSON.parse(item);
    } catch (error) {
      logger.warn('Error reading localStorage', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue: SetValue<T> = (value) => {
    try {
      // Allow value to be a function for consistency with useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save to state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      logger.warn('Error setting localStorage', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          // Handle empty values
          if (event.newValue.trim() === '') {
            setStoredValue(initialValue);
            return;
          }
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          logger.warn('Error parsing storage event value', {
            key,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
