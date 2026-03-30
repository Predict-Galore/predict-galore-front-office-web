'use client';

import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, var(--theme-secondary-main) 0%, var(--theme-primary-dark) 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
            alignItems: 'center',
          }}
        >
          {/* LEFT CONTENT */}
          <Box sx={{ color: 'white', zIndex: 2 }}>
            <Typography
              sx={{
                fontSize: { xs: '2.8rem', md: '3.5rem' },
                fontWeight: 900,
                lineHeight: 1.1,
                mb: 3,
                color: '#fff',
              }}
            >
              Stay Ahead of
              <br />
              the Game,
              <br />
              Every Game
            </Typography>

            <Typography
              sx={{
                fontSize: '1.1rem',
                maxWidth: 520,
                color: alpha('#fff', 0.9),
                mb: 5,
              }}
            >
              Whether on web or mobile, Predict Galore delivers accurate predictions, league tables,
              and in-depth analysis you can trust.
            </Typography>

            {/* CTA */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: '100%' }}
            >
              {/* PRIMARY BUTTON */}
              <Button
                component={Link}
                href="/register"
                sx={{
                  width: { xs: '100%', sm: 'auto' },

                  px: { xs: 2.5, sm: 3.5, md: 5 },
                  py: { xs: 0.9, sm: 1.2, md: 1.6 },

                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                  fontWeight: 700,

                  minHeight: { xs: 40, sm: 44, md: 48 },

                  borderRadius: 1,
                  bgcolor: 'white',
                  color: '#111',

                  whiteSpace: 'nowrap',

                  '&:hover': {
                    bgcolor: '#f3f3f3',
                    transform: 'translateY(-1px)',
                  },

                  transition: 'all 0.2s ease',
                }}
              >
                Join Predict Galore Now
              </Button>

              {/* SECONDARY BUTTON */}
              <Button
                component={Link}
                href="/login"
                variant="outline"
                sx={{
                  width: { xs: '100%', sm: 'auto' },

                  px: { xs: 2.5, sm: 3.5, md: 5 },
                  py: { xs: 0.9, sm: 1.2, md: 1.6 },

                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                  fontWeight: 700,

                  minHeight: { xs: 40, sm: 44, md: 48 },

                  borderRadius: 1,
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,

                  whiteSpace: 'nowrap',

                  '&:hover': {
                    borderColor: 'white',
                    background: alpha('#fff', 0.1),
                    transform: 'translateY(-1px)',
                  },

                  transition: 'all 0.2s ease',
                }}
              >
                Download Our Mobile App
              </Button>
            </Stack>
          </Box>

          {/* RIGHT SIDE */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: { xs: 'center', lg: 'flex-end' },
              alignItems: 'center',
              height: { xs: 500, md: 700, lg: 750 },
              mt: { xs: 2, lg: 0 },
            }}
          >
            {/* PHONE */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: 280, md: 380, lg: 450 }, // Larger on desktop
                height: { xs: 540, md: 720, lg: 850 }, // Larger on desktop
                maxWidth: '100%',
              }}
            >
              <Image
                src={IMAGES.LANDING.HERO_PHONE_MOCKUP}
                alt="App"
                fill
                sizes="(max-width: 600px) 280px, (max-width: 900px) 380px, 450px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
