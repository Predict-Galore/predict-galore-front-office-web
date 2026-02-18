/**
 * Search Bar Component
 * Professional implementation following DatePicker pattern
 */

'use client';

import React, { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, Close } from '@mui/icons-material';
import { cn } from '@/shared/lib/utils';
import SearchDropdown from './SearchDropdown';
import type { SearchResult } from '../model/types';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  variant?: 'default' | 'header';
  className?: string;
}

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

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
    onSearch?.('');
  }, [onSearch]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

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
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 pointer-events-none z-10">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-2.5 rounded-full',
            'bg-gray-100 border border-gray-100',
            'focus:border-gray-200 focus:ring-2 focus:ring-gray-300/40',
            'text-gray-900 placeholder-gray-400',
            'transition-all duration-200 focus:outline-none',
            variant === 'default' && 'rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white'
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-gray-200 transition-colors z-10"
            aria-label="Clear search"
          >
            <Close className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <SearchDropdown
          ref={dropdownRef}
          query={query}
          onClose={() => setIsOpen(false)}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;