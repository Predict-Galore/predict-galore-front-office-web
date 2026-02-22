/**
 * Search Bar Component
 * Professional search input with dropdown functionality
 * 
 * @component
 * @description A search input component that displays a dropdown with search results.
 * Supports keyboard navigation, outside click detection, and clear functionality.
 */

'use client';

import React, { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, Close } from '@mui/icons-material';
import { Box, InputBase, IconButton, InputAdornment } from '@mui/material';
import SearchDropdown from './SearchDropdown';
import type { SearchResult } from '../model/types';

/**
 * Props for the SearchBar component
 */
interface SearchBarProps {
  /** Callback when search query changes */
  onSearch?: (query: string) => void;
  /** Callback when a search result is clicked */
  onResultClick?: (result: SearchResult) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Visual variant of the search bar */
  variant?: 'default' | 'header';
  /** Optional CSS class name */
  className?: string;
}

/**
 * SearchBar Component
 * 
 * Provides a search input with dropdown results.
 * Automatically opens dropdown when typing or focusing.
 * Supports keyboard shortcuts and outside click detection.
 * 
 * @example
 * ```tsx
 * <SearchBar
 *   onSearch={(query) => console.log(query)}
 *   onResultClick={(result) => navigate(result.url)}
 *   placeholder="Search for players, teams..."
 * />
 * ```
 */
const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>((
  {
    onSearch,
    onResultClick,
    placeholder = 'Search for a player, team, club, league',
    variant = 'default',
    className,
  },
  ref
) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  /**
   * Handles input value changes
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      
      // Open dropdown when typing or show popular items when empty
      setIsOpen(true);

      onSearch?.(value);
    },
    [onSearch]
  );

  /**
   * Clears the search input and closes dropdown
   */
  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
    onSearch?.('');
  }, [onSearch]);

  /**
   * Opens dropdown when input is focused
   */
  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Handles result click from dropdown
   */
  const handleResultClick = useCallback((result: SearchResult) => {
    onResultClick?.(result);
    setIsOpen(false);
  }, [onResultClick]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }} className={className}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <InputBase
          inputRef={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Search sx={{ color: 'grey.400', fontSize: 20 }} />
            </InputAdornment>
          }
          endAdornment={
            query && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  aria-label="Clear search"
                  sx={{
                    '&:hover': { bgcolor: 'grey.200' },
                  }}
                >
                  <Close sx={{ fontSize: 16, color: 'grey.400' }} />
                </IconButton>
              </InputAdornment>
            )
          }
          sx={{
            width: '100%',
            px: 1.5,
            py: 1.25,
            borderRadius: variant === 'default' ? 2 : '9999px',
            bgcolor: variant === 'default' ? 'white' : 'grey.100',
            border: '1px solid',
            borderColor: variant === 'default' ? 'grey.300' : 'grey.100',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: variant === 'default' ? 'grey.400' : 'grey.200',
            },
            '&.Mui-focused': {
              borderColor: variant === 'default' ? 'success.main' : 'grey.200',
              boxShadow: variant === 'default' 
                ? '0 0 0 3px rgba(34, 197, 94, 0.1)' 
                : '0 0 0 3px rgba(0, 0, 0, 0.05)',
            },
            '& input': {
              color: 'grey.900',
              '&::placeholder': {
                color: 'grey.400',
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* Search Dropdown */}
      {isOpen && (
        <SearchDropdown
          ref={dropdownRef}
          query={query}
          onClose={() => setIsOpen(false)}
          onResultClick={handleResultClick}
        />
      )}
    </Box>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;