'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const ComingSoonPage: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, var(--theme-secondary-main) 0%, var(--theme-primary-dark) 100%)',
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          backgroundImage: `
            radial-gradient(circle at 18% 14%, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 2px, transparent 3px),
            radial-gradient(circle at 82% 10%, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 2px, transparent 3px),
            radial-gradient(circle at 28% 78%, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 3px)
          `,
          backgroundSize: '220px 220px, 280px 280px, 320px 320px',
          pointerEvents: 'none',
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: { xs: 280, md: 460 },
          height: { xs: 280, md: 460 },
          borderRadius: '50%',
          filter: 'blur(80px)',
          bgcolor: alpha('#ffffff', 0.24),
          top: { xs: -120, md: -150 },
          right: { xs: -90, md: -120 },
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            borderRadius: { xs: 3, md: 4 },
            border: `1px solid ${alpha('#fff', 0.32)}`,
            bgcolor: alpha('#081103', 0.22),
            backdropFilter: 'blur(12px)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.28)',
            py: { xs: 5, sm: 6, md: 7 },
            px: { xs: 3, sm: 5, md: 7 },
            textAlign: 'center',
          }}
        >
          <Stack spacing={{ xs: 2.25, md: 2.75 }} alignItems="center">
            <Chip
              label="Predict Galore"
              sx={{
                color: '#fff',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: `1px solid ${alpha('#fff', 0.45)}`,
                borderRadius: 1,
                bgcolor: alpha('#fff', 0.12),
              }}
            />

            <Typography
              variant="h1"
              sx={{
                color: '#fff',
                fontWeight: 800,
                lineHeight: { xs: 1.1, md: 1.05 },
                fontSize: { xs: '2rem', sm: '2.8rem', md: '4rem' },
                letterSpacing: '-0.02em',
              }}
            >
              A Smarter Sports
              <br />
              Experience Is Coming Soon
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: alpha('#fff', 0.92),
                maxWidth: 680,
                fontSize: { xs: '1rem', sm: '1.08rem', md: '1.2rem' },
                lineHeight: 1.7,
              }}
            >
              We are preparing the next chapter of sport prediction with richer insights, faster
              updates, and a cleaner prediction workflow built for everyday winners.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ pt: 1, width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  minWidth: { sm: 190 },
                  bgcolor: '#fff',
                  color: '#1a1a1a',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 1,
                  py: 1.35,
                  '&:hover': { bgcolor: '#f2f2f2' },
                }}
              >
                Join Waitlist
              </Button>
              {/* <Button
                component={Link}
                href="/landing-page"
                variant="outlined"
                size="large"
                sx={{
                  minWidth: { sm: 190 },
                  color: '#fff',
                  borderColor: alpha('#fff', 0.62),
                  borderWidth: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  py: 1.35,
                  '&:hover': {
                    borderColor: '#fff',
                    borderWidth: 2,
                    bgcolor: alpha('#fff', 0.08),
                  },
                }}
              >
                View Platform
              </Button> */}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ComingSoonPage;
