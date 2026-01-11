/**
 * Search Modal Component
 * Full search interface matching Figma UI
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box } from '@mui/material';
import { useSearchStore } from '../model/store';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import type { SearchResult } from '../model/types';

interface SearchModalProps {
  onResultClick?: (result: SearchResult) => void;
  onClose?: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onResultClick, onClose }) => {
  const { isOpen, setIsOpen, query } = useSearchStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        modalRef.current &&
        overlayRef.current.contains(e.target as Node) &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, setIsOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          setIsOpen(false);
          onClose?.();
        }
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bgcolor: 'white' }}>
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2, py: 2 }}>
          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <SearchBar />
          </Box>

          {/* Search Results */}
          {(query || isOpen) && (
            <Box ref={modalRef} sx={{ maxWidth: '4xl', mx: 'auto' }}>
              <SearchResults onResultClick={onResultClick} />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default SearchModal;
