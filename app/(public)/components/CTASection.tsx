'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useMediaQuery, useTheme } from '@mui/material';
import { IMAGES } from '@/shared/constants/images';
import { alpha } from '@mui/material/styles';

const CTASection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  // const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 4, sm: 5, md: 6, lg: 8 },
        px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        bgcolor: '#f8fafc', // Light background to make the CTA card pop
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1C4602 0%, #2d6a04 100%)',
          color: 'white',
          mx: 'auto',
          maxWidth: '1400px',
          py: { xs: 4, sm: 5, md: 6, lg: 8 },
          px: { xs: 3, sm: 4, md: 5, lg: 6, xl: 8 },
          borderRadius: { xs: 3, sm: 4, md: 5 },
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr',
              md: '1.2fr 0.8fr',
            },
            gap: { xs: 4, sm: 5, md: 8, lg: 12, xl: 16 },
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Content Section */}
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { xs: '100%', md: '600px' },
              mx: { xs: 'auto', md: 0 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: '1.75rem',
                  sm: '2rem',
                  md: '2.25rem',
                  lg: '2.75rem',
                  xl: '3rem',
                },
                fontWeight: { xs: 700, md: 800 },
                lineHeight: { xs: 1.2, md: 1.1 },
                mb: { xs: 2, sm: 2.5, md: 3 },
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Ready to unlock smarter predictions?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: {
                  xs: '0.95rem',
                  sm: '1rem',
                  md: '1.05rem',
                  lg: '1.125rem',
                },
                color: alpha('#fff', 0.95),
                lineHeight: { xs: 1.5, md: 1.6 },
                mb: { xs: 3, sm: 3.5, md: 4 },
                maxWidth: { xs: '100%', md: '550px' },
                mx: { xs: 'auto', md: 0 },
                px: { xs: 2, sm: 3, md: 0 },
              }}
            >
              Sign up on the web or download the mobile app today and start getting expert insights,
              real-time updates, and data-driven predictions at your fingertips.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 2, md: 3 },
                alignItems: { xs: 'stretch', md: 'flex-start' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                maxWidth: { xs: '100%', sm: '500px' },
                mx: { xs: 'auto', md: 0 },
                px: { xs: 2, sm: 0 },
              }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                fullWidth={isMobile}
                sx={{
                  bgcolor: 'white',
                  color: '#1C4602',
                  // py: { xs: 1.25, sm: 1.5,  },
                  // px: { xs: 3, sm: 4, md: 5, lg: 8 },
                  // fontSize: { xs: '0.9rem',  },
                  // fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 1,
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.95),
                    transform: { md: 'translateY(-2px)' },
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Sign Up for Free
              </Button>

              {/* Download our Mobile App button (disabled for now) */}
              {/*
                <Button
                  component={Link}
                  href="#"
                  variant="outlined"
                  fullWidth={isMobile}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 1,
                    borderWidth: { xs: 2, md: 2.5 },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: alpha('#fff', 0.1),
                      transform: { md: 'translateY(-2px)' },
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Download our Mobile App
                </Button>
              */}
            </Box>
          </Box>

          {/* Phone Mockup Section */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              order: { xs: -1, md: 1 }, // Images show above text on mobile
              mb: { xs: 2, sm: 3, md: 0 },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: '220px', sm: '280px', md: '320px', lg: '380px', xl: '420px' },
                height: { xs: '220px', sm: '280px', md: '320px', lg: '380px', xl: '420px' },
                '& img': {
                  transition: 'transform 0.6s ease',
                },
                '&:hover img': {
                  transform: { md: 'scale(1.05) translateY(-10px)' },
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '20px',
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                  borderRadius: '50%',
                  zIndex: -1,
                  opacity: { xs: 0.5, md: 0.7 },
                },
              }}
            >
              <Image
                src={IMAGES.LANDING.DOUBLE_PHONE_MOCKUP}
                alt="Mobile App Preview"
                fill
                sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 320px, (max-width: 1280px) 380px, 420px"
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))',
                }}
                priority
                unoptimized
              />
            </Box>

            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: '10%', md: '15%' },
                right: { xs: '5%', md: '10%' },
                width: { xs: '40px', sm: '50px', md: '60px' },
                height: { xs: '40px', sm: '50px', md: '60px' },
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                filter: 'blur(8px)',
                zIndex: 1,
                display: { xs: 'none', md: 'block' },
              }}
            />
          </Box>
        </Box>

        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, 30%)',
            pointerEvents: 'none',
            display: { xs: 'none', lg: 'block' },
          }}
        />
      </Box>
    </Box>
  );
};

export default CTASection;
