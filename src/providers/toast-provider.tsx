/**
 * TOAST PROVIDER
 *
 * Provides toast notifications to the application
 */

'use client';

import React, { ReactNode } from 'react';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

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
            iconTheme: {
              primary: '#FFFFFF',
              secondary: '#10B981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
              color: '#FFFFFF',
            },
            iconTheme: {
              primary: '#FFFFFF',
              secondary: '#EF4444',
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
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <IconButton
                    size="small"
                    onClick={() => toast.dismiss(t.id)}
                    sx={{
                      color: 'inherit',
                      padding: '4px',
                      marginLeft: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}
