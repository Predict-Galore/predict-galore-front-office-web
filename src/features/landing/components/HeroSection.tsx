'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/components/ui';
import { IMAGES } from '@/shared/constants/images';

const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        // Dynamic gradient using theme colors for a cohesive brand feel
        background:
          'linear-gradient(135deg, var(--theme-secondary-main) 0%, var(--theme-primary-dark) 100%)',
        overflow: 'hidden',
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
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          mx: 0,
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
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
                // maxWidth: { xs: '100%', lg: '580px' },
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mx: { xs: 'auto', lg: 0 },
              }}
            >
              Predict Galore delivers accurate and in-depth analyses you can trust.
            </Typography>

            {/* CTA Buttons - use design system buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2.5}
              justifyContent={{ xs: 'center', lg: 'flex-start' }}
            >
              <Button
                component={Link}
                href="/register"
                variant="primary"
                size="lg"
                sx={{
                  px: 6,
                  py: 2,
                  fontWeight: 700,
                  bgcolor: 'white',
                  color: '#1a1a1a',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
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
                variant="outline"
                size="lg"
                sx={{
                  px: 6,
                  py: 2,
                  fontWeight: 700,
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    borderWidth: 2,
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
              height: { xs: '400px', sm: '550px',  },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.2))',
            }}
          >
            <Image
              src={IMAGES.LANDING.HERO_PHONE_MOCKUP}
              alt="Predict Galore Mobile App with Features"
              fill
              sizes="(max-width: 768px) 400px, (max-width: 1024px) 550px, 800px"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              priority
              unoptimized
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
