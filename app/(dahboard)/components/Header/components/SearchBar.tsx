'use client';

import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import clsx from 'clsx';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  variant?: 'default' | 'header';
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  variant = 'default',
  className,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <TextField
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      size="small"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search className="text-gray-500" />
          </InputAdornment>
        ),
        sx:
          variant === 'header'
            ? {
                borderRadius: 9999,
                backgroundColor: '#0f0f0f',
                color: '#d1d5db',
                px: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d1d5db',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#42A605',
                  borderWidth: 1.5,
                },
                input: {
                  color: '#e5e7eb',
                  paddingY: 1.25,
                },
              }
            : undefined,
      }}
      className={clsx('w-full', className)}
    />
  );
};

export default SearchBar;
