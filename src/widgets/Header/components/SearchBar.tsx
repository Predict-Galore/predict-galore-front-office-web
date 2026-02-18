'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui';
import { cn } from '@/shared/lib/utils';

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
    <Input
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      leftIcon={<Search className="w-5 h-5 text-gray-500" />}
      className={cn(
        'w-full',
        variant === 'header' && [
          'bg-gray-900 border-gray-600 text-gray-100 placeholder:text-gray-400',
          'hover:border-gray-500 focus:border-primary focus:bg-gray-900',
          'rounded-full px-4'
        ],
        className
      )}
    />
  );
};

export default SearchBar;
