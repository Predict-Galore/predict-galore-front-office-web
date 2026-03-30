/**
 * Contact Hero Component
 * Hero section for contact page
 */

'use client';

import React from 'react';
import { Box, Typography, Container, Chip, alpha, useMediaQuery, useTheme } from '@mui/material';
import { ContactMail } from '@mui/icons-material';

const ContactHero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      sx={(theme) => ({
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      {/* Background Texture Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.12,
          backgroundImage: `
            radial-gradient(circle at 20% 15%, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 2px, transparent 3px),
            radial-gradient(circle at 75% 10%, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 3px)
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

      {/* Decorative floating elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: { xs: 100, sm: 150, md: 200 },
          height: { xs: 100, sm: 150, md: 200 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: { xs: 150, sm: 200, md: 250 },
          height: { xs: 150, sm: 200, md: 250 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Themed Chip */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 3, sm: 3.5, md: 4 },
            px: { xs: 2, sm: 0 },
          }}
        >
          <Chip
            icon={
              <ContactMail
                sx={(theme) => ({
                  color: `${theme.palette.neutral[950]} !important`,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                })}
              />
            }
            label="We'd love to hear from you"
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.neutral[950],
              fontWeight: 700,
              height: { xs: 36, sm: 40, md: 44 },
              px: { xs: 0.5, sm: 1 },
              borderRadius: '100px',
              border: `1.5px solid ${theme.palette.neutral[950]}`,
              boxShadow: `4px 4px 0px ${theme.palette.neutral[950]}33`,
              '& .MuiChip-label': {
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                px: { xs: 1.5, sm: 2 },
              },
              transition: 'transform 0.2s',
              '&:hover': {
                transform: { md: 'translateY(-2px)' },
                boxShadow: `6px 6px 0px ${theme.palette.neutral[950]}33`,
              },
            })}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            mb: { xs: 1.5, sm: 2, md: 2.5 },
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.15)',
            fontSize: {
              xs: '2rem',
              sm: '2.5rem',
              md: '3rem',
              lg: '3.5rem',
            },
            fontWeight: { xs: 700, md: 800 },
            lineHeight: { xs: 1.2, md: 1.1 },
            px: { xs: 2, sm: 4, md: 0 },
            maxWidth: '900px',
            mx: 'auto',
          }}
        >
          {isMobile ? 'Contact Us' : 'Contact Predict Galore'}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: alpha('#fff', 0.95),
            fontSize: {
              xs: '0.95rem',
              sm: '1.1rem',
              md: '1.25rem',
              lg: '1.35rem',
            },
            maxWidth: { xs: '100%', sm: '600px', md: '700px' },
            mx: 'auto',
            lineHeight: { xs: 1.5, md: 1.6 },
            px: { xs: 3, sm: 4, md: 0 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          Questions, feedback, or partnership ideas? Our team is here to help you get the most out
          of our platform.
        </Typography>
      </Container>
    </Box>
  );
};

export default ContactHero;
