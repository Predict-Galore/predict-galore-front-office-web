/**
 * TOAST PROVIDER
 *
 * Provides toast notifications to the application
 */

'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            padding: '16px 24px',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#FFFFFF',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
              color: '#FFFFFF',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#3B82F6',
              color: '#FFFFFF',
            },
          },
        }}
      />
    </>
  );
}
