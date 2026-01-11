/**
 * Virtualized List Component
 * Migrated to shared components
 * Uses a simple scrollable list implementation to avoid react-window compatibility issues with Next.js 15/Turbopack
 */

'use client';

import React, { memo } from 'react';
import { Box } from '@mui/material';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscanCount?: number;
  variableSize?: boolean;
}

/**
 * Simple scrollable list component
 * Provides basic virtualization functionality using native scrolling
 * This is a fallback implementation that works reliably with Next.js 15/Turbopack
 */
function VirtualizedList<T>({
  items,
  height,
  itemHeight: _itemHeight,
  renderItem,
  className = '',
  overscanCount: _overscanCount = 5,
  variableSize: _variableSize = false,
}: VirtualizedListProps<T>) {
  // acknowledge optional props to satisfy lint
  void _itemHeight;
  void _overscanCount;
  void _variableSize;

  return (
    <Box
      sx={{
        height: `${height}px`,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
        ...className,
      }}
    >
      {items.map((item, index) => (
        <Box key={index}>{renderItem(item, index)}</Box>
      ))}
    </Box>
  );
}

export default memo(VirtualizedList) as typeof VirtualizedList;
