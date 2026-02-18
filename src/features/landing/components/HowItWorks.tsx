'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import { IMAGES } from '@/shared/constants/images';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Choose Your Path',
      description: 'Sign up directly on the Web or download the Mobile App to get started.',
      phoneImage: IMAGES.LANDING.HOW_IT_WORKS_1,
    },
    {
      id: 2,
      title: 'Access Predictions',
      description: 'Get expert predictions, player insights, and match analysis all in one place.',
      phoneImage: IMAGES.LANDING.HOW_IT_WORKS_2,
    },
    {
      id: 3,
      title: 'Upgrade for More',
      description: 'Unlock premium insights and advanced features that give you the winning edge.',
      phoneImage: IMAGES.LANDING.HOW_IT_WORKS_3,
    },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        // Matching the deep red/maroon from the screenshot
        // background:
        //   'linear-gradient(180deg, var(--theme-secondary-main) 0%, var(--theme-secondary-dark) 100%)',
        background: '#A8141A',
        py: { xs: 10, md: 15 },
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.12,
          backgroundImage: `
            radial-gradient(circle at 25% 20%, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 2px, transparent 3px),
            radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 3px)
          `,
          backgroundSize: '220px 220px',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 10,
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          mx: 0,
          flex: 1,
        }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 2,
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: alpha('#fff', 0.95),
              maxWidth: '800px',
              margin: '0 auto',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            From AI insights to real-time updates, Predict Galore gives you the advantage before,
            during, and after the game.
          </Typography>
        </Box>

        {/* Steps Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', lg: 'flex-start' },
            gap: { xs: 4, lg: 4 },
            position: 'relative',
          }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: { xs: '380px', lg: '400px' },
                }}
              >
                {/* Main Step Card Container */}
                <Box
                  sx={{
                    width: '100%',
                    bgcolor: 'rgba(245, 119, 126, 0.2)',
                    borderRadius: '32px',
                    // p: 3,
                    pb: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: `1px solid ${alpha('#fff', 0.15)}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Phone Image */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '240px',
                      height: { xs: '380px', md: '450px' },
                      zIndex: 2,
                    }}
                  >
                    <Image
                      src={step.phoneImage}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 240px, 240px"
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </Box>

                  {/* Black Text Box Container */}
                  <Box
                    sx={{
                      bgcolor: '#0f172a',
                      width: 'calc(100% + 2px)', // Match parent width
                      mx: -3,
                      p: { xs: 4, md: 5 },
                      textAlign: 'center',
                      zIndex: 3,
                      mt: -2, // Slight overlap with phone
                      borderTop: `1px solid ${alpha('#fff', 0.05)}`,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: 'white',
                        mb: 1.5,
                        fontSize: '1.5rem',
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha('#fff', 0.8),
                        lineHeight: 1.6,
                        fontSize: '1rem',
                        maxWidth: '280px',
                        mx: 'auto',
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Step Connectors (Arrows) */}
              {index < steps.length - 1 && (
                <>
                  {/* Desktop Horizontal Curved Arrow */}
                  <Box
                    sx={{
                      display: { xs: 'none', lg: 'flex' },
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '450px', // Match phone height roughly
                    }}
                  >
                    <Image
                      src={IMAGES.LANDING.CURVED_ARROW}
                      alt="next step"
                      width={120}
                      height={60}
                      style={{ filter: 'brightness(0) invert(1)' }}
                      unoptimized
                    />
                  </Box>

                  {/* Mobile Vertical Straight Arrow */}
                  <Box
                    sx={{
                      display: { xs: 'flex', lg: 'none' },
                      justifyContent: 'center',
                      my: 2,
                    }}
                  >
                    <Image
                      src={IMAGES.LANDING.VERTICAL_ARROW}
                      alt="next step"
                      width={40}
                      height={80}
                      style={{ filter: 'brightness(0) invert(1)' }}
                      unoptimized
                    />
                  </Box>
                </>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
