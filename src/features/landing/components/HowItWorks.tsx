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
        // background: '#A8141A',
        background: '#5e0b0b',
        py: { xs: 6, sm: 8, md: 10, lg: 15 },
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
          backgroundSize: {
            xs: '120px 120px',
            sm: '160px 160px',
            md: '200px 200px',
            lg: '220px 220px',
          },
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
          maxWidth: { xl: '1400px' },
          mx: 'auto',
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, sm: 7, md: 8, lg: 10 },
            maxWidth: { sm: '90%', md: '80%', lg: '70%' },
            mx: 'auto',
            px: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: { xs: 700, sm: 800 },
              mb: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem',
                lg: '3.5rem',
              },
              lineHeight: { xs: 1.2, md: 1.1 },
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: alpha('#fff', 0.95),
              maxWidth: { xs: '100%', md: '800px' },
              margin: '0 auto',
              fontSize: {
                xs: '1rem',
                sm: '1.1rem',
                md: '1.2rem',
                lg: '1.25rem',
              },
              lineHeight: { xs: 1.5, md: 1.6 },
              px: { xs: 2, sm: 3, md: 0 },
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
            justifyContent: 'center',
            alignItems: { xs: 'center', lg: 'stretch' },
            gap: { xs: 4, sm: 5, md: 6, lg: 4 },
            position: 'relative',
          }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <Box
                sx={{
                  flex: { lg: 1 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: { xs: '100%', sm: '80%', md: '70%', lg: '100%' },
                  maxWidth: { xs: '400px', sm: '450px', md: '480px', lg: '400px' },
                  mx: { xs: 'auto', lg: 0 },
                }}
              >
                {/* Main Step Card Container */}
                <Box
                  sx={{
                    width: '100%',
                    bgcolor: 'rgba(245, 119, 126, 0.2)',
                    borderRadius: { xs: '24px', sm: '28px', md: '32px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: `1px solid ${alpha('#fff', 0.15)}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: { lg: 'translateY(-8px)' },
                      boxShadow: { lg: '0 20px 40px rgba(0,0,0,0.2)' },
                    },
                  }}
                >
                  {/* Phone Image */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: { xs: '200px', sm: '220px', md: '240px' },
                      height: { xs: '320px', sm: '360px', md: '400px', lg: '450px' },
                      zIndex: 2,
                      mt: { xs: 2, sm: 3, md: 0 },
                      '& img': {
                        transition: 'transform 0.6s ease',
                      },
                      '&:hover img': {
                        transform: { lg: 'scale(1.05)' },
                      },
                    }}
                  >
                    <Image
                      src={step.phoneImage}
                      alt={step.title}
                      fill
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 220px, (max-width: 1024px) 240px, 240px"
                      style={{
                        objectFit: 'contain',
                        objectPosition: 'bottom center',
                      }}
                      unoptimized
                      priority={index === 0}
                    />
                  </Box>

                  {/* Black Text Box Container */}
                  <Box
                    sx={{
                      bgcolor: '#0f172a',
                      width: '100%',
                      p: { xs: 3, sm: 3.5, md: 4, lg: 5 },
                      textAlign: 'center',
                      zIndex: 3,
                      mt: { xs: -1, sm: -1.5, md: -2 },
                      borderTop: `1px solid ${alpha('#fff', 0.05)}`,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: { xs: 700, md: 800 },
                        color: 'white',
                        mb: { xs: 1, sm: 1.25, md: 1.5 },
                        fontSize: {
                          xs: '1.25rem',
                          sm: '1.35rem',
                          md: '1.5rem',
                          lg: '1.65rem',
                        },
                        lineHeight: 1.2,
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha('#fff', 0.8),
                        lineHeight: { xs: 1.5, md: 1.6 },
                        fontSize: {
                          xs: '0.875rem',
                          sm: '0.9rem',
                          md: '0.95rem',
                          lg: '1rem',
                        },
                        maxWidth: { xs: '240px', sm: '260px', md: '280px' },
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
                      height: 'auto',
                      minHeight: '450px',
                    }}
                  >
                    <Image
                      src={IMAGES.LANDING.CURVED_ARROW}
                      alt="next step"
                      width={100}
                      height={50}
                      style={{
                        filter: 'brightness(0) invert(1)',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '120px',
                      }}
                      unoptimized
                    />
                  </Box>

                  {/* Mobile/Tablet Vertical Straight Arrow */}
                  <Box
                    sx={{
                      display: { xs: 'flex', lg: 'none' },
                      justifyContent: 'center',
                      my: { xs: 1, sm: 2 },
                    }}
                  >
                    <Image
                      src={IMAGES.LANDING.VERTICAL_ARROW}
                      alt="next step"
                      width={32}
                      height={64}
                      style={{
                        filter: 'brightness(0) invert(1)',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '40px',
                      }}
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
