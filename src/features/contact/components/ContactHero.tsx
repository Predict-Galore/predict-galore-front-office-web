/**
 * Contact Hero Component
 * Hero section for contact page
 */

'use client';

import React from 'react';
import { Box, Typography, Container, Chip, useTheme, alpha } from '@mui/material';
import { ContactMail } from '@mui/icons-material';

const ContactHero: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // Synchronized brand gradient: Red to Dark Green
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
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
          backgroundSize: '220px 220px',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Themed Chip */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Chip
            icon={
              <ContactMail
                sx={{
                  color: `${theme.palette.neutral[900]} !important`,
                  fontSize: '20px',
                }}
              />
            }
            label="We'd love to hear from you"
            sx={{
              backgroundColor: theme.palette.primary.light, // Brand's signature light green
              color: theme.palette.neutral[900],
              fontWeight: 700,
              height: 44,
              px: 1,
              borderRadius: '100px',
              border: `1.5px solid ${theme.palette.neutral[900]}`,
              boxShadow: `4px 4px 0px ${alpha(theme.palette.neutral[900], 0.2)}`,
              '& .MuiChip-label': {
                fontSize: '1rem',
                px: 2,
              },
            }}
          />
        </Box>

        {/* Title - Using Fluid Typography */}
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            mb: 2,
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          Contact Predict Galore
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: alpha('#fff', 0.9),
            fontSize: { xs: '1.1rem', md: '1.35rem' },
            maxWidth: '700px',
            mx: 'auto',
            lineHeight: 1.6,
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
