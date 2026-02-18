/**
 * ERROR BOUNDARY COMPONENT
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * Migrated to use new Tailwind design system components
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Box, Typography } from '@mui/material';
import { Button } from '@/shared/components/ui/Button/Button';
import { createLogger } from '@/shared/api/logger';

const logger = createLogger('ErrorBoundary');

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our logging service
    logger.error('ErrorBoundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset error boundary when props change (if enabled)
    if (hasError && resetOnPropsChange) {
      const propsKeys = Object.keys(this.props as Record<string, unknown>);
      const hasPropsChanged = propsKeys.some((key) => {
        const currentValue = (this.props as unknown as Record<string, unknown>)[key];
        const previousValue = (prevProps as unknown as Record<string, unknown>)[key];
        return currentValue !== previousValue;
      });

      if (hasPropsChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI using new design system
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            p: 3,
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 3,
              p: 4,
              maxWidth: '28rem',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <AlertTriangle
              className="w-15 h-15"
              style={{
                width: '60px',
                height: '60px',
                color: '#dc2626',
                margin: '0 auto 16px',
              }}
            />

            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Something went wrong
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'neutral.100',
                  borderRadius: 3,
                  textAlign: 'left',
                  maxHeight: 192,
                  overflow: 'auto',
                }}
              >
                <Box
                  component="pre"
                  sx={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'text.primary',
                    whiteSpace: 'pre-wrap',
                    m: 0,
                  }}
                >
                  {this.state.error?.stack}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="primary"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={this.resetErrorBoundary}
                sx={{ minWidth: 140 }}
              >
                Try Again
              </Button>

              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outline"
                  leftIcon={<Home className="w-4 h-4" />}
                  sx={{ minWidth: 140 }}
                >
                  Go Home
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
