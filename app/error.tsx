// app/error.tsx
'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, IconButton, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        backgroundColor: 'background.default',
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Error Icon */}
          <ErrorOutlineIcon
            sx={{
              fontSize: 60,
              color: 'error.main',
              mb: 2,
            }}
          />

          {/* Main Message */}
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Something went wrong
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            We encountered an error while loading this page. Please try again.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              disabled={isRetrying}
              sx={{ minWidth: 140 }}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>

            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button variant="outlined" startIcon={<HomeIcon />} sx={{ minWidth: 140 }}>
                Go Home
              </Button>
            </Link>
          </Box>

          {/* Error Details Toggle */}
          <Box sx={{ mb: 2 }}>
            <IconButton onClick={() => setShowDetails(!showDetails)} size="small">
              {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              <Typography variant="caption" sx={{ ml: 1 }}>
                {showDetails ? 'Hide details' : 'Show error details'}
              </Typography>
            </IconButton>
          </Box>

          {/* Error Details (Development only) */}
          {showDetails && process.env.NODE_ENV === 'development' && (
            <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Error Details
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  backgroundColor: 'grey.50',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 200,
                }}
              >
                <div>
                  <strong>Message:</strong> {error.message}
                </div>
                {error.digest && (
                  <div>
                    <strong>Digest:</strong> {error.digest}
                  </div>
                )}
                {error.stack && (
                  <>
                    <div>
                      <strong>Stack:</strong>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</div>
                  </>
                )}
              </Box>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
