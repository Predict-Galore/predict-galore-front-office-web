'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IMAGES } from '@/shared/constants/images';

const CTASection: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
      }}
    >
      <Box
        sx={{
          // background: 'linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)',
          background: '#1C4602',
          color: 'white',
          mx: 'auto',
          maxWidth: '1400px',
          py: { xs: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          borderRadius: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
            gap: { xs: 4, md: 12, lg: 16 },
            alignItems: 'center',
          }}
        >
          {/* Content Section */}
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 3,
                color: 'white',
              }}
            >
              Ready to unlock smarter predictions?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Sign up on the web or download the mobile app today and start getting expert insights,
              real-time updates, and data-driven predictions at your fingertips.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'white',
                  color: '#1a1a1a',
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  },
                }}
              >
                Sign Up for Free
              </Button>

              <Button
                component={Link}
                href="#"
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1,
                  borderWidth: 2,
                }}
              >
                Download our Mobile App
              </Button>
            </Box>
          </Box>

          {/* Phone Mockup Section */}

          <Box>
            <Image
              src={IMAGES.LANDING.DOUBLE_PHONE_MOCKUP}
              alt="Mobile App Preview"
              width={500}
              height={500}
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4))',
              }}
              unoptimized
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CTASection;
