/**
 * Search Bar Component
 * Matches Figma UI design
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Close } from '@mui/icons-material';
import { Box } from '@mui/material';
import { cn } from '@/shared/lib/utils';
import { useSearchStore } from '../model/store';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  variant?: 'default' | 'header';
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for a player, team, club, league',
  variant = 'default',
  className,
}) => {
  const { query, setQuery, setIsOpen } = useSearchStore();
  const [localQuery, setLocalQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);
      setQuery(value);
      setIsOpen(true);

      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch, setQuery, setIsOpen]
  );

  const handleClear = useCallback(() => {
    setLocalQuery('');
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();

    if (onSearch) {
      onSearch('');
    }
  }, [onSearch, setQuery, setIsOpen]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && localQuery.trim().length >= 2) {
        setIsOpen(true);
      }
    },
    [localQuery, setIsOpen]
  );

  return (
    <Box sx={{ position: 'relative', width: '100%', ...className }}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Search Icon */}
        <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none' }}>
          <Search sx={{ width: 20, height: 20, color: 'text.disabled' }} />
        </Box>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            variant === 'header'
              ? cn(
                  'w-full pl-10 pr-10 py-2.5',
                  'rounded-full',
                  'bg-gray-100',
                  'border border-gray-100',
                  'focus:border-gray-200 focus:ring-2 focus:ring-gray-300/40',
                  'text-gray-900 placeholder-gray-400',
                  'transition-all duration-200',
                  'focus:outline-none'
                )
              : cn(
                  'w-full pl-10 pr-10 py-2.5 rounded-lg',
                  'border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
                  'bg-white text-gray-900 placeholder-gray-400',
                  'transition-all duration-200',
                  'focus:outline-none'
                )
          )}
        />

        {/* Clear Button */}
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <Close className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </Box>
    </Box>
  );
};

export default SearchBar;
