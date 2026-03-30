/**
 * Search Modal Component
 * Full search interface matching Figma UI
 */

'use client';

import React, { useState } from 'react';
import { Menu, MenuItem, ListItemText, ListItemIcon, Avatar } from '@mui/material';
import { useSearchStore } from '../model/store';
import { getSafeImageUrl } from '@/shared/utils/imageUtils';
import SearchBar from './SearchBar';
import type { SearchResult } from '../model/types';

interface SearchModalProps {
  onResultClick?: (result: SearchResult) => void;
  onClose?: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onResultClick, onClose }) => {
  const { isOpen, setIsOpen } = useSearchStore();
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const results: SearchResult[] = [];
  // TODO: Replace with actual search results from store/query

  if (!isOpen) return null;

  return (
    <>
      <SearchBar ref={setAnchorEl} />
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          onClose?.();
        }}
        PaperProps={{ sx: { minWidth: 340, maxHeight: 400 } }}
      >
        {results.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No results found" />
          </MenuItem>
        ) : (
          results.map((result) => (
            <MenuItem key={result.id} onClick={() => onResultClick?.(result)}>
              {getSafeImageUrl(result.imageUrl) && (
                <ListItemIcon>
                  <Avatar src={getSafeImageUrl(result.imageUrl)} alt={result.title} />
                </ListItemIcon>
              )}
              <ListItemText primary={result.title} secondary={result.subtitle} />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default SearchModal;
