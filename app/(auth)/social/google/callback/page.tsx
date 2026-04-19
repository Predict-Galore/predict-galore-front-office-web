// app/(auth)/social/google/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function parseHash(hash: string): Record<string, string> {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(clean);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export default function GoogleCallbackPage() {
  useEffect(() => {
    try {
      const { id_token: idToken, error, error_description: errorDescription } = parseHash(
        window.location.hash
      );

      if (window.opener && !window.opener.closed) {
        if (idToken) {
          window.opener.postMessage({ type: 'pg_google_id_token', data: { idToken } }, window.location.origin);
        } else {
          window.opener.postMessage(
            {
              type: 'pg_google_id_token',
              data: { idToken: '', error: error || 'oauth_error', message: errorDescription || 'Google sign-in failed.' },
            },
            window.location.origin
          );
        }
      }
    } finally {
      window.close();
    }
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Completing Google sign-in…</Typography>
      <Typography sx={{ color: 'text.secondary' }}>You can close this window if it doesn’t close automatically.</Typography>
    </Box>
  );
}

