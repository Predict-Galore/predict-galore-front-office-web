/**
 * LOADING COMPONENT - Tailwind Implementation
 * 
 * Comprehensive loading component with multiple variants and animations
 */

'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'bars';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  fullScreen = false,
  overlay = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-3',
    fullScreen && 'fixed inset-0 z-50',
    overlay && 'bg-white/80 backdrop-blur-sm',
    !fullScreen && 'p-8',
    className
  );

  const renderSpinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 border-t-primary',
        sizeClasses[size]
      )}
      role="status"
      aria-label="Loading"
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary animate-pulse',
            size === 'sm' && 'w-1 h-1',
            size === 'md' && 'w-2 h-2',
            size === 'lg' && 'w-3 h-3',
            size === 'xl' && 'w-4 h-4'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        'rounded-full bg-primary animate-pulse',
        sizeClasses[size]
      )}
      role="status"
      aria-label="Loading"
    />
  );

  const renderSkeleton = () => (
    <div className="space-y-3 w-full max-w-sm" role="status" aria-label="Loading">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
    </div>
  );

  const renderBars = () => (
    <div className="flex items-end space-x-1" role="status" aria-label="Loading">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary animate-pulse',
            size === 'sm' && 'w-1',
            size === 'md' && 'w-2',
            size === 'lg' && 'w-3',
            size === 'xl' && 'w-4'
          )}
          style={{
            height: `${20 + (i * 10)}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'bars':
        return renderBars();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoadingIndicator()}
      {message && (
        <p className="text-sm text-gray-600 text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
};

// Page Loading Component - for full page loading states
export interface PageLoadingProps extends Omit<LoadingProps, 'fullScreen' | 'overlay'> {
  title?: string;
  description?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  title = 'Loading',
  description,
  message,
  variant = 'spinner',
  size = 'lg',
  className,
  ...props
}) => {
  return (
    <div className={cn(
      'min-h-screen flex flex-col items-center justify-center bg-gray-50',
      className
    )}>
      <div className="text-center space-y-4">
        {title && (
          <h1 className="text-2xl font-semibold text-gray-900">
            {title}
          </h1>
        )}
        
        <Loading
          variant={variant}
          size={size}
          message={message || description}
          {...props}
        />
      </div>
    </div>
  );
};

// Inline Loading Component - for inline loading states
export interface InlineLoadingProps extends Omit<LoadingProps, 'fullScreen' | 'overlay'> {
  text?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = 'Loading...',
  variant = 'spinner',
  size = 'sm',
  className,
  ...props
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loading
        variant={variant}
        size={size}
        {...props}
      />
      {text && (
        <span className="text-sm text-gray-600">
          {text}
        </span>
      )}
    </div>
  );
};

// Button Loading Component - for button loading states
export interface ButtonLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  size = 'sm',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-white/30 border-t-white',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

// Overlay Loading Component - for overlay loading states
export interface OverlayLoadingProps extends LoadingProps {
  show: boolean;
}

export const OverlayLoading: React.FC<OverlayLoadingProps> = ({
  show,
  message = 'Loading...',
  variant = 'spinner',
  size = 'lg',
  className,
  ...props
}) => {
  if (!show) return null;

  return (
    <Loading
      variant={variant}
      size={size}
      message={message}
      fullScreen
      overlay
      className={className}
      {...props}
    />
  );
};

export { Loading };