'use client';

import React from 'react';
import { Box, Container, Stack, Typography, Button, useTheme, alpha } from '@mui/material';
import Link from 'next/link';

const CTASection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        py: { xs: 8, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle texture */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 3px),
            radial-gradient(circle at 80% 0%, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 2px, transparent 3px)
          `,
          backgroundSize: '220px 220px',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{ maxWidth: 760, mx: 'auto' }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            Ready to stay ahead of every game?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: alpha('#fff', 0.9),
              fontSize: { xs: '1.05rem', md: '1.15rem' },
              lineHeight: 1.7,
            }}
          >
            Join Predict Galore for expert analyses, live updates, and personalized insights
            tailored to your teams and leagues.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: theme.palette.neutral[900],
                px: 4,
                py: 1.5,
                fontWeight: 800,
                '&:hover': {
                  bgcolor: theme.palette.neutral[50],
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              href="/contact-us"
              variant="outlined"
              size="large"
              sx={{
                borderColor: alpha('#fff', 0.7),
                color: 'white',
                borderWidth: 2,
                px: 4,
                fontWeight: 700,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: alpha('#fff', 0.12),
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              Talk to Us
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default CTASection;
