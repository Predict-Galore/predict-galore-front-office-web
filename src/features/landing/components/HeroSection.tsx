'use client';

import React from 'react';
import { Box, Button, Typography, Container, Stack, useTheme, alpha } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        // Dynamic gradient using theme colors for a cohesive brand feel
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        overflow: 'hidden',
        minHeight: { xs: 'auto', lg: '100vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 12, lg: 0 }, // Adjust for navbar height
      }}
    >
      {/* Decorative background overlay for texture */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
            gap: { xs: 8, lg: 2 },
            alignItems: 'center',
          }}
        >
          {/* Left Side - Content */}
          <Box sx={{ color: 'white', textAlign: { xs: 'center', lg: 'left' } }}>
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                color: 'white',
                lineHeight: 1.1,
              }}
            >
              Stay Ahead of <br /> the Game, <br /> Every Game
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 5,
                color: alpha('#fff', 0.9),
                maxWidth: { xs: '100%', lg: '580px' },
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mx: { xs: 'auto', lg: 0 },
              }}
            >
              Predict Galore delivers accurate and in-depth analyses you can trust.
            </Typography>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2.5}
              justifyContent={{ xs: 'center', lg: 'flex-start' }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.neutral[900],
                  px: 6,
                  py: 2,
                  fontWeight: 800,
                  '&:hover': {
                    bgcolor: theme.palette.neutral[50],
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Join Predict Galore Now{' '}
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: alpha('#fff', 0.6),
                  color: 'white',
                  borderWidth: '2px',
                  px: 6,
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: alpha('#fff', 0.1),
                    borderWidth: '2px',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Download our Mobile App
              </Button>
            </Stack>
          </Box>

          {/* Right Side - Full Mockup Image */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '400px', sm: '550px', lg: '800px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.2))',
            }}
          >
            <Image
              src="/landing-page/phone-mockup-hero.png"
              alt="Predict Galore Mobile App with Features"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              priority
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
