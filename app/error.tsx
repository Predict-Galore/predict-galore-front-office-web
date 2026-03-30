// app/error.tsx
'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { Box, Typography, IconButton } from '@mui/material';
import { Button } from '@/shared/components/ui';
import { Alert } from '@/shared/components/ui';
import { createLogger } from '@/shared/api/logger';

const logger = createLogger('GlobalError');

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Log error using centralized logger
  useEffect(() => {
    logger.error('Application Error', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  const handleReset = async () => {
    setIsRetrying(true);
    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    reset();
    setIsRetrying(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'neutral.50',
      }}
    >
      <Box
        sx={{
          maxWidth: '28rem',
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 3,
          p: 4,
          textAlign: 'center',
        }}
      >
        {/* Error Icon */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <AlertTriangle className="w-16 h-16" style={{ color: 'inherit' }} />
        </Box>

        {/* Main Message */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Something went wrong
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          We encountered an error while loading this page. Please try again.
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
          <Button
            variant="primary"
            onClick={handleReset}
            loading={isRetrying}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            sx={{ minWidth: 140 }}
          >
            {isRetrying ? 'Retrying...' : 'Try Again'}
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

        {/* Error Details Toggle */}
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={() => setShowDetails(!showDetails)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </IconButton>
          <Typography
            variant="body2"
            component="span"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': {
                color: 'text.primary',
              },
            }}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide details' : 'Show error details'}
          </Typography>
        </Box>

        {/* Error Details (Development only) */}
        {showDetails && process.env.NODE_ENV === 'development' && (
          <Alert variant="info" title="Error Details" sx={{ textAlign: 'left', mt: 2 }}>
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: 'neutral.100',
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: 192,
              }}
            >
              <Box sx={{ mb: 1 }}>
                <Typography component="strong" sx={{ fontWeight: 600 }}>
                  Message:
                </Typography>{' '}
                {error.message}
              </Box>
              {error.digest && (
                <Box sx={{ mb: 1 }}>
                  <Typography component="strong" sx={{ fontWeight: 600 }}>
                    Digest:
                  </Typography>{' '}
                  {error.digest}
                </Box>
              )}
              {error.stack && (
                <>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography component="strong" sx={{ fontWeight: 600 }}>
                      Stack:
                    </Typography>
                  </Box>
                  <Box
                    component="div"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.75rem',
                    }}
                  >
                    {error.stack}
                  </Box>
                </>
              )}
            </Box>
          </Alert>
        )}
      </Box>
    </Box>
  );
}
