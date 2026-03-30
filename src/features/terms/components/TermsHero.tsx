'use client';

import React from 'react';
import { Box, Typography, Chip, Container, alpha } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const TermsHero: React.FC = () => {
  return (
    <Box
      sx={(theme) => ({
        // Consistent brand gradient: Secondary (coolRed) to Primary (green) using theme colors
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: { xs: 8, md: 12 },
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
          backgroundSize: '220px 220px',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Feature Chip - Pulling from theme neutral and primary */}
          <Chip
            icon={
              <ArticleOutlinedIcon
                sx={{
                  color: 'neutral.950 !important',
                  fontSize: '20px',
                }}
              />
            }
            label="Using Predict Galore"
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.light, // green-400 from theme
              color: theme.palette.neutral[950], // #101012 from Figma
              fontWeight: 700,
              height: 44,
              px: 1,
              mb: 4,
              borderRadius: '100px',
              border: `1.5px solid ${theme.palette.neutral[950]}`,
              boxShadow: `4px 4px 0px ${theme.palette.neutral[950]}33`, // Subtle retro pop
              '& .MuiChip-label': {
                fontSize: '1rem',
                px: 2,
              },
            })}
          />

          {/* Title - Using Fluid Typography */}
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              color: 'white',
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            Terms of Service
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: alpha('#fff', 0.9),
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              maxWidth: '650px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Please read these terms carefully. Your access to our platform means you agree to be
            bound by these conditions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsHero;
