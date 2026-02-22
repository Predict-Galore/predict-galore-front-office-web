/**
 * Virtualized List Component
 * Simple scrollable list implementation for Next.js 15/Turbopack compatibility
 * 
 * @component
 * @description Provides a basic virtualized list using native scrolling.
 * This is a fallback implementation that works reliably with Next.js 15/Turbopack.
 * For production use with large datasets, consider react-window or react-virtual.
 */

'use client';

import React, { memo } from 'react';
import { Box } from '@mui/material';

/**
 * Props for the VirtualizedList component
 */
interface VirtualizedListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of the scrollable container in pixels */
  height: number;
  /** Height of each item (can be a number or function) */
  itemHeight: number | ((index: number) => number);
  /** Function to render each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Optional CSS class name */
  className?: string;
  /** Number of items to render outside visible area (not used in this implementation) */
  overscanCount?: number;
  /** Whether items have variable sizes (not used in this implementation) */
  variableSize?: boolean;
}

/**
 * VirtualizedList Component
 * 
 * Renders a scrollable list of items with smooth scrolling behavior.
 * This is a simplified implementation that renders all items.
 * 
 * @example
 * ```tsx
 * <VirtualizedList
 *   items={dataArray}
 *   height={600}
 *   itemHeight={80}
 *   renderItem={(item, index) => (
 *     <div key={index}>{item.name}</div>
 *   )}
 * />
 * ```
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
  // Acknowledge optional props to satisfy lint
  void _itemHeight;
  void _overscanCount;
  void _variableSize;

  return (
    <Box
      className={className}
      sx={{
        height: `${height}px`,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'grey.100',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'grey.400',
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'grey.500',
          },
        },
      }}
      role="list"
    >
      {items.map((item, index) => (
        <Box key={index} role="listitem">
          {renderItem(item, index)}
        </Box>
      ))}
    </Box>
  );
}

export default memo(VirtualizedList) as typeof VirtualizedList;
